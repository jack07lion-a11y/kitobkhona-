/* ---- Навсозии саҳифа дар APK: корбари оддӣ — танҳо баъди «Нашр кардан»-и админ; админ/ёрдамчӣ — худкор ---- */
const WEB_H="__WEBH__";
const WU={busy:false,pct:0,ready:false};
const wuStaff=()=>S.role==="admin"||S.role==="subadmin";
const wuNative=()=>{const A=window.KitobAndroid;return A&&A.updateShell&&A.setShellAuto?A:null};
const wuDue=()=>{const A=wuNative(),p=S.flags&&S.flags.webPub;return !!(A&&p&&!wuStaff()&&p!==WEB_H&&S.webDone!==p)};
function webUpdCheck(){const A=wuNative();if(!A)return;
 if(wuStaff()){try{A.setShellAuto(true)}catch(_){}if(!window.__stShell){window.__stShell=1;try{A.updateShell()}catch(_){}}return}
 try{A.setShellAuto(false)}catch(_){}
 if(WU.ready){wuRestartUI();return}
 if(wuDue()&&!WU.busy)wuSheet()}
function wuSheet(){if(document.getElementById("wus"))return;const el=document.createElement("div");el.id="wus";el.className="wus";
 el.innerHTML=`<div class="wus-bg"></div><div class="wus-c"><i class="wus-h"></i><div class="wus-i">${P('<path d="M12 3v12M7 10l5 5 5-5M5 20h14"/>',2)}</div><h3>Навсозии нав тайёр аст</h3><p>Барнома беҳтар шуд. Навсозӣ чанд сонияро мегирад ва шумо метавонед хондани китобро давом диҳед.</p><button class="pay-btn" id="wus-go">Навсозӣ</button></div>`;
 document.body.appendChild(el);const c=el.querySelector(".wus-c"),bg=el.querySelector(".wus-bg");
 requestAnimationFrame(()=>el.classList.add("in"));
 const close=()=>{el.classList.remove("in");setTimeout(()=>el.remove(),380)};
 bg.onclick=close;document.getElementById("wus-go").onclick=()=>{close();wuStart()};
 let y0=null,dy=0;c.onpointerdown=e=>{if(e.target.closest("button"))return;y0=e.clientY;dy=0;try{c.setPointerCapture(e.pointerId)}catch(_){}c.style.transition="none"};
 c.onpointermove=e=>{if(y0===null)return;dy=Math.max(0,e.clientY-y0);c.style.transform=`translateY(${dy}px)`};
 c.onpointerup=c.onpointercancel=()=>{if(y0===null)return;y0=null;c.style.transition="";if(dy>80)close();else c.style.transform=""}}
function wuStart(){const A=wuNative();if(!A)return;S.webDone=S.flags.webPub;save();WU.busy=true;WU.pct=0;wuRing(0);try{A.updateShell()}catch(_){WU.busy=false;wuRingOff()}}
function wuRing(p,done){let r=document.getElementById("wup");
 if(!r){r=document.createElement("div");r.id="wup";r.className="wup";r.innerHTML=`<svg viewBox="0 0 40 40"><circle class="wup-b" cx="20" cy="20" r="15"/><circle class="wup-a" cx="20" cy="20" r="15" pathLength="100"/></svg><b></b>`;document.body.appendChild(r);requestAnimationFrame(()=>r.classList.add("in"))}
 r.querySelector(".wup-a").style.strokeDashoffset=String(100-p);r.querySelector("b").textContent=done?"✓":Math.round(p)+"%"}
function wuRingOff(){const r=document.getElementById("wup");if(r){r.classList.remove("in");setTimeout(()=>r.remove(),300)}}
function wuRestartUI(){if(document.getElementById("wur"))return;const el=document.createElement("div");el.id="wur";el.className="wur";
 el.innerHTML=`<button class="pay-btn" id="wur-go">${P('<path d="M4 12a8 8 0 1 0 3-6.200M4 4v4h4"/>',2)}Аз нав оғоз кардан</button>`;document.body.appendChild(el);requestAnimationFrame(()=>el.classList.add("in"));
 document.getElementById("wur-go").onclick=()=>{try{window.KitobAndroid.restartApp()}catch(_){location.reload()}}}
window.__shellP=(p,st)=>{if(wuStaff())return;
 if(st==="down"){WU.pct=p;wuRing(p)}
 else if(st==="ready"){WU.busy=false;WU.ready=true;wuRing(100,true);setTimeout(wuRingOff,1800);wuRestartUI()}
 else if(st==="err"){WU.busy=false;S.webDone=null;save();wuRingOff();toast("Навсозӣ нашуд. Баъдтар аз нав кӯшиш кунед")}};

// ===== Админ: нашри нусхаи сайт ба корбарони APK =====
async function webLatest(){try{const r=await fetch(SITE_URL+"version.json?nc="+Date.now(),{cache:"no-store"});if(!r.ok)return null;const j=await r.json();return j&&j.h||null}catch(_){return null}}
function admWebHTML(){const pub=(S.flags&&S.flags.webPub)||"",last=S.webLast||"";
 return `<div class="plan wuadm"><div><b>Навсозии саҳифа ба корбарон (APK)</b><span>Корбарони оддии APK нусхаи навро фақат баъди «Нашр кардан» мегиранд. Админ ва ёрдамчӣ худкор мегиранд. Сайт ва iPhone — доимо навтарин.</span>
  <small translate="no">Охирин сохташуда: ${last||"—"} · Нашршуда: ${pub||"—"} · Дар ин дастгоҳ: ${WEB_H}</small></div>
  <div class="rp-a"><button class="pill" data-webpub style="background:var(--orange);color:#fff"${last&&last===pub?" disabled":""}>${last&&last===pub?"Нашр шудааст ✓":"Нашр кардан"}</button></div></div>`}
function bindWebPub(){const b=document.querySelector("[data-webpub]");if(!b)return;
 b.onclick=async()=>{b.disabled=true;const h=await webLatest();if(!h){toast("Версияи сайт хонда нашуд");b.disabled=false;return}
  try{const c=await sbLoad();const{error}=await c.rpc("publish_web",{p_hash:h});if(error){toast("Иҷозат дода нашуд. Аввал SQL-и «веб»-ро иҷро кунед");b.disabled=false;return}
   S.flags.webPub=h;S.webLast=h;save();render();toast("Нашр шуд: корбарон навсозиро мебинанд")}catch(_){toast("Интернет нест");b.disabled=false}}}
