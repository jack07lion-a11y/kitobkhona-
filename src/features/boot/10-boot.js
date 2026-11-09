afterSplash(()=>{sbLoad().then(()=>syncServer());markHave()});
applyTheme();matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change",applyTheme);
render();
I18N.start();
/* ---- Сплэш: бори аввал рендер, баъд ҳаракат; корҳои вазнин баъди сплэш ---- */
(function(){const el=document.getElementById("spl");if(!el)return;let ended=false;
 function finish(){if(ended)return;ended=true;try{el.remove()}catch(_){}try{window.KitobAndroid&&KitobAndroid.splashDone&&KitobAndroid.splashDone()}catch(_){}
  window.__splDone=true;setTimeout(()=>{while(window.__after.length){try{window.__after.shift()()}catch(_){}}},60)}
 function start(){if(ended)return;const fly=el.querySelector(".sx-fly"),fr=fly.getBoundingClientRect(),
   tg=document.querySelector(".brand svg")||document.querySelector(".login .lg svg"),tr=tg?tg.getBoundingClientRect():null;
  if(tr&&tr.width>4&&tr.top>=0&&tr.bottom<=innerHeight){el.style.setProperty("--dx",(tr.left+tr.width/2-(fr.left+fr.width/2))+"px");el.style.setProperty("--dy",(tr.top+tr.height/2-(fr.top+fr.height/2))+"px");el.style.setProperty("--ds",String(tr.width/fr.width))}
  else{el.style.setProperty("--dx","0px");el.style.setProperty("--dy","0px");el.style.setProperty("--ds",".86")}
  el.classList.add("go");
  // секин телефон: агар кадрҳо бурида шаванд, ҳаракатро кӯтоҳ мекунем
  let last=performance.now(),slow=0,t0=last;(function m(now){const d=now-last;last=now;if(d>70)slow++;if(slow>=3&&!el.classList.contains("lite")){el.classList.add("lite")}if(now-t0<1300&&!ended)requestAnimationFrame(m)})(last);
  el.addEventListener("animationend",e=>{if(e.target===el&&e.animationName==="sxOut")finish()});setTimeout(finish,3600)}
 requestAnimationFrame(()=>requestAnimationFrame(start))})();

afterSplash(()=>{pushNotifyCfg();setTimeout(()=>{const A=window.KitobAndroid;if(A&&A.askNotify&&S.view!=="login"&&!S.askedN){S.askedN=1;save();try{A.askNotify()}catch(_){}}},2500)});
if(/[?&]doira\b/.test(location.search)&&S.role==="admin")cxEditOn();
(function(){
 const el=document.createElement("div");el.className="ptr";el.innerHTML='<div class="ptr-c"><div class="ptr-r"><svg viewBox="0 0 40 40"><circle class="ptr-bg" cx="20" cy="20" r="15"/><circle class="ptr-ar" cx="20" cy="20" r="15" pathLength="100"/></svg></div></div><div class="ptr-m"></div>';document.body.appendChild(el);
 const circ=el.querySelector(".ptr-c"),svg=el.querySelector("svg"),arc=el.querySelector(".ptr-ar"),msg=el.querySelector(".ptr-m");
 const pr=document.createElement("div");pr.style.cssText="position:fixed;left:0;top:0;padding-top:env(safe-area-inset-top,0px);visibility:hidden";document.body.appendChild(pr);
 const SAFE=()=>pr.offsetHeight||0,HOLD=()=>SAFE()+76,MAX=150;
 let g=null,busy=false;
 const tg=()=>app.firstElementChild;
 const setY=(y,anim)=>{const t=tg();if(!t)return;t.style.transition=anim?"transform .38s cubic-bezier(.32,.72,0,1)":"none";t.style.transform=y?`translate3d(0,${y}px,0)`:""};
 const ind=d=>{const p=Math.min(1,d/HOLD());circ.style.transition="none";circ.style.opacity=Math.min(1,p*1.6);circ.style.transform=`translateY(${-46*(1-p)}px) scale(${.55+.45*p})`;
  arc.style.transition="none";arc.style.strokeDasharray="100";arc.style.strokeDashoffset=String(100-p*72);svg.style.transition="none";svg.style.transform=`rotate(${-90+d*2.4}deg)`};
 const can=e=>{if(busy||S.sheet||["read","audio","login"].includes(S.view))return false;if(window.scrollY>1||document.documentElement.scrollTop>1)return false;if(e.touches.length!==1)return false;return !e.target.closest("input,textarea,select,.crp,#wheel,.car,.sheet,.rd,.cx-b")};
 addEventListener("touchstart",e=>{g=can(e)?{x:e.touches[0].clientX,y:e.touches[0].clientY,on:false,d:0}:null},{passive:true});
 addEventListener("touchmove",e=>{if(!g)return;const dy=e.touches[0].clientY-g.y,dx=e.touches[0].clientX-g.x;
  if(!g.on){if(dy>10&&Math.abs(dx)<dy*.7&&window.scrollY<=1){g.on=true;g.y0=dy}else if(Math.abs(dx)>12||dy<-6){g=null;return}else return}
  if(e.cancelable)e.preventDefault();const raw=Math.max(0,dy-g.y0),H=HOLD();g.d=raw<H?raw*.9:H*.9+(raw-H)*.3;g.d=Math.min(MAX,g.d);setY(g.d,false);ind(g.d)},{passive:false});
 const wait=ms=>new Promise(r=>setTimeout(r,ms));
 const end=async()=>{if(!g)return;const G=g;g=null;if(!G.on)return;const H=HOLD();
  if(G.d<H*.85){setY(0,true);circ.style.transition="opacity .25s,transform .3s";circ.style.opacity=0;circ.style.transform="translateY(-46px) scale(.55)";return}
  busy=true;const t0=Date.now();
  setY(H,true);circ.style.transition="transform .35s cubic-bezier(.32,.72,0,1),opacity .2s";circ.style.opacity=1;circ.style.transform="translateY(0) scale(1)";
  arc.style.transition="stroke-dasharray .3s,stroke-dashoffset .3s";arc.style.strokeDasharray="30 100";arc.style.strokeDashoffset="0";svg.style.transition="transform .3s";svg.style.transform="rotate(-90deg)";
  el.classList.add("spin");try{if(navigator.vibrate)navigator.vibrate(8)}catch(_){}
  let lines;try{lines=await Promise.race([doRefresh(),wait(12000).then(()=>["Ҷавоб наомад. Баъдтар аз нав кӯшиш кунед"])])}catch(_){lines=["Навсозӣ нашуд"]}
  const el2=Date.now()-t0;if(el2<1100)await wait(1100-el2);
  setY(H,true);
  circ.style.transition="opacity .25s,transform .3s";circ.style.opacity=0;circ.style.transform="translateY(0) scale(.6)";
  await wait(220);el.classList.remove("spin");msg.textContent=lines.join(" · ");msg.style.opacity=1;
  await wait(lines.length>1||lines[0].length>26?2400:1500);
  msg.style.opacity=0;setY(0,true);await wait(420);const t=tg();if(t)t.style.transition="";busy=false};
 addEventListener("touchend",end,{passive:true});addEventListener("touchcancel",end,{passive:true});
})();
try{if(sessionStorage.getItem("kitob_upd")){sessionStorage.removeItem("kitob_upd");afterSplash(()=>toast("Интерфейс нав шуд"))}}catch(_){}
afterSplash(()=>{checkShell(true);try{const A=window.KitobAndroid;if(A&&A.takeCrash){const cr=A.takeCrash();if(cr)logErr("native",cr.split("\n")[0],cr)}}catch(_){}flushErrs();flushReports();sendRead();trackActive();tryRef();checkMin();bkCheck();webUpdCheck();setTimeout(()=>{try{checkUpdate().then(()=>apkNag(true))}catch(_){}},1500)});
afterSplash(checkUpdate);/* PWA (iPhone/Safari «Ба экрани асосӣ» ва офлайн): service worker фақат дар браузер, на дар APK */
try{if("serviceWorker" in navigator&&!window.KitobAndroid&&(location.protocol==="https:"||location.hostname==="localhost"))addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}))}catch(_){}
