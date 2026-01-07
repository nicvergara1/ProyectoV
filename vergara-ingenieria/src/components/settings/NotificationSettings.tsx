'use client'

import { useState, useEffect } from 'react'
import { Bell, Mail, Package, FileText, Calendar, TrendingUp, Check, X, Send } from 'lucide-react'
import { usePushNotifications } from '@/hooks/usePushNotifications'
import { sendPushNotification } from '@/app/actions/push-notifications'

type NotificationChannel = 'app' | 'email' | 'both'
type FrequencySummary = 'daily' | 'weekly' | 'monthly' | 'never'

interface NotificationPreferences {
  lowStock: boolean
  lowStockChannel: NotificationChannel
  newQuotes: boolean
  newQuotesChannel: NotificationChannel
  projectDeadlines: boolean
  projectDeadlinesChannel: NotificationChannel
  activitySummary: FrequencySummary
}

export function NotificationSettings() {
  const {
    isSubscribed,
    isSupported,
    permission,
    isLoading,
    subscribe,
    unsubscribe,
  } = usePushNotifications()

  const [preferences, setPreferences] = useState<NotificationPreferences>({
    lowStock: true,
    lowStockChannel: 'both',
    newQuotes: true,
    newQuotesChannel: 'email',
    projectDeadlines: true,
    projectDeadlinesChannel: 'both',
    activitySummary: 'weekly',
  })

  useEffect(() => {
    // Load saved preferences from localStorage
    const saved = localStorage.getItem('notificationPreferences')
    if (saved) {
      setPreferences(JSON.parse(saved))
    }
  }, [])

  const updatePreference = <K extends keyof NotificationPreferences>(
    key: K,
    value: NotificationPreferences[K]
  ) => {
    const updated = { ...preferences, [key]: value }
    setPreferences(updated)
    localStorage.setItem('notificationPreferences', JSON.stringify(updated))
  }

  const sendTestNotification = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      
      if (permission === 'granted') {
        // Usar Service Worker en lugar del constructor directo (requerido en Android)
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.ready
          await registration.showNotification('Vergara Ingeniería', {
            body: '¡Notificación de prueba local enviada exitosamente! 🎉',
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            tag: 'test-notification',
            requireInteraction: false,
          })
        } else {
          // Fallback para navegadores sin Service Worker
          new Notification('Vergara Ingeniería', {
            body: '¡Notificación de prueba local enviada exitosamente! 🎉',
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            tag: 'test-notification',
            requireInteraction: false,
          })
        }
      } else {
        alert('Para recibir notificaciones, debes permitir las notificaciones en tu navegador.')
      }
    } else {
      alert('Tu navegador no soporta notificaciones push.')
    }
  }

  const handleTogglePushNotifications = async () => {
    try {
      if (isSubscribed) {
        await unsubscribe()
      } else {
        await subscribe()
      }
    } catch (error: any) {
      alert(error.message || 'Error al cambiar la suscripción')
    }
  }

  const sendTestPushNotification = async () => {
    console.log('🔔 Iniciando envío de notificación cross-device...')
    try {
      console.log('📤 Llamando a sendPushNotification...')
      const result = await sendPushNotification({
        title: 'Vergara Ingeniería',
        body: '¡Notificación de prueba CROSS-DEVICE enviada! 🎉',
        url: '/dashboard',
        tag: 'test-notification',
      })

      console.log('📥 Resultado:', result)

      if (result.error) {
        console.error('❌ Error:', result.error)
        alert('Error: ' + result.error)
      } else {
        console.log('✅ Éxito! Enviado a', result.data?.sent, 'dispositivos')
        alert(`Notificación enviada a ${result.data?.sent || 0} dispositivo(s)`)
      }
    } catch (error: any) {
      console.error('💥 Excepción:', error)
      alert('Error al enviar notificación: ' + error.message)
    }
  }

  const ChannelSelector = ({ 
    value, 
    onChange 
  }: { 
    value: NotificationChannel
    onChange: (v: NotificationChannel) => void 
  }) => (
    <div className="flex gap-2 mt-2">
      <button
        onClick={() => onChange('app')}
        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
          value === 'app'
            ? 'bg-blue-600 text-white'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        }`}
      >
        <Bell className="h-3 w-3 inline mr-1" />
        Solo App
      </button>
      <button
        onClick={() => onChange('email')}
        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
          value === 'email'
            ? 'bg-blue-600 text-white'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        }`}
      >
        <Mail className="h-3 w-3 inline mr-1" />
        Solo Email
      </button>
      <button
        onClick={() => onChange('both')}
        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
          value === 'both'
            ? 'bg-blue-600 text-white'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        }`}
      >
        Ambos
      </button>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Push Notifications Toggle */}
      {isSupported && (
        <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                  <Bell className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Notificaciones Push
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {isSubscribed 
                      ? 'Recibirás notificaciones en todos tus dispositivos' 
                      : 'Activa para recibir notificaciones en tiempo real'}
                  </p>
                </div>
              </div>
              
              {permission === 'denied' && (
                <div className="mt-3 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-700 dark:text-red-400">
                    Has bloqueado las notificaciones. Debes habilitarlas en la configuración de tu navegador.
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={handleTogglePushNotifications}
              disabled={isLoading || permission === 'denied'}
              className={`ml-4 px-6 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                isSubscribed
                  ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-950/30 dark:text-red-400'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-lg hover:shadow-blue-500/50'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                'Procesando...'
              ) : isSubscribed ? (
                <>
                  <X className="h-4 w-4" />
                  Desactivar
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Activar
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Low Stock Alerts */}
      <div className="p-6 bg-slate-50 rounded-xl border-2 border-slate-200 dark:bg-slate-900/50 dark:border-slate-700">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Package className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Alertas de Stock Bajo</h4>
              <p className="text-sm text-slate-600">Notificaciones cuando un producto está por debajo del stock mínimo</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.lowStock}
              onChange={(e) => updatePreference('lowStock', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        {preferences.lowStock && (
          <ChannelSelector
            value={preferences.lowStockChannel}
            onChange={(v) => updatePreference('lowStockChannel', v)}
          />
        )}
      </div>

      {/* New Quotes Notifications */}
      <div className="p-6 bg-slate-50 rounded-xl border-2 border-slate-200">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Notificaciones de Nuevas Cotizaciones</h4>
              <p className="text-sm text-slate-600">Recibe alertas cuando se crea o actualiza una cotización</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.newQuotes}
              onChange={(e) => updatePreference('newQuotes', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        {preferences.newQuotes && (
          <ChannelSelector
            value={preferences.newQuotesChannel}
            onChange={(v) => updatePreference('newQuotesChannel', v)}
          />
        )}
      </div>

      {/* Project Deadline Reminders */}
      <div className="p-6 bg-slate-50 rounded-xl border-2 border-slate-200">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Recordatorios de Proyectos</h4>
              <p className="text-sm text-slate-600">Alertas para proyectos próximos a vencer o con fechas importantes</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.projectDeadlines}
              onChange={(e) => updatePreference('projectDeadlines', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        {preferences.projectDeadlines && (
          <ChannelSelector
            value={preferences.projectDeadlinesChannel}
            onChange={(v) => updatePreference('projectDeadlinesChannel', v)}
          />
        )}
      </div>

      {/* Activity Summary */}
      <div className="p-6 bg-slate-50 rounded-xl border-2 border-slate-200">
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-slate-900 mb-1">Resumen de Actividad</h4>
            <p className="text-sm text-slate-600 mb-4">Recibe un resumen periódico de tu actividad en el sistema</p>
            
            <div className="grid grid-cols-4 gap-2">
              {(['daily', 'weekly', 'monthly', 'never'] as FrequencySummary[]).map((freq) => (
                <button
                  key={freq}
                  onClick={() => updatePreference('activitySummary', freq)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    preferences.activitySummary === freq
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {freq === 'daily' && 'Diario'}
                  {freq === 'weekly' && 'Semanal'}
                  {freq === 'monthly' && 'Mensual'}
                  {freq === 'never' && 'Nunca'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Test Notification Buttons */}
      <div className="flex justify-center gap-4 pt-4">
        <button
          onClick={sendTestNotification}
          className="px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-slate-500/50 transition-all duration-300 flex items-center gap-2"
        >
          <Bell className="h-5 w-5" />
          Notificación Local
        </button>
        
        {isSubscribed && (
          <button
            onClick={sendTestPushNotification}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 flex items-center gap-2"
          >
            <Send className="h-5 w-5" />
            Notificación Cross-Device
          </button>
        )}
      </div>

      {/* Info Box */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl dark:bg-blue-950/30 dark:border-blue-800">
        <div className="flex gap-3">
          <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">Sobre las notificaciones</p>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Las notificaciones en la app aparecerán en el dashboard. Las notificaciones por email se enviarán a tu correo registrado. 
              Puedes cambiar estas preferencias en cualquier momento.
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-4 border-t border-slate-200">
        <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold">
          Guardar Preferencias
        </button>
      </div>
    </div>
  )
}
