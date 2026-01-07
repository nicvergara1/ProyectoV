'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

interface PushSubscriptionInfo {
  isSubscribed: boolean
  isSupported: boolean
  permission: NotificationPermission
}

export function usePushNotifications() {
  const [subscriptionInfo, setSubscriptionInfo] = useState<PushSubscriptionInfo>({
    isSubscribed: false,
    isSupported: false,
    permission: 'default',
  })
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    checkSubscriptionStatus()
  }, [])

  const checkSubscriptionStatus = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setSubscriptionInfo({
        isSubscribed: false,
        isSupported: false,
        permission: 'default',
      })
      return
    }

    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      
      setSubscriptionInfo({
        isSubscribed: !!subscription,
        isSupported: true,
        permission: Notification.permission,
      })
    } catch (error) {
      console.error('Error checking subscription:', error)
    }
  }

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  const subscribe = async () => {
    if (!subscriptionInfo.isSupported) {
      throw new Error('Push notifications no soportadas en este navegador')
    }

    setIsLoading(true)

    try {
      // Request notification permission
      const permission = await Notification.requestPermission()
      
      if (permission !== 'granted') {
        throw new Error('Permiso de notificaciones denegado')
      }

      // Get service worker registration
      const registration = await navigator.serviceWorker.ready

      // Subscribe to push notifications
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      if (!vapidPublicKey) {
        throw new Error('VAPID public key no configurada')
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      })

      // Get subscription details
      const subscriptionJSON = subscription.toJSON()
      
      // Get user ID
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('Usuario no autenticado')
      }

      // Get device info
      const deviceInfo = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
      }

      // Save subscription to database
      console.log('Guardando suscripción en base de datos...', {
        user_id: user.id,
        endpoint: subscription.endpoint.substring(0, 50) + '...',
      })

      const { data, error } = await supabase
        .from('push_subscriptions')
        .upsert({
          user_id: user.id,
          endpoint: subscription.endpoint,
          p256dh: subscriptionJSON.keys?.p256dh || '',
          auth: subscriptionJSON.keys?.auth || '',
          device_info: deviceInfo,
        }, {
          onConflict: 'user_id,endpoint'
        })
        .select()

      if (error) {
        console.error('Error guardando suscripción:', error)
        throw error
      }

      console.log('Suscripción guardada exitosamente:', data)

      await checkSubscriptionStatus()
      return subscription
    } catch (error) {
      console.error('Error al suscribirse:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const unsubscribe = async () => {
    if (!subscriptionInfo.isSupported) {
      throw new Error('Push notifications no soportadas en este navegador')
    }

    setIsLoading(true)

    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()

      if (subscription) {
        // Unsubscribe from push manager
        await subscription.unsubscribe()

        // Remove from database
        const { error } = await supabase
          .from('push_subscriptions')
          .delete()
          .eq('endpoint', subscription.endpoint)

        if (error) throw error
      }

      await checkSubscriptionStatus()
    } catch (error) {
      console.error('Error al desuscribirse:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    ...subscriptionInfo,
    isLoading,
    subscribe,
    unsubscribe,
    checkSubscriptionStatus,
  }
}
