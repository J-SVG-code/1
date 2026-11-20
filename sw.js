/*
 * Gestor Pro - Service Worker
 * Autor: Joelvy José Salazar Vargas (C.I. 30.022.434)
 * Copyright: © 2026 Gestor Pro. Todos los derechos reservados. Joelvy José Salazar Vargas (C.I. 30.022.434)
 */

const CACHE_NAME = 'gestor-pro-cache-v2026.11.19-v3';
const STATIC_ASSETS = [
  './',
  './index.html',
  './catalogo.html',
  './manifest.json',
  './sw.js',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png',
  './shortcut-venta.png',
  './shortcut-catalogo.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        STATIC_ASSETS.map((url) => cache.add(url))
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

function isBypassedRequest(urlObj) {
  const host = urlObj.hostname || '';
  if (
    host.includes('firestore.googleapis.com') ||
    host.includes('firebaseio.com') ||
    host.includes('googleapis.com') ||
    host.includes('gstatic.com') ||
    host.includes('googlesyndication.com') ||
    host.includes('admob.com') ||
    host.includes('doubleclick.net') ||
    host.includes('google-analytics.com')
  ) {
    return true;
  }
  return false;
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') {
    return;
  }

  const urlObj = new URL(request.url);
  if (urlObj.origin !== self.location.origin || isBypassedRequest(urlObj)) {
    return;
  }

  // Network-first for HTML documents (including ?neg=... or ?tab=... query params)
  if (request.mode === 'navigate' || urlObj.pathname.endsWith('.html') || urlObj.pathname.endsWith('/')) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            const cacheKey = new Request(urlObj.pathname === '/' ? './index.html' : urlObj.pathname);
            caches.open(CACHE_NAME).then((cache) => cache.put(cacheKey, responseClone)).catch(() => {});
          }
          return networkResponse;
        })
        .catch(async () => {
          const cache = await caches.open(CACHE_NAME);
          const exactMatch = await cache.match(request);
          if (exactMatch) return exactMatch;
          const pathMatch = await cache.match(urlObj.pathname);
          if (pathMatch) return pathMatch;
          if (urlObj.pathname.includes('catalogo')) {
            return (await cache.match('./catalogo.html')) || (await cache.match('./index.html'));
          }
          return cache.match('./index.html');
        })
    );
    return;
  }

  // Stale-while-revalidate for static assets (manifest, sw, icons)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone)).catch(() => {});
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
