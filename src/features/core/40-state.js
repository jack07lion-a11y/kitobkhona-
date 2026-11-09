setInterval(()=>{if(S.view==="me"&&!S.sheet&&document.visibilityState==="visible")loadStats()},8000);
window.__upd=(p,st)=>{S.updSt=st;S.updP=p;if(st==="down"){const el=document.querySelector(".upd-bar");if(el)el.style.setProperty("--p",p+"%");const sp=document.querySelector(".upd-sub");if(sp)sp.textContent="Боргирӣ… "+p+"%"}else render()};
let S={view:"login",step:"email",email:"",uname:"",uid:"",chip:"all",q:"",ptab:0,search:false,recent:[],prog:{},confirmOut:false,pref:{fs:16,th:"sepia",ff:"serif",v2:1},pages:{},marks:{},mode:{},aprog:{},apos:{},dl:{},dlBook:{},premium:false,sheet:null,tocTab:0,au:null};
/* «Тез кунда» байроқчаҳо: app_flags.feat (админ аз барнома идора мекунад; пешфарз ҳама хомӯш). Калидҳо: docs/sql-bayroq.sql */
const FEAT=k=>!!(S.flags&&S.flags.feat&&S.flags.feat[k]===true);
const FEATS=[["audio","Аудиокитоб","Плеер (ҳоло намуна аст)"],["buy","Харид / обуна","Тугмаи обуна ва нарх"],["contest","Озмун: ИФМ, Фурӯғ, Баҳс","Саҳифаҳои озмун"],["coin","Тавозуни хирад","Нишондиҳандаи танга"],["rank","Рейтинг ва мақом","Ҷойи шумо дар Озмун"],["social","Баҳо ва фикри корбарон","Рейтинг ва шарҳ дар китоб"],["ai","Ёрдамчии китоб (АИ)","Савол додан аз рӯи китоб"],["quiz","Санҷиши донишҳо","Озмуни санҷишӣ"],["teacher","Кабинети муаллим","Гурӯҳ ва топшириқ"]];
const app=document.getElementById("app");
try{const o=JSON.parse(localStorage.getItem("kitob10")||"null");if(o){Object.assign(S,o);S.upd=null;S.updSt="";S.updP=0;S.staff=null;S.sheet=null;S.loading=false;if(S.au)S.au.playing=false}}catch(e){}
if(["read","audio","book"].includes(S.view))S.view="home";S.au=null;if(!S.rdCh)S.rdCh={};if(!S.rdFr)S.rdFr={};if(!S.lib)S.lib={q:[],d:[],c:[]};if(!S.flags)S.flags={premium:false};if(!S.pref.v2){S.pref.fs=16;S.pref.v2=1}S.pref.fs=Math.max(13,Math.min(28,Math.round((S.pref.fs-13)/3)*3+13));S.rdUI=false;if(Array.isArray(S.bkCache))S.bkCache.forEach(b=>{if(b&&b.id&&!BOOKS.some(x=>x.id===b.id))BOOKS.push(b)});BOOKS.forEach(mkAud);S.premium=!!(S.pu&&S.pu>Date.now());if(!S.pref.lh)S.pref.lh=1.6;
/* Вақти тағйири токчаҳо ва хатчӯбҳо (барои ҳалли ихтилоф дар синхронизатсия, docs/sql-holat.sql) */
const hasAny=o=>{try{const j=JSON.stringify(o);return !!j&&!/^(\{\}|\[\]|null|\{"q":\[\],"d":\[\],"c":\[\]\})$/.test(j)}catch(_){return false}};
function stamp(){const a=JSON.stringify(S.lib),b=JSON.stringify(S.marks);
 if(S._lh===undefined||S._mh===undefined){S._lh=a;S._mh=b;if(S.libT===undefined)S.libT=hasAny(S.lib)?Date.now():0;if(S.marksT===undefined)S.marksT=hasAny(S.marks)?Date.now():0;return}
 if(a!==S._lh){S._lh=a;S.libT=Date.now()}if(b!==S._mh){S._mh=b;S.marksT=Date.now()}}
function save(){stamp();try{localStorage.setItem("kitob10",JSON.stringify({...S,sheet:null,loading:false}))}catch(e){}}
const esc=s=>s.replace(/"/g,"&quot;");