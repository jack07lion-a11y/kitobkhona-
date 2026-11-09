/* Китобхона: service worker (PWA). Тарҳ: сохтори статикӣ (шрифт, китобхонаҳо, расмҳо) — аввал кэш; саҳифаи асосӣ — аввал шабака, агар интернет набошад — кэш.
   Ба Supabase ва дигар хостҳо дахл надорад (фақат ҳамон манбаъ). Нусха иваз шавад — V-ро иваз кунед, кэши кӯҳна нест мешавад. */
const V = "kitob-sw-1";
const STATIC = /\/(fonts|lib|avatars|logos|icons)\//;
self.addEventListener("install", e => { self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith("kitob-sw-") && k !== V) await caches.delete(k);
    await self.clients.claim();
  })());
});
self.addEventListener("fetch", e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== location.origin) return;
  if (STATIC.test(u.pathname)) {
    e.respondWith((async () => {
      const c = await caches.open(V), hit = await c.match(r);
      if (hit) return hit;
      const res = await fetch(r);
      if (res.ok) c.put(r, res.clone());
      return res;
    })());
  } else if (r.mode === "navigate" || /\/(index\.html|version\.json)$/.test(u.pathname)) {
    e.respondWith((async () => {
      const c = await caches.open(V);
      try {
        const res = await fetch(r);
        if (res.ok && r.mode === "navigate") c.put("./index.html", res.clone());
        return res;
      } catch (_) {
        return (await c.match(r)) || (await c.match("./index.html")) || Response.error();
      }
    })());
  }
});
