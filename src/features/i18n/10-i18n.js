/* ===== Забонҳо: тарҷумаи намуди барнома (китобҳо тағйир намеёбанд) ===== */
const LANGS=[["tg","Тоҷикӣ"],["ru","Русский"],["uz","Oʻzbekcha"],["en","English"]];
const I18N=(()=>{
 const COL={ru:1,uz:2,en:3};
 // ҷадвали тарҷума: i18n/rows.json (дар index.html ҳамчун JSON-и хомӯш; фақат ҳангоми забони ғайри тоҷикӣ хонда мешавад)
 let _rows=null;const ROWS=()=>_rows||(_rows=JSON.parse(document.getElementById("data-i18n-rows").textContent));
 const NOTR='[translate=no],.rds-sn,.rd-flow,.rd-tsheet,.book .t,.book .a,.bd-hero h1,.bd-au,.bd-tt,.bd-desc,.rd-ch,.ap-meta h1,.ap-meta p,.mini-tx,.sh-head>div>b,.sh-head>div>span,.cover,.sh-cv,script,style,textarea,input';
 const esc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
 const pl=(n,a,b,c)=>{n=Math.abs(n)%100;const d=n%10;return n>10&&n<20?c:d>1&&d<5?b:d===1?a:c};
 const U={
  ru:{"китоб":n=>pl(n,"книга","книги","книг"),"боб":n=>pl(n,"глава","главы","глав"),"маҷмӯа":n=>pl(n,"подборка","подборки","подборок"),"саҳифа":n=>pl(n,"страница","страницы","страниц"),"сония":()=>"сек.","дақиқа":()=>"мин.","дақ":()=>"мин.","мб":()=>"МБ"},
  uz:{"китоб":()=>"ta kitob","боб":()=>"ta bob","маҷмӯа":()=>"ta toʻplam","саҳифа":()=>"ta sahifa","сония":()=>"soniya","дақиқа":()=>"daqiqa","дақ":()=>"daq.","мб":()=>"MB"},
  en:{"китоб":n=>n==1?"book":"books","боб":n=>n==1?"chapter":"chapters","маҷмӯа":n=>n==1?"collection":"collections","саҳифа":n=>n==1?"page":"pages","сония":()=>"sec","дақиқа":()=>"min","дақ":()=>"min","мб":()=>"MB"}};
 const RULES=[
  [/^(\d+) бахш · (админ|ёрдамчӣ)$/,(l,m)=>({ru:`${m[1]} разделов · ${m[2]==="админ"?"админ":"помощник"}`,uz:`${m[1]} boʻlim · ${m[2]==="админ"?"admin":"yordamchi"}`,en:`${m[1]} sections · ${m[2]==="админ"?"admin":"helper"}`})[l]],
  [/^Охирин нав кардан: (.+) · (\d+) рӯз пеш( · НАВ КАРДАН ЛОЗИМ)?$/,(l,m)=>({ru:`Последнее обновление: ${m[1]} · ${m[2]} дн. назад${m[3]?" · НУЖНО ОБНОВИТЬ":""}`,uz:`Oxirgi yangilash: ${m[1]} · ${m[2]} kun oldin${m[3]?" · YANGILASH KERAK":""}`,en:`Last updated: ${m[1]} · ${m[2]} days ago${m[3]?" · UPDATE NEEDED":""}`})[l]],
  [/^«([\s\S]+)» дар бораи чист\?$/,(l,m)=>({ru:`О чём «${m[1]}»?`,uz:`«${m[1]}» nima haqida?`,en:`What is “${m[1]}” about?`})[l]],
  [/^Барои идомаи «([\s\S]+)» ба Премиум гузаред\.$/,(l,m)=>({ru:`Чтобы продолжить «${m[1]}», перейдите на Премиум.`,uz:`«${m[1]}» ni davom ettirish uchun Premiumga oʻting.`,en:`To continue “${m[1]}”, go Premium.`})[l]],
  [/^Ин ном банд буд\. Ба шумо «([\s\S]+)» дода шуд$/,(l,m)=>({ru:`Это имя было занято. Вам присвоено «${m[1]}»`,uz:`Bu ism band edi. Sizga «${m[1]}» berildi`,en:`That name was taken. You were given “${m[1]}”`})[l]],
  [/^Таймер: пас аз (\d+) дақиқа қатъ мешавад$/,(l,m)=>({ru:`Таймер: остановка через ${m[1]} мин.`,uz:`Taymer: ${m[1]} daqiqadan keyin toʻxtaydi`,en:`Timer: stops in ${m[1]} min`})[l]],
  [/^Рамзи нав \((\d+) сония\)$/,(l,m)=>({ru:`Новый код (${m[1]} сек.)`,uz:`Yangi kod (${m[1]} soniya)`,en:`New code (${m[1]} sec)`})[l]],
  [/^Боргирӣ… (\d+)%$/,(l,m)=>({ru:`Загрузка… ${m[1]}%`,uz:`Yuklanmoqda… ${m[1]}%`,en:`Downloading… ${m[1]}%`})[l]],
  [/^Рақами (\d+)$/,(l,m)=>({ru:`Цифра ${m[1]}`,uz:`${m[1]}-raqam`,en:`Digit ${m[1]}`})[l]],
  [/^(\d+)-саҳифа$/,(l,m)=>({ru:`Страница ${m[1]}`,uz:`${m[1]}-sahifa`,en:`Page ${m[1]}`})[l]],
  [/^(\d+) китоб ёфт шуд$/,(l,m)=>({ru:`Найдено: ${m[1]} ${U.ru["китоб"](+m[1])}`,uz:`${m[1]} ta kitob topildi`,en:`${m[1]} ${+m[1]==1?"book":"books"} found`})[l]]];
 const NUM=/(\d+(?:[.,]\d+)?)\s*(китоб|боб|маҷмӯа|саҳифа|сония|дақиқа|дақ|мб)(?![\p{L}])/gu;
 const built={},cache={},orig=new WeakMap(),oatt=new WeakMap();
 let lang="tg";
 function build(l){if(built[l])return built[l];const c=COL[l],ex=new Map(),sub=[];
  ROWS().forEach(r=>{const k=r[0].trim(),v=r[c];if(!k||!v)return;ex.set(k,v.trim());if(r[4]!=="x"&&k.length>=3&&/[\p{L}]/u.test(k))sub.push([new RegExp("(?<![\\p{L}\\p{N}])"+esc(k)+"(?![\\p{L}\\p{N}])","gu"),v.trim()])});
  sub.sort((a,b)=>b[0].source.length-a[0].source.length);return built[l]={ex,sub}}
 function tr(s,l=lang){if(l==="tg"||!s)return s;const t=s.trim();if(!t||!/[Ѐ-ӿ]/.test(t))return s;
  const ck=l+"\u0001"+s;if(cache[ck]!==undefined)return cache[ck];
  const B=build(l);let out=B.ex.get(t);
  if(out===undefined){for(const [re,f] of RULES){const m=t.match(re);if(m){out=f(l,m);break}}}
  if(out===undefined){out=t.replace(NUM,(_,n,u)=>n+" "+(U[l][u]?U[l][u](parseFloat(n.replace(",","."))):u));
   /* қисмӣ-иваз танҳо барои матни кӯтоҳ: ҷумлаи дароз ё сатри пурра дорад ё бетағйир мемонад — на омехтаи ду забон */
   if(t.length<=36)B.sub.forEach(([re,v])=>{out=out.replace(re,v)})}
  const lead=s.match(/^\s*/)[0],trail=s.match(/\s*$/)[0];return cache[ck]=lead+out+trail}
 const ATT=["placeholder","title","aria-label","alt"];
 const skip=n=>{const e=n.nodeType===1?n:n.parentElement;return !e||!!e.closest(NOTR)};
 function doText(n){const r=orig.get(n);let o;
  if(r&&n.data===r.t)o=r.o;else o=n.data;
  const t=lang==="tg"?o:tr(o);
  if(skip(n)){if(r){orig.delete(n)}return}
  if(t!==n.data)n.data=t;
  if(t!==o)orig.set(n,{o,t});else orig.delete(n)}
 function doAtt(e){if(e.closest&&e.closest('[translate=no],[data-book]'))return;ATT.forEach(a=>{if(!e.hasAttribute(a))return;let m=oatt.get(e);if(!m)oatt.set(e,m={});const v=e.getAttribute(a);let r=m[a],o;
   if(r&&v===r.t)o=r.o;else o=v;const t=lang==="tg"?o:tr(o);if(t!==v)e.setAttribute(a,t);m[a]={o,t}})}
 let busy=false;
 function walk(root){if(busy)return;busy=true;try{
  if(root.nodeType===3){doText(root);return}
  if(root.nodeType!==1)return;
  const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode())doText(n);
  if(root.matches&&root.matches("[placeholder],[title],[aria-label],[alt]"))doAtt(root);
  root.querySelectorAll("[placeholder],[title],[aria-label],[alt]").forEach(doAtt)
 }finally{busy=false}}
 const mo=new MutationObserver(ms=>{if(busy)return;
  for(const m of ms){if(m.type==="characterData")walk(m.target);else if(m.type==="attributes"){if(!busy)doAtt(m.target)}else m.addedNodes.forEach(walk)}});
 function apply(){document.documentElement.lang=lang==="tg"?"tg":lang;
  walk(document.body);
  const T=document.querySelector("title");if(T){if(!T.__o)T.__o=T.textContent;T.textContent=lang==="tg"?T.__o:tr(T.__o)}}
 function set(l){if(!LANGS.some(x=>x[0]===l))l="tg";lang=l;S.lang=l;apply();save()}
 function start(){lang=LANGS.some(x=>x[0]===S.lang)?S.lang:"tg";apply();
  mo.observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:ATT});
  const c0=window.confirm;window.confirm=m=>c0.call(window,tr(m))}
 return {tr,set,start,get lang(){return lang}}
})();

/* ---- пайвасти тугмаҳо: i18n (аз bind() даъват мешавад) ---- */
function bindI18n($$){
 $$("[data-lang]",b=>b.onclick=()=>{I18N.set(b.dataset.lang);pushNotifyCfg();S.sheet="app";render();toast("Забон иваз шуд")});
}

/* ---- варақи lang ---- */
SHEETS.lang=X=>{let h="";{const cur=S.lang||"tg";
  h=`<div class="sh-head"><b class="sh-t">Забони интерфейс</b>${X}</div>
  <div class="sh-list">${LANGS.map(([k,n],i)=>`<button class="sh-row" data-lang="${k}" role="radio" aria-checked="${cur===k}"${i===LANGS.length-1?' style="border:0"':""}><span translate="no">${n}</span><em>${cur===k?P(IC_OK,2.6).replace('class="ico"','class="ico" style="width:20px;height:20px;color:var(--g,#0b7d57)"'):""}</em></button>`).join("")}</div>
  <p class="set-note">Танҳо намуди барнома иваз мешавад. Китобҳо тағйир намеёбанд.</p>`};return h};
