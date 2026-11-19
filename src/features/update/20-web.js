/* ---- Навсозии саҳифа дар APK: корбари оддӣ — танҳо баъди «Нашр кардан»-и админ; админ/ёрдамчӣ — худкор ---- */
const WEB_H="__WEBH__";
const WU={busy:false,pct:0,ready:false};
const wuStaff=()=>S.role==="admin"||S.role==="subadmin";
const wuNative=()=>{const A=window.KitobAndroid;return A&&A.updateShell&&A.setShellAuto?A:null};
const wuDue=()=>{const A=wuNative(),p=S.flags&&S.flags.webPub;return !!(A&&p&&!wuStaff()&&p!==WEB_H&&S.webDone!==p)};
function webUpdCheck(){const A=wuNative();if(!A)return;
 if(wuStaff()){try{A.setShellAuto(true)}catch(_){}if(!window.__stShell){window.__stShell=1;try{A.updateShell()}catch(_){}}return}
 try{A.setShellAuto(false)}catch(_){}
 if(WU.ready){wuApply();return}
 if(wuDue()&&!WU.busy)wuAuto()}
/* ХУДКОР: ойна, тугма ва доира нест. Нусха паси замина фаро мешавад, баъд дар вақти баргаштан ба барнома (ё оғози навбатӣ) худ ба худ ишга меафтад; фақат як хабари хурд: «Навсозӣ шуд». */
function wuAuto(){const A=wuNative();if(!A||!S.flags||!S.flags.webPub)return;S.webDone=S.flags.webPub;save();WU.busy=true;WU.auto=true;try{A.updateShell()}catch(_){WU.busy=false}}
function wuApply(){if(!WU.ready||S.view==="read"||S.sheet)return;WU.ready=false;try{sessionStorage.setItem("kitob_upd","1")}catch(_){}try{location.reload()}catch(_){}}
let WU_HID=0;document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden")WU_HID=Date.now();else if(WU.ready&&Date.now()-WU_HID>8000)wuApply()});
window.__shellP=(p,st)=>{if(wuStaff()||!WU.auto)return;
 if(st==="ready"){WU.busy=false;WU.ready=true}else if(st==="err"){WU.busy=false;WU.auto=false;S.webDone=null;save()}};

// ===== Админ: нашри нусхаи сайт ба корбарони APK =====
async function webLatest(){try{const r=await fetch(SITE_URL+"version.json?nc="+Date.now(),{cache:"no-store"});if(!r.ok)return null;const j=await r.json();return j&&j.h||null}catch(_){return null}}
function admWebHTML(){const pub=(S.flags&&S.flags.webPub)||"",last=S.webLast||"";
 return `<div class="plan wuadm"><div><b>Навсозии саҳифа ба корбарон (APK)</b><span>Баъди «Нашр кардан» нусха ба корбарони APK худкор, бе савол, дар вақти баргаштан ба барнома мерасад. Админ ва ёрдамчӣ дарҳол мегиранд. Сайт ва iPhone — доимо навтарин.</span>
  <small translate="no">Охирин сохташуда: ${last||"—"} · Нашршуда: ${pub||"—"} · Дар ин дастгоҳ: ${WEB_H}</small></div>
  <div class="rp-a"><button class="pill" data-webpub style="background:var(--orange);color:#fff"${last&&last===pub?" disabled":""}>${last&&last===pub?"Нашр шудааст ✓":"Нашр кардан"}</button></div></div>`}
function bindWebPub(){const b=document.querySelector("[data-webpub]");if(!b)return;
 b.onclick=async()=>{b.disabled=true;const h=await webLatest();if(!h){toast("Версияи сайт хонда нашуд");b.disabled=false;return}
  try{const c=await sbLoad();const{error}=await c.rpc("publish_web",{p_hash:h});if(error){toast("Иҷозат дода нашуд. Аввал SQL-и «веб»-ро иҷро кунед");b.disabled=false;return}
   S.flags.webPub=h;S.webLast=h;save();render();toast("Нашр шуд: корбарон навсозиро мебинанд")}catch(_){toast("Интернет нест");b.disabled=false}}}
