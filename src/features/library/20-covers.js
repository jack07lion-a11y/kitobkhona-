/* ===== Муқовоҳо: як бор боргирӣ мешаванд ва дар хотираи дастгоҳ (Cache API) нигоҳ дошта мешаванд ===== */
/* Бо роҳи (cover_path) — на бо суроғаи имзошуда, ки ҳар дафъа иваз мешавад. Бе интернет ҳам муқоваҳо мемонанд.
   Ҳар расм якта нигоҳ дошта мешавад (чанд даҳ КБ): китоби нав ҳам худкор илова мешавад, китоби нестшуда — тоза мешавад.
   Нест мешаванд: вақте ки барнома нест карда шавад ё кэши он тоза шавад. */
const CVU={};let CVBUSY=false;
const CV_PFX="https://kitob.local/cover/",CV_MAX=1500000;
const cvOK=()=>typeof caches!=="undefined"&&typeof URL!=="undefined"&&!!URL.createObjectURL;
const cvKey=p=>CV_PFX+encodeURIComponent(p),cvPath=u=>decodeURIComponent(u.slice(CV_PFX.length));
async function cvOpen(){return cvOK()?await caches.open("kitob-covers"):null}
function cvSwap(){document.querySelectorAll("img[data-cp]").forEach(im=>{const u=CVU[im.dataset.cp];if(u&&im.getAttribute("src")!==u&&!im.classList.contains("ld"))im.src=u});
 // агар муқоваи расмдор пештар хато карда, ранги китобро нишон дода бошад — як бор аз нав мекашем
 if(window.__cvErr&&S.view!=="read"&&!S.sheet&&S.view!=="login"){window.__cvErr=0;try{render()}catch(_){}}}
async function cvLoad(){try{const c=await cvOpen();if(!c)return;
 for(const rq of await c.keys()){if(!rq.url.startsWith(CV_PFX))continue;const p=cvPath(rq.url);if(CVU[p])continue;const r=await c.match(rq);if(r)CVU[p]=URL.createObjectURL(await r.blob())}
 cvSwap()}catch(_){}}
async function cvStore(){if(CVBUSY||!cvOK()||!navigator.onLine)return;CVBUSY=true;
 try{const c=await cvOpen();if(!c)return;const want=new Set();
  for(const b of BOOKS){if(!b.cp)continue;want.add(b.cp);if(CVU[b.cp]||!b.cover)continue;
   try{const r=await fetch(b.cover);if(!r.ok)continue;const bl=await r.blob();if(!bl.size||bl.size>CV_MAX||!/^image\//.test(bl.type))continue;
    await c.put(cvKey(b.cp),new Response(bl,{headers:{"content-type":bl.type}}));CVU[b.cp]=URL.createObjectURL(bl)}catch(_){}}
  if(BOOKS.some(b=>b.db)){for(const rq of await c.keys()){if(!rq.url.startsWith(CV_PFX))continue;const p=cvPath(rq.url);
    if(!want.has(p)){await c.delete(rq);if(CVU[p]){try{URL.revokeObjectURL(CVU[p])}catch(_){}delete CVU[p]}}}}
  cvSwap()}catch(_){}finally{CVBUSY=false}}
cvLoad();
