'use client'

import { useEffect, useState } from 'react'
import { Download, X } from 'lucide-react'

export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallBanner, setShowInstallBanner] = useState(false)

  useEffect(() => {
    // Registrar Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registrado:', registration)
        })
        .catch((error) => {
          console.error('Error registrando Service Worker:', error)
        })
    }

    // Capturar evento de instalación
    const handler = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallBanner(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      console.log('PWA instalada')
    }
    
    setDeferredPrompt(null)
    setShowInstallBanner(false)
  }

  if (!showInstallBanner) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 animate-slide-up">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl shadow-2xl p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Download className="h-5 w-5" />
              <h3 className="font-bold">Instalar App</h3>
            </div>
            <p className="text-sm text-blue-100">
              Instala Vergara Ingeniería en tu dispositivo para acceso rápido y notificaciones
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleInstall}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold text-sm hover:bg-blue-50 transition-colors"
              >
                Instalar
              </button>
              <button
                onClick={() => setShowInstallBanner(false)}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg font-semibold text-sm hover:bg-white/30 transition-colors"
              >
                Ahora no
              </button>
            </div>
          </div>
          <button
            onClick={() => setShowInstallBanner(false)}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
