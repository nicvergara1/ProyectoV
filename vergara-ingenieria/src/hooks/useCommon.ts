import { useState, useEffect, useRef } from 'react'

/**
 * Hook para debounce de valores
 * Útil para búsquedas y inputs que disparan requests
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Hook para manejar estados de carga
 */
export function useLoadingState(initialState: boolean = false) {
  const [isLoading, setIsLoading] = useState(initialState)
  const [error, setError] = useState<Error | null>(null)

  const startLoading = () => {
    setIsLoading(true)
    setError(null)
  }

  const stopLoading = () => {
    setIsLoading(false)
  }

  const setLoadingError = (err: Error | string) => {
    setIsLoading(false)
    setError(typeof err === 'string' ? new Error(err) : err)
  }

  const reset = () => {
    setIsLoading(false)
    setError(null)
  }

  return {
    isLoading,
    error,
    startLoading,
    stopLoading,
    setError: setLoadingError,
    reset
  }
}

/**
 * Hook para modal de confirmación
 */
export function useConfirmDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const resolveRef = useRef<((value: boolean) => void) | null>(null)

  const confirm = (): Promise<boolean> => {
    setIsOpen(true)
    return new Promise((resolve) => {
      resolveRef.current = resolve
    })
  }

  const handleConfirm = async () => {
    setPending(true)
    resolveRef.current?.(true)
    setPending(false)
    setIsOpen(false)
  }

  const handleCancel = () => {
    resolveRef.current?.(false)
    setIsOpen(false)
  }

  return {
    isOpen,
    pending,
    confirm,
    handleConfirm,
    handleCancel
  }
}

/**
 * Hook para manejo de errores con toast (soporte múltiple)
 */
export function useToast() {
  const [toasts, setToasts] = useState<Array<{
    id: string
    message: string
    type: 'success' | 'error' | 'info' | 'warning'
  }>>([])

  const addToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => removeToast(id), 5000)
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const success = (message: string) => addToast(message, 'success')
  const error = (message: string) => addToast(message, 'error')
  const info = (message: string) => addToast(message, 'info')
  const warning = (message: string) => addToast(message, 'warning')

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
    warning
  }
}

/**
 * Hook para localStorage con TypeScript
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue] as const
}

/**
 * Hook para copiar al portapapeles
 */
export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false)

  const copy = async (text: string) => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported')
      return false
    }

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      return true
    } catch (error) {
      console.warn('Copy failed', error)
      setCopied(false)
      return false
    }
  }

  return { copied, copy }
}
