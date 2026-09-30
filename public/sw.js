// Hilarus PWA Service Worker
const CACHE_NAME = "hilarus-pwa-v1";
const OFFLINE_URLS = [
  "/",
  "/learning",
  "/manifest.webmanifest",
  "/icon-192.png",
  "/icon-512.png",
  "/apple-touch-icon.png",
];

// Install: Cache essential assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(OFFLINE_URLS))
      .then(() => self.skipWaiting())
      .catch((err) => console.debug("SW install cache note:", err))
  );
});

// Activate: Clean up old caches & take control
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

// Fetch: Network first with cache fallback
self.addEventListener("fetch", (event) => {
  // Only handle GET requests and non-API/non-firestore requests
  if (
    event.request.method !== "GET" ||
    event.request.url.includes("/api/") ||
    event.request.url.includes("firestore.googleapis.com") ||
    event.request.url.includes("identitytoolkit.googleapis.com")
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone and cache successful responses
        if (response.status === 200 && response.type === "basic") {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(async () => {
        // Fallback to cache if network fails
        const cached = await caches.match(event.request);
        if (cached) return cached;
        // If navigating to a page, fallback to cached root
        if (event.request.mode === "navigate") {
          return caches.match("/") || caches.match("/learning");
        }
        return new Response("Offline", { status: 503, statusText: "Offline" });
      })
  );
});
