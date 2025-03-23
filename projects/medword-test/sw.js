const CACHE_NAME = 'medword-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/js/tailwind.min.js',
  '/assets/js/alpinejs.min.js',
  '/assets/fonts/Lato-Regular.woff2',
  '/assets/fonts/Lato-Bold.woff2',
  '/assets/images/medword-logo.png',
  '/assets/images/play.png',
  '/assets/images/shop.png',
  '/assets/images/progress.png',
  '/assets/images/settings.png',
  '/assets/images/about.png',
  '/assets/images/coin.png',
  '/assets/images/anesthesia.png',
  '/assets/images/hints.png',
  '/assets/images/time.png',
  '/assets/images/reveal.png',
  '/assets/images/cardiology.png',
  '/assets/images/neurology.png',
  '/assets/images/pharmacology.png',
  '/assets/images/premium.png',
  '/assets/images/villanueva.jpeg',
  '/assets/images/ponayo.jpeg',
  '/assets/images/anonuevo.jpeg',
  '/assets/images/gadil.jpeg',
  '/assets/images/rosales.jpeg',
  '/assets/icons/icon-72x72.png',
  '/assets/icons/icon-96x96.png',
  '/assets/icons/icon-128x128.png',
  '/assets/icons/icon-144x144.png',
  '/assets/icons/icon-152x152.png',
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-384x384.png',
  '/assets/icons/icon-512x512.png',
  'https://assets.mixkit.co/music/preview/mixkit-game-show-puzzle-waiting-682.mp3',
  'https://assets.mixkit.co/sfx/preview/mixkit-unlock-game-notification-253.mp3',
  'https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3',
  'https://assets.mixkit.co/sfx/preview/mixkit-coin-win-notification-1992.mp3',
  'https://assets.mixkit.co/sfx/preview/mixkit-fantasy-game-success-notification-270.mp3'
];

// Install event - cache all initial resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then(response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
      })
  );
});