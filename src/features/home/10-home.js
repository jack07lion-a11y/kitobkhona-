/* ---- Асосӣ: қисмҳои тақсимшуда (Ҳама / Барои шумо / Нав / жанр) ---- */
const bookN=b=>{let h=book(b);if(!isNewB(b))return h;h=h.replace('class="book"','class="book isnew"');const k=h.lastIndexOf("</button>");return h.slice(0,k)+'<span class="nw">НАВ</span>'+h.slice(k)};
function homeChips(){
 const hf=S.hf||"all",nn=unseenNew().length,gs=GENRES.filter(g=>BOOKS.some(x=>x.c===g[0]));
 const L=[["all","Ҳама"],["foryou","Барои шумо"]];if(newBooks().length)L.push(["new","Нав",nn]);
 gs.forEach(g=>L.push([g[0],g[1]]));if(FEAT("audio")&&BOOKS.some(x=>x.audio))L.push(["audio","Аудио дар роҳ"]);
 return `<div class="chips hchips">${L.map(([k,n,c])=>`<button class="chip ${hf===k?"on":""}" data-hf="${k}">${n}${c?`<b class="cnt">${c}</b>`:""}</button>`).join("")}</div>`}
function newsBanner(){
 const u=unseenNew();if(!u.length)return "";const all=newBooks(),cnt={};all.forEach(b=>cnt[b.c]=(cnt[b.c]||0)+1);
 const sum=GENRES.filter(g=>cnt[g[0]]).sort((a,b)=>cnt[b[0]]-cnt[a[0]]).slice(0,2).map(g=>`<span>${g[1]}</span> <b>${cnt[g[0]]}</b>`).join(" · ");
 const fan=all.slice(0,3).map(b=>{const cu=(b.cp&&CVU[b.cp])||b.cover;return cu?`<img src="${escH(cu)}" alt="">`:`<span class="nfc" style="background:linear-gradient(135deg,${escH((b.col&&b.col[0])||"#24443a")},${escH((b.col&&b.col[1])||"#122a22")})"></span>`}).join("");
 return `<div class="newsb"><button class="nx" data-newx aria-label="Пӯшидан">×</button><div class="nt"><span class="ntag">НАВ</span><h2>Ин ҳафта <b>${all.length}</b> китоби нав</h2><p>${sum}</p><button class="ngo" data-newgo>Дидан ${P(I.chev,2.4)}</button></div><div class="nfan">${fan}</div></div>`}
function gridOf(list,sub,h){return `<div class="sec"><div class="sec-h"><h2>${h}</h2></div>${sub?`<p class="hint">${sub}</p>`:""}${list.length?`<div class="grid">${list.map(bookN).join("")}</div>`:`<p class="empty">Ҳоло китоб нест</p>`}</div>`}
function homeShelf(h,sub,list,go){return `<div class="sec"><div class="sec-h"><h2>${h}</h2><button data-hf="${go}">Ҳама</button></div>${sub?`<p class="hint" style="margin-top:-8px">${sub}</p>`:""}<div class="shelf">${list.map(bookN).join("")}</div></div>`}
function homeBody(){
 if(!BOOKS.length)return `<div class="empty-card"><span class="round">${P('<path d="M3 5c3-1.5 6-1.5 9 0v14c-3-1.5-6-1.5-9 0zM21 5c-3-1.5-6-1.5-9 0v14c3-1.5 6-1.5 9 0z"/>')}</span><div>${S.uid?`<b>Китобҳо ба зудӣ илова мешаванд</b><span>Китобхона ҳоло пурра карда мешавад</span>`:`<b>Барои дидани китобҳо ворид шавед</b><span>Бо почтаи худ ворид шавед: рамз ба почта меояд, парол лозим нест</span><button class="pill" data-go="login" style="margin-top:10px">Ворид шудан</button>`}</div></div>`;
 let hf=S.hf||"all";const gs=GENRES.filter(g=>BOOKS.some(x=>x.c===g[0]));
 if(hf!=="all"&&hf!=="foryou"&&hf!=="new"&&hf!=="audio"&&!gs.some(g=>g[0]===hf))hf=S.hf="all";
 const byTs=(a,b)=>(b.ts||0)-(a.ts||0);
 if(hf==="foryou")return gridOf(reco(24),recoSub(),"Барои шумо");
 if(hf==="new")return gridOf(newBooks(),"Ин ҳафта илова шуд","Китобҳои нав");
 if(hf==="audio")return gridOf(BOOKS.filter(x=>x.audio).sort(byTs),"","Аудио дар роҳ");
 if(hf!=="all"){const g=gs.find(x=>x[0]===hf);return gridOf(BOOKS.filter(x=>x.c===hf).sort(byTs),"",g[1])}
 const nw=newBooks(),rc=reco(10);
 return `${newsBanner()}
   <div class="sec-h" style="margin-bottom:-6px"><h2>Охирин хондаам</h2><span class="demo">${S.recent.length}/10</span></div>
   ${wheelHTML()}
   ${rc.length?homeShelf("Барои шумо",recoSub(),rc,"foryou"):""}
   ${nw.length?homeShelf("Китобҳои нав","Ин ҳафта илова шуд",nw.slice(0,12),"new"):""}
   ${gs.map(g=>homeShelf(g[1],"",BOOKS.filter(x=>x.c===g[0]).sort(byTs).slice(0,10),g[0])).join("")}
   ${BOOKS.some(x=>x.audio)?`<div class="sec"><div class="sec-h"><h2>Аудио дар роҳ</h2><button data-hf="audio">Ҳама</button></div><div class="shelf">${BOOKS.filter(x=>x.audio).slice(0,8).map(book).join("")}</div></div>`:""}
   <div class="sec"><div class="sec-h"><h2>Маҷмӯаҳо</h2></div><div class="hscroll">${GENRES.filter(g=>BOOKS.some(x=>x.c===g[0])).map(([k,n])=>{const bs=BOOKS.filter(x=>x.c===k);return `<button class="colc" data-chip2="${k}"><span class="col-fan">${bs.slice(0,3).map((x,i)=>`<span class="cf cf${i}">${cover(x)}</span>`).join("")}</span><b>${n}</b><em>${bs.length} китоб</em></button>`}).join("")}</div></div>
   <div class="sec"><div class="sec-h"><h2>Муаллифон</h2></div><div class="hscroll">${BOOKS.filter((x,i,a)=>a.findIndex(y=>y.a===x.a)===i).map(x=>{const w=x.a.split(" ");return `<button class="au-c" data-author="${escH(x.a)}"><span class="au-av" style="background:linear-gradient(135deg,${x.col[0]},${x.col[1]})">${w.map(y=>y[0]).slice(0,2).join("")}</span><b>${escH(x.a)}</b><em>${BOOKS.filter(y=>y.a===x.a).length} китоб</em></button>`}).join("")}</div></div>
   `}
function bindHome($$){
 $$("[data-hf]",b=>b.onclick=()=>{S.hf=b.dataset.hf;if(S.hf==="new")markNewSeen();save();render()});
 $$("[data-newgo]",b=>b.onclick=()=>{S.hf="new";markNewSeen();render()});
 $$("[data-newx]",b=>b.onclick=()=>{markNewSeen();render()});
}
function home(){
 const b=BOOKS[0];
 const EMPTY=`<div class="empty-card"><span class="round">${P('<path d="M3 5c3-1.5 6-1.5 9 0v14c-3-1.5-6-1.5-9 0zM21 5c-3-1.5-6-1.5-9 0v14c3-1.5 6-1.5 9 0z"/>')}</span><div><b>Ҳоло китобе нахондаед</b><span>Китобро интихоб кунед ва хониш оғоз мешавад</span></div><button class="pill" data-opensearch>Интихоб</button></div>`;
 if(S.search){
  const q=S.q.trim().toLowerCase();
  const list=BOOKS.filter(x=>(S.chip==="all"||(S.chip==="audio"?x.audio:x.c===S.chip))&&(!q||(x.t+" "+x.a).toLowerCase().includes(q)));
  return `<section class="screen pad"><div class="top"><button class="round" data-closesearch aria-label="Бозгашт">${P('<path d="M15 5l-7 7 7 7"/>')}</button>
   <label class="search" for="q">${P(I.search)}<input id="q" type="search" placeholder="Китоб ё муаллиф" value="${esc(S.q)}"></label></div>
   <div class="chips">${chipList().map(([k,n])=>`<button class="chip ${S.chip===k?"on":""}" data-chip="${k}">${n}</button>`).join("")}</div>
   ${S.loading?skel():`<p class="hint">${list.length} китоб ёфт шуд</p>
   ${list.length?`<div class="grid">${list.map(book).join("")}</div>`:`<p class="empty">Ҳеҷ чиз ёфт нашуд. Калимаи дигарро санҷед.</p>`}`}</section>${tabs()}`;
 }
 return `<section class="screen home pad">
   <div class="top"><div class="brand" translate="no">${LOGO}<span>Китоб<em>хона</em></span></div>${fabHTML()}${ratingBadge()}
    <button class="round" data-opensearch aria-label="Ҷустуҷӯ">${P(I.search)}</button><button class="round" data-sheet="app" aria-label="Танзимот">${P(I.gear)}</button></div>
   ${PREM()&&FEAT("buy")?`<div class="promo hp"><h2>Китобхона Премиум</h2><p>Ҳамаи китобҳои пулакиро бепул хонед</p>
    <button class="cta" data-toast="Харид — қадами оянда">Гузаштан ба Премиум ${P(I.chev,2.4)}</button>
    <svg class="art" viewBox="0 0 150 140" aria-hidden="true"><path d="M50 110l-8-60 28 26 22-44 24 44 26-26-8 60z" fill="#fff" fill-opacity=".92"/><path d="M75 62l5 10 11 1-8 7 2 11-10-6-10 6 2-11-8-7 11-1z" fill="#63d48f"/></svg></div>`:""}
   ${BOOKS.length?homeChips():""}
   ${homeBody()}
   ${S.premium||!PREM()||!FEAT("buy")?"":`<button class="ppill ${S.au?"up":""}" data-paywall>${CROWN}Премиум ${P(I.chev,2.4)}</button>`}
  </section>${tabs()}`;
}

const isDone=id=>S.lib.d.includes(id)||(S.prog[id]||0)>=100;
function goal(){
 const b=S.gender==="boy";
 const cur="Тавозуни хирад";
 return `<section class="screen pad"><h1 class="title">Озмун</h1>
  <div class="empty-card"><span class="gart sm">${COIN_I}</span><div><b translate="no">${cur}</b><span>${FEAT("coin")?"Ин валютаи Китобхона. Бо хондан ҷамъ мекунед.":"Ин валютаи Китобхона. Ба зудӣ кушода мешавад."}</span></div></div>
  ${FEAT("rank")||FEAT("coin")?`<div class="stats">${FEAT("rank")?`<div class="stat"><small>Мақоми шумо</small><b>${S.rankNo||"—"}</b></div>`:""}${FEAT("coin")?`<button class="stat" data-sheet="khirad"><small translate="no">${cur}</small><b>${COIN_I}${S.coins||0}</b></button>`:""}</div>`:`<button class="empty-card" data-sheet="khirad"><span class="round">${P(I.trophy,2)}</span><div><b>Озмун ба зудӣ кушода мешавад</b><span>ИФМ, Фурӯғ ва Баҳс — ҳоло омода мешаванд</span></div></button>`}
  </section>${tabs()}`;
}

function soon(ic,t,p){return `<section class="screen pad"><h1 class="title">${t}</h1><div class="soon"><span class="big">${P(ic,1.8)}</span><h2>Дар қадами оянда</h2><p>${p}</p></div></section>${tabs()}`}