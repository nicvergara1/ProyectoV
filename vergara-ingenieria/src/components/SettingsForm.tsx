'use client'

import { useState } from 'react'
import { updateSettings, CompanySettings } from '@/app/actions/settings'
import { Save, Building, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function SettingsForm({ initialSettings }: { initialSettings: CompanySettings | null }) {
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setIsPending(true)
    const result = await updateSettings(formData)
    setIsPending(false)

    if (result.success) {
      alert('Configuración guardada correctamente')
      router.refresh()
    } else {
      alert('Error al guardar la configuración')
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* Company Information Card */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Building className="h-5 w-5 text-slate-400" />
          Información de la Empresa
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre de la Empresa</label>
              <input 
                type="text" 
                name="nombre_empresa"
                defaultValue={initialSettings?.nombre_empresa || ''}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">RUT</label>
              <input 
                type="text" 
                name="rut"
                defaultValue={initialSettings?.rut || ''}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Dirección Comercial</label>
            <input 
              type="text" 
              name="direccion"
              defaultValue={initialSettings?.direccion || ''}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email de Contacto</label>
              <input 
                type="email" 
                name="email_contacto"
                defaultValue={initialSettings?.email_contacto || ''}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
              <input 
                type="tel" 
                name="telefono"
                defaultValue={initialSettings?.telefono || ''}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Preferences Card */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Preferencias Regionales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Moneda</label>
            <select 
              name="moneda"
              defaultValue={initialSettings?.moneda || 'CLP'}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900"
            >
              <option value="CLP">Peso Chileno (CLP)</option>
              <option value="USD">Dólar Estadounidense (USD)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          type="submit" 
          disabled={isPending}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          Guardar Cambios
        </button>
      </div>
    </form>
  )
}
