// @ts-nocheck
// Supabase Edge Function para enviar Push Notifications
// Este archivo se ejecuta en Deno runtime, no Node.js
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NotificationPayload {
  user_id?: string // If specified, send to specific user, otherwise send to all subscribed users
  title: string
  body: string
  url?: string
  icon?: string
  tag?: string
  requireInteraction?: boolean
  actions?: Array<{ action: string; title: string }>
}

async function sendPushNotification(
  subscription: any,
  payload: NotificationPayload
) {
  const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY')!
  const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY')!
  const vapidSubject = Deno.env.get('VAPID_SUBJECT')!

  console.log('🔑 VAPID keys:', { 
    hasPublic: !!vapidPublicKey, 
    hasPrivate: !!vapidPrivateKey, 
    hasSubject: !!vapidSubject 
  })

  // Import web-push dynamically
  console.log('📦 Importando web-push...')
  const webpush = await import('https://esm.sh/web-push@3.6.7')
  
  console.log('⚙️ Configurando VAPID...')
  webpush.setVapidDetails(
    vapidSubject,
    vapidPublicKey,
    vapidPrivateKey
  )

  const pushSubscription = {
    endpoint: subscription.endpoint,
    keys: {
      p256dh: subscription.p256dh,
      auth: subscription.auth,
    },
  }

  console.log('📤 Enviando notificación a:', subscription.endpoint.substring(0, 50) + '...')

  try {
    await webpush.sendNotification(
      pushSubscription,
      JSON.stringify({
        title: payload.title,
        body: payload.body,
        url: payload.url,
        icon: payload.icon,
        tag: payload.tag,
        requireInteraction: payload.requireInteraction,
        actions: payload.actions,
      })
    )
    console.log('✅ Notificación enviada exitosamente')
    return { success: true }
  } catch (error: any) {
    console.error('❌ Error sending push notification:', error)
    
    // If subscription is invalid (410 Gone), we should remove it
    if (error.statusCode === 410) {
      return { success: false, remove: true, error: error.message }
    }
    
    return { success: false, error: error.message }
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get authorization token
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Verify user token
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      throw new Error('Invalid authorization token')
    }

    // Parse request body
    const payload: NotificationPayload = await req.json()

    // Get subscriptions to send to
    let query = supabase
      .from('push_subscriptions')
      .select('*')

    // If user_id is specified, only send to that user
    if (payload.user_id) {
      query = query.eq('user_id', payload.user_id)
    }

    const { data: subscriptions, error: subError } = await query

    if (subError) {
      throw subError
    }

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No subscriptions found',
          sent: 0 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Send notifications to all subscriptions
    const results = await Promise.allSettled(
      subscriptions.map(sub => sendPushNotification(sub, payload))
    )

    // Remove invalid subscriptions
    const toRemove = []
    for (let i = 0; i < results.length; i++) {
      const result = results[i]
      if (result.status === 'fulfilled' && result.value.remove) {
        toRemove.push(subscriptions[i].id)
      }
    }

    if (toRemove.length > 0) {
      await supabase
        .from('push_subscriptions')
        .delete()
        .in('id', toRemove)
    }

    const successful = results.filter(
      r => r.status === 'fulfilled' && r.value.success
    ).length

    return new Response(
      JSON.stringify({
        success: true,
        sent: successful,
        total: subscriptions.length,
        removed: toRemove.length,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: any) {
    console.error('Error in send-push-notification function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
