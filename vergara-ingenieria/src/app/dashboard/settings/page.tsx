import { Save, User, Building, Bell, Lock } from 'lucide-react'
import { getSettings } from '@/app/actions/settings'
import { getUserProfile } from '@/app/actions/profile'
import { SettingsForm } from '@/components/SettingsForm'
import { ProfileForm } from '@/components/ProfileForm'

export default async function SettingsPage() {
  const settings = await getSettings()
  const profile = await getUserProfile()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Configuración</h1>
        <p className="text-slate-500">Administra los detalles de tu cuenta y preferencias de la empresa.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Navigation (Visual only for now) */}
        <div className="lg:col-span-1 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-2 bg-blue-50 text-blue-700 rounded-md font-medium">
            <User className="h-5 w-5" />
            Perfil
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-md font-medium transition-colors">
            <Building className="h-5 w-5" />
            Empresa
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-md font-medium transition-colors">
            <Bell className="h-5 w-5" />
            Notificaciones
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-md font-medium transition-colors">
            <Lock className="h-5 w-5" />
            Seguridad
          </button>
        </div>

        {/* Main Settings Form */}
        <div className="lg:col-span-2 space-y-6">
          <ProfileForm profile={profile} />
          <SettingsForm initialSettings={settings} />
        </div>
      </div>
    </div>
  )
}
