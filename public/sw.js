// Service Worker — Padaria Nova Paokent PWA
// Handles: offline caching, push notifications, background sync

const CACHE_NAME = 'paokent-v1'
const OFFLINE_URL = '/offline'

// Assets para cache inicial
const PRECACHE_ASSETS = [
  '/',
  '/cardapio',
  '/offline',
  '/manifest.json',
]

// Instalação: pre-cache dos assets essenciais
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS)
    })
  )
  self.skipWaiting()
})

// Ativação: limpar caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    })
  )
  self.clients.claim()
})

// Fetch: estratégia Network First para API, Cache First para assets
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Ignorar requests para Supabase e APIs externas
  if (
    url.hostname.includes('supabase.co') ||
    url.hostname.includes('openai.com') ||
    url.pathname.startsWith('/api/')
  ) {
    return
  }

  // Cache First para assets estáticos
  if (
    request.destination === 'image' ||
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'font'
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        return cached || fetch(request).then((response) => {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
          return response
        })
      })
    )
    return
  }

  // Network First para páginas HTML
  event.respondWith(
    fetch(request)
      .then((response) => {
        const clone = response.clone()
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
        return response
      })
      .catch(() => {
        return caches.match(request).then((cached) => {
          return cached || caches.match(OFFLINE_URL)
        })
      })
  )
})

// Push Notifications
self.addEventListener('push', (event) => {
  if (!event.data) return

  const data = event.data.json()
  const { title, body, icon, badge, url, tag } = data

  const options = {
    body: body || '',
    icon: icon || '/icons/icon-192x192.png',
    badge: badge || '/icons/icon-72x72.png',
    tag: tag || 'paokent-notification',
    renotify: true,
    requireInteraction: false,
    vibrate: [200, 100, 200],
    data: { url: url || '/admin/dashboard' },
    actions: [
      { action: 'open', title: 'Ver painel' },
      { action: 'dismiss', title: 'Dispensar' }
    ]
  }

  event.waitUntil(
    self.registration.showNotification(title || 'Nova Paokent', options)
  )
})

// Clique em notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'dismiss') return

  const url = event.notification.data?.url || '/admin/dashboard'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Focar janela existente se disponível
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus()
        }
      }
      // Abrir nova janela
      if (clients.openWindow) {
        return clients.openWindow(url)
      }
    })
  )
})
