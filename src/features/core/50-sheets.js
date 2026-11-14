let lastSheet=null;
/* Агар варақ аз панели идоракунӣ кушода шуда бошад — пӯшидан ба панел бармегардонад (на ба «Ҳисоб») */
function sheetNext(){const was=S.sheet;if(S.hubBack&&S.hubBack===was){S.hubBack=null;return"admhub"}S.hubBack=null;return null}
function closeSheet(){S.nd=null;S.ndl=null;S._rl=0;const sh=document.querySelector(".sheet"),bg=document.querySelector(".sh-bg");
 if(!sh||matchMedia("(prefers-reduced-motion: reduce)").matches){S.sheet=sheetNext();render();return}
 sh.style.transition=`transform .32s ${EASE}`;sh.style.transform="translateY(105%)";if(bg)bg.classList.add("out");{closing=true;const sec=app.firstElementChild;if(sec&&sec.classList.contains("behind")){sec.style.transform="";sec.classList.add("behind-out")}}
 setTimeout(()=>{S.sheet=sheetNext();render()},300)}function setupSheet(){const sh=document.querySelector(".sheet");if(!sh)return;let g=null;
 sh.onpointerdown=e=>{const r=sh.getBoundingClientRect();if(e.clientY-r.top>44&&sh.scrollTop>0)return;if(e.clientY-r.top>44&&e.target.closest("button,input"))return;g={y0:e.clientY,dy:0,vy:0,ly:e.clientY,lt:performance.now()}};
 sh.onpointermove=e=>{if(!g)return;const now=performance.now();g.vy=(e.clientY-g.ly)/Math.max(1,now-g.lt);g.ly=e.clientY;g.lt=now;g.dy=Math.max(0,e.clientY-g.y0);if(g.dy>6){try{sh.setPointerCapture(e.pointerId)}catch(_){}sh.style.transition="none";sh.style.transform=`translateY(${g.dy}px)`;const sec=app.firstElementChild;if(sec&&sec.classList.contains("behind")){const k=Math.min(1,g.dy/sh.offsetHeight);sec.classList.remove("behind-in");sec.style.transition="none";sec.style.transform=`scale(${.92+.08*k})`}}};
 sh.onpointerup=sh.onpointercancel=()=>{if(!g)return;const G0=g;g=null;if(G0.dy<6)return;
  if(G0.dy>110||G0.vy>.5)closeSheet();else{sh.style.transition=`transform .35s ${EASE}`;sh.style.transform="translateY(0)";const sec=app.firstElementChild;if(sec&&sec.classList.contains("behind")){sec.style.transition="";sec.style.transform=""}}}}
const THEMES=[["auto","Худкор"],["light","Рӯшан"],["paper","Коғазӣ"],["dark","Торик"]];
function applyTheme(){const t=S.theme||"paper",r=document.documentElement;if(t==="auto")r.removeAttribute("data-theme");else r.dataset.theme=t;
 const dark=t==="dark"||(t==="auto"&&matchMedia("(prefers-color-scheme: dark)").matches);
 let m=document.querySelector('meta[name="theme-color"]');if(!m){m=document.createElement("meta");m.name="theme-color";document.head.appendChild(m)}
 m.content=dark?"#131211":t==="paper"?"#f7f1e3":"#ffffff"}
const SHEETS={}; // феатурҳо варақҳои худро месабт мекунанд: SHEETS.ном=X=>html
function sheetHTML(){
 if(!S.sheet){lastSheet=null;return ""}
 const X=`<button class="sh-x" data-shclose aria-label="Пӯшидан">${P(IC_X,2)}</button>`;let h="";
 if(SHEETS[S.sheet])h=SHEETS[S.sheet](X);
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 if(!h){S.sheet=null;return ""}
 const still=lastSheet===S.sheet?"still":"";lastSheet=S.sheet;
 return `<div class="sh-bg ${still}" data-shclose></div><div class="sheet ${still} ${S.view==="audio"?"ap-sh":""} ${S.sheet==="rds"?"tall":["pedit","lib","report","admrep","admnews","admmake","admrights","admdel","admhub","admstat","admfeat"].includes(S.sheet)?"tall pe":""}" role="dialog" aria-modal="true">${h}</div>`;
}
function skel(){return `<div class="skel-w">${[38,70,52,88,40,64,0,30,76,48,58].map(w=>w?`<span class="sk" style="width:${w}%"></span>`:`<span style="height:8px"></span>`).join("")}</div>`}
function wheelHTML(){
 const RC=S.recent.filter(id=>bk(id));
 if(!RC.length)return `<div class="wheel one" id="wheel"><div class="wpad t"></div><div class="witem wempty"><span class="round" style="width:60px;height:60px">${P('<path d="M3 5c3-1.5 6-1.5 9 0v14c-3-1.5-6-1.5-9 0zM21 5c-3-1.5-6-1.5-9 0v14c3-1.5 6-1.5 9 0z"/>')}</span><div class="wi"><b>Ҳоло китоб нахондаед</b><span class="a">Хонданро ҳозир оғоз кунед</span><button class="readbtn" data-read="2">${P('<path d="M6 4v16l14-8z" fill="currentColor"/>')}Китобро хонед</button></div></div><div class="wpad b"></div></div>`;
 const one=RC.length===1;
 return `<div class="car ${one?"one":""}" id="wheel">${RC.map(id=>{const b=BOOKS.find(x=>x.id===id);const au=S.mode[id]==="audio";const pr=(au?S.aprog[id]:S.prog[id])||0;return `<div class="witem"><div style="width:60px;flex:none">${cover(b)}</div><div class="wi"><b>${escH(b.t)}</b><span class="a">${escH(b.a)}</span><div class="pbar"><i style="width:${pr}%"></i></div><button class="readbtn" ${au?"data-listen":"data-read"}="${id}">${au?P(I.head,2.2):P('<path d="M6 4v16l14-8z" fill="currentColor"/>')}${au?"Гӯш кардан":"Идома додан"} <small>(${pr}%)</small></button></div></div>`}).join("")}</div>${one?"":`<div class="cdots" aria-hidden="true">${S.recent.map((_,i)=>`<i class="${i?"":"on"}"></i>`).join("")}</div>`}`;
}
function setupWheel(){
 const w=document.getElementById("wheel");if(!w)return;
 const items=[...w.querySelectorAll(".witem")];
 if(w.classList.contains("car")){
  const dots=[...document.querySelectorAll(".cdots i")];
  const upd=()=>{const i=Math.max(0,Math.min(items.length-1,Math.round(w.scrollLeft/(items[0].offsetWidth+10))));dots.forEach((d,j)=>d.classList.toggle("on",j===i));items.forEach((it,j)=>it.classList.toggle("focus",j===i))};
  w.addEventListener("scroll",upd,{passive:true});upd();
  // one-time hint: the row nudges left and back so people see it slides
  if(items.length>1&&!S.carHint2){
   setTimeout(()=>{if(!w.isConnected||w.scrollLeft>5)return;w.classList.add("nudge");
    items[0].addEventListener("animationend",()=>{w.classList.remove("nudge");S.carHint2=true;save()},{once:true})},600)}
  return}
 const ph=Math.max(0,(w.clientHeight-items[0].offsetHeight)/2);
 w.querySelector(".wpad.t").style.height=ph+"px";w.querySelector(".wpad.b").style.height=ph+"px";
 const upd=()=>{const mid=w.scrollTop+w.clientHeight/2;items.forEach(it=>{const c=it.offsetTop+it.offsetHeight/2;const d=Math.abs(c-mid)/it.offsetHeight;it.style.transform=`scale(${1-Math.min(d,2)*.09})`;it.style.opacity=String(1-Math.min(d,2)*.4);it.classList.toggle("focus",d<.55)})};
 w.addEventListener("scroll",upd,{passive:true});upd();
}
function tabs(){return mini()}

/* ---- варақи app ---- */
SHEETS.app=X=>{let h="";{const t=S.theme||"paper";
  h=`<div class="sh-head"><b class="sh-t">Танзимот</b>${X}</div>
  <p class="set-cap">Намуди барнома</p>
  <div class="thg" role="radiogroup" aria-label="Намуди барнома">${THEMES.map(([k,n])=>`<button class="thb ${t===k?"on":""}" data-theme-set="${k}" role="radio" aria-checked="${t===k}"><span class="thp thp-${k}"><i></i><i></i><i></i></span>${n}</button>`).join("")}</div>
  <p class="set-note">${t==="auto"?"Мисли телефон: рӯз рӯшан, шаб торик.":t==="paper"?"Ранги коғази кӯҳна, чашм камтар хаста мешавад.":t==="dark"?"Барои шаб ва батареяро сарфа мекунад.":"Ҳамеша рӯшан."}</p>
  <div class="sh-list">
   <button class="sh-row" data-sheet="report"><span>${P('<path d="M12 9v4M12 17h.01M10.3 3.9L2.4 18a2 2 0 001.7 3h15.800a2 2 0 001.700-3L13.700 3.900a2 2 0 00-3.400 0z"/>')}Хато фиристодан</span><em>›</em></button>
   ${S.uid?`<button class="sh-row" data-rt-vis><span>${P('<path d="M8 4h8v5a4 4 0 01-8 0zM8 6H5a3 3 0 003 4M16 6h3a3 3 0 01-3 4M12 13v4M9 20h6"/>')}Дар рейтинг нишон дода шавам</span><em>${S.myRank&&S.myRank.hidden?"Не":"Ҳа"}</em></button>`:""}
   <button class="sh-row" data-sheet="founders"><span>${P('<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.4"/><path d="M2.5 20c.5-4 2.8-6 5.5-6s5 2 5.5 6M14 15.2c.8-.5 1.7-.7 2.6-.7 2.2 0 3.9 1.6 4.4 5"/>')}Бунёдгузорон</span><em>›</em></button>
   ${S.uid?`<button class="sh-row" data-sheet="delacc"><span>${P('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>')}Ҳисобро нест кардан</span><em>›</em></button>`:""}
   <button class="sh-row" data-privacy><span>${P('<path d="M12 3l8 3v6c0 5-3.500 8-8 9-4.500-1-8-4-8-9V6z"/>')}Сиёсати махфият</span><em>›</em></button>
   <button class="sh-row" data-sheet="lang" style="border:0"><span>${P('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 2.5 15.300 0 18M12 3c-2.5 2.700-2.5 15.300 0 18"/>')}Забон</span><em translate="no">${LANGS.find(x=>x[0]===(S.lang||"tg"))[1]} ›</em></button>
  </div>`};return h};
