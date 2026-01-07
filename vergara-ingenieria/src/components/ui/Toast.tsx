'use client'

import { useEffect } from 'react'
import { X, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ToastProps {
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  onClose: () => void
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info
}

const styles = {
  success: 'bg-green-50 text-green-900 border-green-200',
  error: 'bg-red-50 text-red-900 border-red-200',
  warning: 'bg-yellow-50 text-yellow-900 border-yellow-200',
  info: 'bg-blue-50 text-blue-900 border-blue-200'
}

const iconColors = {
  success: 'text-green-600',
  error: 'text-red-600',
  warning: 'text-yellow-600',
  info: 'text-blue-600'
}

export function Toast({ message, type, onClose }: ToastProps) {
  const Icon = icons[type]

  useEffect(() => {
    const timer = setTimeout(onClose, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={cn(
      'fixed top-4 right-4 z-50 max-w-md w-full shadow-lg rounded-lg border p-4',
      'transform transition-all duration-300 ease-in-out',
      'animate-in slide-in-from-top-5',
      styles[type]
    )}>
      <div className="flex items-start gap-3">
        <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', iconColors[type])} />
        <p className="flex-1 text-sm font-medium">{message}</p>
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

/**
 * Toast Container para manejar múltiples toasts
 */
interface ToastContainerProps {
  toasts: Array<{
    id: string
    message: string
    type: 'success' | 'error' | 'warning' | 'info'
  }>
  onClose: (id: string) => void
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md w-full pointer-events-none">
      {toasts.map((toast, index) => (
        <div key={toast.id} style={{ marginTop: index * 8 }} className="pointer-events-auto">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => onClose(toast.id)}
          />
        </div>
      ))}
    </div>
  )
}
