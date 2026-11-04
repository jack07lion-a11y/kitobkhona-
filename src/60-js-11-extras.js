/* ---------- Дақиқаҳои хондан ва огоҳиномаҳо (Android APK) ---------- */
const RDG={sess:0,act:Date.now(),lt:0};
const todayKey=()=>{const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")};
const readMin=k=>Math.floor(((S.rsec||{})[k||todayKey()]||0)/60);
const readTotal=()=>Math.floor(Object.values(S.rsec||{}).reduce((a,b)=>a+b,0)/60);
const read7=()=>{let t=0;for(let i=0;i<7;i++){const d=new Date(Date.now()-i*864e5),k=d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");t+=(S.rsec||{})[k]||0}return Math.floor(t/60)};
["pointerdown","touchstart","scroll","keydown"].forEach(ev=>addEventListener(ev,()=>{RDG.act=Date.now()},{passive:true,capture:true}));
setInterval(()=>{if(S.view==="read"&&document.visibilityState==="visible"&&Date.now()-RDG.act<120000){const k=todayKey();S.rsec=S.rsec||{};S.rsec[k]=(S.rsec[k]||0)+1;RDG.sess++;trackTick();if(RDG.sess%15===0)save()}},1000);
function rdLeave(){flushRead();if(Date.now()-RDG.lt<3000)return;RDG.lt=Date.now();save();const A=window.KitobAndroid;if(A&&A.leave){try{A.leave(readMin(),RDG.sess)}catch(_){}}RDG.sess=0}
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden")rdLeave();else{RDG.sess=0;RDG.act=Date.now()}});
addEventListener("pagehide",rdLeave);window.__leave=rdLeave;
const DEF_REMIND="Имрӯз ҳатто 1 дақиқа китоб нахондед!",DEF_CONGRATS="Табрик шумо имрӯз {n} дақиқа хондед!🎉 боз хонда боз доно шавед!";
const cfgTxt=(o,d)=>(o&&o[I18N.lang])||I18N.tr(d);
const canNotif=()=>S.role==="admin"||(S.role==="subadmin"&&(canPerm("notif")||!!(S.ncfg&&S.ncfg.sub_can_edit)));
function pushNotifyCfg(){const A=window.KitobAndroid;if(!A||!A.config)return;const c=S.ncfg||{};
 try{A.config(JSON.stringify({remind:c.remind_on!==false,congrats:c.congrats_on!==false,hour:c.remind_hour||20,role:S.role==="admin"?"АДМИН":S.role==="subadmin"?"СУБАДМИН":"",title:"Китобхона",remindText:cfgTxt(c.remind_text,DEF_REMIND),tpl:cfgTxt(c.congrats_tpl,DEF_CONGRATS),sbUrl:SB_URL,sbKey:SB_KEY,news:true}))}catch(_){}}
async function loadNotifCfg(){const c=await sbLoad();if(!c)return;
 try{const{data,error}=await c.from("notif_cfg").select("*").eq("id",1).maybeSingle();if(!error&&data){S.ncfg=data;save();pushNotifyCfg();if(S.view==="me"&&(S.sheet==="admnotif"||!S.sheet))render()}}catch(_){}}
async function saveNotif(p){const c=await sbLoad();if(!c){toast("Интернет нест");return false}
 try{const{error}=await c.rpc("save_notif_cfg",{p});if(error){toast("Иҷозат дода нашуд. Аввал SQL-ро иҷро кунед");return false}
  if(p.remind_text||p.congrats_tpl)S.nd=null;await loadNotifCfg();toast("Захира шуд");return true}catch(_){toast("Интернет нест ё сервер ҷавоб намедиҳад");return false}}
afterSplash(()=>{sbLoad().then(()=>syncServer());markHave()});
applyTheme();matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change",applyTheme);
async function loadRelease(){const c=await sbLoad();if(!c)return null;
 try{const{data,error}=await c.from("app_release").select("*").eq("id",1).maybeSingle();if(!error&&data){S.rel=data;return data}}catch(_){}return null}
function checkUpdate(){const A=window.KitobAndroid;if(!A||!navigator.onLine)return Promise.resolve(false);let cur=0;try{cur=+A.version()||0}catch(e){}
 return loadRelease().then(async r=>{
  if(r&&r.version>cur&&/^https:\/\/github\.com\/jack07lion-a11y\/kitobkhona-\/releases\//.test(r.url||"")){if(!S.upd||S.upd.v!==r.version)S.upd={v:r.version,url:r.url};return true}
  // админ ва ёрдамчӣ: охирин APK-и сохташуда (нашр нашуда бошад ҳам) худкор
  if(S.role==="admin"||S.role==="subadmin"){const b=await loadBuilds();if(b&&b.v>cur&&/^https:\/\/github\.com\/jack07lion-a11y\/kitobkhona-\/releases\//.test(b.url||"")){if(!S.upd||S.upd.v!==b.v)S.upd={v:b.v,url:b.url};return true}}
  if(S.upd&&cur>=S.upd.v)S.upd=null;return false})}
async function loadBuilds(){try{const r=await fetch("https://api.github.com/repos/jack07lion-a11y/kitobkhona-/releases?per_page=15");if(!r.ok)return null;const j=await r.json();let best=null;
 for(const x of j){const m=/^apk-(\d+)$/.exec(x.tag_name||"");if(!m||x.draft)continue;const a=(x.assets||[]).find(y=>/\.apk$/.test(y.name));if(!a)continue;const v=+m[1];if(!best||v>best.v)best={v,url:a.browser_download_url,date:x.published_at||x.created_at}}return best}catch(_){return null}}
async function loadRelAdmin(){if(!canPerm("release"))return;S.webLast=await webLatest();const[,b]=await Promise.all([loadRelease(),loadBuilds()]);S.rb=b;S.rbDone=true;if(S.view==="me"&&(S.sheet==="admrel"||!S.sheet))render()}
const relNew=()=>!!(S.rb&&S.rb.v>((S.rel&&S.rel.version)||0));
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

/* ---- Навсозӣ бо кашидани экран ба поён (ҳамаи экранҳои асосӣ) ---- */
async function checkShell(auto){if(window.KitobAndroid||!navigator.onLine)return false;if(auto&&S.view==="read")return false;
 try{const r=await fetch(location.pathname+"?_="+Date.now(),{cache:"no-store"});if(!r.ok)return false;const t=await r.text();let x=0;for(let i=0;i<t.length;i++)x=(x*31+t.charCodeAt(i))|0;
  const k=x+":"+t.length,old=localStorage.getItem("kitob_shell");localStorage.setItem("kitob_shell",k);
  if(old&&old!==k){try{sessionStorage.setItem("kitob_upd","1")}catch(_){}location.reload();return true}}catch(_){}return false}
async function doRefresh(){
 if(!navigator.onLine)return["Интернет нест"];
 const nb=BOOKS.length;try{await syncServer()}catch(_){}
 try{await checkUpdate()}catch(_){}
 if(await checkShell(false))return["Интерфейс нав мешавад…"];
 const out=[];
 if(wuDue()){out.push("Навсозии нав тайёр аст");webUpdCheck()}
 if(S.upd&&apkNative()){out.push("Навсозии барнома ҳаст (версияи "+S.upd.v+")");setTimeout(()=>apkNag(true),900)}
 if(BOOKS.length>nb)out.push("Китобҳои нав: "+(BOOKS.length-nb));
 const nw=await loadNewsOnce();if(nw){const seen=+(localStorage.getItem("kitob_news")||0);if(seen&&nw.id>seen)out.push("Хабар: "+nw.title);if(nw.id>seen)localStorage.setItem("kitob_news",String(nw.id))}
 return out.length?out:["Ҳама чиз нав аст"]}
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
afterSplash(checkUpdate);
