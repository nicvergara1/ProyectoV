'use client'

import { useState, useRef } from 'react'
import { Camera, Loader2, Upload, FileText } from 'lucide-react'
import { analyzeImage, analyzeInvoice } from '@/app/actions/recognize'

interface ImageRecognizerProps {
  onRecognized: (data: any) => void
  mode?: 'inventory' | 'invoice'
}

export function ImageRecognizer({ onRecognized, mode = 'inventory' }: ImageRecognizerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsAnalyzing(true)
    const formData = new FormData()
    formData.append('image', file)

    try {
      const result = mode === 'inventory' 
        ? await analyzeImage(formData)
        : await analyzeInvoice(formData)

      if (result.success && result.data) {
        onRecognized(result.data)
      } else {
        alert(result.error || 'No se pudo reconocer el archivo. Intente nuevamente.')
      }
    } catch (error) {
      console.error('Error analyzing file:', error)
      alert('Ocurrió un error al procesar el archivo.')
    } finally {
      setIsAnalyzing(false)
      // Reset inputs
      if (e.target) e.target.value = ''
    }
  }

  return (
    <div className="mb-6">
      {/* Camera Input (Images only) */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        ref={cameraInputRef}
        onChange={handleFileChange}
      />

      {/* File Input (PDFs/Images) */}
      <input
        type="file"
        accept={mode === 'invoice' ? "application/pdf,image/*" : "image/*"}
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => cameraInputRef.current?.click()}
          disabled={isAnalyzing}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-md border border-blue-200 hover:bg-blue-100 transition-colors"
        >
          {isAnalyzing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Camera className="h-5 w-5" />}
          <span className="font-medium">Usar Cámara</span>
        </button>

        {mode === 'invoice' && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isAnalyzing}
            className="flex-1 flex items-center justify-center gap-2 bg-slate-50 text-slate-700 px-4 py-2 rounded-md border border-slate-200 hover:bg-slate-100 transition-colors"
          >
            {isAnalyzing ? <Loader2 className="h-5 w-5 animate-spin" /> : <FileText className="h-5 w-5" />}
            <span className="font-medium">Subir PDF/Archivo</span>
          </button>
        )}
      </div>
      
      <p className="text-xs text-slate-500 mt-2">
        {mode === 'invoice' 
          ? 'Escanee una factura con la cámara o suba un archivo PDF/Imagen.' 
          : 'Tome una foto del producto para identificarlo automáticamente.'}
      </p>
    </div>
  )
}
