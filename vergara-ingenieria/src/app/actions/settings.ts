'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export interface CompanySettings {
  id?: number
  nombre_empresa: string
  rut: string
  direccion: string
  email_contacto: string
  telefono: string
  moneda: string
}

export async function getSettings(): Promise<CompanySettings | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('configuracion')
    .select('*')
    .single()

  if (error) {
    console.warn('Error fetching settings:', error)
    return null
  }

  return data
}

export async function updateSettings(formData: FormData) {
  const supabase = await createClient()
  
  const settings = {
    nombre_empresa: formData.get('nombre_empresa') as string,
    rut: formData.get('rut') as string,
    direccion: formData.get('direccion') as string,
    email_contacto: formData.get('email_contacto') as string,
    telefono: formData.get('telefono') as string,
    moneda: formData.get('moneda') as string,
    updated_at: new Date().toISOString()
  }

  // Check if row exists, if not insert, else update id=1
  const { data: existing } = await supabase.from('configuracion').select('id').single()

  let error
  if (existing) {
    const { error: updateError } = await supabase
      .from('configuracion')
      .update(settings)
      .eq('id', existing.id)
    error = updateError
  } else {
    const { error: insertError } = await supabase
      .from('configuracion')
      .insert(settings)
    error = insertError
  }

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/dashboard/settings')
  return { success: true }
}
