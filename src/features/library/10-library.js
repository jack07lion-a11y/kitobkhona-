/* ---------- illustrated covers (100x150) ---------- */
const A={
 bg:(id,c1,c2)=>`<defs><linearGradient id="s${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="100" height="150" fill="url(#s${id})"/>`,
 stars:(n,seed,maxY=70)=>{let r="",x=seed;for(let i=0;i<n;i++){x=(x*9301+49297)%233280;const a=x/233280;x=(x*9301+49297)%233280;const b=x/233280;r+=`<circle cx="${(a*96+2).toFixed(1)}" cy="${(b*maxY+2).toFixed(1)}" r="${(.4+((a*b*10)%1)*.9).toFixed(2)}" fill="#fff" fill-opacity="${(.45+((a*7)%1)*.55).toFixed(2)}"/>`}return r},
 sun:(x,y,r,c="#ffd36b")=>`<circle cx="${x}" cy="${y}" r="${r*1.9}" fill="${c}" fill-opacity=".18"/><circle cx="${x}" cy="${y}" r="${r*1.4}" fill="${c}" fill-opacity=".28"/><circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`,
 moon:(id,x,y,r)=>`<mask id="m${id}"><rect width="100" height="150" fill="#fff"/><circle cx="${x+r*.5}" cy="${y-r*.2}" r="${r*.85}" fill="#000"/></mask><circle cx="${x}" cy="${y}" r="${r*1.6}" fill="#f6e7b4" fill-opacity=".15"/><circle cx="${x}" cy="${y}" r="${r}" fill="#f6e7b4" mask="url(#m${id})"/>`,
 mtn:(c,y,h,o=0)=>`<path d="M0 150V${y}L${10+o} ${y-h*.6}L${22+o} ${y-h*.2}L${38+o} ${y-h}L${54+o} ${y-h*.3}L${68+o} ${y-h*.75}L${84+o} ${y-h*.25}L100 ${y-h*.5}V150z" fill="${c}"/>`,
 dune:(c,y,a=6)=>`<path d="M0 150V${y}Q25 ${y-a} 50 ${y}T100 ${y-2}V150z" fill="${c}"/>`,
 minaret:(x,b,w,h,c)=>`<g fill="${c}"><rect x="${x-w/2}" y="${b-h}" width="${w}" height="${h}"/><rect x="${x-w*.85}" y="${b-h}" width="${w*1.7}" height="${w*.35}"/><path d="M${x-w*.65} ${b-h-w*.05}a${w*.65} ${w*.95} 0 0 1 ${w*1.3} 0z"/><rect x="${x-.5}" y="${b-h-w*1.9}" width="1" height="${w*1}"/></g>`,
 dome:(x,b,w,h,c)=>`<g fill="${c}"><rect x="${x-w/2}" y="${b-h*.5}" width="${w}" height="${h*.5}"/><path d="M${x-w*.5} ${b-h*.5}a${w/2} ${h*.5} 0 0 1 ${w} 0z"/><rect x="${x-.6}" y="${b-h-4}" width="1.2" height="5"/></g>`,
 arch:(x,b,w,h,c,i)=>`<path d="M${x-w/2} ${b}V${b-h*.62}Q${x-w/2} ${b-h*.9} ${x} ${b-h}Q${x+w/2} ${b-h*.9} ${x+w/2} ${b-h*.62}V${b}z" fill="${c}"/><path d="M${x-w*.32} ${b}V${b-h*.55}Q${x-w*.32} ${b-h*.78} ${x} ${b-h*.86}Q${x+w*.32} ${b-h*.78} ${x+w*.32} ${b-h*.55}V${b}z" fill="${i}"/>`,
 cyp:(x,b,h,c)=>`<path d="M${x} ${b-h}C${x+h*.13} ${b-h*.62} ${x+h*.15} ${b-h*.2} ${x} ${b}C${x-h*.15} ${b-h*.2} ${x-h*.13} ${b-h*.62} ${x} ${b-h}z" fill="${c}"/>`,
 rose:(x,y,s)=>`<g transform="translate(${x} ${y}) scale(${s})"><g fill="#b82350">${[0,72,144,216,288].map(a=>`<ellipse cx="0" cy="-9" rx="8.500" ry="10" transform="rotate(${a})"/>`).join("")}</g><g fill="#e04a73">${[36,108,180,252,324].map(a=>`<ellipse cx="0" cy="-6.500" rx="6.500" ry="7.500" transform="rotate(${a})"/>`).join("")}</g><g fill="#f78aa6">${[0,90,180,270].map(a=>`<ellipse cx="0" cy="-4" rx="4.500" ry="5.500" transform="rotate(${a})"/>`).join("")}</g><circle r="3" fill="#a31c46"/></g>`,
 camel:(x,y,s,c)=>`<g transform="translate(${x} ${y}) scale(${s})" fill="${c}"><path d="M0 0q2-7 8-7 3-6 6 0 6 0 8 7v10h-2v-8h-3v8h-2v-8h-8v8h-2v-8h-3v8h-2z"/><path d="M22 -2q4-6 6-12l3 1q-1 6-4 12z"/><path d="M28 -14l6-1 .5 3-6 2z"/></g>`,
 bird:(x,y,s,c1,c2,c3)=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0C-22 -10 -38 -8 -46 -26 -30 -22 -14 -18 0 -8z" fill="${c1}"/><path d="M0 0C22 -10 38 -8 46 -26 30 -22 14 -18 0 -8z" fill="${c1}"/><path d="M0 -2C-18 -4 -30 -2 -38 -14 -24 -12 -12 -10 0 -6z" fill="${c2}" fill-opacity=".9"/><path d="M0 -2C18 -4 30 -2 38 -14 24 -12 12 -10 0 -6z" fill="${c2}" fill-opacity=".9"/><path d="M-3 6C-8 28 -18 40 -26 56M0 8C0 30 -2 44 0 62M3 6C8 28 18 40 26 56" stroke="${c3}" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="0" cy="2" rx="6" ry="11" fill="${c2}"/><circle cx="0" cy="-12" r="5" fill="${c1}"/><path d="M-1 -17l1 -6 1 6z" fill="${c3}"/></g>`,
 crown:(x,y,s,c)=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M-16 8L-19 -8L-8 0L0 -12L8 0L19 -8L16 8z" fill="${c}"/><rect x="-16" y="8" width="32" height="4" rx="1" fill="${c}"/><circle cx="0" cy="-14" r="2" fill="${c}"/><circle cx="-19" cy="-10" r="2" fill="${c}"/><circle cx="19" cy="-10" r="2" fill="${c}"/></g>`,
 goblet:(x,y,s,c)=>`<g transform="translate(${x} ${y}) scale(${s})" fill="${c}"><path d="M-9 -14h18c0 12-3 18-9 18s-9-6-9-18z"/><rect x="-1.200" y="4" width="2.400" height="10"/><ellipse cx="0" cy="15" rx="8" ry="2.200"/></g>`,
 cap:(x,y,s,c,t)=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 -12L24 -2 0 8-24 -2z" fill="${c}"/><path d="M-13 3v10c8 5 18 5 26 0V3L0 8z" fill="${c}" fill-opacity=".8"/><path d="M22 -1v14" stroke="${t}" stroke-width="1.600"/><circle cx="22" cy="15" r="2.200" fill="${t}"/></g>`,
 book:(x,y,s,c,d)=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 -4C-8 -9 -16 -9 -22 -6V14c6-3 14-3 22 2z" fill="${c}"/><path d="M0 -4C8 -9 16 -9 22 -6V14c-6-3-14-3-22 2z" fill="${d}"/></g>`,
 letter:(t,x,y,sz,c,rot=0)=>`<text x="${x}" y="${y}" font-size="${sz}" font-weight="800" font-family="Lora,Georgia,serif" fill="${c}" text-anchor="middle" transform="rotate(${rot} ${x} ${y})">${t}</text>`,
 kite:(x,y,s,c1,c2)=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 -14L10 0 0 16-10 0z" fill="${c1}"/><path d="M0 -14L10 0 0 0z" fill="${c2}"/><path d="M0 16q-6 8 2 14t-2 16" stroke="#fff" stroke-width="1" fill="none"/></g>`,
 cloud:(x,y,s)=>`<g transform="translate(${x} ${y}) scale(${s})" fill="#fff" fill-opacity=".9"><circle r="6"/><circle cx="8" cy="2" r="7"/><circle cx="17" cy="3" r="5"/><rect x="-6" y="3" width="28" height="6" rx="3"/></g>`,
 atom:(x,y,s,c)=>`<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="${c}" stroke-width="1.600"><ellipse rx="26" ry="9"/><ellipse rx="26" ry="9" transform="rotate(60)"/><ellipse rx="26" ry="9" transform="rotate(120)"/><circle r="4" fill="${c}" stroke="none"/></g>`,
};
const ARTS={};
function cover(b){
 const au=b.audio?`<span class="au">${FILL('<path d="M6 4v16l14-8z"/>')}</span>`:"";
 const face=b.cover?`<img src="${escH(b.cover)}" alt="">`:`<svg viewBox="0 0 100 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${(ARTS[b.id]||(()=>A.bg(b.id,b.col[0],b.col[1])))("c"+b.id)}</svg><div class="cv-t"><b>${b.t}</b><em>${b.a}</em></div>`;
 return `<div class="cover art img b3d" style="--cvc:${escH((b.col&&b.col[1])||"#3a2f24")}"><div class="b3d-in"><div class="f f-front">${face}${au}</div><i class="f f-right"></i><i class="f f-back"></i><i class="f f-left"></i></div></div>`;
}

function book(b){return `<button class="book" data-book="${b.id}" aria-label="${escH(b.t)}, ${escH(b.a)}">${cover(b)}<span class="t">${escH(b.t)}</span><span class="a">${escH(b.a)}</span>${fmtPill(b,true)}</button>`}
const DESC={};
const CATN={classic:"Классика",kids:"Барои кӯдакон",exam:"Омодагӣ ба ММТ",text:"Мактаб"};
const AGE={kids:"0+",text:"6+",exam:"14+"};
function openDetail(id){if(S.view!=="book"){S.prev=S.view;S.prevSearch=S.search}S.bookId=id;S.view="book";render();window.scrollTo(0,0)}
function detail(){
 const b=BOOKS.find(x=>x.id===S.bookId);const pr=S.prog[b.id]||0;
 const sim=BOOKS.filter(x=>x.c===b.c&&x.id!==b.id).slice(0,6);
 const qs=[`«${b.t}» дар бораи чист?`,"Аз рӯи китоб флешкарта сохтан","Қаҳрамон ё фикри асосии китоб кист?"];
 const spark='<path d="M12 3l1.900 5.100L19 10l-5.100 1.900L12 17l-1.900-5.100L5 10l5.100-1.900zM19 15l.8 2.200L22 18l-2.200.8L19 21l-.8-2.200L16 18l2.200-.8z" fill="currentColor" stroke="none"/>';
 return `<section class="bd" style="--bc:${b.col[0]}">
  <div class="bd-top pad"><button class="bd-ic" data-back aria-label="Бозгашт">${P('<path d="M15 5l-7 7 7 7"/>',2.2)}</button><span class="bd-tt">${b.t}</span>
   <button class="bd-ic" data-share="${b.id}" aria-label="Мубодила">${P('<path d="M14 5l7 7-7 7M21 12H10a7 7 0 00-7 7"/>',2)}</button>
   <button class="bd-ic" data-dlbook="${b.id}" aria-label="Боргирифтан">${(S.dlBook[b.id]||b.have)?P(IC_OK,2.2):P(IC_DL,2)}</button>
   <button class="bd-ic${S.lib.q.includes(b.id)?" on":""}" data-qtog="${b.id}" aria-label="Ба навбат">${P('<path d="M6 3h12v18l-6-4-6 4z"/>',2)}</button></div>
  <div class="bd-hero pad"><div class="bd-cover">${cover(b)}</div><h1>${b.t}</h1><p class="bd-au">${b.a}</p>${fmtPill(b)}</div>
  <div class="pad bd-body">
   <div class="bd-stats"><div><small>Рейтинг</small><b><span style="color:#f2a93b">${FILL(I.star)}</span>—</b></div><div><small>Давомнокӣ</small><b><span style="color:#3aa0d8">${P(I.clock,2)}</span>${b.audio?"—":"Матн"}</b></div><div><small>Мехонанд</small><b><span style="color:var(--orange)">${P('<circle cx="9" cy="8" r="3.500"/><path d="M2.500 20c.6-4 3.200-6 6.500-6s5.900 2 6.500 6M16 4.500a3.500 3.500 0 010 7M18 14c2 .7 3.300 2.700 3.500 6"/>',2)}</span>0</b></div></div>
   <div class="bd-act ${locked(b)?"sm":""}">${b.ebook===false?"":`<button class="bd-btn" data-read="${b.id}">${P('<path d="M3 5c3-1.500 6-1.500 9 0v14c-3-1.500-6-1.500-9 0zM21 5c-3-1.500-6-1.500-9 0v14c3-1.500 6-1.500 9 0z"/>',2)}<span class="lb">${locked(b)?"Парча хондан":(bpath(b)&&!b.have?"Боргирӣ ва хондан":"Хондан")}</span>${pr&&!locked(b)?` <small>(${pr}%)</small>`:""}</button>`}${b.audio?`${b.ebook===false?"":"<i></i>"}<button class="bd-btn" data-listen="${b.id}">${P(I.head,2)}${locked(b)?"Парча гӯш кардан":"Гӯш кардан"}${S.aprog[b.id]&&!locked(b)?` <small>(${S.aprog[b.id]}%)</small>`:""}</button>`:""}</div>
   <div class="bd-q"><button class="${S.lib.q.includes(b.id)?"on":""}" data-qtog="${b.id}">${P(I.list,2)}${S.lib.q.includes(b.id)?"Дар навбат":"Ба навбат гузоштан"}</button><button class="${isDone(b.id)?"on":""}" data-dtog="${b.id}">${P(I.flag,2)}${isDone(b.id)?"Хонда шуд":"Хонда шуд гуфтан"}</button></div>
   <p class="bd-desc">${DESC[b.id]||b.desc||""}</p>
   <div class="sec"><h2 class="bd-h">Батафсил</h2>
    <div class="bd-info"><div><span>${P('<path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>',1.8)}Бахш</span><b>${CATN[b.c]||(GENRES.find(x=>x[0]===b.c)||[])[1]||""}${b.audio?`, <em>Аудио дар роҳ</em>`:""}</b></div>
    <div><span>${P('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/>',1.8)}Гӯянда</span><b>${b.audio?"—":"Танҳо матн"}</b></div>
    <div><span>${P('<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',1.8)}Синну сол</span><b class="age">${AGE[b.c]||"12+"}</b></div></div></div>
   <div class="sec"><div class="sec-h"><h2 class="bd-h">Аз рӯи китоб савол диҳед</h2><span class="demo">Ёрдамчӣ</span></div>
    ${qs.map(q=>`<button class="bd-q" data-toast="Ёрдамчии китоб — қадами оянда"><span class="sp">${P(spark)}</span><span class="qt">${q}</span>${P(I.chev).replace('class="ico"','class="chev"')}</button>`).join("")}</div>
   <div class="sec"><h2 class="bd-h">Фикри шумо дар бораи китоб?</h2>
    <button class="bd-op" data-toast="Навиштани фикр — қадами оянда"><span class="av2">${P('<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4.500 4.500-6.500 8-6.500s7 2 8 6.500"/>',1.8)}</span><span class="txt"><b>Номи шумо</b><span>Фикратонро нависед…</span></span>${P(I.chev).replace('class="ico"','class="chev"')}</button></div>
   <div class="sec"><div class="sec-h"><h2 class="bd-h">Фикрҳо <span style="color:var(--muted)">0</span></h2></div><p class="hint">Ҳоло фикр нест. Аввалин шуда нависед.</p></div>
   ${sim.length?`<div class="sec"><div class="sec-h"><h2 class="bd-h">Китобҳои монанд</h2><button data-chip2="${b.c}" class="bd-all">Ҳама ›</button></div>
    <div class="shelf">${sim.map(x=>`<div class="simb">${book(x)}<button class="simr" data-read="${x.id}" aria-label="Хондан">${P('<path d="M3 5c3-1.500 6-1.500 9 0v14c-3-1.500-6-1.500-9 0zM21 5c-3-1.500-6-1.500-9 0v14c3-1.500 6-1.500 9 0z"/>',1.8)}</button></div>`).join("")}</div></div>`:""}
  </div></section>`;
}

async function openBook(id){const b=bk(id);if(b&&bpath(b)&&!TX[id]){if(DLP[id]!=null)return;if(S.view!=="book"||b.have)toast("Китоб кушода мешавад…");if(!await fetchBook(b)){toast("Китоб боргирӣ нашуд. Интернетро санҷед");return}}openBook0(id)}
const isTx=b=>!!(b&&bpath(b)&&TX[b.id]);
const mkey=id=>{const b=bk(id);return isTx(b)?(S.rdCh[id]||0)*1e5+(S.pages[id]||0):(S.pages[id]||0)};
function mlabel(id,k){return isTx(bk(id))?`Боби ${Math.floor(k/1e5)+1}, саҳифаи ${k%1e5+1}`:`Саҳифаи ${k+1}`}
function goChap(id,ci,p){S.rdCh[id]=ci;S.pages[id]=p;delete S.rdFr[id];S.sheet=null;render()}
function openBook0(id){window.__rdT=Date.now();if(S.rdId!==id){RQ="";RQT="";HITS=[];HI=-1}S.rdUI=false;S.recent=[id,...S.recent.filter(x=>x!==id)].slice(0,10);S.mode[id]="read";if(S.view!=="read")S.rdPrev=S.view;S.rdId=id;S.sheet=null;S.view="read";render();window.scrollTo(0,0)}
function openAudio(id){S.recent=[id,...S.recent.filter(x=>x!==id)].slice(0,10);S.mode[id]="audio";
 if(!S.au||S.au.id!==id){if(S.au)S.apos[S.au.id]={ch:S.au.ch,pos:S.au.pos};const sv=S.apos[id]||{ch:0,pos:0};S.au={id,ch:sv.ch,pos:sv.pos,playing:true,speed:S.au?S.au.speed:1,sleep:0,sleepSet:0}}else S.au.playing=true;
 if(S.view!=="audio")S.apPrev=S.view;S.sheet=null;S.view="audio";render();window.scrollTo(0,0)}
function openSearch(){S.view="home";S.search=true;S.loading=true;render(true);setTimeout(()=>{S.loading=false;if(S.search&&S.view==="home")render(true)},500)}
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

/* ---- пайвасти тугмаҳо: library (аз bind() даъват мешавад) ---- */
function bindLibrary($$){
 $$("[data-share]",b=>b.onclick=()=>{const bb=bk(+b.dataset.share)||bk(b.dataset.share);if(bb)NATIVE.share("«"+bb.t+"» — "+bb.a+"\nДар Китобхона бихонед:",bookLink(bb))});
 $$("[data-lib]",b=>b.onclick=()=>{S.libK=b.dataset.lib;S.libC=null;S.libAdd=false;S.sheet="lib";render()});
 $$("[data-lib-open]",b=>b.onclick=()=>{S.sheet=null;openDetail(+b.dataset.libOpen)});
 $$("[data-lib-rm]",b=>b.onclick=()=>{const[k,id]=b.dataset.libRm.split(":");const n=+id;
  if(k==="q")S.lib.q=S.lib.q.filter(x=>x!==n);else if(k==="d"){S.lib.d=S.lib.d.filter(x=>x!==n);if((S.prog[n]||0)>=100)S.prog[n]=99}else if(k==="c"){const c=S.lib.c.find(x=>x.id===S.libC);if(c)c.ids=c.ids.filter(x=>x!==n)}save();render()});
 $$("[data-lib-new]",b=>b.onclick=()=>{const el=document.getElementById("lbn"),n=(el&&el.value||"").trim().slice(0,30);if(!n){toast("Ном нависед");return}S.lib.c.push({id:Date.now(),n,ids:[]});save();render()});
 $$("[data-lib-c]",b=>b.onclick=()=>{S.libC=+b.dataset.libC;S.libAdd=false;render()});
 $$("[data-lib-back]",b=>b.onclick=()=>{S.libC=null;S.libAdd=false;render()});
 $$("[data-lib-add]",b=>b.onclick=()=>{S.libAdd=!S.libAdd;render()});
 $$("[data-lib-delc]",b=>b.onclick=()=>{S.lib.c=S.lib.c.filter(x=>x.id!==+b.dataset.libDelc);S.libC=null;save();render()});
 $$("[data-lib-tog]",b=>b.onclick=()=>{const c=S.lib.c.find(x=>x.id===S.libC);if(!c)return;const n=+b.dataset.libTog;c.ids=c.ids.includes(n)?c.ids.filter(x=>x!==n):[...c.ids,n];save();render()});
 $$("[data-qtog]",b=>b.onclick=()=>{const n=+b.dataset.qtog,a=S.lib.q;S.lib.q=a.includes(n)?a.filter(x=>x!==n):[...a,n];save();toast(S.lib.q.includes(n)?"Ба навбат гузошта шуд":"Аз навбат бардошта шуд");render()});
 $$("[data-dtog]",b=>b.onclick=()=>{const n=+b.dataset.dtog,a=S.lib.d;S.lib.d=a.includes(n)?a.filter(x=>x!==n):[...a,n];if(!S.lib.d.includes(n)&&(S.prog[n]||0)>=100)S.prog[n]=99;save();toast(S.lib.d.includes(n)?"Хонда шуд":"Аз «Хонда шуда» бардошта шуд");render()});
 $$("[data-dlbook]",b=>b.onclick=async()=>{const id=+b.dataset.dlbook,bb=bk(id);if(locked(bb)){S.payId=id;S.sheet="pay";render();return}
  if(bb&&bpath(bb)){if(bb.have){toast("Китоб аллакай дар телефон аст");return}if(DLP[id]!=null)return;
   if(await fetchBook(bb)){render();toast("Боргирӣ шуд. Акнун бе интернет ҳам мехонед")}else toast("Боргирӣ нашуд. Интернетро санҷед");return}S.dlBook[id]=!S.dlBook[id];toast(S.dlBook[id]?"Барои хондан бе интернет нигоҳ дошта шуд":"Аз хотираи телефон тоза шуд");render()});
 $$("[data-author]",b=>b.onclick=()=>{S.q=b.dataset.author;S.chip="all";openSearch()});
}

/* ---- варақи lib ---- */
SHEETS.lib=X=>{if(!(S.libK))return "";let h="";h=libSheet(X);;return h};
