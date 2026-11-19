/* ===== Хонанда: (1) кашидани ду ангушт — андозаи ҳарф; (2) хониши худкор (танҳо ҳолати вертикалӣ); (3) зарб — ҳамаи тугмаҳо пайдо мешаванд, баъди 15 сония худ пинҳон ===== */
const UI_HIDE_MS=15000,FS_STEPS=[13,16,19,22,25,28]; // FS_STEPS — ҳамон қадамҳои слайдери «Андозаи ҳарф»
let UIT=0;
const AS={on:false,panel:false,hold:0,loop:0,acc:0,t:0,idle:0,v:null};
if(!(S.asv>0))S.asv=1;
/* ---- (3) панели UI: баъди 15 сония худ пинҳон мешавад ---- */
function uiKeep(){clearTimeout(UIT);if(!S.rdUI||S.view!=="read")return;
 UIT=setTimeout(()=>{
  const sc=document.getElementById("rdscr");
  if(S.view!=="read"||!S.rdUI)return;
  if(S.sheet||AS.panel||(sc&&sc.dataset.drag)||document.querySelector(".rd-gc.on")){uiKeep();return} // ҳоло корбар бо чизе машғул аст
  S.rdUI=false;const r=document.querySelector(".rd");if(r){r.classList.remove("ui");r.classList.add("dock")}},UI_HIDE_MS)}
/* тугмаҳои канор («гардонка» ва «хониши худкор»): баъди 2 сония ба канори рост «медароянд» (ялпоқ, матнро намепӯшонанд); ламс — бо бонс бармеоянд */
const DOCK_MS=2000;let DKT=0;
function dockSet(on){const r=document.querySelector(".rd");if(r)r.classList.toggle("dock",on)}
function dockKeep(){clearTimeout(DKT);if(!S.rdUI||S.view!=="read"||window.__noDock)return;
 DKT=setTimeout(()=>{const sc=document.getElementById("rdscr");
  if(S.view!=="read"||!S.rdUI)return;
  if(S.sheet||AS.panel||(sc&&sc.dataset.drag)||document.querySelector(".rd-gc.on")){dockKeep();return}
  dockSet(true)},DOCK_MS)}
function toggleUI(){const r=document.querySelector(".rd");
 if(S.rdUI&&r&&r.classList.contains("dock")){dockSet(false);dockKeep();uiKeep();return} // тугмаҳо канор буданд: ламс — бармеоянд
 S.rdUI=!S.rdUI;if(r)r.classList.toggle("ui",S.rdUI);
 if(S.rdUI){dockSet(false);dockKeep()}else{asPanel(false);dockSet(true)}uiKeep()}
/* ---- (1) кашидани ду ангушт: андозаи ҳарф ---- */
function pzSnap(x){let b=FS_STEPS[0];for(const s of FS_STEPS)if(Math.abs(s-x)<Math.abs(b-x))b=s;return b}
function rdPinch(v){if(v.__pz)return;v.__pz=1;
 let d0=0,fs0=0,cur=0,on=false,fr0=null,ci0=0,bub=null;
 const dist=t=>Math.hypot(t[0].clientX-t[1].clientX,t[0].clientY-t[1].clientY);
 const mark=()=>{window.__pz=Date.now()};
 v.addEventListener("touchstart",e=>{if(e.touches.length===2&&!S.sheet){on=true;mark();d0=Math.max(10,dist(e.touches));fs0=cur=S.pref.fs;const id=S.rdId;fr0=S.rdFr[id];ci0=S.rdCh[id]}},{passive:true});
 v.addEventListener("touchmove",e=>{if(!on||e.touches.length<2)return;e.preventDefault();mark();
  const f=pzSnap(Math.max(FS_STEPS[0],Math.min(FS_STEPS[FS_STEPS.length-1],fs0*dist(e.touches)/d0)));
  if(!bub){const r=document.querySelector(".rd");if(r){bub=document.createElement("div");bub.className="rd-pz";r.appendChild(bub)}}
  if(bub)bub.textContent=f;
  if(f!==cur){cur=f;tick();const r=document.querySelector(".rd");if(r)r.style.setProperty("--fs",f+"px")}},{passive:false});
 const end=()=>{if(!on)return;on=false;mark();if(bub){const x=bub;bub=null;x.classList.add("out");setTimeout(()=>x.remove(),300)}
  if(cur!==fs0){const id=S.rdId;S.pref.fs=cur;if(fr0!=null){S.rdFr[id]=fr0;S.rdCh[id]=ci0}save();render()}};
 v.addEventListener("touchend",e=>{if(e.touches.length<2)end()});v.addEventListener("touchcancel",end);
 // iPhone Safari: ўзи масштаби саҳифаро иваз накунад
 ["gesturestart","gesturechange"].forEach(n=>v.addEventListener(n,e=>e.preventDefault()))}
/* ---- (2) хониши худкор (танҳо вертикалӣ: ҳолати «Аз боло ба поён») ---- */
const AS_SPEEDS=[.3,.5,1,1.5,2,3],AS_PX=34; // 1× ≈ 34 px/сония
const asSpd=()=>Math.max(.1,Math.min(5,+S.asv||1));
function asHTML(){return `<button class="rd-as" id="rdas" aria-label="Хониши худкор">${P('<path d="M12 4v13M6 12l6 6 6-6M5 21h14"/>',2.2)}</button>
 <div class="rd-asp" id="rdasp" aria-hidden="true"><b class="asp-t">Хониши худкор</b>
  <div class="asp-r"><span>Суръат</span><output id="asv" translate="no">${asSpd().toFixed(1)}×</output></div>
  <input type="range" class="rd-scr" id="asr" min="1" max="50" step="1" value="${Math.round(asSpd()*10)}" style="--p:${(Math.round(asSpd()*10)-1)/49*100}%" aria-label="Суръат">
  <div class="asp-c">${AS_SPEEDS.map(x=>`<button data-asv="${x}" translate="no"${Math.abs(x-asSpd())<.05?' class="on"':""}>${x}×</button>`).join("")}</div>
  <button class="pay-btn asp-go" id="asgo">Оғоз кардан</button></div>`}
function asPanel(on){AS.panel=on;const p=document.getElementById("rdasp");if(p){p.classList.toggle("on",on);p.setAttribute("aria-hidden",on?"false":"true")}if(on){uiKeep();dockSet(false)}else dockKeep()}
function asLabel(){const g=document.getElementById("asgo");if(g)g.textContent=AS.on?"Қатъ кардан":"Оғоз кардан";
 const b=document.getElementById("rdas");if(b){b.classList.toggle("run",AS.on);b.innerHTML=P(AS.on?'<path d="M8 5v14M16 5v14"/>':'<path d="M12 4v13M6 12l6 6 6-6M5 21h14"/>',2.2)}}
function asStop(){AS.on=false;cancelAnimationFrame(AS.loop);AS.loop=0;asLabel()}
function asStart(){const v=document.getElementById("rdview");if(!v||!(RD&&RD.vert))return;
 AS.on=true;AS.v=v;AS.acc=0;AS.t=performance.now();AS.idle=0;asLabel();asPanel(false);
 S.rdUI=false;const r=document.querySelector(".rd");if(r){r.classList.remove("ui");r.classList.add("dock")} // фақат китоб монад
 cancelAnimationFrame(AS.loop);AS.loop=requestAnimationFrame(asStep)}
function asStep(t){if(!AS.on)return;const v=document.getElementById("rdview");
 if(S.view!=="read"||v!==AS.v||!RD||!RD.vert||document.visibilityState!=="visible"){asStop();return}
 const dt=Math.min(.05,(t-AS.t)/1000||0);AS.t=t;
 if(Date.now()>AS.hold&&!S.sheet){AS.acc+=asSpd()*AS_PX*dt;const n=Math.floor(AS.acc);
  if(n>=1){AS.acc-=n;const y=v.scrollTop;v.scrollTop=y+n;
   if(Math.abs(v.scrollTop-y)<1){if(++AS.idle>90){asStop();toast("Китоб тамом шуд");return}}else AS.idle=0}}
 AS.loop=requestAnimationFrame(asStep)}
function rdAS(r,v){const vert=!!(RD&&RD.vert);
 if(!vert){asStop();return}
 if(!document.getElementById("rdas")){const gl=document.getElementById("rdgl");if(!gl)return;gl.insertAdjacentHTML("afterend",asHTML())}
 asLabel();
 const bt=document.getElementById("rdas"),pn=document.getElementById("rdasp"),sr=document.getElementById("asr"),sv=document.getElementById("asv");
 const setV=x=>{S.asv=Math.round(Math.max(.1,Math.min(5,x))*10)/10;if(sv)sv.textContent=S.asv.toFixed(1)+"×";if(sr){sr.value=Math.round(S.asv*10);sr.style.setProperty("--p",(Math.round(S.asv*10)-1)/49*100+"%")}
  pn.querySelectorAll("[data-asv]").forEach(b=>b.classList.toggle("on",Math.abs(+b.dataset.asv-S.asv)<.05));uiKeep()};
 bt.onclick=()=>{if(AS.on){asStop();return}asPanel(!AS.panel)};
 sr.oninput=()=>setV(+sr.value/10);sr.onchange=()=>save();
 pn.querySelectorAll("[data-asv]").forEach(b=>b.onclick=()=>{setV(+b.dataset.asv);save()});
 document.getElementById("asgo").onclick=()=>{if(AS.on)asStop();else{save();asStart()}};
 pn.addEventListener("pointerdown",e=>e.stopPropagation());
 // ангушт ба экран расад — хониши худкор лаҳзае меистад (то корбар худаш гардонад) ва сипас давом мекунад
 if(!v.__as){v.__as=1;const h=()=>{AS.hold=Date.now()+900};["touchstart","touchmove","touchend","wheel"].forEach(n=>v.addEventListener(n,h,{passive:true}))}
 if(AS.panel){pn.classList.add("on")}}
/* ---- пайвастшавӣ: баъди ҳар render()-и хонанда ---- */
function rdExtra(){if(S.view!=="read"){asStop();clearTimeout(UIT);return}
 const r=document.querySelector(".rd"),v=document.getElementById("rdview");if(!r||!v)return;
 rdPinch(v);
 if(!r.__ui){r.__ui=1;r.addEventListener("pointerdown",e=>{uiKeep();if(e.target.closest&&e.target.closest(".rd-gl,.rd-gc,.rd-as,.rd-asp"))dockKeep()},true)}
 if(!S.rdUI)r.classList.add("dock");
 rdAS(r,v);uiKeep();dockKeep()}
