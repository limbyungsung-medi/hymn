// 말씀나눔 찬송가 — 앱 설치와 오프라인 사용을 위한 서비스워커
// 화면(index.html)은 항상 인터넷에서 새로 받고, 안 될 때만 저장본을 씁니다.
const CACHE = 'hymn-app-v1';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // 피아노 소리 등 외부 파일은 앱이 따로 저장함
  e.respondWith((async () => {
    try {
      const res = await fetch(req, { cache: 'no-store' });
      if (res && res.ok) { const c = await caches.open(CACHE); c.put(req, res.clone()); }
      return res;
    } catch (err) {
      const hit = await caches.match(req, { ignoreSearch: true });
      if (hit) return hit;
      if (req.mode === 'navigate') { const idx = await caches.match('./') || await caches.match('index.html'); if (idx) return idx; }
      throw err;
    }
  })());
});
