/* Supabase: Project URL ва anon key. Холӣ бошад — реҷаи намуна (demo). */
const OTPN=8,RESEND_SEC=60;
const SB_URL="https://hxtpmwxglfuabdvaeapj.supabase.co",SB_KEY="sb_publishable_hnpY6mKTu9ahVxjIbcKvkQ_gjv0tb39";
let sb=null;
async function sbSend(e){const c=await sbLoad();
 if(c){const{error}=await c.auth.signInWithOtp({email:e,options:{shouldCreateUser:true}});
  if(error)return/rate|limit|seconds/i.test(error.message)?"Каме сабр кунед ва аз нав кӯшиш кунед":"Хатоги рӯй дод. Баъдтар аз нав кӯшиш кунед";return""}
 return SB_URL?"Интернет нест ё сервер ҷавоб намедиҳад":""}
function sbLoad(){return new Promise(r=>{if(!SB_URL||!SB_KEY)return r(null);if(sb)return r(sb);
 const mk=()=>{try{sb=window.supabase.createClient(SB_URL,SB_KEY,{auth:{persistSession:true,autoRefreshToken:true}})}catch(e){sb=null}r(sb)};
 const load=(src,fail)=>{const t=document.createElement("script");t.src=src;t.onload=mk;t.onerror=fail;document.head.appendChild(t)};
 load("lib/supabase.min.js",()=>load("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js",()=>r(null)))})}
const escH=v=>String(v).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[c]);
const okMail=e=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
const IN_APK=!!window.KitobAndroid;
const BOOKS=IN_APK?[
 {id:900001,slug:"sadriddin-ayni-yoddoshtho",t:"Ёддоштҳо",a:"Садриддин Айнӣ",c:"fiction",col:["#1f4f7a","#123352"],audio:false,desc:"Хотираҳои Садриддин Айнӣ дар бораи кӯдакӣ, деҳа ва замони худ. 142 боб дар 4 қисм.",local:true,src:"books/yoddoshtho/book.json.gz",size:"0,8 МБ",cover:"books/yoddoshtho/cover.jpg"}
]:[];
const LOCALS=BOOKS.slice();
/* audio фақат вақте кор мекунад, ки админ байроқи «audio»-ро фурӯзон кардааст (docs/sql-bayroq.sql); au0 = қимати хоми база */
function mkAud(b){const raw=b.au0!==undefined?!!b.au0:!!b.audio;Object.defineProperty(b,"au0",{value:raw,writable:true,enumerable:true,configurable:true});
 Object.defineProperty(b,"audio",{get(){return !!this.au0&&FEAT("audio")},set(v){this.au0=!!v},enumerable:true,configurable:true})}
BOOKS.forEach(mkAud);


const PARAS=[
 "Ин матни намуна аст. Дар нусхаи аслӣ дар ин ҷо матни пурраи китоб меистад. Мо онро танҳо барои санҷидани экрани хондан гузоштем.",
 "Китоб дӯсти беминнати инсон аст. Ҳар саҳифае, ки мехонем, ба мо як ҷаҳони нав мекушояд. Хонандаи доно аз ҳар сатр як дарс мегирад ва онро дар зиндагӣ ба кор мебарад.",
 "Бобоёни мо китобро азиз медоштанд. Онҳо дар шабҳои дарози зимистон дар гирди оташдон менишастанд ва достонҳои қаҳрамононро бо овози баланд мехонданд. Кӯдакон бошанд, бо чашмони пурзавқ гӯш медоданд.",
 "Имрӯз китоб ба телефони мо омадааст. Акнун дар роҳ, дар автобус ё пеш аз хоб метавонем чанд саҳифа хонем. Ҳатто бе интернет китоби боргирифта ҳамеша бо мост.",
 "Ҳар рӯз каме хондан одати хуб аст. Агар рӯзе бист дақиқа хонем, дар як сол даҳҳо китобро тамом мекунем. Хондани мунтазам одати хуб аст.",
 "Барои саҳифаи нав канори рости экранро пахш кунед ё саҳифаро бо ангушт ба чап кашед. Барои бозгашт канори чапро пахш кунед."
];
const CHN=["Сарсухан","Боби якум","Боби дуюм","Боби сеюм"];
function chapters(b){return CHN.map((n,i)=>({n,ps:[0,1,2,3,4].map(j=>PARAS[(i*2+j)%PARAS.length])}))}
function tracks(b){const n=3+b.id%3;return Array.from({length:n},(_,i)=>({n:i?`Боби ${i}`:"Сарсухан",d:150+(b.id*37+i*53)%420}))}
const bk=id=>BOOKS.find(x=>x.id===id);
async function loadBooks(c){try{const{data,error}=await c.from("books").select("*").order("id");if(error||!data)return;
 const cp=data.map(r=>r.cover_path).filter(Boolean);let urls={};
 if(cp.length){try{const{data:su}=await c.storage.from("books").createSignedUrls(cp,604800);(su||[]).forEach(x=>{if(x.signedUrl)urls[x.path]=x.signedUrl})}catch(_){}}
 BOOKS.length=0;LOCALS.forEach(b=>BOOKS.push(b));const sl=new Set(data.map(x=>x.slug).filter(Boolean));for(let i=BOOKS.length-1;i>=0;i--)if(BOOKS[i].local&&BOOKS[i].slug&&sl.has(BOOKS[i].slug))BOOKS.splice(i,1);data.forEach(r=>BOOKS.push({id:+r.id,t:r.t,a:r.a,c:r.c,col:[r.col1,r.col2],audio:!!r.audio,prem:!!r.premium,ebook:r.ebook!==false,desc:r.descr||"",db:true,pub:r.published!==false,slug:r.slug||"",tp:r.text_path||"",cover:urls[r.cover_path]||"",rs:r.rights_status||"",rh:r.rights_holder||"",src2:r.source||"",ed:r.edition||"",tr:r.translator||"",ln:r.license_note||""}));BOOKS.forEach(mkAud);
S.bkCache=BOOKS.filter(b=>b.db).map(b=>({...b}));save();
 S.recent=S.recent.filter(id=>bk(id))}catch(_){}}
async function loadRole(c){S.role="";try{const{data:s}=await c.auth.getSession();const u=s.session?.user;if(!u)return;
 const{data}=await c.from("profiles").select("role").eq("id",u.id).maybeSingle();S.role=data?.role==="admin"?"admin":data?.role==="subadmin"?"subadmin":""}catch(_){}}
async function loadFlags(c){try{const{data,error}=await c.from("app_flags").select("*").eq("id",1).maybeSingle();if(!error&&data){const v=data.premium_on===true,m=+data.min_native||0;let ch=false;if(S.flags.premium!==v){S.flags.premium=v;ch=true}if((S.flags.min||0)!==m){S.flags.min=m;ch=true}const ft=data.feat&&typeof data.feat==="object"?data.feat:{};if(JSON.stringify(S.flags.feat||{})!==JSON.stringify(ft)){S.flags.feat=ft;ch=true}const bk=data.backup_at?+new Date(data.backup_at):0;if(bk&&(S.flags.bk||0)!==bk){S.flags.bk=bk;ch=true}const wp=data.web_pub||"";if((S.flags.webPub||"")!==wp){S.flags.webPub=wp;ch=true}if(ch){save();if(S.view!=="login")render()}}}catch(_){}checkMin();webUpdCheck()}
async function loadStats(){if(S.role!=="admin"&&S.role!=="subadmin")return;try{const c=await sbLoad();if(!c)return;const{data,error}=await c.rpc("user_stats");if(error||!data)return;S.stats=data;
  const set=(k,v)=>{const e=document.getElementById("st_"+k);if(e)e.textContent=v};set("admin",data.admins);set("sub",data.subadmins);set("user",data.users);set("all",data.total);
  const{data:r}=await c.rpc("stats_summary");if(r){S.rs=r;set("dau",r.dau);set("wau",r.wau);set("mt",fmtT(r.sec_today));set("m7",fmtT(r.sec_7d))}loadFunnel(c)}catch(_){}}
async function syncServer(){const c=await sbLoad();if(!c)return;trackInstall(c);await loadBooks(c);await loadRole(c);await loadPerms(c);await loadFlags(c);await loadProfile(c);await loadPremium(c);await syncState(c,true);flushConsent(c);checkConsent(c);loadStats();save();await markHave();loadNotifCfg();if(S.view!=="login")render();pushNotifyCfg();tryRef();flushReports();flushErrs();sendRead();trackActive();bkCheck();if(canPerm("release"))loadRelAdmin();if(S.role==="admin"){loadStaff();if(/[?&]doira\b/.test(location.search))cxEditOn()}}
const TX={};
function txChapters(b){const d=TX[b.id];if(!d)return null;if(d._ch)return d._ch;const out=[];(d.parts||[]).forEach(pt=>(pt.chapters||[]).forEach((c,i)=>out.push({n:c.title||"",part:i===0?pt.title||"":"",bl:c.blocks||[]})));return d._ch=out}
async function gunzipJSON(blob){const st=blob.stream().pipeThrough(new DecompressionStream("gzip"));return JSON.parse(await new Response(st).text())}
const bpath=b=>b&&(b.tp||b.src);
const cacheOK=()=>typeof caches!=="undefined";
async function cacheGet(k){try{if(!cacheOK())return null;return await (await caches.open("kitob-books")).match(k)}catch(_){return null}}
async function cachePut(k,r){try{if(cacheOK())await (await caches.open("kitob-books")).put(k,r)}catch(_){}}
async function haveBook(b){if(S.hv&&S.hv[b.id])return true;return !!(await cacheGet("https://kitob.local/"+bpath(b)))}
async function markHave(){let ch=false;for(const b of BOOKS)if(bpath(b)){const h=await haveBook(b);if(h!==!!b.have){b.have=h;ch=true}}if(ch&&S.view!=="login"&&S.view!=="read")render()}
async function readAsset(b){
 if(window.KitobAndroid){const bin=atob(window.KitobAndroid.asset(b.src)),u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);return new Blob([u])}
 const rs=await fetch(b.src);if(!rs.ok)throw new Error("asset");return await rs.blob()}
const DLP={};
async function fetchProg(url,onP){const rs=await fetch(url);if(!rs.ok)throw new Error("net");const tot=+rs.headers.get("content-length")||0,out=[];let got=0;
 if(!rs.body||!rs.body.getReader){const bl=await rs.blob();onP&&onP(99);return bl}
 const rd=rs.body.getReader();for(;;){const{done,value}=await rd.read();if(done)break;out.push(value);got+=value.length;
  onP&&onP(Math.min(99,tot?Math.round(got/tot*100):Math.round(got/(got+250000)*90)))}
 return new Blob(out)}
function setDLP(id,p){if(p==null)delete DLP[id];else DLP[id]=p;
 document.querySelectorAll(`.bd-btn[data-read="${id}"],[data-dlbook="${id}"]`).forEach(e=>{
  if(e.classList.contains("bd-btn")){e.classList.toggle("ing",p!=null);if(p==null)e.style.removeProperty("--p");else{e.style.setProperty("--p",p+"%");const l=e.querySelector(".lb");if(l)l.textContent="Боргирӣ… "+p+"%"}}
  else if(p!=null){e.classList.add("ing");e.innerHTML="<small>"+p+"%</small>"}else e.classList.remove("ing")})}
async function fetchBook(b){if(DLP[b.id]!=null)return false;setDLP(b.id,0);try{return await loadText(b,p=>setDLP(b.id,p))}finally{setDLP(b.id,null)}}
async function loadText(b,onP){if(TX[b.id])return true;const key="https://kitob.local/"+bpath(b);
 try{let blob=null;const hit=await cacheGet(key);if(hit)blob=await hit.blob();
  if(!blob&&b.src){blob=await readAsset(b);await cachePut(key,new Response(blob))}
  if(!blob){const c=await sbLoad();if(!c)return false;let data=null;try{const{data:su}=await c.storage.from("books").createSignedUrl(b.tp,3600);if(su&&su.signedUrl)data=await fetchProg(su.signedUrl,onP)}catch(_){data=null}
   if(!data){const r=await c.storage.from("books").download(b.tp);if(r.error||!r.data)return false;data=r.data}
   blob=data;await cachePut(key,new Response(data))}
  TX[b.id]=await gunzipJSON(blob);b.have=true;if(b.src){S.hv=S.hv||{};S.hv[b.id]=true;save()}return true}catch(_){return false}}
function fmtPill(b,mini){const bits=[],T=mini?"span":"button",at=(txt,lab)=>mini?"":` data-fmt="${txt}" aria-label="${lab}"`,sz=mini?1.9:1.9;
 if(b.ebook!==false)bits.push(`<${T}${at("Шакли электронӣ: китобро дар барнома мехонед","Шакли электронӣ")}>${P('<path d="M3 5c3-1.500 6-1.500 9 0v14c-3-1.500-6-1.500-9 0zM21 5c-3-1.500-6-1.500-9 0v14c3-1.500 6-1.500 9 0z"/>',sz)}</${T}>`);
 if(b.audio)bits.push(`<${T}${at("Аудиокитоб: китобро гӯш мекунед","Аудиокитоб")}>${P(I.head,sz)}</${T}>`);
 if(b.prem&&PREM())bits.push(`<${T} class="pr"${at("Премиум: пурра хондан бо обуна","Премиум")}>${CROWN}</${T}>`);
 return bits.length?`<div class="fmt${mini?" sm":""}"${mini?"":' role="group" aria-label="Шаклҳои китоб"'}>${bits.join("")}</div>`:""}