const CACHE = 'upscale-studio-v1';
const ASSETS = [
  './',
  './index.html',
  './tf.min.js',
  './upscale-bundle.min.js',
  './upscaler.min.js',
  './models/x2/model.json',
  './models/x2/group1-shard1of1.bin',
  './models/x4/model.json',
  './models/x4/group1-shard1of1.bin',
  './manifest.json',
  './icon.svg',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
