// PWA: манифест, иконкаҳо, service worker (кор мекунад ва офлайн саҳифаро медиҳад)
module.exports=async t=>{
 await t.open({view:'home'});
 const man=await t.page.evaluate(async()=>{const l=document.querySelector('link[rel=manifest]');if(!l)return null;const r=await fetch(l.href);return r.ok?await r.json():null});
 t.ok(man&&man.name==='Китобхона'&&man.display==='standalone'&&man.lang==='tg','manifest: ном, standalone, lang=tg');
 const need=[192,512].map(n=>n+'x'+n);
 t.ok(man&&need.every(s=>man.icons.some(i=>i.sizes===s&&i.purpose==='any'))&&man.icons.some(i=>i.purpose==='maskable'),'manifest: иконкаҳо 192, 512 ва maskable');
 const icons=await t.page.evaluate(async b=>{const out=[];for(const i of ['icons/icon-192.png','icons/icon-512.png','icons/icon-maskable-512.png','icons/apple-touch-icon.png']){const r=await fetch(b+i);out.push(r.ok&&r.headers.get('content-type')==='image/png')}return out},t.base);
 t.ok(icons.every(Boolean),'иконкаҳои PNG мавҷуданд');
 t.ok(await t.page.evaluate(()=>!!document.querySelector('link[rel=apple-touch-icon]')&&document.querySelector('meta[name=apple-mobile-web-app-capable]')?.content==='yes'),'iOS: apple-touch-icon ва standalone meta');
 const sw=await t.page.evaluate(async()=>{try{const r=await navigator.serviceWorker.ready;return !!r.active}catch(_){return false}});
 t.ok(sw,'service worker фаъол шуд');
 // боргирии такрорӣ (то кэш пур шавад), баъд офлайн
 await t.page.reload();await t.page.waitForFunction(()=>navigator.serviceWorker.controller,null,{timeout:8000}).catch(()=>{});
 t.ok(await t.page.evaluate(()=>!!navigator.serviceWorker.controller),'service worker саҳифаро идора мекунад');
 await t.page.reload();await t.page.waitForFunction(()=>window.__splDone,null,{timeout:15000});await t.page.waitForTimeout(500);
 await t.page.context().setOffline(true);
 let off=false;try{await t.page.reload({timeout:15000});await t.page.waitForFunction(()=>window.__splDone,null,{timeout:15000});off=await t.page.evaluate(()=>document.getElementById('app').innerText.length>10)}catch(e){off=false}
 await t.page.context().setOffline(false);
 t.ok(off,'офлайн: саҳифа аз кэши service worker кушода мешавад');
};

// landing.html: 360px-да горизонталӣ кашиш нест, тасвирҳо боргирӣ мешаванд, пайвандҳо ҷойи худро доранд
module.exports=(prev=>async t=>{
 await prev(t);
 const P=t.page;
 await P.setViewportSize({width:360,height:800});
 const res=await P.goto(t.base+'landing.html');t.ok(res.ok(),'landing.html кушода мешавад');
 await P.waitForLoadState('load');
 t.ok(await P.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'landing: дар 360px кашиши уфуқӣ нест');
 const imgs=await P.evaluate(async()=>{const a=[...document.querySelectorAll('.shots img')];a.forEach(i=>i.loading='eager');await Promise.all(a.map(i=>i.complete?1:new Promise(r=>{i.onload=i.onerror=r})));return a.map(i=>i.naturalWidth>0)});
 t.ok(imgs.length===5&&imgs.every(Boolean),'landing: 5 тасвири барнома боргирӣ шуд');
 t.ok(await P.evaluate(()=>['yuklab.html','index.html','maxfiyat.html','#iphone'].every(h=>!!document.querySelector('a[href="'+h+'"]'))),'landing: пайвандҳо (боргирӣ, браузер, махфият, iPhone)');
 t.ok(await P.evaluate(()=>/Ба экрани асосӣ/.test(document.getElementById('iphone').parentElement.innerText)&&/Насби барномаҳои номаълум/.test(document.body.innerText)),'landing: роҳнамои iPhone ва Android (манбаи номаълум)');
 t.ok(await P.evaluate(()=>/Ба зудӣ/.test(document.body.innerText)&&!document.querySelector('#contact a')),'landing: «Ба зудӣ» ҳаст; алоқа холӣ бошад, пайванди холӣ нест');
 for(const p of ['yuklab.html','maxfiyat.html']){const r=await P.goto(t.base+p);t.ok(r.ok(),p+' кушода мешавад')}
 t.ok(await P.evaluate(()=>/КОРАЛАМА/.test(document.body.innerText)&&/Ҳисобро нест кардан/.test(document.body.innerText)),'maxfiyat.html: белгии «КОРАЛАМА» ва нест кардани ҳисоб');
})(module.exports);
