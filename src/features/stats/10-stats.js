/* ---- Алоқа бо корбарон: хато/пешниҳод, омори хондан, хабарҳо, версияи ҳадди ақал, ҳавола ---- */
// ===== Омори хондан (рақамҳои беном: барои админ танҳо ҷамъбаст) =====
const RSK="kitob_rs",ST={sec:0,b:0};
const rsLoad=()=>{try{return JSON.parse(localStorage.getItem(RSK)||"{}")}catch(_){return{}}};
function trackTick(){ST.sec++;ST.b=S.rdId||ST.b;if(ST.sec>=60)flushRead()}
function flushRead(){if(ST.sec>0&&ST.b){const q=rsLoad();q[ST.b]=(q[ST.b]||0)+ST.sec;ST.sec=0;try{localStorage.setItem(RSK,JSON.stringify(q))}catch(_){}}sendRead()}
let rsBusy=false;
async function sendRead(){if(rsBusy||!S.uid||!navigator.onLine)return;const q=rsLoad(),ks=Object.keys(q);if(!ks.length)return;rsBusy=true;
 try{const c=await sbLoad();if(!c)return;for(const k of ks){const{error}=await c.rpc("track_read",{p_sec:q[k],p_book:+k});if(error)break;const n=rsLoad();delete n[k];localStorage.setItem(RSK,JSON.stringify(n))}}catch(_){}finally{rsBusy=false}}
async function trackActive(){try{if(!S.uid||!navigator.onLine)return;const d=todayKey();if(localStorage.getItem("kitob_act")===d)return;const c=await sbLoad();if(!c)return;const{error}=await c.rpc("track_active");if(!error)localStorage.setItem("kitob_act",d)}catch(_){}}/* ---------- Дақиқаҳои хондан ва огоҳиномаҳо (Android APK) ---------- */
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