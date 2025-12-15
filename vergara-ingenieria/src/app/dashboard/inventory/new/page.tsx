'use client'

import { useState } from 'react'
import { createProduct } from '@/app/actions/inventory'
import { useRouter } from 'next/navigation'
import { Loader2, Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { ImageRecognizer } from '@/components/ImageRecognizer'

const CATEGORIES = [
  'Materiales Eléctricos',
  'Herramientas',
  'Insumos de Oficina',
  'Equipos de Protección Personal (EPP)',
  'Cables y Conductores',
  'Iluminación',
  'Ferretería',
  'Otros'
]

export default function NewProductPage() {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  
  // State for controlled inputs to allow autofill
  const [nombre, setNombre] = useState('')
  const [categoria, setCategoria] = useState('')
  const [descripcion, setDescripcion] = useState('')

  async function handleSubmit(formData: FormData) {
    setIsPending(true)
    const result = await createProduct(formData)
    setIsPending(false)

    if (result.success) {
      router.push('/dashboard/inventory')
      router.refresh()
    } else {
      alert('Error al guardar el producto: ' + result.error)
    }
  }

  const handleRecognition = (data: { nombre: string; categoria: string; descripcion: string }) => {
    setNombre(data.nombre)
    setCategoria(data.categoria)
    setDescripcion(data.descripcion)
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/inventory" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Nuevo Producto</h1>
          <p className="text-slate-600">Agrega un nuevo producto al inventario.</p>
        </div>
      </div>

      <form action={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 space-y-6">
        
        <ImageRecognizer onRecognized={handleRecognition} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-800 mb-1">Nombre del Producto</label>
            <input
              type="text"
              name="nombre"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              placeholder="Ej: Cable THHN 12AWG"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-800 mb-1">Categoría</label>
            <select
              name="categoria"
              required
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900"
            >
              <option value="">Seleccionar Categoría...</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-800 mb-1">Stock Mínimo (Alerta)</label>
            <input
              type="number"
              name="stock_minimo"
              required
              defaultValue={5}
              min="0"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-800 mb-1">Cantidad Inicial</label>
            <input
              type="number"
              name="cantidad"
              required
              defaultValue={0}
              min="0"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-800 mb-1">Precio Unitario</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600">$</span>
              <input
                type="number"
                name="precio_unitario"
                required
                defaultValue={0}
                min="0"
                className="w-full pl-7 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-800 mb-1">Descripción</label>
            <textarea
              name="descripcion"
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              placeholder="Detalles adicionales del producto..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
          <Link
            href="/dashboard/inventory"
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Guardar Producto
          </button>
        </div>
      </form>
    </div>
  )
}
