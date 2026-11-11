// AMLI West - Floor Truss Connections - service worker
// Cache-first offline app shell + all section/detail images, so the app works with
// zero network after the first successful load (iOS and Android alike).
const CACHE_VERSION = 'nf-trtest-app-v19';
const CACHE_PREFIX = 'nf-trtest-app-';  // TEST copy: never touches the live app's caches (nf-floortruss-*) on the same origin
const SEC_CACHE = 'nf-trtest-sec';       // truss sections saved on demand (page script manages it)
const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-512.png",
  "./icon-192.png",
  "./icon-180.png",
  "./icon-167.png",
  "./icon-152.png",
  "./header-mark.png",
  "./header-logo.png",
  "img/fullplan.webp",
  "img/fullplan_index.png",
  "img/how1.webp",
  "img/how2.webp",
  "img/how3.webp",
  "img/how4.webp",
  "img/p009.webp",
  "img/p010.webp",
  "img/p011.webp",
  "img/p012.webp",
  "img/p013.webp",
  "img/p014.webp",
  "img/p015.webp",
  "img/p016.webp",
  "img/p017.webp",
  "img/p018.webp",
  "img/p019.webp",
  "img/p020.webp",
  "img/p021.webp",
  "img/p022.webp",
  "img/p023.webp",
  "img/p024.webp",
  "img/p025.webp",
  "img/p026.webp",
  "img/p027.webp",
  "img/p028.webp",
  "img/p029.webp",
  "img/p030.webp",
  "img/p031.webp",
  "img/p032.webp",
  "img/p033.webp",
  "img/p034.webp",
  "img/p035.webp",
  "img/p036.webp",
  "img/p037.webp",
  "img/p038.webp",
  "img/p039.webp",
  "img/p040.webp",
  "img/p041.webp",
  "img/p042.webp",
  "img/p043.webp",
  "img/p044.webp",
  "img/p045.webp",
  "img/p046.webp",
  "img/p047.webp",
  "img/p048.webp",
  "img/p049.webp",
  "img/p050.webp",
  "img/p051.webp",
  "img/p052.webp",
  "img/p053.webp",
  "img/p054.webp",
  "img/p055.webp",
  "img/p056.webp",
  "img/p057.webp",
  "img/p058.webp",
  "img/p059.webp",
  "img/p060.webp",
  "img/p061.webp",
  "img/p062.webp",
  "img/p063.webp",
  "img/p064.webp",
  "img/p065.webp",
  "img/p066.webp",
  "img/p067.webp",
  "img/p068.webp",
  "img/p069.webp",
  "img/p070.webp",
  "img/p071.webp",
  "img/p072.webp",
  "img/p073.webp",
  "img/p074.webp",
  "img/p075.webp",
  "img/p076.webp",
  "img/p077.webp",
  "img/p078.webp",
  "img/p079.webp",
  "img/p080.webp",
  "img/p081.webp",
  "img/p082.webp",
  "img/p083.webp",
  "img/p084.webp",
  "img/p085.webp",
  "img/p086.webp",
  "img/p087.webp",
  "img/p088.webp",
  "img/p089.webp",
  "img/p090.webp",
  "img/p091.webp",
  "img/p092.webp",
  "img/p093.webp",
  "img/p094.webp",
  "img/p095.webp",
  "img/p096.webp",
  "img/p097.webp",
  "img/p098.webp",
  "img/p099.webp",
  "img/p100.webp",
  "img/p101.webp",
  "img/p102.webp",
  "img/p103.webp",
  "img/p104.webp",
  "img/p105.webp",
  "img/p106.webp",
  "img/p107.webp",
  "img/p108.webp",
  "img/p109.webp",
  "img/p110.webp",
  "img/p111.webp",
  "img/sec1.webp",
  "img/sec2.webp",
  "img/sec3.webp",
  "img/sec4.webp",
  "img/sec5.webp",
  "img/sec6.webp",
  "img/sec7.webp",
  "img/sec8.webp",
  "img/sw4_5AB.webp",
  "img/sw4_4D.webp",
  "img/sw4_4C.webp",
  "img/sw4_4B.webp",
  "img/sw4_4A.webp",
  "img/sw4_3C.webp",
  "img/sw4_3B.webp",
  "img/sw4_3A.webp",
  "img/sw5_5B.webp",
  "img/sw5_5A.webp",
  "img/sw5_4D.webp",
  "img/sw5_4C.webp",
  "img/sw5_4B.webp",
  "img/sw5_4A.webp",
  "img/sw5_3C.webp",
  "img/sw5_3B.webp",
  "img/sw5_3A.webp",
  "img/sw6_5B.webp",
  "img/sw6_5A.webp",
  "img/sw6_4D.webp",
  "img/sw6_4C.webp",
  "img/sw6_4B.webp",
  "img/sw6_4A.webp",
  "img/sw6_3C.webp",
  "img/sw6_3B.webp",
  "img/sw6_3A.webp",
  "trusses/data/trusses.json",
  "trusses/layouts/L4-3A.webp",
  "trusses/layouts/L4-3B.webp",
  "trusses/layouts/L4-3C.webp",
  "trusses/layouts/L4-4A.webp",
  "trusses/layouts/L4-4B.webp",
  "trusses/layouts/L4-4C.webp",
  "trusses/layouts/L4-4D.webp",
  "trusses/layouts/L4-B5.webp",
  "trusses/layouts/L567-3A.webp",
  "trusses/layouts/L567-3B.webp",
  "trusses/layouts/L567-3C.webp",
  "trusses/layouts/L567-4A.webp",
  "trusses/layouts/L567-4B.webp",
  "trusses/layouts/L567-4C.webp"
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => Promise.all(
      names.filter((n) => n.startsWith(CACHE_PREFIX) && n !== CACHE_VERSION).map((n) => caches.delete(n))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.open(CACHE_VERSION).then((own) => own.match(event.request)).then((cached) => cached || caches.open(SEC_CACHE).then((c) => c.match(event.request))).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((resp) => {
        if (resp && resp.status === 200 && resp.type === 'basic' && event.request.url.indexOf('/trusses/designs/') < 0) {
          const copy = resp.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, copy));
        }
        return resp;
      }).catch(() => {
        // Offline and not in cache: for a navigation request, fall back to the app shell.
        if (event.request.mode === 'navigate') return caches.open(CACHE_VERSION).then((own) => own.match('./index.html'));
      });
    })
  );
});
