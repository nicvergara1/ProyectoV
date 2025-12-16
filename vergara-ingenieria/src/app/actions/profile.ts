'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getUserProfile() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }

  return {
    email: user.email,
    display_name: user.user_metadata?.display_name || '',
    created_at: user.created_at
  }
}

export async function updateUserProfile(formData: FormData) {
  const supabase = await createClient()
  
  const displayName = formData.get('display_name') as string

  if (!displayName || displayName.trim().length === 0) {
    return { success: false, error: 'El nombre no puede estar vacío' }
  }

  const { error } = await supabase.auth.updateUser({
    data: { 
      display_name: displayName.trim()
    }
  })

  if (error) {
    console.error('Error updating profile:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/dashboard/settings')
  return { success: true }
}
