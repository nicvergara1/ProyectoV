import { AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AlertProps {
  type: 'error' | 'warning' | 'success' | 'info'
  title?: string
  message: string
  className?: string
}

const icons = {
  error: AlertCircle,
  warning: AlertTriangle,
  success: CheckCircle,
  info: Info
}

const styles = {
  error: 'bg-red-50 text-red-900 border-red-200',
  warning: 'bg-yellow-50 text-yellow-900 border-yellow-200',
  success: 'bg-green-50 text-green-900 border-green-200',
  info: 'bg-blue-50 text-blue-900 border-blue-200'
}

const iconColors = {
  error: 'text-red-600',
  warning: 'text-yellow-600',
  success: 'text-green-600',
  info: 'text-blue-600'
}

export function Alert({ type, title, message, className }: AlertProps) {
  const Icon = icons[type]

  return (
    <div className={cn('rounded-lg border p-4', styles[type], className)}>
      <div className="flex items-start gap-3">
        <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', iconColors[type])} />
        <div className="flex-1">
          {title && <h4 className="font-semibold mb-1">{title}</h4>}
          <p className="text-sm">{message}</p>
        </div>
      </div>
    </div>
  )
}
