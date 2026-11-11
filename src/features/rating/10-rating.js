/* ---- Рейтинг: китобхонҳои беҳтарин (дақиқаҳои хондан, ҳамаи вақт) ----
   Сервер: docs/sql-reyting.sql (leaderboard, my_rank, set_rating_visible).
   Нишон: тугмаи доира дар боло (ҷои шумо), саҳифаи рейтинг (Top 10), варақаи профили китобхон, доираи «Рейтинг» дар Озмун. */
const RT_TOP=10;
const RT_TROPHY='<path d="M8 4h8v5a4 4 0 01-8 0zM8 6H5a3 3 0 003 4M16 6h3a3 3 0 01-3 4M12 13v4M9 20h6"/>';
const fmtNum=n=>String(Math.round(+n||0)).replace(/\B(?=(\d{3})+(?!\d))/g," ");
const fmtDur=sec=>fmtNum(Math.floor((+sec||0)/60))+" дақ";   // 0 дақиқа ҳам «0 дақ» (ҳамаи ҳисобҳо рейтингда)
const fmtDurLong=sec=>{const m=Math.floor((+sec||0)/60),h=Math.floor(m/60);return h?fmtNum(h)+" соат "+(m%60)+" дақиқа":m+" дақиқа"};
const ratingList=()=>(S.rt&&S.rt.list)||S.rtCache||[];

/* тугмаи доира: ҷои корбар (1, 2, 3 — тиллоӣ, нуқра, биринҷӣ); ҳеҷ гоҳ 0 нест — ҷой набошад, ҷоми ғолибӣ */
function ratingBadge(){const p=+((S.myRank||{}).pos)||0,cls=p===1?" g":p===2?" s":p===3?" b":"";
 const inner=p?`<b class="rb-n${p>=100?" sm":""}${p>=1000?" xs":""}">${p}</b>`:`<span class="rb-i">${P(RT_TROPHY,2.1)}</span>`;
 return `<button class="round rbadge${cls}" data-rating aria-label="${p?"Рейтинг: ҷои "+p:"Рейтинг"}">${inner}</button>`}
function paintBadge(){const e=document.querySelector(".rbadge");if(!e)return;
 const t=document.createElement("div");t.innerHTML=ratingBadge();const n=t.firstChild;n.onclick=openRating;e.replaceWith(n)}

function ratingView(){
 const T=S.rt||{},L=ratingList();
 let body="";
 if(!S.uid)body=`<div class="empty-card"><span class="round">${P(RT_TROPHY,2)}</span><div><b>Барои дидани рейтинг ворид шавед</b><span>Бо почтаи худ ворид шавед: рамз ба почта меояд, парол лозим нест</span><button class="pill" data-go="login" style="margin-top:10px">Ворид шудан</button></div></div>`;
 else{
  if(!L.length&&T.busy)body=skel();
  else if(!L.length&&T.err)body=`<div class="empty-card"><span class="round">${P(RT_TROPHY,2)}</span><div><b>Рейтинг боргирӣ нашуд</b><span>Интернетро санҷед ва аз нав кӯшиш кунед</span><button class="pill" data-rt-retry style="margin-top:10px">Аз нав</button></div></div>`;
  else if(!L.length)body=`<div class="empty-card"><span class="round">${P(RT_TROPHY,2)}</span><div><b>Рейтинг ҳоло холӣ аст</b><span>Ҳисобҳо ба қайд гирифта шавад, рӯйхат пайдо мешавад</span></div></div>`;
  else body=`<div class="rt-list">${L.map(rtRow).join("")}</div>${T.err?`<p class="hint">Интернет нест. Рӯйхати охирин нишон дода шуд.</p>`:""}`;
  body+=rtMe()}
 return `<section class="screen pad rt"><div class="rt-top"><button class="round" data-back aria-label="Бозгашт">${P('<path d="M15 5l-7 7 7 7"/>',2.2)}</button><h1>Рейтинг</h1></div>
  <p class="rt-sub">Дақиқаҳои хондан дар ҳамаи вақт. Баробар бошад, аввал рӯйхат гузашта баландтар аст.</p>${body}</section>`}
function rtRow(e,i){const p=e.pos;
 return `<button class="rt-row${p<=3?" m"+p:""}" data-rt-user="${i}"><span class="rt-pos">${p}</span><span class="rt-av">${avInner(e.avatar)}</span><span class="rt-nm"><b>${escH(e.name)}</b><small>${fmtDur(e.sec)}</small></span><span class="rt-ch">${P(I.chev,2.2)}</span></button>`}
/* карточкаи «Ҷои шумо» дар поёни саҳифа */
function rtMe(){const r=S.myRank||{},p=+r.pos||0;
 if(r.hidden)return `<div class="rt-me mut"><div><b>Шумо дар рейтинг нишон дода намешавед</b><span>${fmtDurLong(r.sec||0)} хондаед</span></div><button class="pill" data-rt-vis>Нишон додан</button></div>`;
 if(!p)return `<div class="rt-me mut"><div><b>Ҷои шумо ҳоло маълум нест</b><span>Профили шумо тайёр шавад, ҷой пайдо мешавад</span></div></div>`;
 return `<div class="rt-me${p<=3?" m"+p:""}"><span class="rt-pos">${p}</span><div><b>Ҷои шумо</b><span>${fmtDurLong(r.sec)} · аз ${fmtNum(r.n||p)} нафар</span></div></div>`}

/* варақаи профили китобхон (бо ангушт аз поён мебарояд) */
SHEETS.ruser=X=>{const e=S.ru;if(!e)return "";const p=e.pos,m=p<=3?" m"+p:"";
 return `<div class="sh-head"><b class="sh-t">Китобхон</b>${X}</div>
 <div class="ru"><div class="ru-av${m}">${avInner(e.avatar)}</div><h2>${escH(e.name)}</h2><div class="ru-pos${m}">${P(RT_TROPHY,2)}Ҷои ${p}</div>
 <div class="ru-st"><div><b>${fmtNum(Math.floor(e.sec/60))}</b><small>дақиқа</small></div><div><b>${fmtDurLong(e.sec)}</b><small>хондааст</small></div></div>
 ${e.bio?`<p class="ru-bio">${escH(e.bio)}</p>`:`<p class="ru-bio mut">Маълумот ҳанӯз навишта нашудааст</p>`}</div>`};

function openRating(){cxClose();if(S.view!=="rating"){S.prev=S.view;S.prevSearch=S.search}
 S.view="rating";S.search=false;S.sheet=null;render();window.scrollTo(0,0);loadRating(true)}
async function loadMyRank(c){try{if(!S.uid||!navigator.onLine)return;c=c||await sbLoad();if(!c)return;
 const{data,error}=await c.rpc("my_rank");if(error||!data)return;S.myRank=data;save();paintBadge()}catch(_){}}
async function loadRating(force){const T=S.rt=S.rt||{};if(!S.uid||T.busy)return;if(!force&&T.at&&Date.now()-T.at<30000)return;
 T.busy=true;if(S.view==="rating"&&!ratingList().length)render();
 try{const c=await sbLoad();if(!c||!navigator.onLine)throw 0;const{data,error}=await c.rpc("leaderboard",{p_limit:RT_TOP});if(error||!Array.isArray(data))throw 0;
  T.list=data.map(x=>({pos:+x.pos,name:String(x.name||""),avatar:x.avatar||"",bio:x.bio||"",sec:+x.sec||0}));T.at=Date.now();T.err=false;S.rtCache=T.list;save()}
 catch(_){T.err=true}finally{T.busy=false}
 if(S.view==="rating")render();loadMyRank()}
async function toggleRatingVisible(){const show=!!(S.myRank&&S.myRank.hidden);
 try{const c=await sbLoad();if(!c)throw 0;const{error}=await c.rpc("set_rating_visible",{p_show:show});if(error)throw error;
  S.myRank=Object.assign({},S.myRank,{hidden:!show});save();toast(show?"Шумо дар рейтинг нишон дода мешавед":"Шумо дар рейтинг нишон дода намешавед");
  S.rt=null;if(S.view==="rating"){loadRating(true)}else render();loadMyRank(c)}
 catch(_){toast("Нашуд. Интернетро санҷед ва аз нав кӯшиш кунед")}}
function bindRating($$){
 $$("[data-rating]",b=>b.onclick=openRating);
 $$("[data-rt-user]",b=>b.onclick=()=>{const e=ratingList()[+b.dataset.rtUser];if(e){S.ru=e;S.sheet="ruser";render()}});
 $$("[data-rt-vis]",b=>b.onclick=toggleRatingVisible);
 $$("[data-rt-retry]",b=>b.onclick=()=>loadRating(true))}
setInterval(()=>{if(document.visibilityState==="visible"&&S.uid){loadMyRank();if(S.view==="rating"&&!S.sheet)loadRating()}},180000);
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible"&&S.uid)loadMyRank()});
