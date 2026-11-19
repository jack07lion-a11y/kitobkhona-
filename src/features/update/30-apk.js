/* ---- Навсозии APK: пурра худкор — бе ойна, бе тугма, бе доира. Танҳо як хабари хурд: «Навсозӣ шуд».
   Админ ва ёрдамчӣ охирин APK-и сохташударо худкор мебинанд; корбарони оддӣ — танҳо баъди «Нашр кардан». ---- */
const AU={busy:false,ready:false};
const apkNative=()=>{const A=window.KitobAndroid;return A&&A.downloadUpdate&&A.installUpdate&&!NATIVE.isPlay()?A:null};
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
// ҷавоби Android: фоизи боргирӣ (нишон дода намешавад)
window.__upd=(p,st)=>{S.updSt=st;S.updP=p;if(!AU.auto)return;
 if(st==="ready"){AU.busy=false;AU.ready=true;apkInstallIdle()}else if(st==="err"){AU.busy=false;AU.ready=false;AU.auto=false}};
// баъди насби версияи нав (ё дар Android аз нав оғоз шудан): як хабари хурд
setTimeout(()=>{try{const A=window.KitobAndroid;if(!A||!A.version)return;const v=String(A.version()),o=localStorage.getItem("kitob_apkv");localStorage.setItem("kitob_apkv",v);if(o&&o!==v&&typeof afterSplash==="function")afterSplash(()=>toast("Навсозӣ шуд"))}catch(_){}},0);
// санҷиши даврӣ: ҳатто дар вақти хондан; ҳангоми баргаштан ба барнома
setInterval(()=>{if(document.visibilityState!=="visible")return;try{checkUpdate().then(()=>{apkAuto();apkInstallIdle()})}catch(_){}},60*1000);
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")setTimeout(()=>{try{checkUpdate().then(()=>{apkAuto();apkInstallIdle()})}catch(_){}},900)});
