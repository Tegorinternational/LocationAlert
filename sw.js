// Handle push notifications (existing code)
self.addEventListener('push', function (event) {
    const options = {
        body: event.data.text(),
        icon: 'icon.jpg',
        vibrate: [200, 100, 200, 100, 200, 100, 200],
        sound: 'sound.mp3'
    };
    event.waitUntil(
        self.registration.showNotification('Location Alert', options)
    );
});



// **PWA Enhancements:**

// Cache static assets for offline access
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('LNAS')
            .then((cache) => cache.addAll([
                // List of static resources to cache (e.g., HTML, CSS, JS, images)
                './',
                'index.html',
                'style.css',
                'sw.js',
                'icon.jpg',
                '/manifest.json',
                'sound.mp3'  // Include sound file for offline notifications
            ]))
    );
});

// Intercept and serve cached resources when offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                return response || fetch(event.request);
            })
    );
});

// Update cached assets when a new version is available
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.map((cacheName) => {
                if (cacheName !== 'LNAS') {
                    return caches.delete(cacheName);
                }
            })
        ))
    );
});
