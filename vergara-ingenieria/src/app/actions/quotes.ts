'use server'

import { createClient } from '@/utils/supabase/server'
import { Quote, QuoteItem } from '@/types'

// Mock data for fallback
const MOCK_QUOTES: Quote[] = [
  {
    id: 1,
    fecha_creacion: new Date().toISOString(),
    cliente_nombre: "Constructora Andes",
    proyecto_nombre: "Instalación Eléctrica Edificio B",
    estado: 'enviada',
    monto_total: 15000000,
    valido_hasta: '2026-01-15',
    items: []
  },
  {
    id: 2,
    fecha_creacion: new Date().toISOString(),
    cliente_nombre: "Inmobiliaria del Sur",
    proyecto_nombre: "Mantenimiento Preventivo",
    estado: 'borrador',
    monto_total: 850000,
    valido_hasta: '2026-01-20',
    items: []
  }
]

export async function getQuotes(): Promise<Quote[]> {
  try {
    // Create a timeout promise that rejects after 5 seconds
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database timeout')), 5000)
    )

    // Race between the database query and the timeout
    const supabase = await createClient()
    const { data, error } = await Promise.race([
      supabase
        .from('cotizaciones')
        .select('*')
        .order('fecha_creacion', { ascending: false }),
      timeoutPromise
    ]) as any

    if (error || !data) {
      console.warn('Supabase fetch failed, using mock data:', error)
      return MOCK_QUOTES
    }

    return data as Quote[]
  } catch (e) {
    console.warn('Supabase connection failed or timed out, using mock data')
    return MOCK_QUOTES
  }
}

export async function createQuote(quote: Omit<Quote, 'id' | 'fecha_creacion' | 'items'>, items: Omit<QuoteItem, 'id' | 'cotizacion_id' | 'total'>[]) {
  try {
    const supabase = await createClient()
    // 1. Insert Quote
    const { data: quoteData, error: quoteError } = await supabase
      .from('cotizaciones')
      .insert(quote)
      .select()
      .single()

    if (quoteError) throw quoteError

    // 2. Insert Items
    if (items.length > 0) {
      const itemsToInsert = items.map(item => ({
        cotizacion_id: quoteData.id,
        descripcion: item.descripcion,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario
      }))

      const { error: itemsError } = await supabase
        .from('items_cotizacion')
        .insert(itemsToInsert)

      if (itemsError) throw itemsError
    }

    return { success: true, id: quoteData.id }
  } catch (e) {
    console.error('Error creating quote:', e)
    return { success: false, error: 'Failed to create quote' }
  }
}

export async function getQuoteById(id: number): Promise<Quote | null> {
  try {
    const supabase = await createClient()
    const { data: quote, error: quoteError } = await supabase
      .from('cotizaciones')
      .select('*')
      .eq('id', id)
      .single()

    if (quoteError || !quote) {
       console.warn('Supabase fetch failed, checking mock data:', quoteError)
       const mock = MOCK_QUOTES.find(q => q.id === Number(id))
       if (mock) return mock
       return null
    }

    const { data: items, error: itemsError } = await supabase
      .from('items_cotizacion')
      .select('*')
      .eq('cotizacion_id', id)

    if (itemsError) {
        console.warn('Error fetching items', itemsError)
        return { ...quote, items: [] }
    }

    return { ...quote, items: items || [] }
  } catch (e) {
    console.warn('Supabase connection failed, using mock data')
    const mock = MOCK_QUOTES.find(q => q.id === Number(id))
    if (mock) return mock
    return null
  }
}
