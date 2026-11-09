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
   <div class="top"><div class="brand" translate="no">${LOGO}<span>Китоб<em>хона</em></span></div>${fabHTML()}<button class="round fbtn" data-sheet="founders" aria-label="Бунёдгузорон">F</button>
    <button class="round" data-opensearch aria-label="Ҷустуҷӯ">${P(I.search)}</button><button class="round" data-sheet="app" aria-label="Танзимот">${P(I.gear)}</button></div>
   ${S.upd&&S.updNo!==S.upd.v?updBanner():""}
   ${PREM()&&FEAT("buy")?`<div class="promo hp"><h2>Китобхона Премиум</h2><p>Ҳамаи китобҳои пулакиро бепул хонед</p>
    <button class="cta" data-toast="Харид — қадами оянда">Гузаштан ба Премиум ${P(I.chev,2.4)}</button>
    <svg class="art" viewBox="0 0 150 140" aria-hidden="true"><path d="M50 110l-8-60 28 26 22-44 24 44 26-26-8 60z" fill="#fff" fill-opacity=".92"/><path d="M75 62l5 10 11 1-8 7 2 11-10-6-10 6 2-11-8-7 11-1z" fill="#63d48f"/></svg></div>`:""}
   <div class="sec-h" style="margin-bottom:-6px"><h2>Охирин хондаам</h2><span class="demo">${S.recent.length}/10</span></div>
   ${wheelHTML()}
   <div class="chips">${chipList().map(([k,n])=>`<button class="chip ${k==="all"?"on":""}" data-chip2="${k}">${n}</button>`).join("")}</div>
   ${BOOKS.length?"":`<div class="empty-card"><span class="round">${P('<path d="M3 5c3-1.5 6-1.5 9 0v14c-3-1.5-6-1.5-9 0zM21 5c-3-1.5-6-1.5-9 0v14c3-1.5 6-1.5 9 0z"/>')}</span><div><b>Китобҳо ба зудӣ илова мешаванд</b><span>Китобхона ҳоло пурра карда мешавад</span></div></div>`}
   ${BOOKS.length?`<div class="sec"><div class="sec-h"><h2>Барои шумо</h2><button data-opensearch>Ҳама</button></div><div class="shelf">${BOOKS.slice(0,8).map(book).join("")}</div></div>`:""}
   ${BOOKS.some(x=>x.audio)?`<div class="sec"><div class="sec-h"><h2>Аудио дар роҳ</h2><button data-chip2="audio">Ҳама</button></div><div class="shelf">${BOOKS.filter(x=>x.audio).slice(0,8).map(book).join("")}</div></div>`:""}
   <div class="sec"><div class="sec-h"><h2>Маҷмӯаҳо</h2></div><div class="hscroll">${GENRES.filter(g=>BOOKS.some(x=>x.c===g[0])).map(([k,n])=>{const bs=BOOKS.filter(x=>x.c===k);return `<button class="colc" data-chip2="${k}"><span class="col-fan">${bs.slice(0,3).map((x,i)=>`<span class="cf cf${i}">${cover(x)}</span>`).join("")}</span><b>${n}</b><em>${bs.length} китоб</em></button>`}).join("")}</div></div>
   <div class="sec"><div class="sec-h"><h2>Муаллифон</h2></div><div class="hscroll">${BOOKS.filter((x,i,a)=>a.findIndex(y=>y.a===x.a)===i).map(x=>{const w=x.a.split(" ");return `<button class="au-c" data-author="${x.a}"><span class="au-av" style="background:linear-gradient(135deg,${x.col[0]},${x.col[1]})">${w.map(y=>y[0]).slice(0,2).join("")}</span><b>${x.a}</b><em>${BOOKS.filter(y=>y.a===x.a).length} китоб</em></button>`}).join("")}</div></div>
   ${BOOKS.length>8?`<div class="sec"><div class="sec-h"><h2>Навтарин</h2><button data-opensearch>Ҳама</button></div><div class="shelf">${BOOKS.slice().reverse().slice(0,8).map(book).join("")}</div></div>`:""}
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