/* ---- Алоқа бо корбарон: хато/пешниҳод, омори хондан, хабарҳо, версияи ҳадди ақал, ҳавола ---- */
// ===== Омори хондан (рақамҳои беном: барои админ танҳо ҷамъбаст) =====
const RSK="kitob_rs",ST={sec:0,b:0};
const rsLoad=()=>{try{return JSON.parse(localStorage.getItem(RSK)||"{}")}catch(_){return{}}};
function trackTick(){ST.sec++;ST.b=S.rdId||ST.b;if(ST.sec>=60)flushRead()}
function flushRead(){if(ST.sec>0&&ST.b){const q=rsLoad();q[ST.b]=(q[ST.b]||0)+ST.sec;ST.sec=0;try{localStorage.setItem(RSK,JSON.stringify(q))}catch(_){}}sendRead()}
let rsBusy=false;
async function sendRead(){if(rsBusy||!S.uid||!navigator.onLine)return;const q=rsLoad(),ks=Object.keys(q);if(!ks.length)return;rsBusy=true;
 try{const c=await sbLoad();if(!c)return;for(const k of ks){const{error}=await c.rpc("track_read",{p_sec:q[k],p_book:+k});if(error)break;const n=rsLoad();delete n[k];localStorage.setItem(RSK,JSON.stringify(n))}}catch(_){}finally{rsBusy=false}}
/* воронка барои админ (docs/sql-metrika.sql): насб → сабти ном → 1 дақиқа хондан → баргашт */
async function loadFunnel(c){if(!canPerm("stats"))return;try{const{data,error}=await c.rpc("funnel",{p_days:30});if(error||!data)return;S.fn=data;try{loadGhDl()}catch(_){}
 ["installs","registered","read1","back1","back7"].forEach(k=>{const e=document.getElementById("fn_"+k);if(e)e.textContent=data[k]});try{admKpiUpdate()}catch(_){}}catch(_){}}
async function trackActive(){try{if(!S.uid||!navigator.onLine)return;const d=todayKey();if(localStorage.getItem("kitob_act")===d)return;const c=await sbLoad();if(!c)return;const{error}=await c.rpc("track_active");if(!error)localStorage.setItem("kitob_act",d)}catch(_){}}/* ---------- Дақиқаҳои хондан ва огоҳиномаҳо (Android APK) ---------- */
const RDG={sess:0,act:Date.now(),lt:0};
const todayKey=()=>{const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")};
const readMin=k=>Math.floor(((S.rsec||{})[k||todayKey()]||0)/60);
const readTotal=()=>Math.floor(Object.values(S.rsec||{}).reduce((a,b)=>a+b,0)/60);
const read7=()=>{let t=0;for(let i=0;i<7;i++){const d=new Date(Date.now()-i*864e5),k=d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");t+=(S.rsec||{})[k]||0}return Math.floor(t/60)};
["pointerdown","touchstart","scroll","keydown"].forEach(ev=>addEventListener(ev,()=>{RDG.act=Date.now()},{passive:true,capture:true}));
/* ===== Ҳисоби ҳалол: вақт танҳо ҳангоми воқеан хондан ҳисоб мешавад (алдашро манъ мекунад) =====
   1) Ҷои китоб бояд иваз шавад (саҳифа гашт/матн сурилид). 65 сония ҷой иваз нашавад — ҳисоб меистад, то бори навбатии ҷунбиш.
   2) Суръат аз 900 калима/дақиқа зиёд бошад (варақ задани тез, ҷаҳиш) — он дақиқа ҳисоб намешавад.
   3) Хониши худкор: ҳар 10 дақиқа як ламс лозим, вагарна ҳисоб меистад.
   Рӯзона 8 соат ва санҷиши сервер: docs/sql-halol.sql */
const RC={k:0,mv:0,mvg:null,wg:null,wt:0,lg:null,pend:0,touch:Date.now(),warned:false};
const RC_IDLE=65000,RC_FAST=900,RC_WIN=60000,RC_STEP=20;
/* Хониши худкор: назорат «ҳанӯз мехонед?» — 3 дақиқа, баъд 7, баъд 15, баъд ҳар 25 дақиқа (экранро ламс накунад). Ҳисоб то ламс меистад. */
const RC_CHK=[180000,420000,900000],RC_CHK_N=1500000,rcChk=()=>RC.k<RC_CHK.length?RC_CHK[RC.k]:RC_CHK_N;
let RC_AC=null;
function rcAlert(){try{const nm=String(S.uname||"").trim();toast(nm?I18N.tr("Ҳоло ҳам хонда истодаед, {ном}?").replace("{ном}",nm):I18N.tr("Ҳоло ҳам хонда истодаед?"))}catch(_){}
 try{if(navigator.vibrate)navigator.vibrate([250,120,250,120,400])}catch(_){}
 try{const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;RC_AC=RC_AC||new AC();if(RC_AC.resume)RC_AC.resume();const t0=RC_AC.currentTime;
  [[880,0],[660,.28]].forEach(([f,d])=>{const o=RC_AC.createOscillator(),g=RC_AC.createGain();o.type="sine";o.frequency.value=f;g.gain.setValueAtTime(.0001,t0+d);g.gain.exponentialRampToValueAtTime(.35,t0+d+.03);g.gain.exponentialRampToValueAtTime(.0001,t0+d+.25);o.connect(g);g.connect(RC_AC.destination);o.start(t0+d);o.stop(t0+d+.27)})}catch(_){}}
function rcTouch(){RC.touch=Date.now();if(RC.warned){RC.warned=false;RC.k++}}
function rcAdd(n){if(n<=0)return;const k=todayKey();S.rsec=S.rsec||{};S.rsec[k]=(S.rsec[k]||0)+n;RDG.sess+=n;ST.sec+=n;ST.b=S.rdId||ST.b;save();if(ST.sec>=60)flushRead()}
function rcCommit(now,g){const el=Math.max(RC_WIN,now-RC.wt);
 if(RC.pend>0&&RC.wg!=null&&g!=null){const adv=Math.max(0,g-RC.wg),wpm=adv/6/(el/60000);if(wpm<=RC_FAST)rcAdd(RC.pend)}
 RC.pend=0;RC.wg=g;RC.wt=now}
/* ҳар сония: now — вақт, g — ҷои китоб (ҳарф), e: {read,vis,as} */
function rcStep(now,g,e){
 if(!e.read||!e.vis||g==null){if(RC.pend)rcCommit(now,RC.lg);RC.mvg=null;RC.wg=null;RC.warned=false;RC.k=0;return}
 RC.lg=g;
 if(RC.mvg==null){RC.mvg=g;RC.mv=now;RC.wg=g;RC.wt=now;RC.pend=0}
 if(Math.abs(g-RC.mvg)>=RC_STEP){RC.mvg=g;RC.mv=now}
 let ok=now-RC.mv<RC_IDLE;
 if(!e.as){RC.k=0;RC.warned=false}
 else if(RC.warned)ok=false;
 else if(now-RC.touch>=rcChk()){ok=false;RC.warned=true;rcAlert()}
 if(ok)RC.pend++;
 if(now-RC.wt>=RC_WIN)rcCommit(now,g)}
const rcG=()=>{try{if(!RD||!RD.b||RD.gf==null)return null;return RD.gf*rdInfo(RD.b).tot}catch(_){return null}};
["pointerdown","touchstart","touchmove","wheel","keydown"].forEach(ev=>addEventListener(ev,rcTouch,{passive:true,capture:true}));
setInterval(()=>{const vis=document.visibilityState==="visible",rd=S.view==="read"&&vis&&!!RD&&!!RD.b;rcStep(Date.now(),rd?rcG():null,{read:rd,vis,as:typeof AS!=="undefined"&&!!AS.on})},1000);
function rdLeave(){try{rcStep(Date.now(),null,{read:false,vis:false})}catch(_){}flushRead();if(Date.now()-RDG.lt<3000)return;RDG.lt=Date.now();save();const A=window.KitobAndroid;if(A&&A.leave){try{A.leave(readMin(),RDG.sess)}catch(_){}}RDG.sess=0}
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden")rdLeave();else{RDG.sess=0;RDG.act=Date.now()}});
addEventListener("pagehide",rdLeave);window.__leave=rdLeave;