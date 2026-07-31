/* Simple offline cache for the web (PWA) build.
   Not used inside the Capacitor Android build. */
const CACHE = 'baitussalam-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(()=>{}));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Never cache the Mawaqit request — always go to network for fresh times.
  if (url.hostname.includes('mawaqit.net') || url.hostname.includes('corsproxy.io')) return;
  // App shell: cache-first, fall back to network.
  if (e.request.method === 'GET' && url.origin === location.origin) {
    e.respondWith(
      caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy)).catch(()=>{});
        return res;
      }).catch(() => caches.match('./index.html')))
    );
  }
});
