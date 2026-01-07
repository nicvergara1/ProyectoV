'use client'

import { useState } from 'react'
import { User, Bell } from 'lucide-react'
import { NotificationSettings } from '@/components/settings/NotificationSettings'
import { ProfileSettings } from '@/components/settings/ProfileSettings'

type Tab = 'profile' | 'notifications'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('profile')

  const tabs = [
    { id: 'profile' as Tab, label: 'Perfil', icon: User },
    { id: 'notifications' as Tab, label: 'Notificaciones', icon: Bell },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 md:p-8 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
            <User className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Configuración</h1>
            <p className="text-blue-100">Personaliza tu experiencia y preferencias</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="border-b border-slate-200">
          <nav className="flex gap-2 p-2" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all
                    ${activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                      : 'text-slate-600 hover:bg-slate-50'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'profile' && <ProfileSettings />}
          {activeTab === 'notifications' && <NotificationSettings />}
        </div>
      </div>
    </div>
  )
}
