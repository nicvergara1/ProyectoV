'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Save, Download } from 'lucide-react'
import { createQuote } from '@/app/actions/quotes'
import { Project } from '@/types'

type QuoteItemInput = {
  descripcion: string
  cantidad: number
  precio_unitario: number
}

interface QuoteFormProps {
  projects?: Project[]
}

export function QuoteForm({ projects = [] }: QuoteFormProps) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [items, setItems] = useState<QuoteItemInput[]>([{ descripcion: '', cantidad: 1, precio_unitario: 0 }])

  const addItem = () => {
    setItems([...items, { descripcion: '', cantidad: 1, precio_unitario: 0 }])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: keyof QuoteItemInput, value: string | number) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  const calculateTotal = () => {
    return items.reduce((acc, item) => acc + (item.cantidad * item.precio_unitario), 0)
  }

  async function handleSubmit(formData: FormData) {
    setIsPending(true)
    
    const quoteData = {
      cliente_nombre: formData.get('client_name') as string,
      cliente_email: formData.get('client_email') as string,
      proyecto_nombre: formData.get('project_name') as string,
      estado: formData.get('status') as 'borrador' | 'enviada' | 'aceptada' | 'rechazada',
      monto_total: calculateTotal(),
      valido_hasta: formData.get('valid_until') as string
    }

    const result = await createQuote(quoteData, items)
    
    if (result.success && result.id) {
      router.push(`/dashboard/quotes/${result.id}`)
    } else {
      alert('Error al guardar la cotización')
    }
    setIsPending(false)
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      {/* Client Info */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Información del Cliente</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700">Cliente / Empresa</label>
            <input type="text" name="client_name" required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border text-slate-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input type="email" name="client_email" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border text-slate-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Nombre del Proyecto</label>
            <select 
              name="project_name" 
              required 
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border text-slate-900 bg-white"
            >
              <option value="">Seleccione un proyecto</option>
              {projects.map((project) => (
                <option key={project.id} value={project.nombre}>
                  {project.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Válido Hasta</label>
            <input type="date" name="valid_until" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border text-slate-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Estado</label>
            <select name="status" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border text-slate-900">
              <option value="borrador">Borrador</option>
              <option value="enviada">Enviada</option>
              <option value="aceptada">Aceptada</option>
              <option value="rechazada">Rechazada</option>
            </select>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Ítems de la Cotización</h2>
          <button type="button" onClick={addItem} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
            <Plus className="h-4 w-4" /> Agregar Ítem
          </button>
        </div>
        
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="flex gap-4 items-start">
              <div className="flex-1">
                <input 
                  type="text" 
                  placeholder="Descripción"
                  value={item.descripcion}
                  onChange={(e) => updateItem(index, 'descripcion', e.target.value)}
                  required
                  className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border text-slate-900" 
                />
              </div>
              <div className="w-24">
                <input 
                  type="number" 
                  placeholder="Cant."
                  value={item.cantidad || ''}
                  onChange={(e) => updateItem(index, 'cantidad', Number(e.target.value) || 0)}
                  required
                  min="1"
                  className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border text-slate-900" 
                />
              </div>
              <div className="w-32">
                <input 
                  type="number" 
                  placeholder="Precio Unit."
                  value={item.precio_unitario || ''}
                  onChange={(e) => updateItem(index, 'precio_unitario', Number(e.target.value) || 0)}
                  required
                  min="0"
                  className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border text-slate-900" 
                />
              </div>
              <div className="w-32 pt-2 text-right font-medium text-slate-700">
                ${(item.cantidad * item.precio_unitario).toLocaleString('es-CL')}
              </div>
              <button type="button" onClick={() => removeItem(index)} className="pt-2 text-red-500 hover:text-red-700">
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-slate-200 pt-4 flex justify-end">
          <div className="text-xl font-bold text-slate-900">
            Total: ${calculateTotal().toLocaleString('es-CL')}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {isPending ? 'Guardando...' : 'Guardar Cotización'}
        </button>
      </div>
    </form>
  )
}
