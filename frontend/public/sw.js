const CACHE_NAME = 'stock-manager-v1'
const urlsToCache = [
  '/',
  '/index.html',
  '/src/main.jsx',
  '/manifest.json'
]

// Installation du service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache).catch(() => {
        // Si la mise en cache échoue, continuer quand même
        return Promise.resolve()
      })
    })
  )
  self.skipWaiting()
})

// Activation du service worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      )
    })
  )
  self.clients.claim()
})

// Fetch avec stratégie de cache
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  // Ne pas mettre en cache les appels API
  if (url.pathname.startsWith('/api')) {
    return event.respondWith(
      fetch(request)
        .then(response => response)
        .catch(() => {
          // Si pas de connexion, retourner une réponse offline
          return new Response(
            JSON.stringify({ error: 'Mode offline' }),
            { status: 503, headers: { 'Content-Type': 'application/json' } }
          )
        })
    )
  }

  // Stratégie cache-first pour les autres ressources
  event.respondWith(
    caches.match(request).then(response => {
      return response || fetch(request).then(response => {
        if (!response || response.status !== 200 || response.type === 'error') {
          return response
        }

        const responseToCache = response.clone()
        caches.open(CACHE_NAME).then(cache => {
          cache.put(request, responseToCache)
        })
        return response
      })
    })
  )
})
