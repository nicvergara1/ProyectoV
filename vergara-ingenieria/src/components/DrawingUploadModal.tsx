'use client'

import { useState, useRef, FormEvent } from 'react'
import { Upload, X, FileImage, AlertCircle } from 'lucide-react'
import { uploadDrawing } from '@/app/actions/drawings'
import { Project } from '@/types'

interface DrawingUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  projects?: Project[]
}

export default function DrawingUploadModal({
  isOpen,
  onClose,
  onSuccess,
  projects = []
}: DrawingUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [descripcion, setDescripcion] = useState('')
  const [proyectoId, setProyectoId] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

  // Formatos CAD soportados
  const SUPPORTED_FORMATS = [
    // AutoCAD
    '.dwg', '.dwf', '.dxf',
    // Autodesk
    '.rvt', '.rfa', '.rte', '.nwd', '.nwc', '.ipt', '.iam', '.idw', '.f3d',
    // Otros CAD
    '.sldprt', '.sldasm', '.slddrw', '.skp', '.step', '.stp', '.iges', '.igs',
    '.sat', '.catpart', '.catproduct',
    // 3D Genéricos
    '.obj', '.stl', '.fbx', '.3ds', '.dae',
    // BIM
    '.ifc'
  ];

  // Validar archivo
  const validateFile = (file: File): string | null => {
    const fileName = file.name.toLowerCase();
    const isSupported = SUPPORTED_FORMATS.some(format => fileName.endsWith(format));
    
    if (!isSupported) {
      return `Formato no soportado. Formatos permitidos: ${SUPPORTED_FORMATS.join(', ')}`;
    }

    if (file.size > MAX_FILE_SIZE) {
      return 'El archivo excede el tamaño máximo de 50MB'
    }

    return null
  }

  // Manejar selección de archivo
  const handleFileSelect = (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setSelectedFile(file)
    setError(null)
  }

  // Drag & Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  // Manejar cambio de input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  // Manejar submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!selectedFile) {
      setError('Debe seleccionar un archivo')
      return
    }

    setIsUploading(true)
    setError(null)
    setUploadProgress(0)

    try {
      // Simular progreso (el upload real es muy rápido)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 85) return prev // Pausar en 85% hasta que termine
          return prev + 15
        })
      }, 300)

      const formData = new FormData()
      formData.append('file', selectedFile)
      if (descripcion) formData.append('descripcion', descripcion)
      if (proyectoId) formData.append('proyecto_id', proyectoId)

      const result = await uploadDrawing(formData)

      clearInterval(progressInterval)

      if (result.success) {
        // Completar progreso gradualmente para mejor UX
        setUploadProgress(95)
        await new Promise(resolve => setTimeout(resolve, 200))
        setUploadProgress(100)
        
        // Mantener modal abierto 1.5s para que el usuario vea el 100%
        setTimeout(() => {
          if (onSuccess) onSuccess()
          handleClose()
        }, 1500)
      } else {
        setError(result.error || 'Error al subir el archivo')
        setUploadProgress(0)
      }

    } catch (err: any) {
      setError(err.message || 'Error desconocido al subir el archivo')
      setUploadProgress(0)
    } finally {
      setIsUploading(false)
    }
  }

  // Cerrar modal y resetear estado
  const handleClose = () => {
    if (isUploading) return // No cerrar mientras se sube

    setSelectedFile(null)
    setDescripcion('')
    setProyectoId('')
    setError(null)
    setUploadProgress(0)
    onClose()
  }

  // Formatear tamaño de archivo
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">Subir Archivo CAD</h2>
          <button
            onClick={handleClose}
            disabled={isUploading}
            className="text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Drag & Drop Zone */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Archivo CAD <span className="text-red-500">*</span>
            </label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
                ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}
                ${selectedFile ? 'bg-green-50 border-green-500' : ''}
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".dwg,.dwf,.dxf,.rvt,.rfa,.rte,.nwd,.nwc,.ipt,.iam,.idw,.f3d,.sldprt,.sldasm,.slddrw,.skp,.step,.stp,.iges,.igs,.sat,.catpart,.catproduct,.obj,.stl,.fbx,.3ds,.dae,.ifc"
                onChange={handleInputChange}
                className="hidden"
                disabled={isUploading}
              />

              {selectedFile ? (
                <div className="space-y-3">
                  <FileImage className="h-12 w-12 text-green-600 mx-auto" />
                  <div>
                    <p className="font-medium text-slate-900">{selectedFile.name}</p>
                    <p className="text-sm text-slate-500">{formatFileSize(selectedFile.size)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedFile(null)
                    }}
                    disabled={isUploading}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Cambiar archivo
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="h-12 w-12 text-slate-400 mx-auto" />
                  <div>
                    <p className="text-slate-700 font-medium">
                      Arrastra un archivo CAD aquí
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      DWG, DWF, DXF, RVT, SKP, STEP, IFC y más (máx. 50MB)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-slate-700 mb-2">
              Descripción (opcional)
            </label>
            <textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              disabled={isUploading}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-500"
              placeholder="Descripción del plano..."
            />
          </div>

          {/* Asociar a proyecto */}
          {projects.length > 0 && (
            <div>
              <label htmlFor="proyecto" className="block text-sm font-medium text-slate-700 mb-2">
                Asociar a Proyecto (opcional)
              </label>
              <select
                id="proyecto"
                value={proyectoId}
                onChange={(e) => setProyectoId(e.target.value)}
                disabled={isUploading}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
              >
                <option value="">Sin proyecto</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.nombre} {project.cliente && `- ${project.cliente}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Progress Bar */}
          {isUploading && (
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className={uploadProgress === 100 ? "text-green-600 font-medium" : "text-slate-600"}>
                  {uploadProgress === 100 ? "✓ Archivo subido correctamente" : "Subiendo archivo..."}
                </span>
                <span className={uploadProgress === 100 ? "text-green-600 font-medium" : "text-slate-600"}>
                  {uploadProgress}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ease-out ${
                    uploadProgress === 100 ? "bg-green-500" : "bg-blue-600"
                  }`}
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              {uploadProgress === 100 && (
                <p className="text-xs text-slate-500 mt-2">
                  La traducción 3D se procesará en segundo plano
                </p>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={isUploading}
              className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!selectedFile || isUploading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Subiendo...</span>
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  <span>Subir Archivo</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
