// AMLI West - Floor Truss Connections - service worker (TEST copy: UPDATE 27 + section 4D L5-7)
// Two caches so an UPDATE never has to download the big images again:
//  1) SHELL (CACHE_VERSION, renamed every UPDATE, ~1 MB): the screens (index.html), manifest, icons, trusses.json.
//     Network-first when there is signal (always the newest screens); cached copy with no signal or a slow network.
//  2) IMAGES (IMG_CACHE, renamed ONLY when an image file changes): the plans and sheets. Cache-first. Images already on the
//     phone are copied from the older caches on upgrade (no download); missing ones are fetched in the background and
//     resume on the next open if the signal drops.
const CACHE_VERSION = 'nf-trtest-app-v27-4d';
const IMG_CACHE = 'nf-trtest-app-img-1';
const CACHE_PREFIX = 'nf-trtest-app-';  // TEST copy: never touches the live app's caches (nf-floortruss-*) on the same origin
const SEC_CACHE = 'nf-trtest-sec';       // truss sections saved on demand (page script manages it)
const SHELL_URLS = [
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
  "trusses/data/trusses.json"
];
const IMG_URLS = [
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
  "trusses/layouts/L567-4C.webp",
  "trusses/layouts/L567-4D.webp"
];
const SHELL_PATHS = new Set(SHELL_URLS.map((u) => new URL(u, self.location).pathname));
const IMG_PATHS = new Set(IMG_URLS.map((u) => new URL(u, self.location).pathname));

async function migrateImages() {
  const img = await caches.open(IMG_CACHE);
  for (const u of IMG_URLS) {
    try {
      if (await img.match(u)) continue;
      const old = await caches.match(u);          // looks in every cache, incl. the previous versioned ones (no network)
      if (old && old.ok) await img.put(u, old.clone());
    } catch (e) {}
  }
}
async function prefetchImages() {
  const img = await caches.open(IMG_CACHE);
  const todo = [];
  for (const u of IMG_URLS) { if (!(await img.match(u))) todo.push(u); }
  let i = 0;
  const worker = async () => {
    while (i < todo.length) {
      const u = todo[i++];
      try { const r = await fetch(u, { cache: 'reload' }); if (r && r.status === 200) await img.put(u, r.clone()); } catch (e) {}
    }
  };
  await Promise.all([worker(), worker(), worker(), worker()]);
}
async function fetchFresh(url, ms) {
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), ms);
  try { return await fetch(url, { cache: 'no-store', signal: ctl.signal }); } finally { clearTimeout(t); }
}
async function shellFirst(req) {
  const cache = await caches.open(CACHE_VERSION);
  const nav = req.mode === 'navigate';
  const key = nav ? './index.html' : req.url;
  try {
    const resp = await fetchFresh(nav ? './index.html' : req.url, 4000);
    if (resp && resp.status === 200) { cache.put(key, resp.clone()); return resp; }
  } catch (e) {}
  return (await cache.match(key, { ignoreSearch: nav })) || (await cache.match('./')) || fetch(req);
}

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_VERSION);
    await Promise.all(SHELL_URLS.map((u) => cache.add(new Request(u, { cache: 'reload' }))));
    try { await migrateImages(); } catch (e) {}
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => Promise.all(
      names.filter((n) => n.startsWith(CACHE_PREFIX) && n !== CACHE_VERSION && n !== IMG_CACHE).map((n) => caches.delete(n))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'prefetch') event.waitUntil(prefetchImages());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (req.mode === 'navigate' || SHELL_PATHS.has(url.pathname)) { event.respondWith(shellFirst(req)); return; }
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((resp) => {
        if (resp && resp.status === 200 && resp.type === 'basic' && url.pathname.indexOf('/trusses/designs/') < 0) {
          const copy = resp.clone();
          caches.open(IMG_PATHS.has(url.pathname) ? IMG_CACHE : CACHE_VERSION).then((c) => c.put(req, copy));
        }
        return resp;
      });
    })
  );
});
