const CACHE_NAME = 'uromed-v3';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png',
  '/manifest.json',
];

const DYNAMIC_CACHE = 'uromed-dynamic-v1';
const FONT_CACHE = 'uromed-fonts-v1';

const SCRIPT_STYLE_REGEX = /\.(js|css)$/;
const STATIC_ASSETS_REGEX = /\.(png|jpg|jpeg|svg|ico|woff2?)$/;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== DYNAMIC_CACHE && name !== FONT_CACHE)
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

const cacheFirst = async (request) => {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return new Response('Offline', { status: 503 });
  }
};

const networkFirst = async (request) => {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    if (request.destination === 'document') {
      const appShell = await caches.match('/index.html');
      if (appShell) {
        return appShell;
      }
    }

    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }

    return new Response('Offline', { status: 503 });
  }
};

const staleWhileRevalidate = async (request) => {
  const cached = await caches.match(request);

  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, networkResponse.clone()));
      }
      return networkResponse;
    })
    .catch(() => cached);

  return cached || fetchPromise;
};

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') {
    return;
  }

  if (url.origin === location.origin) {
    if (request.destination === 'document') {
      event.respondWith(networkFirst(request));
      return;
    }

    if (SCRIPT_STYLE_REGEX.test(url.pathname)) {
      event.respondWith(networkFirst(request));
      return;
    }

    if (STATIC_ASSETS_REGEX.test(url.pathname)) {
      event.respondWith(cacheFirst(request));
      return;
    }

    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  if (url.hostname.endsWith('fonts.googleapis.com') || url.hostname.endsWith('fonts.gstatic.com')) {
    event.respondWith(
      caches.open(FONT_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) {
          return cached;
        }

        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
          cache.put(request, networkResponse.clone());
        }
        return networkResponse;
      })
    );
    return;
  }

  event.respondWith(fetch(request).catch(() => new Response('Offline', { status: 503 })));
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data?.type === 'CACHE_URLS') {
    const { urls } = event.data;
    caches.open(DYNAMIC_CACHE).then((cache) => {
      urls.forEach((url) => {
        fetch(url)
          .then((response) => {
            if (response.ok) {
              cache.put(url, response);
            }
          })
          .catch(() => {});
      });
    });
  }
});

self.addEventListener('push', (event) => {
  if (!event.data) {
    return;
  }

  const data = event.data.json();
  const options = {
    body: data.body || 'Новое уведомление от UroMed',
    icon: '/logo192.png',
    badge: '/logo192.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/',
    },
    actions: data.actions || [],
  };

  event.waitUntil(self.registration.showNotification(data.title || 'UroMed', options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(clients.openWindow(url));
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-favorites') {
    event.waitUntil(syncFavorites());
  }
});

async function syncFavorites() {
  console.log('[SW] Syncing favorites...');
}

self.addEventListener('periodicSync', (event) => {
  if (event.tag === 'update-content') {
    event.waitUntil(updateContent());
  }
});

async function updateContent() {
  console.log('[SW] Checking for content updates...');
  const cache = await caches.open(DYNAMIC_CACHE);
  const requests = await cache.keys();

  for (const request of requests) {
    try {
      const response = await fetch(request);
      if (response.ok) {
        await cache.put(request, response);
      }
    } catch (error) {}
  }
}
