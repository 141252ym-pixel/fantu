// 凡途修仙 Service Worker：联网时始终优先获取最新版，离线时才回退缓存。
// 每次发布递增此版本，activate 会清理所有旧版资源缓存。
const CACHE_NAME = 'fantu-v15';

self.addEventListener('install', () => {});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('fantu-') && key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

async function cacheNetworkResponse(request, response) {
  if (!response || !response.ok || request.method !== 'GET') return response;
  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response.clone());
  return response;
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  // 网络优先：刷新时一定尝试拉取新文件；断网才使用最近一次的缓存。
  event.respondWith((async () => {
    try {
      return await cacheNetworkResponse(request, await fetch(request));
    } catch (_) {
      const cached = await caches.match(request, { ignoreSearch: request.mode === 'navigate' });
      if (cached) return cached;
      if (request.mode === 'navigate') return caches.match('./index.html', { ignoreSearch: true });
      return Response.error();
    }
  })());
});
