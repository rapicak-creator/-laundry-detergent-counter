const CACHE_NAME = 'detergent-counter-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/image/favicon.svg',
  '/image/icon-192.png',
  '/image/icon-512.png'
];

// インストール：キャッシュに静的リソースを保存
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// フェッチ：ネットワーク優先、失敗時はキャッシュ
self.addEventListener('fetch', event => {
  // Supabase のAPIリクエストはキャッシュしない
  if (event.request.url.includes('supabase.co')) {
    event.respondWith(
      fetch(event.request)
    );
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request).then(response => {
        return response || caches.match('/index.html');
      });
    })
  );
});