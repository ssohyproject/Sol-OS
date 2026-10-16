/**
 * SoloOS Progressive Web Service (PWS) Service Worker
 * Version: 2.3.0 (Cache Busting & Network-First for HTML)
 */
const CACHE_NAME = 'soloos-pws-cache-v6';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './hwpx_data.js',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  // Activate immediately without waiting for old worker to exit
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  // Claim all active clients and delete obsolete caches
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => {
          console.log('[PWS SW] Deleting outdated cache:', key);
          return caches.delete(key);
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Network first for all requests to ensure real-time updates
  const url = new URL(event.request.url);
  const isHtml = event.request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname === '/';

  event.respondWith(
    fetch(event.request, isHtml ? { cache: 'reload' } : {})
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET' && !url.protocol.startsWith('chrome-extension')) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Fallback to cache when offline
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (isHtml) return caches.match('./index.html');
          return new Response('Network error occurred and no cache available', { status: 503 });
        });
      })
  );
});
