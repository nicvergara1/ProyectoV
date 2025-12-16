'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { Invoice, FinancialSummary } from '@/types'

export async function getInvoices() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('facturas')
    .select('*')
    .order('fecha_emision', { ascending: false })

  if (error) {
    console.error('Error fetching invoices:', error)
    return { invoices: [], error: error.message }
  }

  return { invoices: data as Invoice[] }
}

export async function getInvoiceById(id: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('facturas')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching invoice:', error)
    return null
  }

  return data as Invoice
}

export async function createInvoice(formData: FormData) {
  const supabase = await createClient()
  
  const rawData = {
    tipo: formData.get('tipo'),
    numero_factura: Number(formData.get('numero_factura')),
    fecha_emision: formData.get('fecha_emision'),
    entidad: formData.get('entidad'),
    rut_entidad: formData.get('rut_entidad'),
    direccion_entidad: formData.get('direccion_entidad'),
    descripcion: formData.get('descripcion'),
    servicio: formData.get('servicio'),
    monto_neto: Number(formData.get('monto_neto')),
    iva: Number(formData.get('iva')),
    monto_total: Number(formData.get('monto_total')),
    estado: formData.get('estado')
  }

  const { error } = await supabase
    .from('facturas')
    .insert(rawData)

  if (error) {
    console.error('Error creating invoice:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/dashboard/invoices')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function getFinancialSummary(): Promise<FinancialSummary> {
  const { invoices } = await getInvoices()
  
  const totalIncome = (invoices || [])
    .filter(i => i.tipo === 'venta' && i.estado !== 'anulada')
    .reduce((acc, curr) => acc + curr.monto_total, 0)
    
  const totalExpenses = (invoices || [])
    .filter(i => i.tipo === 'compra' && i.estado !== 'anulada')
    .reduce((acc, curr) => acc + curr.monto_total, 0)

  return {
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses
  }
}
