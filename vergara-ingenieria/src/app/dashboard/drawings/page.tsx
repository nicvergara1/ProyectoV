'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, FileImage, Eye, Download, Trash2, Search, Filter } from 'lucide-react'
import { getDrawings, deleteDrawing } from '@/app/actions/drawings'
import { Drawing } from '@/types'
import DrawingUploadModal from '@/components/DrawingUploadModal'

export default function DrawingsPage() {
  const router = useRouter()
  const [drawings, setDrawings] = useState<Drawing[]>([])
  const [filteredDrawings, setFilteredDrawings] = useState<Drawing[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEstado, setFilterEstado] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  // Cargar dibujos
  const loadDrawings = async () => {
    setIsLoading(true)
    const { drawings: data, error } = await getDrawings()
    if (!error && data) {
      setDrawings(data)
      setFilteredDrawings(data)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    loadDrawings()
  }, [])

  // Polling para dibujos en procesamiento
  useEffect(() => {
    const processingDrawings = drawings.filter(
      d => d.estado === 'pending' || d.estado === 'processing'
    )

    if (processingDrawings.length === 0) {
      return
    }

    console.log(`[Polling] ${processingDrawings.length} dibujo(s) en procesamiento, iniciando polling cada 5s`)

    // Actualizar estado de cada dibujo en procesamiento
    const pollStatus = async () => {
      for (const drawing of processingDrawings) {
        if (!drawing.urn) continue

        try {
          const response = await fetch(`/api/autodesk/status/${drawing.urn}`)
          if (response.ok) {
            const data = await response.json()
            console.log(`[Polling] Drawing ${drawing.id}: ${data.status} (${data.progressPercent}%)`)
          }
        } catch (error) {
          console.error(`[Polling] Error actualizando drawing ${drawing.id}:`, error)
        }
      }

      // Recargar la lista después de hacer polling
      await loadDrawings()
    }

    // Configurar intervalo de polling cada 5 segundos
    const intervalId = setInterval(pollStatus, 5000)

    // Limpiar intervalo al desmontar
    return () => {
      console.log('[Polling] Deteniendo polling')
      clearInterval(intervalId)
    }
  }, [drawings.length, drawings.map(d => `${d.id}-${d.estado}`).join(',')])

  // Filtrar dibujos
  useEffect(() => {
    let filtered = drawings

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(d =>
        d.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.nombre_original.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtrar por estado
    if (filterEstado !== 'all') {
      filtered = filtered.filter(d => d.estado === filterEstado)
    }

    setFilteredDrawings(filtered)
  }, [searchTerm, filterEstado, drawings])

  // Eliminar dibujo
  const handleDelete = async (id: number, nombre: string) => {
    if (!confirm(`¿Estás seguro de eliminar el plano "${nombre}"?`)) {
      return
    }

    const result = await deleteDrawing(id)
    if (result.success) {
      loadDrawings()
    } else {
      alert(result.error || 'Error al eliminar el dibujo')
    }
  }

  // Ver dibujo
  const handleView = (id: number) => {
    router.push(`/dashboard/drawings/${id}`)
  }

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
      month: 'short',
      day: 'numeric'
    })
  }

  // Badge de estado
  const EstadoBadge = ({ estado }: { estado: Drawing['estado'] }) => {
    const config: Record<Drawing['estado'], { color: string; text: string }> = {
      uploading: { color: 'bg-blue-100 text-blue-700', text: 'Subiendo' },
      pending: { color: 'bg-yellow-100 text-yellow-700', text: 'Pendiente' },
      processing: { color: 'bg-purple-100 text-purple-700', text: 'Procesando' },
      success: { color: 'bg-green-100 text-green-700', text: 'Listo' },
      failed: { color: 'bg-red-100 text-red-700', text: 'Error' },
    }

    const { color, text } = config[estado]

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        {text}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Planos DWG</h1>
          <p className="text-slate-600 mt-1">
            Gestiona y visualiza tus archivos de AutoCAD
          </p>
        </div>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="h-5 w-5" />
          Subir Plano
        </button>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar planos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filtro por estado */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            >
              <option value="all">Todos los estados</option>
              <option value="success">Listos</option>
              <option value="processing">Procesando</option>
              <option value="pending">Pendientes</option>
              <option value="failed">Con error</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de dibujos */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredDrawings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
          <FileImage className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            {searchTerm || filterEstado !== 'all'
              ? 'No se encontraron planos'
              : 'No tienes planos DWG'
            }
          </h3>
          <p className="text-slate-600 mb-4">
            {searchTerm || filterEstado !== 'all'
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Comienza subiendo tu primer archivo DWG'
            }
          </p>
          {!searchTerm && filterEstado === 'all' && (
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Subir Primer Plano
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDrawings.map(drawing => (
            <div
              key={drawing.id}
              className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow"
            >
              {/* Header del card */}
              <div className="flex items-start justify-between mb-3">
                <FileImage className="h-10 w-10 text-blue-600 flex-shrink-0" />
                <EstadoBadge estado={drawing.estado} />
              </div>

              {/* Nombre */}
              <h3 className="font-semibold text-slate-900 mb-1 truncate" title={drawing.nombre}>
                {drawing.nombre}
              </h3>

              {/* Metadatos */}
              <div className="text-sm text-slate-600 space-y-1 mb-3">
                <p className="truncate" title={drawing.nombre_original}>{drawing.nombre_original}</p>
                <p>{formatBytes(drawing.tamano_bytes)} • {formatDate(drawing.created_at)}</p>
                {drawing.progreso > 0 && drawing.estado === 'processing' && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Procesando</span>
                      <span>{drawing.progreso}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5">
                      <div
                        className="h-full bg-purple-600 rounded-full transition-all"
                        style={{ width: `${drawing.progreso}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Descripción */}
              {drawing.descripcion && (
                <p className="text-sm text-slate-500 mb-3 line-clamp-2">
                  {drawing.descripcion}
                </p>
              )}

              {/* Mensaje de error */}
              {drawing.estado === 'failed' && drawing.estado_mensaje && (
                <p className="text-xs text-red-600 mb-3">
                  {drawing.estado_mensaje}
                </p>
              )}

              {/* Acciones */}
              <div className="flex gap-2 pt-3 border-t border-slate-200">
                <button
                  onClick={() => handleView(drawing.id)}
                  disabled={drawing.estado !== 'success'}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Eye className="h-4 w-4" />
                  Ver
                </button>
                <button
                  onClick={() => handleDelete(drawing.id, drawing.nombre)}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Upload */}
      <DrawingUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={loadDrawings}
      />
    </div>
  )
}
