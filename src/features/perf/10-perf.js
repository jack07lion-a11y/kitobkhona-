/* ---- Суръат ва мувофиқшавӣ ба телефон ----
   Се дараҷа: high (пурра), mid (миёна), low (сабук). Дар <html data-perf="…"> гузошта мешавад; намоиш: perf/20-perf.css.
   1) Тахмини аввалия аз сахтафзор (хотира, ядроҳо, Android API): ҳанӯз пеш аз расмкашии аввал.
   2) Ченаки воқеӣ: агар кадрҳо ҳангоми сплэш, гардонидан ё хондан бурида шаванд (аксар кадрҳо >40 мс), дараҷа як зина паст мешавад ва нигоҳ дошта мешавад. Худ ба боло намеравад.
   3) Дастӣ: Танзимот → «Суръати барнома»: Худкор / Сабук / Миёна / Пурра. «Худкор» ҳисобро аз нав оғоз мекунад.
   Ҳолат дар localStorage калити kitob_perf (на дар S, то ки ҳар save() онро ҳамроҳ накунад). */
const PERF_KEY="kitob_perf",PERF_T=["low","mid","high"];
let PF={m:"auto",a:null,n:0};   // m: интихоби дастӣ (auto|low|mid|high), a: дараҷаи худкор, n: чанд маротиба паст шуд
try{const o=JSON.parse(localStorage.getItem(PERF_KEY)||"null");if(o&&typeof o==="object")PF=Object.assign(PF,o)}catch(_){}
/* g={mem,cores,touch,save,sdk,ua} → 0 low, 1 mid, 2 high. Тоза (бе ҷаҳони берун) — барои санҷиш. */
function perfEstimate(g){
 const ua=g.ua||"",ios=/iPhone|iPad|iPod/.test(ua)||(/Macintosh/.test(ua)&&(+g.touch||0)>1);
 if(ios)return g.cores&&g.cores<=2?1:2;                    // iPhone/iPad: ҳамеша қавӣ
 const mem=+g.mem||0,cores=+g.cores||0,sdk=+g.sdk||0;let s=2;
 if(g.save)s=Math.min(s,1);                                 // «сарфаи трафик» дар телефон
 if(mem){if(mem<=2)s=0;else if(mem<=4)s=Math.min(s,1)}      // deviceMemory: тахминан 0.25…8 ГБ
 if(cores){if(cores<=2)s=0;else if(cores<=4)s=Math.min(s,mem&&mem<=3?0:1);else if(cores<=6&&!mem)s=Math.min(s,1)}
 if(sdk){if(sdk<=27)s=0;else if(sdk<=29)s=Math.min(s,1)}    // Android 8.1 ва кӯҳнатар — сабук; Android 9–10 — аз миёна боло не
 return s}
function perfSignals(){const n=navigator,o={mem:n.deviceMemory,cores:n.hardwareConcurrency,touch:n.maxTouchPoints,ua:n.userAgent,save:!!(n.connection&&n.connection.saveData),sdk:0};
 try{const A=window.KitobAndroid;if(A&&A.deviceInfo)o.sdk=+JSON.parse(A.deviceInfo()||"{}").sdk||0}catch(_){}   // UA-и Chrome версияи Android-ро намедиҳад, аз ин рӯ фақат аз APK
 return o}
const perfManual=()=>PERF_T.includes(PF.m);
const perfTier=()=>perfManual()?PF.m:(PERF_T.includes(PF.a)?PF.a:"high");
const perfLite=()=>perfTier()!=="high";   // миёна ва сабук: бе шишаи нимшаффоф ва ҳаракатҳои вазнин
const perfLow=()=>perfTier()==="low";
function perfSave(){try{localStorage.setItem(PERF_KEY,JSON.stringify(PF))}catch(_){}}
function perfApply(){document.documentElement.dataset.perf=perfTier()}
/* Оғоз: тахмин. Агар пештар ченак паст карда бошад, аз он болотар намеравем. */
(function(){const e=PERF_T[perfEstimate(perfSignals())],i=PERF_T.indexOf(PF.a);PF.a=i>=0?PERF_T[Math.min(i,PERF_T.indexOf(e))]:e;perfSave();perfApply()})();

/* Ченаки кадрҳо: 1.6–2 сония дар вақти гардонидан. 2 «зарбаи» пай дар пай → як зина паст. */
let PW=0,PS=0,PWT=0,PWN=0;
function perfDown(){if(perfManual())return;const i=PERF_T.indexOf(perfTier());if(i<=0)return;PF.a=PERF_T[i-1];PF.n=(PF.n||0)+1;PS=0;perfSave();perfApply()}
function perfStrike(){if(perfManual()||perfTier()==="low")return;PS++;if(PS>=2)perfDown()}
function perfJudge(n,jk,lg){if(n<18)return;if(jk/n>=.3||lg>=3)perfStrike();else PS=0}
function perfWatch(ms){if(PW||perfManual()||perfTier()==="low"||PWN>=40||document.visibilityState!=="visible")return;
 PWN++;let last=0,n=0,jk=0,lg=0;const t0=performance.now();
 PW=requestAnimationFrame(function f(now){
  if(last){const d=now-last;if(d<1000){n++;if(d>=40)jk++;if(d>=120)lg++}}last=now;
  if(now-t0<(ms||1700)&&document.visibilityState==="visible"){PW=requestAnimationFrame(f);return}
  PW=0;perfJudge(n,jk,lg)})}
addEventListener("scroll",()=>{const t=Date.now();if(t-PWT>5000){PWT=t;perfWatch(1700)}},{passive:true,capture:true});
addEventListener("touchstart",()=>{const t=Date.now();if(t-PWT>5000){PWT=t;perfWatch(1700)}},{passive:true,capture:true});
afterSplash(()=>setTimeout(()=>perfWatch(2000),1200));

/* Танзимот → «Суръати барнома» */
function perfCtl(){const m=perfManual()?PF.m:"auto",O=[["auto","Худкор"],["low","Сабук"],["mid","Миёна"],["high","Пурра"]],
  N={auto:"Худкор: барнома телефонро ҳуди худ месанҷад ва ба он мувофиқ мешавад.",low:"Сабук: ҳаракатҳо ва шишаи нимшаффоф хомӯш, барои телефонҳои суст.",mid:"Миёна: шишаи нимшаффоф хомӯш, ҳаракатҳои асосӣ мемонанд.",high:"Пурра: ҳамаи ҳаракатҳо ва зебоӣ, барои телефонҳои қавӣ."};
 return `<p class="set-cap">Суръати барнома</p><div class="thg" role="radiogroup" aria-label="Суръати барнома">${O.map(([k,n])=>`<button class="thb pf-b ${m===k?"on":""}" data-perf-set="${k}" role="radio" aria-checked="${m===k}">${n}</button>`).join("")}</div><p class="set-note">${N[m]}</p>`}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-perf-set]");if(!b)return;const k=b.dataset.perfSet;
 if(k==="auto"){PF.m="auto";PF.a=PERF_T[perfEstimate(perfSignals())];PF.n=0;PS=0;PWN=0}else PF.m=k;
 perfSave();perfApply();render()});
