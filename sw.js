const CACHE_NAME = 'el-pollo-loco-v1';

const STATIC_RESOURCES = [
  '/',
  '/index.html',
  '/style.css',
  '/impressum.html',
  '/impressum.css',
  '/js/game.js',
  '/js/audio.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_RESOURCES))
      .then(() => self.skipWaiting())
      .catch(err => console.error('Cache install failed:', err))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(response => {
        if (response.ok && event.request.method === 'GET') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    }).catch(() => caches.match(event.request))
  );
});
