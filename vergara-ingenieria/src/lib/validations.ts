/**
 * Esquemas de validación con Zod para formularios
 */

import { z } from 'zod'

/**
 * Validación de RUT chileno
 */
export function validateRUT(rut: string): boolean {
  // Limpiar RUT
  const cleaned = rut.replace(/[.-]/g, '')
  
  if (cleaned.length < 8 || cleaned.length > 9) return false
  
  const dv = cleaned.slice(-1).toUpperCase()
  const number = parseInt(cleaned.slice(0, -1))
  
  if (isNaN(number)) return false
  
  // Calcular dígito verificador
  let sum = 0
  let multiplier = 2
  
  for (let i = cleaned.length - 2; i >= 0; i--) {
    sum += parseInt(cleaned.charAt(i)) * multiplier
    multiplier = multiplier === 7 ? 2 : multiplier + 1
  }
  
  const expectedDV = 11 - (sum % 11)
  const calculatedDV = expectedDV === 11 ? '0' : expectedDV === 10 ? 'K' : expectedDV.toString()
  
  return dv === calculatedDV
}

/**
 * Schema para contacto
 */
export const contactSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  telefono: z.string()
    .regex(/^\+56\s?9\s?\d{4}\s?\d{4}$/, 'Formato: +56 9 XXXX XXXX')
    .optional(),
  subject: z.string().min(5, 'El asunto debe tener al menos 5 caracteres'),
  message: z.string()
    .min(1, 'El mensaje es requerido')
    .refine(
      (val) => val.trim().split(/\s+/).length >= 20,
      'El mensaje debe tener al menos 20 palabras'
    )
})

/**
 * Schema para facturas
 */
export const invoiceSchema = z.object({
  tipo: z.enum(['compra', 'venta']),
  numero_factura: z.number()
    .int('Debe ser un número entero')
    .positive('Debe ser positivo')
    .max(999999, 'Máximo 6 dígitos'),
  fecha_emision: z.string()
    .refine((date) => {
      const inputDate = new Date(date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return inputDate <= today
    }, 'No se permiten fechas futuras'),
  entidad: z.string().min(3, 'Mínimo 3 caracteres'),
  rut_entidad: z.string()
    .optional()
    .refine((rut) => !rut || validateRUT(rut), 'RUT inválido'),
  direccion_entidad: z.string().optional(),
  descripcion: z.string().optional(),
  monto_neto: z.number().positive('Debe ser positivo'),
  iva: z.number().min(0, 'No puede ser negativo'),
  estado: z.enum(['pendiente', 'pagada', 'anulada'])
})

/**
 * Schema para productos
 */
export const productSchema = z.object({
  nombre: z.string().min(2, 'Mínimo 2 caracteres'),
  descripcion: z.string().optional(),
  cantidad: z.number().int('Debe ser entero').min(0, 'No puede ser negativo'),
  precio_unitario: z.number().positive('Debe ser positivo'),
  categoria: z.string().min(2, 'Selecciona una categoría'),
  stock_minimo: z.number().int('Debe ser entero').min(0, 'No puede ser negativo')
})

/**
 * Schema para proyectos
 */
export const projectSchema = z.object({
  nombre: z.string().min(3, 'Mínimo 3 caracteres'),
  cliente: z.string().min(2, 'Mínimo 2 caracteres'),
  descripcion: z.string().optional(),
  fecha_inicio: z.string()
    .optional()
    .refine((date) => {
      if (!date) return true
      const inputDate = new Date(date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return inputDate <= today
    }, 'No se pueden marcar como terminados proyectos con fecha de inicio futura'),
  fecha_fin: z.string().optional(),
  estado: z.enum(['sin_comenzar', 'activo', 'terminado']),
  presupuesto: z.number().positive('Debe ser positivo').optional()
})

/**
 * Types exportados desde los schemas
 */
export type ContactFormData = z.infer<typeof contactSchema>
export type InvoiceFormData = z.infer<typeof invoiceSchema>
export type ProductFormData = z.infer<typeof productSchema>
export type ProjectFormData = z.infer<typeof projectSchema>
