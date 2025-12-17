'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { Drawing } from '@/types'

/**
 * Obtiene todos los dibujos del usuario autenticado
 */
export async function getDrawings() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('dibujos')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching drawings:', error)
    return { drawings: [], error: error.message }
  }

  return { drawings: data as Drawing[] }
}

/**
 * Obtiene un dibujo específico por ID
 */
export async function getDrawing(id: number) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('dibujos')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching drawing:', error)
    return null
  }

  return data as Drawing
}

/**
 * Sube un archivo DWG y lo procesa
 *
 * @param formData - Debe contener:
 *   - file: File (.dwg)
 *   - descripcion?: string (opcional)
 *   - proyecto_id?: number (opcional)
 */
export async function uploadDrawing(formData: FormData) {
  try {
    const supabase = await createClient()

    // 1. Extraer datos del FormData
    const file = formData.get('file') as File
    const descripcion = formData.get('descripcion') as string | null
    const proyectoId = formData.get('proyecto_id') as string | null

    if (!file) {
      return { success: false, error: 'No se proporcionó ningún archivo' }
    }

    // 2. Validar archivo
    if (!file.name.toLowerCase().endsWith('.dwg')) {
      return { success: false, error: 'Solo se permiten archivos .dwg' }
    }

    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      return { success: false, error: 'El archivo excede el tamaño máximo de 50MB' }
    }

    console.log(`[Upload Drawing] Procesando archivo: ${file.name} (${file.size} bytes)`)

    // 3. Obtener user_id
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return { success: false, error: 'Usuario no autenticado' }
    }

    const userId = session.user.id

    // 4. Subir a Supabase Storage
    const timestamp = Date.now()
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const storagePath = `${userId}/${timestamp}_${sanitizedFileName}`

    console.log('[Upload Drawing] Subiendo a Supabase Storage:', storagePath)

    const fileBuffer = await file.arrayBuffer()

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('drawings')
      .upload(storagePath, fileBuffer, {
        contentType: 'application/acad',
        upsert: false
      })

    if (uploadError) {
      console.error('[Upload Drawing] Error subiendo a Storage:', uploadError)
      return { success: false, error: `Error subiendo archivo: ${uploadError.message}` }
    }

    console.log('[Upload Drawing] Archivo subido a Storage')

    // 5. Obtener URL pública (signed URL porque el bucket es privado)
    const { data: urlData, error: urlError } = await supabase.storage
      .from('drawings')
      .createSignedUrl(storagePath, 60 * 60 * 24 * 7) // URL válida por 7 días

    if (urlError) {
      console.error('[Upload Drawing] Error generando signed URL:', urlError)
      await supabase.storage.from('drawings').remove([storagePath])
      return { success: false, error: `Error generando URL: ${urlError.message}` }
    }

    const storageUrl = urlData.signedUrl

    // 6. Insertar en base de datos
    const { data: dibujoData, error: dbError } = await supabase
      .from('dibujos')
      .insert({
        nombre: sanitizedFileName.replace('.dwg', '').replace(/_/g, ' '),
        nombre_original: file.name,
        tamano_bytes: file.size,
        descripcion: descripcion || null,
        storage_path: storagePath,
        storage_url: storageUrl,
        estado: 'uploading',
        uploaded_at: new Date().toISOString(),
        proyecto_id: proyectoId ? parseInt(proyectoId) : null,
        progreso: 0
      })
      .select()
      .single()

    if (dbError) {
      console.error('[Upload Drawing] Error insertando en BD:', dbError)
      // Intentar eliminar el archivo subido
      await supabase.storage.from('drawings').remove([storagePath])
      return { success: false, error: `Error guardando en base de datos: ${dbError.message}` }
    }

    const drawingId = dibujoData.id
    console.log('[Upload Drawing] Dibujo creado en BD con ID:', drawingId)

    // 7. Iniciar proceso de traducción en Autodesk (async, no bloquear respuesta)
    if (storageUrl) {
      // Llamar a la API route de upload (fire and forget)
      fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/autodesk/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          drawingId,
          storageUrl,
          fileName: sanitizedFileName
        })
      }).catch(error => {
        console.error('[Upload Drawing] Error iniciando proceso Autodesk:', error)
      })

      console.log('[Upload Drawing] Proceso de traducción iniciado en background')
    }

    // 8. Revalidar cache
    revalidatePath('/dashboard/drawings')

    return {
      success: true,
      drawingId,
      message: 'Archivo subido correctamente. La traducción se está procesando.'
    }

  } catch (error: any) {
    console.error('[Upload Drawing] Error:', error)
    return { success: false, error: error.message || 'Error desconocido al subir archivo' }
  }
}

/**
 * Elimina un dibujo y su archivo asociado
 */
export async function deleteDrawing(id: number) {
  try {
    const supabase = await createClient()

    // 1. Obtener info del dibujo
    const { data: dibujo, error: fetchError } = await supabase
      .from('dibujos')
      .select('storage_path')
      .eq('id', id)
      .single()

    if (fetchError || !dibujo) {
      return { success: false, error: 'Dibujo no encontrado' }
    }

    // 2. Eliminar archivo de Storage
    if (dibujo.storage_path) {
      const { error: storageError } = await supabase.storage
        .from('drawings')
        .remove([dibujo.storage_path])

      if (storageError) {
        console.error('[Delete Drawing] Error eliminando de Storage:', storageError)
        // Continuar de todas formas con la eliminación de la BD
      }
    }

    // 3. Eliminar registro de BD
    const { error: deleteError } = await supabase
      .from('dibujos')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('[Delete Drawing] Error eliminando de BD:', deleteError)
      return { success: false, error: deleteError.message }
    }

    // 4. Revalidar cache
    revalidatePath('/dashboard/drawings')

    return { success: true }

  } catch (error: any) {
    console.error('[Delete Drawing] Error:', error)
    return { success: false, error: error.message || 'Error eliminando dibujo' }
  }
}

/**
 * Actualiza el estado de un dibujo (usado internamente por las API routes)
 */
export async function updateDrawingStatus(
  id: number,
  estado: 'uploading' | 'pending' | 'processing' | 'success' | 'failed',
  progreso: number,
  estadoMensaje?: string
) {
  const supabase = await createClient()

  const updateData: any = {
    estado,
    progreso
  }

  if (estadoMensaje) {
    updateData.estado_mensaje = estadoMensaje
  }

  if (estado === 'success') {
    updateData.translation_completed_at = new Date().toISOString()
  }

  const { error } = await supabase
    .from('dibujos')
    .update(updateData)
    .eq('id', id)

  if (error) {
    console.error('[Update Drawing Status] Error:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/dashboard/drawings')
  revalidatePath(`/dashboard/drawings/${id}`)

  return { success: true }
}
