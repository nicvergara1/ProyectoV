'use server'

import { createClient } from '@/utils/supabase/server'
import { ContactMessage } from '@/types'

export async function getContactMessages() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('mensajes_contacto')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching contact messages:', error)
    return { messages: [], error: error.message }
  }

  return { messages: data as ContactMessage[], error: null }
}

export async function updateMessageStatus(id: number, estado: 'nuevo' | 'leido' | 'respondido', notas?: string) {
  const supabase = await createClient()
  
  const updateData: any = { estado }
  if (notas !== undefined) {
    updateData.notas = notas
  }

  const { error } = await supabase
    .from('mensajes_contacto')
    .update(updateData)
    .eq('id', id)

  if (error) {
    console.error('Error updating message status:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function deleteContactMessage(id: number) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('mensajes_contacto')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting message:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}
