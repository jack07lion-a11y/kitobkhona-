function home(){
 const b=BOOKS[0];
 const EMPTY=`<div class="empty-card"><span class="round">${P('<path d="M3 5c3-1.5 6-1.5 9 0v14c-3-1.5-6-1.5-9 0zM21 5c-3-1.5-6-1.5-9 0v14c3-1.5 6-1.5 9 0z"/>')}</span><div><b>Ҳоло китобе нахондаед</b><span>Китобро интихоб кунед ва хониш оғоз мешавад</span></div><button class="pill" data-opensearch>Интихоб</button></div>`;
 if(S.search){
  const q=S.q.trim().toLowerCase();
  const list=BOOKS.filter(x=>(S.chip==="all"||(S.chip==="audio"?x.audio:x.c===S.chip))&&(!q||(x.t+" "+x.a).toLowerCase().includes(q)));
  return `<section class="screen pad"><div class="top"><button class="round" data-closesearch aria-label="Бозгашт">${P('<path d="M15 5l-7 7 7 7"/>')}</button>
   <label class="search" for="q">${P(I.search)}<input id="q" type="search" placeholder="Китоб ё муаллиф" value="${esc(S.q)}"></label></div>
   <div class="chips">${CHIPS.map(([k,n])=>`<button class="chip ${S.chip===k?"on":""}" data-chip="${k}">${n}</button>`).join("")}</div>
   ${S.loading?skel():`<p class="hint">${list.length} китоб ёфт шуд <span class="demo">намуна</span></p>
   ${list.length?`<div class="grid">${list.map(book).join("")}</div>`:`<p class="empty">Ҳеҷ чиз ёфт нашуд. Калимаи дигарро санҷед.</p>`}`}</section>${tabs()}`;
 }
 return `<section class="screen home pad">
   <div class="top"><div class="brand" translate="no">${LOGO}<span>Китоб<em>хона</em></span></div><button class="round fbtn" data-sheet="founders" aria-label="Бунёдгузорон">F</button>
    <button class="round" data-opensearch aria-label="Ҷустуҷӯ">${P(I.search)}</button><button class="round" data-sheet="app" aria-label="Танзимот">${P(I.gear)}</button></div>
   ${S.upd&&S.updNo!==S.upd.v?updBanner():""}
   ${PREM()?`<div class="promo hp"><h2>Китобхона Премиум</h2><p>Ҳамаи китобҳои пулакиро бепул хонед</p>
    <button class="cta" data-toast="Харид — қадами оянда">Гузаштан ба Премиум ${P(I.chev,2.4)}</button>
    <svg class="art" viewBox="0 0 150 140" aria-hidden="true"><path d="M50 110l-8-60 28 26 22-44 24 44 26-26-8 60z" fill="#fff" fill-opacity=".92"/><path d="M75 62l5 10 11 1-8 7 2 11-10-6-10 6 2-11-8-7 11-1z" fill="#63d48f"/></svg></div>`:""}
   <div class="sec-h" style="margin-bottom:-6px"><h2>Охирин хондаам</h2><span class="demo">${S.recent.length}/10</span></div>
   ${wheelHTML()}
   <div class="chips">${CHIPS.map(([k,n])=>`<button class="chip ${k==="all"?"on":""}" data-chip2="${k}">${n}</button>`).join("")}</div>
   ${BOOKS.length?"":`<div class="empty-card"><span class="round">${P('<path d="M3 5c3-1.5 6-1.5 9 0v14c-3-1.5-6-1.5-9 0zM21 5c-3-1.5-6-1.5-9 0v14c3-1.5 6-1.5 9 0z"/>')}</span><div><b>Китобҳо ба зудӣ илова мешаванд</b><span>Китобхона ҳоло пурра карда мешавад</span></div></div>`}
   ${BOOKS.length?`<div class="sec"><div class="sec-h"><h2>Барои шумо</h2><button data-opensearch>Ҳама</button></div><div class="shelf">${BOOKS.slice(0,8).map(book).join("")}</div></div>`:""}
   ${BOOKS.some(x=>x.audio)?`<div class="sec"><div class="sec-h"><h2>Аудио дар роҳ</h2><button data-chip2="audio">Ҳама</button></div><div class="shelf">${BOOKS.filter(x=>x.audio).slice(0,8).map(book).join("")}</div></div>`:""}
   <div class="sec"><div class="sec-h"><h2>Маҷмӯаҳо</h2></div><div class="hscroll">${GENRES.filter(g=>BOOKS.some(x=>x.c===g[0])).map(([k,n])=>{const bs=BOOKS.filter(x=>x.c===k);return `<button class="colc" data-chip2="${k}"><span class="col-fan">${bs.slice(0,3).map((x,i)=>`<span class="cf cf${i}">${cover(x)}</span>`).join("")}</span><b>${n}</b><em>${bs.length} китоб</em></button>`}).join("")}</div></div>
   <div class="sec"><div class="sec-h"><h2>Муаллифон</h2></div><div class="hscroll">${BOOKS.filter((x,i,a)=>a.findIndex(y=>y.a===x.a)===i).map(x=>{const w=x.a.split(" ");return `<button class="au-c" data-author="${x.a}"><span class="au-av" style="background:linear-gradient(135deg,${x.col[0]},${x.col[1]})">${w.map(y=>y[0]).slice(0,2).join("")}</span><b>${x.a}</b><em>${BOOKS.filter(y=>y.a===x.a).length} китоб</em></button>`}).join("")}</div></div>
   ${BOOKS.length>8?`<div class="sec"><div class="sec-h"><h2>Навтарин</h2><button data-opensearch>Ҳама</button></div><div class="shelf">${BOOKS.slice().reverse().slice(0,8).map(book).join("")}</div></div>`:""}
   ${S.premium||!PREM()?"":`<button class="ppill ${S.au?"up":""}" data-paywall>${CROWN}Премиум ${P(I.chev,2.4)}</button>`}
  </section>${tabs()}`;
}

const isDone=id=>S.lib.d.includes(id)||(S.prog[id]||0)>=100;
const LIBK={read:["Хондаистодаам",I.heart],q:["Дар навбат",I.list],d:["Хонда шуда",I.flag],dl:["Китобҳои боргирифта",I.dl],au:["Аудиокитобҳои боргирифта",I.head],col:["Маҷмӯаҳо",I.shelf]};
function libList(k){const ok=id=>bk(id);
 if(k==="read")return S.recent.filter(id=>ok(id)&&!isDone(id));
 if(k==="q")return S.lib.q.filter(ok);
 if(k==="d")return BOOKS.filter(b=>isDone(b.id)).map(b=>b.id);
 if(k==="dl")return BOOKS.filter(b=>S.dlBook[b.id]||b.have).map(b=>b.id);
 if(k==="au")return BOOKS.filter(b=>(S.dl[b.id]||[]).length).map(b=>b.id);
 return []}
function lib(){
 const EMPTY2=`<div class="empty-card"><div><b>Ҳоло китобе нахондаед</b><span>Китобҳои хондаистода дар ин ҷо пайдо мешаванд</span></div></div>`;
 const cur=libList("read")[0],cb=cur?bk(cur):null;
 const items=Object.keys(LIBK).map(k=>[LIBK[k][1],LIBK[k][0],k==="col"?`${S.lib.c.length} маҷмӯа`:`${libList(k).length} китоб`,k]);
 return `<section class="screen pad"><h1 class="title">Китобхонаи ман</h1>
  <div class="row"><span class="round">${P('<path d="M3 5c3-1.5 6-1.5 9 0v14c-3-1.5-6-1.5-9 0zM21 5c-3-1.5-6-1.5-9 0v14c3-1.5 6-1.5 9 0z"/>')}</span><b style="font-size:18px;font-weight:800">Ҳоло мехонам</b></div>
  ${cb?`<button class="lb-cur" data-read="${cb.id}"><span class="sh-cv" style="width:54px;flex:none">${cover(cb)}</span><span class="lb-t"><b translate="no">${escH(cb.t)}</b><small translate="no">${escH(cb.a)}</small><i class="lb-p"><u style="width:${S.prog[cb.id]||0}%"></u></i></span><em>${S.prog[cb.id]||0}%</em></button>`:EMPTY2}
  <div class="rows">${items.map(([ic,n,c,k])=>`<button class="row" data-lib="${k}" style="background:none;border:0;text-align:left;width:100%"><span class="round">${P(ic)}</span><span class="txt"><b>${n} </b><span>${c}</span></span>${P(I.chev).replace('class="ico"','class="chev"')}</button>`).join("")}</div>
 </section>${tabs()}`;
}
function bookRow(id,rm){const b=bk(id);if(!b)return "";const pr=S.prog[id]||0;
 return `<div class="sh-row lb-r"><button class="sh-main lb-o" data-lib-open="${id}"><span class="sh-cv" style="width:42px;flex:none">${cover(b)}</span><span class="lb-t"><b translate="no">${escH(b.t)}</b><small translate="no">${escH(b.a)}</small>${pr?`<i class="lb-p"><u style="width:${pr}%"></u></i>`:""}</span></button>${rm?`<button class="lb-x" data-lib-rm="${rm}:${id}" aria-label="Бардоштан">${P(IC_X,2)}</button>`:""}</div>`}
function libSheet(X){const k=S.libK;const t=LIBK[k][0];
 if(k==="col"){const cid=S.libC,c=S.lib.c.find(x=>x.id===cid);
  if(c){const add=S.libAdd;
   return `<div class="sh-head"><b class="sh-t" translate="no">${escH(c.n)}</b>${X}</div>
    <div class="lb-bar"><button class="pill" data-lib-back>‹ Маҷмӯаҳо</button><button class="pill" data-lib-add>${add?"Тайёр":"Китоб илова кардан"}</button><button class="pill" data-lib-delc="${c.id}">Нест кардан</button></div>
    ${add?`<div class="sh-list">${BOOKS.map(b=>`<button class="sh-row lb-pick${c.ids.includes(b.id)?" on":""}" data-lib-tog="${b.id}"><span translate="no">${escH(b.t)}</span><em>${c.ids.includes(b.id)?"✓":"+"}</em></button>`).join("")||`<p class="sh-empty">Китоб нест</p>`}</div>`
    :`<div class="sh-list">${c.ids.filter(id=>bk(id)).map(id=>bookRow(id,"c")).join("")||`<p class="sh-empty">Маҷмӯа холӣ аст. «Китоб илова кардан»-ро пахш кунед.</p>`}</div>`}</div>`}
  return `<div class="sh-head"><b class="sh-t">${t}</b>${X}</div>
   <div class="rds-in"><input id="lbn" maxlength="30" placeholder="Номи маҷмӯаи нав…" autocomplete="off"><button class="pill" data-lib-new>Сохтан</button></div>
   <div class="sh-list">${S.lib.c.map(c=>`<button class="sh-row" data-lib-c="${c.id}"><span translate="no">${escH(c.n)}</span><em>${c.ids.length} китоб ›</em></button>`).join("")||`<p class="sh-empty">Ҳоло маҷмӯа нест. Ном нависед ва «Сохтан»-ро пахш кунед.</p>`}</div>`}
 const ids=libList(k),rm=k==="q"||k==="d"?k:"";
 return `<div class="sh-head"><b class="sh-t">${t}</b>${X}</div><div class="sh-list">${ids.map(id=>bookRow(id,rm)).join("")||`<p class="sh-empty">Ҳоло холӣ аст</p>`}</div>`}

