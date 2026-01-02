import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/utils/supabase/service'
import { getApsToken } from '../token/route'

/**
 * POST /api/autodesk/upload
 *
 * Recibe información de un archivo ya subido a Supabase Storage
 * y lo sube a Autodesk OSS para traducción.
 *
 * Body (JSON):
 *  - drawingId: number - ID del dibujo en BD
 *  - storageUrl: string - URL del archivo en Supabase
 *  - fileName: string - Nombre del archivo
 */
export async function POST(request: NextRequest) {
  let drawingId: number | null = null
  
  try {
    const body = await request.json()
    const { drawingId: id, storageUrl, fileName } = body
    drawingId = id

    if (!drawingId || !storageUrl || !fileName) {
      return NextResponse.json(
        { error: 'Missing required fields: drawingId, storageUrl, fileName' },
        { status: 400 }
      )
    }

    console.log('[APS Upload] Iniciando proceso para drawing ID:', drawingId)

    // Usar Service Role client para bypassear RLS
    const supabase = createServiceClient()

    // 1. Actualizar estado a 'pending'
    await supabase
      .from('dibujos')
      .update({
        estado: 'pending',
        progreso: 10,
        translation_started_at: new Date().toISOString()
      })
      .eq('id', drawingId)

    // 2. Obtener token de Autodesk
    const accessToken = await getApsToken()
    console.log('[APS Upload] Token obtenido')

    // 3. Crear bucket en Autodesk OSS (si no existe)
    const bucketKey = `vergara_ingenieria_${process.env.APS_CLIENT_ID?.substring(0, 10)}`.toLowerCase()

    const bucketResponse = await fetch(
      'https://developer.api.autodesk.com/oss/v2/buckets',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          bucketKey,
          policyKey: 'transient' // Archivos se eliminan después de 24 horas
        })
      }
    )

    // Bucket puede ya existir (409), eso está bien
    if (!bucketResponse.ok && bucketResponse.status !== 409) {
      console.error('[APS Upload] Error creando bucket:', await bucketResponse.text())
    } else {
      console.log('[APS Upload] Bucket listo:', bucketKey)
    }

    // 4. Descargar archivo desde Supabase Storage
    console.log('[APS Upload] Descargando archivo desde Supabase:', storageUrl)
    const fileResponse = await fetch(storageUrl)

    if (!fileResponse.ok) {
      throw new Error('No se pudo descargar el archivo desde Supabase Storage')
    }

    const fileBuffer = await fileResponse.arrayBuffer()
    console.log('[APS Upload] Archivo descargado, tamaño:', fileBuffer.byteLength, 'bytes')

    // 5. Subir archivo a Autodesk OSS usando S3 Signed URLs (método moderno)
    const objectKey = `${drawingId}_${fileName}`

    console.log('[APS Upload] Subiendo a Autodesk OSS:', objectKey)

    // 5.1. Obtener S3 signed upload URLs
    const signedUrlEndpoint = `https://developer.api.autodesk.com/oss/v2/buckets/${bucketKey}/objects/${encodeURIComponent(objectKey)}/signeds3upload`

    const signedUrlResponse = await fetch(signedUrlEndpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })

    if (!signedUrlResponse.ok) {
      const errorText = await signedUrlResponse.text()
      console.error('[APS Upload] Error obteniendo S3 signed URL:', errorText)
      throw new Error(`Error obteniendo S3 signed URL: ${errorText}`)
    }

    const signedData = await signedUrlResponse.json()
    console.log('[APS Upload] S3 signed URL obtenida')

    // 5.2. Subir archivo a S3 usando la URL firmada
    const s3UploadUrl = signedData.urls[0] // Primera parte (para archivos pequeños es solo una)

    const s3UploadResponse = await fetch(s3UploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/octet-stream'
      },
      body: fileBuffer
    })

    if (!s3UploadResponse.ok) {
      const errorText = await s3UploadResponse.text()
      console.error('[APS Upload] Error subiendo a S3:', errorText)
      throw new Error(`Error subiendo archivo a S3: ${errorText}`)
    }

    console.log('[APS Upload] Archivo subido a S3 exitosamente')

    // 5.3. Completar el upload en Autodesk
    const completeUploadResponse = await fetch(signedUrlEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uploadKey: signedData.uploadKey
      })
    })

    if (!completeUploadResponse.ok) {
      const errorText = await completeUploadResponse.text()
      console.error('[APS Upload] Error completando upload:', errorText)
      throw new Error(`Error completando upload: ${errorText}`)
    }

    const ossData = await completeUploadResponse.json()
    console.log('[APS Upload] Upload completado, objectId:', ossData.objectId)

    // 6. Generar URN (base64 del objectId)
    const urn = Buffer.from(ossData.objectId)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')

    console.log('[APS Upload] URN generado:', urn)

    // 7. Actualizar BD con URN
    await supabase
      .from('dibujos')
      .update({
        urn,
        forge_bucket_key: bucketKey,
        forge_object_key: objectKey,
        progreso: 20
      })
      .eq('id', drawingId)

    // 8. Iniciar traducción a SVF2
    const translationPayload = {
      input: {
        urn
      },
      output: {
        formats: [
          {
            type: 'svf2',
            views: ['2d', '3d']
          }
        ]
      }
    }

    console.log('[APS Upload] Iniciando traducción')

    const translateResponse = await fetch(
      'https://developer.api.autodesk.com/modelderivative/v2/designdata/job',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'x-ads-force': 'true' // Forzar nueva traducción
        },
        body: JSON.stringify(translationPayload)
      }
    )

    if (!translateResponse.ok) {
      const errorText = await translateResponse.text()
      console.error('[APS Upload] Error iniciando traducción:', errorText)

      // Actualizar estado a failed
      await supabase
        .from('dibujos')
        .update({
          estado: 'failed',
          estado_mensaje: `Error iniciando traducción: ${errorText}`,
          progreso: 0
        })
        .eq('id', drawingId)

      throw new Error(`Error iniciando traducción: ${errorText}`)
    }

    const translateData = await translateResponse.json()
    console.log('[APS Upload] Traducción iniciada:', translateData)

    // 9. Actualizar estado a 'processing'
    await supabase
      .from('dibujos')
      .update({
        estado: 'processing',
        progreso: 30
      })
      .eq('id', drawingId)

    console.log('[APS Upload] Proceso completado exitosamente')

    return NextResponse.json({
      success: true,
      urn,
      bucketKey,
      objectKey,
      translationResult: translateData
    })

  } catch (error: any) {
    console.error('[APS Upload] Error:', error)
    
    // Intentar actualizar el estado a failed en la BD
    if (drawingId) {
      try {
        const supabase = createServiceClient()
        await supabase
          .from('dibujos')
          .update({
            estado: 'failed',
            estado_mensaje: error.message || 'Error desconocido',
            progreso: 0
          })
          .eq('id', drawingId)
      } catch (updateError) {
        console.error('[APS Upload] Error actualizando estado a failed:', updateError)
      }
    }
    
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error.message
      },
      { status: 500 }
    )
  }
}
