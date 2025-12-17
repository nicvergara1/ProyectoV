export type InvoiceService = {
  servicio: string
  descripcion?: string
  monto: number
}

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
  servicios?: InvoiceService[] // Array de servicios para facturas de venta
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

export type Drawing = {
  id: number
  created_at: string
  nombre: string
  nombre_original: string
  tamano_bytes: number
  descripcion?: string
  storage_path: string
  storage_url?: string
  urn?: string
  forge_bucket_key?: string
  forge_object_key?: string
  estado: 'uploading' | 'pending' | 'processing' | 'success' | 'failed'
  estado_mensaje?: string
  progreso: number
  uploaded_at?: string
  translation_started_at?: string
  translation_completed_at?: string
  proyecto_id?: number
  user_id: string
}
