/* ---- Синхронизатсияи ҳолати корбар: пешравии хондан, токчаҳо, хатчӯбҳо (сервер: docs/sql-holat.sql) ----
   Қоидаи ихтилоф (чанд телефон):
   • пешравӣ — барои ҳар китоб фоизи БАЛАНДТАРИН ғолиб (пешравӣ танҳо меафзояд);
   • токчаҳо (S.lib) ва хатчӯбҳо (S.marks) — ҳар кадом як дона, вақти тағйири нав (S.libT / S.marksT) ғолиб. */
function buildSync(){
 const prog={};Object.keys(S.prog||{}).forEach(id=>{const v=+S.prog[id]||0;if(v>0)prog[id]={v,pg:+(S.pages||{})[id]||0,ch:+(S.rdCh||{})[id]||0,t:Date.now()}});
 const o={prog};if((S.libT||0)>0)o.lib={t:S.libT,v:S.lib};if((S.marksT||0)>0)o.marks={t:S.marksT,v:S.marks};return o}
/* ҷавоби серверро ба ҳолати маҳаллӣ татбиқ мекунад; true = чизе тағйир ёфт */
function applySync(r){if(!r||typeof r!=="object")return false;let ch=false;
 S.prog=S.prog||{};S.pages=S.pages||{};S.rdCh=S.rdCh||{};S.rdFr=S.rdFr||{};
 const P=r.prog&&typeof r.prog==="object"?r.prog:{};
 Object.keys(P).forEach(id=>{const e=P[id];if(!e||typeof e!=="object")return;const v=+e.v||0;if(v>(+S.prog[id]||0)){S.prog[id]=v;S.pages[id]=+e.pg||0;S.rdCh[id]=+e.ch||0;delete S.rdFr[id];ch=true}});
 if(r.lib&&r.lib.v&&typeof r.lib.v==="object"&&(+r.lib.t||0)>(S.libT||0)){const v=r.lib.v;S.lib={q:Array.isArray(v.q)?v.q:[],d:Array.isArray(v.d)?v.d:[],c:Array.isArray(v.c)?v.c:[]};S.libT=+r.lib.t;S._lh=JSON.stringify(S.lib);ch=true}
 if(r.marks&&r.marks.v&&typeof r.marks.v==="object"&&(+r.marks.t||0)>(S.marksT||0)){S.marks=r.marks.v;S.marksT=+r.marks.t;S._mh=JSON.stringify(S.marks);ch=true}
 return ch}
const syncSig=()=>{const o=buildSync();Object.keys(o.prog).forEach(k=>delete o.prog[k].t);return JSON.stringify(o)};
let syncBusy=false,syncLast="";
async function syncState(c,force){
 if(!S.uid||syncBusy||(typeof navigator!=="undefined"&&!navigator.onLine))return;
 const sg=syncSig();if(!force&&sg===syncLast)return;
 syncBusy=true;
 try{const{data,error}=await c.rpc("sync_state",{p:buildSync()});
  if(!error&&data){syncLast=sg;if(applySync(data)){syncLast=syncSig();save();if(!S.sheet&&!["login","read","audio"].includes(S.view))render()}}}
 catch(_){}finally{syncBusy=false}}
async function syncSoon(){try{const c=await sbLoad();if(c)await syncState(c)}catch(_){}}
setInterval(()=>{if(document.visibilityState==="visible")syncSoon()},120000);
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden")syncSoon()});
/* чиқиш / ҳисобро нест кардан: маълумоти корбар аз телефон пок мешавад (то ки корбари дигар онро ба сервер нафиристад) */
function resetUserData(){
 S.role="";S.perms={};S.staff=null;S.bkCache=[];for(let i=BOOKS.length-1;i>=0;i--)if(BOOKS[i].db)BOOKS.splice(i,1);
 S.gender=undefined;S.recent=[];S.prog={};S.pages={};S.rdCh={};S.rdFr={};S.marks={};S.aprog={};S.apos={};S.mode={};S.lib={q:[],d:[],c:[]};
 S.libT=0;S.marksT=0;S._lh=undefined;S._mh=undefined;S.pu=0;S.premium=false;S.pAv="";S.pBn="";S.pBio="";
 S.confirmOut=false;S.step="email";S.email="";S.uname="";S.uid="";syncLast="";save()}
/* дастгоҳи беном (воронка: «ўрнатган»): ID-и тасодуфӣ, бе почта ва ном; docs/sql-metrika.sql */
function devId(){try{let d=localStorage.getItem("kitob_dev");if(!d){d=(window.crypto&&crypto.randomUUID)?crypto.randomUUID():("d"+Date.now().toString(36)+Math.random().toString(36).slice(2,12));localStorage.setItem("kitob_dev",d)}return d}catch(_){return""}}
async function trackInstall(c){try{const d=devId();if(!d||!navigator.onLine)return;const k=todayKey();if(localStorage.getItem("kitob_inst")===k)return;
 const{error}=await c.rpc("track_install",{p_device:d,p_native:!!window.KitobAndroid});if(!error)localStorage.setItem("kitob_inst",k)}catch(_){}}
