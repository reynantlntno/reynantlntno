const CACHE_NAME = 'medword-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/js/tailwind.min.js',
  '/assets/js/alpinejs.min.js',
  '/assets/fonts/Lato-Regular.woff2',
  '/assets/fonts/Lato-Bold.woff2',
  
  // App main images
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
  
  // PWA Icons
  '/assets/images/manifest-icon-192.png',
  '/assets/images/manifest-icon-512.png',
  '/assets/images/apple-icon-180.png',
  
  // iOS Splash Screens
  '/assets/images/apple-splash-2048-2732.png',
  '/assets/images/apple-splash-2732-2048.png',
  '/assets/images/apple-splash-1668-2388.png',
  '/assets/images/apple-splash-2388-1668.png',
  '/assets/images/apple-splash-1536-2048.png',
  '/assets/images/apple-splash-2048-1536.png',
  '/assets/images/apple-splash-1668-2224.png',
  '/assets/images/apple-splash-2224-1668.png',
  '/assets/images/apple-splash-1620-2160.png',
  '/assets/images/apple-splash-2160-1620.png',
  '/assets/images/apple-splash-1290-2796.png',
  '/assets/images/apple-splash-2796-1290.png',
  '/assets/images/apple-splash-1179-2556.png',
  '/assets/images/apple-splash-2556-1179.png',
  '/assets/images/apple-splash-1284-2778.png',
  '/assets/images/apple-splash-2778-1284.png',
  '/assets/images/apple-splash-1170-2532.png',
  '/assets/images/apple-splash-2532-1170.png',
  '/assets/images/apple-splash-1125-2436.png',
  '/assets/images/apple-splash-2436-1125.png',
  '/assets/images/apple-splash-1242-2688.png',
  '/assets/images/apple-splash-2688-1242.png',
  '/assets/images/apple-splash-828-1792.png',
  '/assets/images/apple-splash-1792-828.png',
  '/assets/images/apple-splash-1242-2208.png',
  '/assets/images/apple-splash-2208-1242.png',
  '/assets/images/apple-splash-750-1334.png',
  '/assets/images/apple-splash-1334-750.png',
  '/assets/images/apple-splash-640-1136.png',
  '/assets/images/apple-splash-1136-640.png',
  
  // Audio files
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
  // Immediately claim clients so the PWA works offline without page reload
  return self.clients.claim();
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', event => {
  // Skip cross-origin requests, like those for Google Analytics
  if (!event.request.url.startsWith(self.location.origin) && 
      !event.request.url.startsWith('https://assets.mixkit.co/')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone the request because it's a one-time use stream
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest)
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
          })
          .catch(error => {
            // For navigation requests, provide the offline page as fallback
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
            
            console.error('Fetch failed:', error);
            // You can return a default offline image or other assets here
          });
      })
  );
});

// Handle push notifications (if you implement them in the future)
self.addEventListener('push', event => {
  const title = 'MedWord';
  const options = {
    body: event.data ? event.data.text() : 'New content available!',
    icon: '/assets/images/manifest-icon-192.png',
    badge: '/assets/images/apple-icon-180.png'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});