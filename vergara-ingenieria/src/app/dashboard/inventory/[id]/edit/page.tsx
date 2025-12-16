'use client'

import { useState, useEffect, use } from 'react'
import { getProduct, updateProduct } from '@/app/actions/inventory'
import { useRouter } from 'next/navigation'
import { Loader2, Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Product } from '@/types'

const CATEGORIES = [
  'Materiales Eléctricos',
  'Herramientas',
  'Cables',
  'Iluminación',
  'Tableros',
  'Automatización',
  'Otros'
]

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const [isPending, setIsPending] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [product, setProduct] = useState<Product | null>(null)

  useEffect(() => {
    async function loadProduct() {
      const { product } = await getProduct(Number(id))
      if (product) {
        setProduct(product)
      }
      setIsLoading(false)
    }
    loadProduct()
  }, [id])

  async function handleSubmit(formData: FormData) {
    setIsPending(true)
    const result = await updateProduct(Number(id), formData)
    setIsPending(false)

    if (result.success) {
      router.push('/dashboard/inventory')
      router.refresh()
    } else {
      alert('Error al actualizar el producto: ' + result.error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Producto no encontrado</p>
        <Link href="/dashboard/inventory" className="text-blue-600 hover:underline mt-4 inline-block">
          Volver al inventario
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/inventory" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Editar Producto</h1>
          <p className="text-slate-600">Actualiza la información del producto.</p>
        </div>
      </div>

      <form action={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-800 mb-1">Nombre del Producto</label>
          <input
            type="text"
            name="nombre"
            required
            defaultValue={product.nombre}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
            placeholder="Ej: Cable THW 12 AWG"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-800 mb-1">Descripción</label>
          <textarea
            name="descripcion"
            rows={3}
            defaultValue={product.descripcion || ''}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
            placeholder="Descripción opcional del producto..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-800 mb-1">Categoría</label>
            <select
              name="categoria"
              required
              defaultValue={product.categoria}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900"
            >
              <option value="">Seleccionar...</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-800 mb-1">Precio Unitario</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600">$</span>
              <input
                type="number"
                name="precio_unitario"
                required
                min="0"
                defaultValue={product.precio_unitario}
                className="w-full pl-7 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-800 mb-1">Stock Actual</label>
              <input
                type="number"
                value={product.cantidad}
                disabled
                className="w-full px-3 py-2 border border-slate-300 rounded-md bg-slate-100 text-slate-700 cursor-not-allowed"
              />
              <p className="text-xs text-slate-600 mt-1">
                Usa "Registrar Salida" o "Registrar Entrada" para modificar el stock
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-800 mb-1">Stock Mínimo</label>
              <input
                type="number"
                name="stock_minimo"
                required
                min="0"
                defaultValue={product.stock_minimo}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                placeholder="0"
              />
              <p className="text-xs text-slate-600 mt-1">
                Alerta cuando el stock esté por debajo de este valor
              </p>
            </div>
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
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  )
}
