'use client'

import { useState } from 'react'
import { registerProductExit } from '@/app/actions/inventory'
import { useRouter } from 'next/navigation'
import { Loader2, Save } from 'lucide-react'
import Link from 'next/link'
import { Product, Project } from '@/types'

export default function ExitForm({ products, projects }: { products: Product[], projects: Project[] }) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsPending(true)
    const result = await registerProductExit(formData)
    setIsPending(false)

    if (result.success) {
      router.push('/dashboard/inventory')
      router.refresh()
    } else {
      alert('Error al registrar la salida: ' + result.error)
    }
  }

  return (
    <form action={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <label htmlFor="project_id" className="text-sm font-medium text-slate-900">
            Proyecto (Opcional)
          </label>
          <select
            name="project_id"
            id="project_id"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccionar proyecto...</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="product_id" className="text-sm font-medium text-slate-900">
            Producto
          </label>
          <select
            name="product_id"
            id="product_id"
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => {
              const product = products.find(p => p.id === Number(e.target.value))
              setSelectedProduct(product || null)
            }}
          >
            <option value="">Seleccionar producto...</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.nombre} (Stock: {product.cantidad})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="cantidad" className="text-sm font-medium text-slate-900">
            Cantidad a retirar
          </label>
          <input
            type="number"
            name="cantidad"
            id="cantidad"
            required
            min="1"
            max={selectedProduct?.cantidad}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0"
          />
          {selectedProduct && (
            <p className="text-xs text-slate-500">
              Máximo disponible: {selectedProduct.cantidad}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="motivo" className="text-sm font-medium text-slate-900">
            Detalle / Observaciones
          </label>
          <textarea
            name="motivo"
            id="motivo"
            rows={3}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: Material entregado a Juan Pérez"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
        <Link
          href="/dashboard/inventory"
          className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Registrando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Registrar Salida
            </>
          )}
        </button>
      </div>
    </form>
  )
}
