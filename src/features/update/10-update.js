// ===== Версияи ҳадди ақали APK: агар кӯҳна бошад, ба навсозӣ даъват мекунем =====
function checkMin(){const m=(S.flags&&S.flags.min)||0,v=NATIVE.ver();let el=document.getElementById("minv_ov");
 if(!(v>0&&m>v)){if(el)el.remove();return}
 if(el)return;el=document.createElement("div");el.id="minv_ov";el.className="minv";
 el.innerHTML=`<div class="minv-c"><div class="minv-i">${P('<path d="M12 3v12M7 10l5 5 5-5M5 20h14"/>',2)}</div><h2>Барномаи шумо кӯҳна шудааст</h2><p>Барои идома додан, версияи навро боргирӣ ва насб кунед.</p><button class="pay-btn" id="minv_go">Навсозӣ кардан</button></div>`;
 document.body.appendChild(el);document.getElementById("minv_go").onclick=()=>NATIVE.openUrl(NATIVE.isPlay()?"https://play.google.com/store/apps/details?id=tj.kitobkhona.app":SITE_URL+"yuklab.html")}
async function loadRelease(){const c=await sbLoad();if(!c)return null;
 try{const{data,error}=await c.from("app_release").select("*").eq("id",1).maybeSingle();if(!error&&data){S.rel=data;return data}}catch(_){}return null}
function checkUpdate(){const A=window.KitobAndroid;if(!A||NATIVE.isPlay()||!navigator.onLine)return Promise.resolve(false);let cur=0;try{cur=+A.version()||0}catch(e){}
 return loadRelease().then(async r=>{
  if(r&&r.version>cur&&/^https:\/\/github\.com\/jack07lion-a11y\/kitobkhona-\/releases\//.test(r.url||"")){if(!S.upd||S.upd.v!==r.version)S.upd={v:r.version,url:r.url};return true}
  // админ ва ёрдамчӣ: охирин APK-и сохташуда (нашр нашуда бошад ҳам) худкор
  if(S.role==="admin"||S.role==="subadmin"){const b=await loadBuilds();if(b&&b.v>cur&&/^https:\/\/github\.com\/jack07lion-a11y\/kitobkhona-\/releases\//.test(b.url||"")){if(!S.upd||S.upd.v!==b.v)S.upd={v:b.v,url:b.url};return true}}
  if(S.upd&&cur>=S.upd.v)S.upd=null;return false})}
async function loadBuilds(){try{const r=await fetch("https://api.github.com/repos/jack07lion-a11y/kitobkhona-/releases?per_page=15");if(!r.ok)return null;const j=await r.json();let best=null;
 for(const x of j){const m=/^apk-(\d+)$/.exec(x.tag_name||"");if(!m||x.draft)continue;const a=(x.assets||[]).find(y=>/\.apk$/.test(y.name));if(!a)continue;const v=+m[1];if(!best||v>best.v)best={v,url:a.browser_download_url,date:x.published_at||x.created_at}}return best}catch(_){return null}}
async function loadRelAdmin(){if(!canPerm("release"))return;S.webLast=await webLatest();const[,b]=await Promise.all([loadRelease(),loadBuilds()]);S.rb=b;S.rbDone=true;if(S.view==="me"&&(S.sheet==="admrel"||!S.sheet))render()}
const relNew=()=>!!(S.rb&&S.rb.v>((S.rel&&S.rel.version)||0));

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
 const nw=await loadNewsOnce();if(nw){let seen=0;try{seen=+(localStorage.getItem("kitob_news")||0)}catch(_){}if(seen&&nw.id>seen)out.push("Хабар: "+nw.title);if(nw.id>seen)try{localStorage.setItem("kitob_news",String(nw.id))}catch(_){}}
 return out.length?out:["Ҳама чиз нав аст"]}

/* ---- пайвасти тугмаҳо: update (аз bind() даъват мешавад) ---- */
function bindUpdate($$){
 $$("[data-upd-go]",b=>b.onclick=()=>{const A=window.KitobAndroid;if(!A||!A.downloadUpdate||!S.upd)return;S.updSt="down";S.updP=0;render();try{A.downloadUpdate(S.upd.url)}catch(_){S.updSt="err";render()}});
 $$("[data-upd-install]",b=>b.onclick=()=>{const A=window.KitobAndroid;let r="err";try{r=A.installUpdate()}catch(_){}
  if(r==="perm")toast("Иҷозат диҳед ва баргашта аз нав пахш кунед");else if(r!=="ok"){S.updSt="err";render()}});
 $$("[data-updno]",b=>b.onclick=()=>{S.updNo=S.upd&&S.upd.v;render()});
 $$("[data-rel-pub]",b=>b.onclick=async()=>{if(!S.rb||!confirm("Ҳамаро навсозӣ мекунед?"))return;const c=await sbLoad();if(!c){toast("Интернет нест");return}
  try{const{error}=await c.rpc("publish_release",{p_version:+b.dataset.relPub,p_url:S.rb.url});if(error){toast("Иҷозат дода нашуд. Аввал SQL-ро иҷро кунед");return}await loadRelease();toast("Нашр шуд");render()}catch(_){toast("Интернет нест ё сервер ҷавоб намедиҳад")}});
 $$("[data-rel-stop]",b=>b.onclick=async()=>{if(!confirm("Навсозиро қатъ мекунед? Баннер намеояд"))return;const c=await sbLoad();if(!c)return;
  try{const{error}=await c.rpc("publish_release",{p_version:0,p_url:null});if(error){toast("Иҷозат дода нашуд");return}await loadRelease();toast("Қатъ шуд");render()}catch(_){toast("Интернет нест")}});
}
