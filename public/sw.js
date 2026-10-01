const CACHE = "vital40-v5";
const FILES = ["./", "index.html", "style.css", "i18n.js", "content-en.js", "content-fr.js", "content-ar.js", "foods.js", "core.js", "food-views.js", "habits.js", "more-views.js", "voice.js", "plan.js", "advice.js", "scan.js", "manifest.webmanifest", "icon.svg"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET" || new URL(e.request.url).pathname.includes("/api/")) return;
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
