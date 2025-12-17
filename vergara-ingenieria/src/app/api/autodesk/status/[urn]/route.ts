import { NextRequest, NextResponse } from 'next/server'
import { getApsToken } from '../../token/route'
import { createServiceClient } from '@/utils/supabase/service'

/**
 * GET /api/autodesk/status/[urn]
 *
 * Consulta el estado de traducción de un archivo DWG en Autodesk Model Derivative.
 * Actualiza la base de datos con el progreso y estado actual.
 *
 * @param urn - URN del archivo (base64 del objectId)
 * @returns {status: string, progress: string, messages?: string[]}
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ urn: string }> }
) {
  try {
    const { urn } = await params

    if (!urn) {
      return NextResponse.json(
        { error: 'URN es requerido' },
        { status: 400 }
      )
    }

    console.log('[APS Status] Consultando estado para URN:', urn)

    // 1. Obtener access token
    const accessToken = await getApsToken()

    // 2. Consultar manifest de traducción
    const manifestResponse = await fetch(
      `https://developer.api.autodesk.com/modelderivative/v2/designdata/${encodeURIComponent(urn)}/manifest`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      }
    )

    if (!manifestResponse.ok) {
      const errorText = await manifestResponse.text()
      console.error('[APS Status] Error consultando manifest:', errorText)

      // Si es 404, la traducción aún no ha comenzado
      if (manifestResponse.status === 404) {
        return NextResponse.json({
          status: 'pending',
          progress: '0%',
          message: 'Esperando inicio de traducción'
        })
      }

      throw new Error(`Failed to get manifest: ${manifestResponse.status}`)
    }

    const manifest = await manifestResponse.json()

    // 3. Parsear estado y progreso
    const status = manifest.status // 'pending' | 'inprogress' | 'success' | 'failed' | 'timeout'
    const progress = manifest.progress || '0% complete'
    const messages = manifest.messages || []

    console.log('[APS Status] Estado:', status, '- Progreso:', progress)

    // 4. Mapear estado de Autodesk a nuestro esquema
    let dbEstado: 'uploading' | 'pending' | 'processing' | 'success' | 'failed' = 'pending'
    let progresoNumerico = 0
    let estadoMensaje: string | undefined

    switch (status) {
      case 'pending':
        dbEstado = 'pending'
        progresoNumerico = 5
        break
      case 'inprogress':
        dbEstado = 'processing'
        // Extraer porcentaje de la string "X% complete"
        const match = progress.match(/(\d+)%/)
        progresoNumerico = match ? parseInt(match[1]) : 50
        break
      case 'success':
        dbEstado = 'success'
        progresoNumerico = 100
        break
      case 'failed':
      case 'timeout':
        dbEstado = 'failed'
        progresoNumerico = 0
        estadoMensaje = messages.length > 0
          ? messages.map((m: any) => m.message || m).join('; ')
          : 'La traducción falló'
        break
      default:
        dbEstado = 'pending'
        progresoNumerico = 0
    }

    // 5. Actualizar base de datos (usando Service Role para bypassear RLS)
    const supabase = createServiceClient()

    const updateData: any = {
      estado: dbEstado,
      progreso: progresoNumerico,
    }

    if (estadoMensaje) {
      updateData.estado_mensaje = estadoMensaje
    }

    if (dbEstado === 'success' && !manifest.translation_completed_at) {
      updateData.translation_completed_at = new Date().toISOString()
    }

    const { error: updateError } = await supabase
      .from('dibujos')
      .update(updateData)
      .eq('urn', urn)

    if (updateError) {
      console.error('[APS Status] Error actualizando BD:', updateError)
      // No fallar la respuesta por esto
    }

    // 6. Retornar estado actualizado
    return NextResponse.json({
      status: dbEstado,
      progress,
      progressPercent: progresoNumerico,
      messages: messages.length > 0 ? messages : undefined,
      derivatives: manifest.derivatives // Información de los derivados generados
    })

  } catch (error: any) {
    console.error('[APS Status] Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get translation status' },
      { status: 500 }
    )
  }
}
