'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Download, FileImage, AlertCircle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react'
import { getDrawing } from '@/app/actions/drawings'
import { Drawing } from '@/types'
import ForgeViewer from '@/components/ForgeViewer'

export default function DrawingViewerPage() {
  const router = useRouter()
  const params = useParams()
  const drawingId = params.id as string

  const [drawing, setDrawing] = useState<Drawing | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isInfoExpanded, setIsInfoExpanded] = useState(false)

  // Cargar dibujo
  const loadDrawing = async () => {
    setIsLoading(true)
    setError(null)

    const data = await getDrawing(parseInt(drawingId))

    if (!data) {
      setError('Dibujo no encontrado')
      setIsLoading(false)
      return
    }

    setDrawing(data)
    setIsLoading(false)
  }

  useEffect(() => {
    loadDrawing()
  }, [drawingId])

  // Polling de estado si está procesando
  useEffect(() => {
    if (!drawing || !drawing.urn) return

    const shouldPoll = drawing.estado === 'pending' || drawing.estado === 'processing'

    if (!shouldPoll) return

    console.log('[DrawingViewer] Iniciando polling para URN:', drawing.urn)

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/autodesk/status/${drawing.urn}`)
        const statusData = await response.json()

        console.log('[DrawingViewer] Estado:', statusData.status, '- Progreso:', statusData.progressPercent)

        // Recargar dibujo para obtener estado actualizado
        await loadDrawing()

        // Detener polling si terminó
        if (statusData.status === 'success' || statusData.status === 'failed') {
          clearInterval(interval)
        }
      } catch (err) {
        console.error('[DrawingViewer] Error en polling:', err)
      }
    }, 5000) // Cada 5 segundos

    return () => clearInterval(interval)
  }, [drawing?.urn, drawing?.estado])

  // Formatear tamaño
  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Renderizar loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando plano...</p>
        </div>
      </div>
    )
  }

  // Renderizar error
  if (error || !drawing) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Error</h3>
          <p className="text-slate-600 mb-4">{error || 'No se pudo cargar el plano'}</p>
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Volver atrás
          </button>
        </div>
      </div>
    )
  }

  // Renderizar vista principal
  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-2 md:gap-4 flex-shrink-0">
        <div className="flex items-center gap-2 md:gap-4 min-w-0">
          <button
            onClick={() => router.back()}
            className="text-slate-600 hover:text-slate-900 transition-colors flex-shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <h1 className="text-base md:text-xl font-semibold text-slate-900 truncate">
              {drawing.nombre}
            </h1>
            <p className="text-xs md:text-sm text-slate-500 truncate hidden sm:block">
              {drawing.nombre_original}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Botón de información en móvil */}
          <button
            onClick={() => setIsInfoExpanded(!isInfoExpanded)}
            className="md:hidden flex items-center gap-1 px-2 py-1.5 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors text-xs"
          >
            Info
            {isInfoExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
          {drawing.storage_url && (
            <a
              href={drawing.storage_url}
              download={drawing.nombre_original}
              className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs md:text-sm flex-shrink-0"
            >
              <Download className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">Descargar</span>
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
        {/* Sidebar con metadatos - Colapsable en móvil */}
        <div className={`
          w-full md:w-80 bg-white border-b md:border-b-0 md:border-r border-slate-200 
          overflow-y-auto flex-shrink-0 transition-all duration-200
          md:block
          ${isInfoExpanded ? 'block max-h-[40vh]' : 'hidden md:block'}
        `}>
          <div className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-900">Información del Plano</h2>
              <button
                onClick={() => setIsInfoExpanded(false)}
                className="md:hidden text-slate-400 hover:text-slate-600"
              >
                <ChevronUp className="h-4 w-4" />
              </button>
            </div>

          <div className="space-y-4 text-sm">
            {/* Estado */}
            <div>
              <label className="text-slate-500 block mb-1">Estado</label>
              <div className="flex items-center gap-2">
                {drawing.estado === 'success' && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    Listo
                  </span>
                )}
                {drawing.estado === 'processing' && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium flex items-center gap-1">
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    Procesando ({drawing.progreso}%)
                  </span>
                )}
                {drawing.estado === 'pending' && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                    Pendiente
                  </span>
                )}
                {drawing.estado === 'failed' && (
                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                    Error
                  </span>
                )}
              </div>
            </div>

            {/* Tamaño */}
            <div>
              <label className="text-slate-500 block mb-1">Tamaño</label>
              <p className="text-slate-900">{formatBytes(drawing.tamano_bytes)}</p>
            </div>

            {/* Fecha de carga */}
            <div>
              <label className="text-slate-500 block mb-1">Subido el</label>
              <p className="text-slate-900">{formatDate(drawing.created_at)}</p>
            </div>

            {/* Descripción */}
            {drawing.descripcion && (
              <div>
                <label className="text-slate-500 block mb-1">Descripción</label>
                <p className="text-slate-900">{drawing.descripcion}</p>
              </div>
            )}

            {/* URN */}
            {drawing.urn && (
              <div>
                <label className="text-slate-500 block mb-1">URN</label>
                <p className="text-slate-900 text-xs font-mono break-all">{drawing.urn}</p>
              </div>
            )}

            {/* Mensaje de error */}
            {drawing.estado === 'failed' && drawing.estado_mensaje && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700 text-xs">{drawing.estado_mensaje}</p>
              </div>
            )}

            {/* Barra de progreso */}
            {(drawing.estado === 'processing' || drawing.estado === 'pending') && (
              <div>
                <label className="text-slate-500 block mb-2">Progreso de traducción</label>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="h-full bg-purple-600 rounded-full transition-all"
                    style={{ width: `${drawing.progreso}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1 text-center">{drawing.progreso}%</p>
              </div>
            )}
          </div>

          {/* Ayuda */}
          <div className="mt-6 p-3 md:p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="font-medium text-blue-900 text-sm mb-2">Herramientas del Visor</h3>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Clic/Touch y arrastra para rotar</li>
              <li>• Scroll/Pinch para zoom</li>
              <li>• <span className="hidden md:inline">Clic derecho</span><span className="md:hidden">Dos dedos</span> y arrastra para pan</li>
              <li className="hidden md:block">• Usa la barra superior para mediciones</li>
            </ul>
          </div>
          </div>
        </div>

        {/* Visor */}
        <div className="flex-1 bg-slate-100 relative min-w-0 h-full">
          {drawing.estado === 'success' && drawing.urn ? (
            <ForgeViewer urn={drawing.urn} />
          ) : drawing.estado === 'processing' || drawing.estado === 'pending' ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md px-6">
                <RefreshCw className="h-16 w-16 text-purple-600 animate-spin mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Procesando archivo DWG
                </h3>
                <p className="text-slate-600 mb-4">
                  Autodesk está traduciendo tu archivo para visualización. Esto puede tardar varios minutos dependiendo del tamaño y complejidad del plano.
                </p>
                <div className="w-full max-w-xs mx-auto bg-slate-200 rounded-full h-2">
                  <div
                    className="h-full bg-purple-600 rounded-full transition-all"
                    style={{ width: `${drawing.progreso}%` }}
                  />
                </div>
                <p className="text-sm text-slate-500 mt-2">{drawing.progreso}% completado</p>
              </div>
            </div>
          ) : drawing.estado === 'failed' ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md px-6">
                <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Error al procesar el archivo
                </h3>
                <p className="text-slate-600 mb-2">
                  Hubo un problema al traducir el archivo DWG.
                </p>
                {drawing.estado_mensaje && (
                  <p className="text-sm text-red-600 mb-4 bg-red-50 p-3 rounded">
                    {drawing.estado_mensaje}
                  </p>
                )}
                <p className="text-sm text-slate-500">
                  Verifica que el archivo sea un DWG válido e intenta subirlo nuevamente.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <FileImage className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">Esperando inicio de procesamiento...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
