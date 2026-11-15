// Offline shell. The HTML, CSS and modules go network-first (cache: "reload", so a
// redeploy is seen at once, never half of one); fonts, the lockup, the icons and the
// photographs are cache-first and precached. The film streams and is left to the
// browser. build.py writes VERSION and both lists.
const VERSION = "enso-6997b937b0";
const SHELL = [
  /* shell:start */
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./css/app.css",
  "./js/app.js",
  "./js/crmdata.js",
  "./js/data.js",
  "./js/fa.js",
  "./js/i18n.js",
  "./js/install.js",
  "./js/island.js",
  "./js/store.js",
  "./js/ui.js",
  "./js/views/bag.js",
  "./js/views/crm.js",
  "./js/views/gather.js",
  "./js/views/home.js",
  "./js/views/menu.js",
  "./js/views/profile.js",
  /* shell:end */
];
const ASSETS = [
  /* assets:start */
  "./assets/brand/alpha-black.png",
  "./assets/brand/alpha-white.png",
  "./assets/brand/enso-mark.svg",
  "./assets/brand/enso-word.svg",
  "./assets/fonts/manrope.woff2",
  "./assets/fonts/vazirmatn.woff2",
  "./assets/icons/apple-touch-icon.png",
  "./assets/icons/favicon-32.png",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/maskable-512.png",
  "./assets/photos/bag-sm.webp",
  "./assets/photos/box-sm.webp",
  "./assets/photos/bread-sm.webp",
  "./assets/photos/coldbrew-sm.webp",
  "./assets/photos/comfort-sm.webp",
  "./assets/photos/cups-sm.webp",
  "./assets/photos/egg-sm.webp",
  "./assets/photos/layers-sm.webp",
  "./assets/photos/lotus-sm.webp",
  "./assets/photos/nutella-sm.webp",
  "./assets/photos/parsley-sm.webp",
  "./assets/photos/pistachio-sm.webp",
  "./assets/photos/pour-sm.webp",
  "./assets/photos/rack-sm.webp",
  "./assets/photos/room-sm.webp",
  "./assets/photos/trio-sm.webp",
  "./assets/photos/twist-sm.webp",
  "./assets/video/poster.webp",
  /* assets:end */
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll([...SHELL, ...ASSETS].map((u) => new Request(u, { cache: "reload" })))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin || url.pathname.endsWith(".mp4")) return;
  const isAsset = /\/assets\//.test(url.pathname);
  if (isAsset) {
    e.respondWith(caches.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
      return res;
    })));
    return;
  }
  e.respondWith(fetch(new Request(req, { cache: "reload" })).then((res) => {
    if (res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
    return res;
  }).catch(() => caches.match(req, { ignoreSearch: true }).then((hit) => hit || caches.match("./index.html"))));
});
