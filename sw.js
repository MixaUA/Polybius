const CACHE_NAME = 'polybius-cipher-cache-v1';
const urlsToCache = [
  './', // Cache the index.html
  './index.html',
  './style.css',
  './script.js',
  './image/Polibius.png',
  'ico/android-chrome-192x192.png',
  'ico/android-chrome-512x512.png',
  'ico/apple-touch-icon.png',
  'ico/favicon-16x16.png',
  'ico/favicon-32x32.png',
  'ico/favicon.ico',
  './site.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});