/* ---- Навсозии APK: ойна аз поён, ҳар 5 дақиқа то навсозӣ нашавад; фоиз дар боло; тугмаи «Насб кардан» ----
   Админ ва ёрдамчӣ охирин APK-и сохташударо худкор мебинанд; корбарони оддӣ — танҳо баъди «Нашр кардан». */
const AU={busy:false,ready:false,last:0,every:5*60*1000};
const apkNative=()=>{const A=window.KitobAndroid;return A&&A.downloadUpdate&&A.installUpdate&&!NATIVE.isPlay()?A:null};
function apkNag(force){const A=apkNative();if(!A||!S.upd||AU.busy||AU.ready)return;if(S.view==="login")return;
 if(document.getElementById("aus")||document.getElementById("wus")||(typeof WU!=="undefined"&&WU.busy))return;
 if(!force&&Date.now()-AU.last<AU.every)return;AU.last=Date.now();apkSheet()}
function apkSheet(){if(document.getElementById("aus"))return;const el=document.createElement("div");el.id="aus";el.className="wus";
 el.innerHTML=`<div class="wus-bg"></div><div class="wus-c"><i class="wus-h"></i><div class="wus-i">${P('<path d="M12 3v12M7 10l5 5 5-5M5 20h14"/>',2)}</div><h3>Навсозии барнома тайёр аст</h3><p>Версияи нави барнома омода шуд. Навсозӣ чанд сонияро мегирад. Дар вақти боргирӣ шумо метавонед хондани китобро давом диҳед.</p><button class="pay-btn" id="aus-go">Навсозӣ</button></div>`;
 document.body.appendChild(el);const c=el.querySelector(".wus-c"),bg=el.querySelector(".wus-bg");
 requestAnimationFrame(()=>el.classList.add("in"));
 const close=()=>{el.classList.remove("in");setTimeout(()=>el.remove(),380)};
 bg.onclick=close;document.getElementById("aus-go").onclick=()=>{close();apkStart()};
 let y0=null,dy=0;c.onpointerdown=e=>{if(e.target.closest("button"))return;y0=e.clientY;dy=0;try{c.setPointerCapture(e.pointerId)}catch(_){}c.style.transition="none"};
 c.onpointermove=e=>{if(y0===null)return;dy=Math.max(0,e.clientY-y0);c.style.transform=`translateY(${dy}px)`};
 c.onpointerup=c.onpointercancel=()=>{if(y0===null)return;y0=null;c.style.transition="";if(dy>80)close();else c.style.transform=""}}
/* ХУДКОР: APK паси замина фаро мешавад ва худ насб мешавад (Android 12+: бе савол; пештар/бори аввал: як зарби системавӣ). */
function apkAuto(){const A=apkNative();if(!A||!S.upd||AU.busy||AU.ready||AU.installing||!navigator.onLine||S.view==="login")return;
 const k=S.upd.v,t=(S.apkTry&&S.apkTry.v===k)?S.apkTry:{v:k,n:0,t:0};if(t.n>=3&&Date.now()-t.t<6*3600*1000)return;
 S.apkTry=t;t.n++;t.t=Date.now();save();AU.busy=true;AU.auto=true;try{A.downloadUpdate(S.upd.url)}catch(_){AU.busy=false;AU.auto=false}}
function apkInstallIdle(){const A=apkNative();if(!A||!AU.ready||AU.installing||S.view==="read"||S.sheet||document.visibilityState!=="visible")return;
 let can=true;try{if(A.canInstall)can=!!A.canInstall()}catch(_){}
 if(!can&&S.permAsk&&Date.now()-S.permAsk<24*3600*1000)return;
 AU.installing=true;let r="err";try{r=A.installUpdate()}catch(_){}
 if(r==="perm"){AU.installing=false;S.permAsk=Date.now();save()}
 else if(r==="ok"){setTimeout(()=>{AU.installing=false},90000)}
 else{AU.installing=false;AU.ready=false}}
function apkStart(){const A=apkNative();if(!A||!S.upd)return;AU.busy=true;S.updSt="down";S.updP=0;wuRing(0);try{A.downloadUpdate(S.upd.url)}catch(_){AU.busy=false;wuRingOff();toast("Навсозӣ нашуд")}}
function apkInstallUI(){if(document.getElementById("aur"))return;const el=document.createElement("div");el.id="aur";el.className="wur";
 el.innerHTML=`<button class="pay-btn" id="aur-go">${P('<path d="M12 3v12M7 10l5 5 5-5M5 20h14"/>',2)}Насб кардан</button>`;document.body.appendChild(el);requestAnimationFrame(()=>el.classList.add("in"));
 document.getElementById("aur-go").onclick=()=>{let r="err";try{r=apkNative().installUpdate()}catch(_){}
  if(r==="perm")toast("Иҷозат диҳед («Насби барнома»), баъд боз «Насб кардан»-ро пахш кунед");
  else if(r==="nofile"||r==="err"){toast("Файл ёфт нашуд. Аз нав кӯшиш кунед");el.remove();AU.ready=false;AU.busy=false}}}
// ҷавоби Android: фоизи боргирӣ
window.__upd=(p,st)=>{S.updSt=st;S.updP=p;
 if(AU.auto){if(st==="ready"){AU.busy=false;AU.ready=true;apkInstallIdle()}else if(st==="err"){AU.busy=false;AU.ready=false;AU.auto=false}return}
 if(st==="down"){AU.busy=true;wuRing(p)}
 else if(st==="ready"){AU.busy=false;AU.ready=true;wuRing(100,true);setTimeout(wuRingOff,1800);apkInstallUI()}
 else if(st==="err"){AU.busy=false;AU.ready=false;wuRingOff();toast("Боргирӣ нашуд. Интернетро санҷед");AU.last=0}};
// санҷиши даврӣ: ҳатто дар вақти хондан; ҳангоми баргаштан ба барнома; бо ба поён кашидан
setInterval(()=>{if(document.visibilityState!=="visible")return;try{checkUpdate().then(()=>{apkAuto();apkInstallIdle()})}catch(_){}},60*1000);
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")setTimeout(()=>{try{checkUpdate().then(()=>{apkAuto();apkInstallIdle()})}catch(_){}},900)});