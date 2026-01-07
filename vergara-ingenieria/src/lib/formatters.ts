/**
 * Utilidades de formateo centralizadas para mantener consistencia en toda la aplicación
 */

/**
 * Formatea un número a moneda chilena (CLP)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

/**
 * Formatea una fecha a formato legible en español
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Formatea una fecha con hora
 */
export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Formatea bytes a tamaño legible
 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

/**
 * Formatea un RUT chileno
 */
export function formatRUT(rut: string): string {
  // Eliminar puntos y guión
  const cleaned = rut.replace(/[.-]/g, '')
  
  // Separar dígito verificador
  const dv = cleaned.slice(-1)
  const number = cleaned.slice(0, -1)
  
  // Formatear con puntos
  const formatted = number.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  
  return `${formatted}-${dv}`
}

/**
 * Formatea un teléfono chileno
 */
export function formatPhone(phone: string): string {
  // Eliminar espacios y caracteres especiales
  const cleaned = phone.replace(/[^\d+]/g, '')
  
  // Si comienza con +56
  if (cleaned.startsWith('+56')) {
    const number = cleaned.substring(3)
    if (number.length === 9) {
      return `+56 ${number.charAt(0)} ${number.substring(1, 5)} ${number.substring(5)}`
    }
  }
  
  return phone
}

/**
 * Trunca texto a un número máximo de caracteres
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * Capitaliza la primera letra de cada palabra
 */
export function capitalize(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Cuenta palabras en un texto
 */
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length
}
