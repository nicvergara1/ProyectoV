// Service Worker para PWA
const CACHE_NAME = 'vergara-ingenieria-v1'
const urlsToCache = [
  '/',
  '/dashboard',
  '/manifest.json'
]

// Instalar Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  )
})

// Activar Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => self.clients.claim())
  )
})

// Estrategia de caché: Network First, fallback to Cache
self.addEventListener('fetch', (event) => {
  // No cachear peticiones POST, PUT, DELETE (solo GET/HEAD)
  if (event.request.method !== 'GET') {
    event.respondWith(fetch(event.request))
    return
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Si la respuesta es válida, guardar en caché
        if (response && response.status === 200) {
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone)
          })
        }
        return response
      })
      .catch(() => {
        // Si falla la red, intentar desde caché
        return caches.match(event.request)
      })
  )
})

// Manejar notificaciones push
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event)
  
  const data = event.data?.json() ?? {}
  const title = data.title || 'Vergara Ingeniería'
  const options = {
    body: data.body || 'Nueva notificación',
    icon: data.icon || '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [200, 100, 200],
    tag: data.tag || 'notification',
    requireInteraction: data.requireInteraction || false,
    actions: data.actions || [],
    data: {
      url: data.url || '/dashboard'
    }
  }

  event.waitUntil(
    self.registration.showNotification(title, options)
  )
})

// Manejar clics en notificaciones
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event)
  
  event.notification.close()

  const urlToOpen = event.notification.data?.url || '/dashboard'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a window open
      for (const client of clientList) {
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus()
        }
      }
      // If not, open a new window
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen)
      }
    })
  )
})

