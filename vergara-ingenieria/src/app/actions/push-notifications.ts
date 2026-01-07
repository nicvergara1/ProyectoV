'use server'

import { createClient } from '@/utils/supabase/server'

interface SendNotificationParams {
  userId?: string
  title: string
  body: string
  url?: string
  icon?: string
  tag?: string
  requireInteraction?: boolean
}

export async function sendPushNotification(params: SendNotificationParams) {
  try {
    const supabase = await createClient()
    
    // Get current user's session
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    
    if (authError || !session) {
      return { error: 'No autenticado' }
    }

    // Call Edge Function
    const functionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-push-notification`

    console.log('Calling Edge Function:', functionUrl)

    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: params.userId,
        title: params.title,
        body: params.body,
        url: params.url || '/dashboard',
        icon: params.icon || '/favicon.ico',
        tag: params.tag,
        requireInteraction: params.requireInteraction || false,
      }),
    })

    console.log('Response status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Edge Function error:', errorText)
      
      let errorMessage = 'Error al enviar notificación'
      try {
        const errorData = JSON.parse(errorText)
        errorMessage = errorData.error || errorMessage
      } catch {
        errorMessage = errorText || errorMessage
      }
      
      // Si es 404, la función no está desplegada
      if (response.status === 404) {
        errorMessage = 'Edge Function no encontrada. Debes desplegarla primero con: supabase functions deploy send-push-notification'
      }
      
      return { error: errorMessage }
    }

    const result = await response.json()
    return { success: true, data: result }
  } catch (error: any) {
    console.error('Error sending push notification:', error)
    return { error: error.message || 'Error al enviar notificación' }
  }
}
