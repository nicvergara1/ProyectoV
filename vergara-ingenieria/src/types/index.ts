export type Invoice = {
  id: string
  created_at: string
  numero_factura: number
  fecha_emision: string
  entidad: string
  rut_entidad?: string
  direccion_entidad?: string
  descripcion?: string
  tipo: 'compra' | 'venta'
  servicio?: string
  monto_neto: number
  iva: number
  monto_total: number
  estado: 'pendiente' | 'pagada' | 'anulada'
  user_id: string
}

export type FinancialSummary = {
  totalIncome: number
  totalExpenses: number
  balance: number
}

export type Product = {
  id: number
  created_at: string
  nombre: string
  descripcion?: string
  cantidad: number
  precio_unitario: number
  categoria: string
  stock_minimo: number
  user_id: string
}

export type ProductMovement = {
  id: number
  created_at: string
  producto_id: number
  tipo: 'entrada' | 'salida'
  cantidad: number
  motivo?: string
  proyecto_id?: number
  user_id: string
}

export type Project = {
  id: number
  created_at: string
  nombre: string
  descripcion?: string
  cliente?: string
  fecha_inicio?: string
  estado: 'activo' | 'terminado' | 'sin_comenzar'
  user_id: string
}

export type Quote = {
  id: number
  fecha_creacion: string
  cliente_nombre: string
  cliente_email?: string
  proyecto_nombre: string
  estado: 'borrador' | 'enviada' | 'aceptada' | 'rechazada'
  monto_total: number
  valido_hasta?: string
  items?: QuoteItem[]
}

export type QuoteItem = {
  id?: number
  cotizacion_id?: number
  descripcion: string
  cantidad: number
  precio_unitario: number
  total: number
}

export type ContactMessage = {
  id: number
  created_at: string
  nombre: string
  email: string
  telefono?: string
  asunto: string
  mensaje: string
  estado: 'nuevo' | 'leido' | 'respondido'
  notas?: string
}
