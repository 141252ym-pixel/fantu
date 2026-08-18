// 凡途修仙 Service Worker（缓存静态资源，支持离线 + 秒开）
const CACHE_NAME = 'fantu-v1';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;

  // 页面导航走「网络优先」，确保玩家拿到最新版本号（?v=N 更新时不会卡旧缓存）
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).catch(() => caches.match('./index.html')));
    return;
  }

  // 静态资源「缓存优先」+ 运行时回填
  e.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(resp => {
        if (resp && resp.status === 200 && req.method === 'GET') {
          const copy = resp.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, copy));
        }
        return resp;
      });
    })
  );
});
