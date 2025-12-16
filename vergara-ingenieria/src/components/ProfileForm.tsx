'use client'

import { useState } from 'react'
import { updateUserProfile } from '@/app/actions/profile'
import { Save, User, Loader2, Mail, Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'

type UserProfile = {
  email?: string
  display_name: string
  created_at?: string
} | null

export function ProfileForm({ profile }: { profile: UserProfile }) {
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setIsPending(true)
    const result = await updateUserProfile(formData)
    setIsPending(false)

    if (result.success) {
      alert('Perfil actualizado correctamente')
      router.refresh()
    } else {
      alert('Error al actualizar el perfil: ' + result.error)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* Profile Information Card */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <User className="h-5 w-5 text-slate-400" />
          Información de Perfil
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre para Mostrar</label>
            <input 
              type="text" 
              name="display_name"
              required
              defaultValue={profile?.display_name || ''}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              placeholder="Ej: Juan Pérez"
            />
            <p className="text-xs text-slate-500 mt-1">
              Este nombre se mostrará en el dashboard y documentos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-400" />
                Email
              </label>
              <input 
                type="email" 
                value={profile?.email || ''}
                disabled
                className="w-full px-3 py-2 border border-slate-300 rounded-md bg-slate-100 text-slate-600 cursor-not-allowed"
              />
              <p className="text-xs text-slate-500 mt-1">
                El email no se puede modificar
              </p>
            </div>
            
            {profile?.created_at && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  Fecha de Registro
                </label>
                <input 
                  type="text" 
                  value={new Date(profile.created_at).toLocaleDateString('es-CL')}
                  disabled
                  className="w-full px-3 py-2 border border-slate-300 rounded-md bg-slate-100 text-slate-600 cursor-not-allowed"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4 mt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Guardar Perfil
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  )
}
