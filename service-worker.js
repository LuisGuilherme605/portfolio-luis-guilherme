/* Service Worker — Portfolio Luis Guilherme */
var CACHE = "lgdev-v4";
var ASSETS = [
  "./",
  "index.html",
  "style.css",
  "script.js",
  "favicon.svg",
  "manifest.json",
  "curriculo-luis-guilherme.pdf",
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys
          .filter(function (k) {
            return k !== CACHE;
          })
          .map(function (k) {
            return caches.delete(k);
          })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function (event) {
  var req = event.request;

  // Apenas GET e mesma origem entram no cache (fontes externas vao pela rede)
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(req).then(function (cached) {
      if (cached) return cached;
      return fetch(req)
        .then(function (res) {
          var copy = res.clone();
          caches.open(CACHE).then(function (cache) {
            cache.put(req, copy);
          });
          return res;
        })
        .catch(function () {
          // Offline: para navegacao, devolve a home em cache
          if (req.mode === "navigate") {
            return caches.match("index.html");
          }
        });
    })
  );
});
