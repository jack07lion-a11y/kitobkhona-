/* ---- Дарвозаҳои Android/веб ва сабти хатоҳои техникӣ ---- */
const SITE_URL="https://jack07lion-a11y.github.io/kitobkhona-/";
const NATIVE={
 ver(){try{const A=window.KitobAndroid;return A&&A.version?(+A.version()||0):0}catch(_){return 0}},
 share(text,url){const A=window.KitobAndroid,full=url?text+"\n"+url:text;
  try{if(A&&A.share){A.share(full);return}if(navigator.share){navigator.share({text,url}).catch(()=>{});return}}catch(_){}
  NATIVE.copy(full);toast("Ҳавола нусха шуд")},
 openUrl(u){try{const A=window.KitobAndroid;if(A&&A.openUrl)A.openUrl(u);else window.open(u,"_blank")}catch(_){}},
 copy(t){try{const A=window.KitobAndroid;if(A&&A.copy){A.copy(t);return}navigator.clipboard&&navigator.clipboard.writeText(t)}catch(_){}},
 haptic(ms){try{const A=window.KitobAndroid;if(A&&A.haptic)A.haptic(ms);else if(navigator.vibrate)navigator.vibrate(ms)}catch(_){}},
 info(){let o={app:"web"};try{const A=window.KitobAndroid;if(A&&A.deviceInfo)o=JSON.parse(A.deviceInfo());o.native=!!A}catch(_){}
  o.ua=(navigator.userAgent||"").slice(0,120);o.lang=(typeof I18N!=="undefined"&&I18N.lang)||"tg";o.scr=innerWidth+"x"+innerHeight;return o}
};
const ERRK="kitob_errq";let errT=0,errN=0,errMin=0;
function errLoad(){try{return JSON.parse(localStorage.getItem(ERRK)||"[]")}catch(_){return[]}}
function logErr(k,m,s){try{m=String(m||"").slice(0,300);if(!m||m==="Script error.")return;const now=Date.now();if(now-errMin>60000){errMin=now;errN=0}if(++errN>6)return;
 const q=errLoad();if(q.some(x=>x.m===m&&now-x.t<600000))return;let v="";try{v=S.view||""}catch(_){}
 q.push({k,m,s:String(s||"").slice(0,2000),v,t:now,d:NATIVE.info()});while(q.length>20)q.shift();localStorage.setItem(ERRK,JSON.stringify(q));clearTimeout(errT);errT=setTimeout(flushErrs,4000)}catch(_){}}
async function flushErrs(){try{const q=errLoad();if(!q.length||!navigator.onLine)return;const c=await sbLoad();if(!c)return;
 const{error}=await c.rpc("log_errors",{p:q.map(x=>({k:x.k,m:x.m,s:x.s,v:x.v,d:x.d}))});if(!error)localStorage.removeItem(ERRK)}catch(_){}}
addEventListener("error",e=>logErr("js",e.message,(e.error&&e.error.stack)||((e.filename||"")+":"+(e.lineno||""))));
addEventListener("unhandledrejection",e=>{const r=e.reason;logErr("promise",(r&&r.message)||r,r&&r.stack)});
