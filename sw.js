
// Push event (including notification customization)
self.addEventListener('push', function (event) {
    const options = {
        body: event.data.text(),
        icon: 'icon.jpg',  // Use the cached icon file
        vibrate: [200, 100, 200, 100, 200, 100, 200],
        sound: 'sound.mp3'  // Use the cached sound file
    };
    event.waitUntil(
        self.registration.showNotification('Location Alert', options)
    );
});


'use strict';

const staticCache = 'v1.0.1';
const dynamicCache = 'dynamic-v1.0.1';

const staticFiles = [
  './',
  'index.html',
  'manifest.json',
  'sw.js',
  'icon.jpg',
  'style.css',
  'sound.mp3'
];

// Install event
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(staticCache).then(cache => {
      return cache.addAll(staticFiles)
        .then(() => console.log('App Version: ' + staticCache))
        .catch(err => console.error('Error adding static files to cache', err));
    })
  );
});

// Activate event
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== staticCache && cache !== dynamicCache) {
            console.info('Deleting Old Cache', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event
self.addEventListener('fetch', e => {
  const req = e.request;

  if (req.method === 'GET' && isStaticFile(req.url)) {
    e.respondWith(cacheFirst(req));
  } else {
    e.respondWith(networkFirst(req));
  }
});

function isStaticFile(url) {
  return staticFiles.some(file => url.endsWith(file));
}

async function cacheFirst(req) {
  const cache = await caches.open(staticCache);
  const cachedResponse = await cache.match(req);
  return cachedResponse || fetch(req);
}

async function networkFirst(req) {
  const cache = await caches.open(dynamicCache);
  try {
    const networkResponse = await fetch(req);
    cache.put(req, networkResponse.clone());
    return networkResponse;
  } catch (err) {
    const cachedResponse = await cache.match(req);
    return cachedResponse || new Response('Offline Page', { status: 503, statusText: 'Service Unavailable' });
  }
}
