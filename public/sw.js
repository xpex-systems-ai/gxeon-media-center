/* Surra de Pagode App — cache seguro de recursos estáticos */
const CACHE = "surra-assets-v1";
const OFFLINE = "/offline.html";
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll([OFFLINE, "/surra-logo.svg", "/manifest.webmanifest"])));
  self.skipWaiting();
});
self.addEventListener("activate", event => {
  event.waitUntil(Promise.all([self.clients.claim(), caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))]));
});
self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith("/_server") || url.pathname.startsWith("/api")) return;
  if (req.mode === "navigate") {
    event.respondWith(fetch(req).catch(() => caches.match(OFFLINE)));
    return;
  }
  if (!["image","style","font","script"].includes(req.destination)) return;
  event.respondWith(caches.match(req).then(cached => cached || fetch(req).then(res => {
    if (res.ok && res.type === "basic") {
      const copy = res.clone();
      caches.open(CACHE).then(cache => cache.put(req, copy));
    }
    return res;
  })));
});