// Leo英语小乐园 Service Worker
const CACHE_NAME = 'leo-english-v10';
const ASSETS = [
  './index.html',
  './manifest.json',
  './icon.png',
  './audio/twinkle.mp3',
  './audio/headshoulders.mp3',
  './audio/happy.mp3',
  './audio/oldmacdonald.mp3'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      return cached || fetch(e.request).then(function(response) {
        // 缓存新请求
        if (e.request.method === 'GET' && response.status === 200) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(e.request, clone);
          });
        }
        return response;
      }).catch(function() {
        return cached;
      });
    })
  );
});
