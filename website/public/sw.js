const CACHE_NAME = "kramaniti-app-shell-v1";
const BASE_PATH = "/kramaniti";
const APP_SHELL = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/manifest.webmanifest`,
  `${BASE_PATH}/assets/pwa/icon-192.png`,
  `${BASE_PATH}/assets/pwa/icon-512.png`,
  `${BASE_PATH}/assets/pwa/icon-maskable-512.png`,
  `${BASE_PATH}/assets/pwa/apple-touch-icon.png`
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  if (event.request.method !== "GET" || requestUrl.origin !== self.location.origin) {
    return;
  }

  if (requestUrl.pathname.startsWith(`${BASE_PATH}/_next/static/`)) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(event.request);
        if (cached) return cached;

        const response = await fetch(event.request);
        cache.put(event.request, response.clone());
        return response;
      })
    );
    return;
  }

  if (requestUrl.pathname.startsWith(`${BASE_PATH}/`)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          return response;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match(`${BASE_PATH}/`)))
    );
  }
});
