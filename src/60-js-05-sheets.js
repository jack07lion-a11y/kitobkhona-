function setupSheet(){const sh=document.querySelector(".sheet");if(!sh)return;let g=null;
 sh.onpointerdown=e=>{const r=sh.getBoundingClientRect();if(e.clientY-r.top>44&&sh.scrollTop>0)return;if(e.clientY-r.top>44&&e.target.closest("button,input"))return;g={y0:e.clientY,dy:0,vy:0,ly:e.clientY,lt:performance.now()}};
 sh.onpointermove=e=>{if(!g)return;const now=performance.now();g.vy=(e.clientY-g.ly)/Math.max(1,now-g.lt);g.ly=e.clientY;g.lt=now;g.dy=Math.max(0,e.clientY-g.y0);if(g.dy>6){try{sh.setPointerCapture(e.pointerId)}catch(_){}sh.style.transition="none";sh.style.transform=`translateY(${g.dy}px)`;const sec=app.firstElementChild;if(sec&&sec.classList.contains("behind")){const k=Math.min(1,g.dy/sh.offsetHeight);sec.classList.remove("behind-in");sec.style.transition="none";sec.style.transform=`scale(${.92+.08*k})`}}};
 sh.onpointerup=sh.onpointercancel=()=>{if(!g)return;const G0=g;g=null;if(G0.dy<6)return;
  if(G0.dy>110||G0.vy>.5)closeSheet();else{sh.style.transition=`transform .35s ${EASE}`;sh.style.transform="translateY(0)";const sec=app.firstElementChild;if(sec&&sec.classList.contains("behind")){sec.style.transition="";sec.style.transform=""}}}}
const THEMES=[["auto","Худкор"],["light","Рӯшан"],["paper","Коғазӣ"],["dark","Торик"]];
function applyTheme(){const t=S.theme||"paper",r=document.documentElement;if(t==="auto")r.removeAttribute("data-theme");else r.dataset.theme=t;
 const dark=t==="dark"||(t==="auto"&&matchMedia("(prefers-color-scheme: dark)").matches);
 let m=document.querySelector('meta[name="theme-color"]');if(!m){m=document.createElement("meta");m.name="theme-color";document.head.appendChild(m)}
 m.content=dark?"#131211":t==="paper"?"#f7f1e3":"#ffffff"}
function sheetHTML(){
 if(!S.sheet){lastSheet=null;return ""}
 const X=`<button class="sh-x" data-shclose aria-label="Пӯшидан">${P(IC_X,2)}</button>`;let h="";
 if(S.sheet==="toc"){const b=bk(S.rdId),mk=(S.marks[b.id]||[]).slice().sort((x,y)=>x-y),tcs=isTx(b)?txChapters(b):null;
  h=`<div class="sh-head"><div class="sh-cv">${cover(b)}</div><div><b>${b.t}</b><span>${b.a}</span></div>${X}</div>
  <div class="seg">${["Мундариҷа","Хатчӯб"].map((n,i)=>`<button class="${S.tocTab===i?"on":""}" data-toct="${i}">${n}</button>`).join("")}</div>
  ${S.tocTab===0?(tcs?`<div class="sh-list">${tcs.map((c,i)=>`${c.part?`<p class="sh-empty" style="text-align:left;margin:10px 4px 2px">${escH(c.part)}</p>`:""}<button class="sh-row toc-r" data-gotch="${i}"><span translate="no"><svg class="toc-i" viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="18" rx="3"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>${escH(c.n)}</span><em>${(S.rdCh[b.id]||0)===i?"Ҳозир":""}</em></button>`).join("")}</div>`:`<div class="sh-list">${CHN.map((n,i)=>`<button class="sh-row" data-goch="${i}"><span>${n}</span><em><span data-chp="${i}">–</span>-саҳифа</em></button>`).join("")}</div>`)
   :S.tocTab===1?(mk.length?`<div class="sh-list">${mk.map(p=>`<button class="sh-row" data-gopg="${p}"><span>${P(IC_MARK)}${mlabel(b.id,p)}</span><em>Гузаштан ›</em></button>`).join("")}</div>`:`<p class="sh-empty">Ҳоло хатчӯб нест. Дар боло тугмаи ${P(IC_MARK)} -ро пахш кунед.</p>`)
   :""}`}
 if(S.sheet==="set"){const f=S.pref;
  h=`<div class="sh-head"><b class="sh-t">Танзимоти хондан</b>${X}</div>
  <div class="set-row col"><span>Андозаи ҳарф</span><div class="fsr"><i>А</i><div class="fsw"><output id="fsv" style="left:${(f.fs-13)/15*100}%">${f.fs}</output><input type="range" class="rd-scr" id="fsr" min="13" max="28" step="3" value="${f.fs}" style="--p:${(f.fs-13)/15*100}%" aria-label="Андозаи ҳарф"><div class="fsd">${[0,1,2,3,4,5].map(i=>`<u></u>`).join("")}</div></div><i class="big">А</i></div></div>
  <div class="set-row"><span>Самти хондан</span><div class="seg sm">${[["h","Уфуқӣ",'<path d="M4 8h14M14 4l4 4-4 4M20 16H6M10 12l-4 4 4 4"/>'],["v","Амудӣ",'<path d="M8 20V6M4 10l4-4 4 4M16 4v14M12 14l4 4 4-4"/>']].map(([k,n,ic])=>`<button class="${(f.dir||"h")===k?"on":""}" data-dir="${k}">${P(ic,2)}${n}</button>`).join("")}</div></div>
  <div class="set-row"><span>Фосилаи сатрҳо</span><div class="stepper"><button data-lh="-1" aria-label="Зичтар">−</button><b>${(f.lh||1.6).toFixed(1)}</b><button data-lh="1" aria-label="Кушодатар">+</button></div></div>
  <div class="set-row"><span>Ҳуруф</span><div class="seg sm">${[["serif","Китобӣ"],["sans","Оддӣ"]].map(([k,n])=>`<button class="${f.ff===k?"on":""}" data-ff="${k}">${n}</button>`).join("")}</div></div>
  <div class="set-row" style="border:0"><span>Ранги саҳифа</span><div class="sw">${[["white","Сафед"],["sepia","Зардча"],["dark","Торик"]].map(([k,n])=>`<button class="swb t-${k} ${f.th===k?"on":""}" data-th="${k}" aria-label="${n}"><i translate="no" style="font-style:normal">Аа</i></button>`).join("")}</div></div>`}
 if(S.sheet==="rds"){
  h=`<div class="sh-head"><b class="sh-t">Ҷустуҷӯ дар китоб</b>${X}</div>
  <label class="rds-in" for="rdsq">${P(I.search,2)}<input id="rdsq" type="search" enterkeyhint="search" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Калима ё ҳарфҳоро нависед…" value="${escH(RQT)}"></label>
  <p class="rds-cnt" id="rdscnt"></p><div class="rds-res" id="rdsres"></div>`}
 if(S.sheet==="report")h=reportSheet(X);
 if(S.sheet==="admrep")h=admRepHTML(X);
 if(S.sheet==="admnews")h=admNewsHTML(X);
 if(S.sheet==="khirad")h=`<div class="sh-head"><b class="sh-t" translate="no">Тавозуни хирад</b>${X}</div>${coin3d()}<p class="kh-p">${KH_TXT}</p>`;
 if(S.sheet==="lib"&&S.libK)h=libSheet(X);
 if(S.sheet==="pedit"&&S.pe){const d=S.pe,girl=(d.asG||S.gender)==="girl";
  h=`<div class="sh-head"><b class="sh-t">Таҳрири профил</b>${X}</div>
  ${canPerm("gender")?`<div class="pe-as"><small>Санҷиши ҷинс (танҳо барои шумо)</small><div class="seg sm">${[["","Худам"],["girl","Духтар"],["boy","Писар"]].map(([k,n])=>`<button class="${(d.asG||"")===k?"on":""}" data-asg="${k}">${n}</button>`).join("")}</div></div>`:""}
  <div class="pe-bn" style="${bnStyle(d.bn)||"background:linear-gradient(180deg,var(--indigo),var(--indigo-2))"}"><button class="pe-cam" data-pe-bn aria-label="Баннери профил">${P('<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',2)}</button></div>
  <div class="pe-sw">${BGS.map((g,i)=>`<button class="${d.bn==="g:"+i?"on":""}" data-pe-bg="${i}" style="background:${g}" aria-label="Ранг ${i+1}"></button>`).join("")}</div>
  <div class="pe-avr"><div class="av pe-av">${avInner(d.av)}${girl?"":`<button class="pe-cam sm" data-pe-av aria-label="Сурати профил">${P('<path d="M12 5v14M5 12h14"/>',2.4)}</button>`}</div>
   <p class="pe-h">${girl?"Аватарро интихоб кунед. Барои духтарон гузоштани сурати шахсӣ иҷозат нест.":"Расми худатонро гузоред (рӯ ба рӯ, аз сина боло)."}${!girl&&d.av?` <button class="pe-lk" data-pe-clr>Тоза кардан</button>`:""}</p></div>
  ${girl?(()=>{const sel=+((/^av:(\d+)$/.exec(d.av||"")||[])[1]||0),more=d.more||sel>5,n=more?AVN:5;return `<div class="pe-ag${more?" all":""}">${Array.from({length:n},(_,i)=>`<button class="${sel===i+1?"on":""}" data-pe-a="${i+1}" aria-label="Аватар ${i+1}"><img class="avc" src="avatars/${i+1}.webp" alt=""></button>`).join("")}</div><button class="pe-lk pe-more" data-pe-more>${more?"Камтар":"Бештар"}</button>`})():""}
  ${d.pend?`<div class="pe-warn"><p>${d.pend.msg}</p><div><button class="pill" data-pe-ok style="background:var(--orange);color:#fff">${d.pend.ok}</button><button class="pill" data-pe-no>Расми дигар</button></div></div>`:""}
  <label class="pe-l" for="pen">Номи намоишӣ</label><input class="pe-i" id="pen" maxlength="40" value="${escH(d.name)}" autocomplete="off" translate="no">
  <p class="pe-n">Агар ин ном аллакай банд бошад, дар охираш рақам илова мешавад (масалан «Ном 1»).</p>
  <label class="pe-l" for="peb">Дар бораи худ</label><textarea class="pe-i" id="peb" rows="3" maxlength="200" placeholder="Панд, шеър, рӯзи таваллуд ё чанд сатр дар бораи худ…">${escH(d.bio)}</textarea>
  <button class="pay-btn" data-pe-save style="width:100%;margin-top:14px">Сабт кардан</button>
  <input type="file" id="pef" accept="image/*" hidden>`}
 if(S.sheet==="founders"){
  const F=[["ҶХ","Ҷасурбек Холиқулов Эгамбердиев","Ғоя ва маҳсулот","#0b7d57","#63d48f"],["УҶ","Умаров Ҷумъаназар","Маълумот ба зудӣ илова мешавад","#c47a12","#f5b53c"]];
  h=`<div class="sh-head"><b class="sh-t fnd-t">Бунёдгузорон</b>${X}</div>
  <div class="fnd">${F.map(([i,n,d,c1,c2])=>`<div class="fnd-c"><span translate="no" class="fnd-av" style="background:linear-gradient(135deg,${c1},${c2})">${i}</span><b>${n}</b><em>Бунёдгузор</em><span>${d}</span></div>`).join("")}</div>`}
 if(S.sheet==="app"){const t=S.theme||"paper";
  h=`<div class="sh-head"><b class="sh-t">Танзимот</b>${X}</div>
  <p class="set-cap">Намуди барнома</p>
  <div class="thg" role="radiogroup" aria-label="Намуди барнома">${THEMES.map(([k,n])=>`<button class="thb ${t===k?"on":""}" data-theme-set="${k}" role="radio" aria-checked="${t===k}"><span class="thp thp-${k}"><i></i><i></i><i></i></span>${n}</button>`).join("")}</div>
  <p class="set-note">${t==="auto"?"Мисли телефон: рӯз рӯшан, шаб торик.":t==="paper"?"Ранги коғази кӯҳна, чашм камтар хаста мешавад.":t==="dark"?"Барои шаб ва батареяро сарфа мекунад.":"Ҳамеша рӯшан."}</p>
  <div class="sh-list">
   <button class="sh-row" data-sheet="report"><span>${P('<path d="M12 9v4M12 17h.01M10.3 3.9L2.4 18a2 2 0 001.7 3h15.800a2 2 0 001.700-3L13.700 3.900a2 2 0 00-3.400 0z"/>')}Хато фиристодан</span><em>›</em></button>
   <button class="sh-row" data-privacy><span>${P('<path d="M12 3l8 3v6c0 5-3.500 8-8 9-4.500-1-8-4-8-9V6z"/>')}Сиёсати махфият</span><em>›</em></button>
   <button class="sh-row" data-sheet="lang" style="border:0"><span>${P('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 2.5 15.300 0 18M12 3c-2.5 2.700-2.5 15.300 0 18"/>')}Забон</span><em translate="no">${LANGS.find(x=>x[0]===(S.lang||"tg"))[1]} ›</em></button>
  </div>`}
 if(S.sheet==="admbooks")h=admBooksHTML(X);
 if(S.sheet==="admstaff")h=admStaffHTML(X);
 if(S.sheet==="admrel")h=admRelHTML(X);
 if(S.sheet==="admnotif")h=admNotifHTML(X);
 if(S.sheet==="lang"){const cur=S.lang||"tg";
  h=`<div class="sh-head"><b class="sh-t">Забони интерфейс</b>${X}</div>
  <div class="sh-list">${LANGS.map(([k,n],i)=>`<button class="sh-row" data-lang="${k}" role="radio" aria-checked="${cur===k}"${i===LANGS.length-1?' style="border:0"':""}><span translate="no">${n}</span><em>${cur===k?P(IC_OK,2.6).replace('class="ico"','class="ico" style="width:20px;height:20px;color:var(--g,#0b7d57)"'):""}</em></button>`).join("")}</div>
  <p class="set-note">Танҳо намуди барнома иваз мешавад. Китобҳо тағйир намеёбанд.</p>`}
 if(S.sheet==="pay"){const b=S.payId?bk(S.payId):null;
  h=`<div class="pay">${X}<span class="pay-cr">${CROWN}</span><h2>${b?"Парчаи ройгон тамом шуд":"Китобхона Премиум"}</h2><p>${b?`Барои идомаи «${b.t}» ба Премиум гузаред.`:"Ҳамаи китобҳо ва аудиокитобҳо бе маҳдудият."}</p>
  <ul>${["Ҳамаи китобҳои пулакӣ","Аудиокитобҳо пурра","Бе интернет хондан ва гӯш кардан","Тарифи оила ва мактаб"].map(x=>`<li>${P(IC_OK,2.4)}${x}</li>`).join("")}</ul>
  <div class="pay-price"><b>20 сомонӣ</b> / моҳ <span class="demo">намуна</span></div>
  <button class="pay-btn" data-subscribe>Обуна шудан</button><button class="pay-later" data-shclose>Баъдтар</button></div>`}
 if(S.sheet==="atoc"&&S.au){const b=bk(S.au.id),tr=tracks(b),d=S.dl[b.id]||[];
  h=`<div class="sh-head"><b class="sh-t">Мундариҷа</b>${X}</div><div class="sh-list">${tr.map((t,i)=>`<div class="sh-row ${S.au.ch===i?"cur":""}"><button class="sh-main" data-goat="${i}"><span>${S.au.ch===i?EQ:""}${t.n}</span><em>${fmt(t.d)} · ${Math.max(1,Math.round(t.d/60))} мб</em></button><button class="dlb ${d.includes(i)?"done":""}" data-dlt="${i}" id="dlt${i}" aria-label="${d.includes(i)?"Боргирифта шуд":"Боргирифтан"}">${d.includes(i)?P(IC_OK,2.4):P(IC_DL,2)}</button></div>`).join("")}</div>
  <button class="pay-later full" data-dlall>${P(IC_DL,2)}${d.length===tr.length?"Ҳама боргирифта шуд":"Пурра боргирифтан"}</button>`}
 if(S.sheet==="adm"){const a=S.adm||{},ci=Math.max(0,ADM_COLS.findIndex(x=>x[0]===(a.col||[])[0]));
  h=`<div class="sh-head"><b class="sh-t">${a.id?"Таҳрири китоб":"Китоби нав"}</b>${X}</div>
  <div class="sh-form">
   <label class="field" for="a_t"><input id="a_t" placeholder="Номи китоб" maxlength="120" value="${escH(a.t||"")}" style="padding-left:6px"></label>
   <label class="field" for="a_a"><input id="a_a" placeholder="Муаллиф" maxlength="120" value="${escH(a.a||"")}" style="padding-left:6px"></label>
   <select id="a_c" aria-label="Бахш">${ADM_CATS.map(([k,n])=>`<option value="${k}" ${(a.c||"fiction")===k?"selected":""}>${n}</option>`).join("")}</select>
   <select id="a_col" aria-label="Ранги муқова">${ADM_COLS.map((x,i)=>`<option value="${i}" ${i===ci?"selected":""}>Муқова: ${x[2]}</option>`).join("")}</select>
   <textarea id="a_d" placeholder="Тавсифи кӯтоҳ" maxlength="600">${escH(a.desc||"")}</textarea>
   <label class="chk"><input type="checkbox" id="a_eb" ${a.ebook===false?"":"checked"}>Шакли электронӣ (матн) дорад</label>
   <label class="chk"><input type="checkbox" id="a_au" ${a.audio?"checked":""}>Аудио низ дорад</label>
   <label class="chk"><input type="checkbox" id="a_pr" ${a.prem?"checked":""}>Премиум (пурра танҳо бо обуна)</label>
   <label class="chk"><input type="checkbox" id="a_pub" ${a.id&&!a.pub?"":"checked"}>Барои ҳама намоён (нашр)</label>
   <label class="chk" for="a_cv" style="flex-wrap:wrap"><span class="pill" style="pointer-events:none">Муқова (расм)</span><span id="a_cvn" style="color:var(--muted);font-size:13px">${a.cover?"Ҳоло муқова ҳаст. Иваз кардан мумкин":"Расм интихоб кунед (JPG ё PNG, 2:3)"}</span></label>
   <input type="file" id="a_cv" accept="image/*" hidden>
   <button class="btn" data-admsave>Захира кардан</button>
   ${a.id?'<button class="btn-t" data-admdel style="color:#d33">Нест кардани китоб</button>':""}
  </div>`}
 if(!h){S.sheet=null;return ""}
 const still=lastSheet===S.sheet?"still":"";lastSheet=S.sheet;
 return `<div class="sh-bg ${still}" data-shclose></div><div class="sheet ${still} ${S.view==="audio"?"ap-sh":""} ${S.sheet==="rds"?"tall":["pedit","lib","report","admrep","admnews"].includes(S.sheet)?"tall pe":""}" role="dialog" aria-modal="true">${h}</div>`;
}
function skel(){return `<div class="skel-w">${[38,70,52,88,40,64,0,30,76,48,58].map(w=>w?`<span class="sk" style="width:${w}%"></span>`:`<span style="height:8px"></span>`).join("")}</div>`}
function wheelHTML(){
 const RC=S.recent.filter(id=>bk(id));
 if(!RC.length)return `<div class="wheel one" id="wheel"><div class="wpad t"></div><div class="witem wempty"><span class="round" style="width:60px;height:60px">${P('<path d="M3 5c3-1.5 6-1.5 9 0v14c-3-1.5-6-1.5-9 0zM21 5c-3-1.5-6-1.5-9 0v14c3-1.5 6-1.5 9 0z"/>')}</span><div class="wi"><b>Ҳоло китоб нахондаед</b><span class="a">Хонданро ҳозир оғоз кунед</span><button class="readbtn" data-read="2">${P('<path d="M6 4v16l14-8z" fill="currentColor"/>')}Китобро хонед</button></div></div><div class="wpad b"></div></div>`;
 const one=RC.length===1;
 return `<div class="car ${one?"one":""}" id="wheel">${RC.map(id=>{const b=BOOKS.find(x=>x.id===id);const au=S.mode[id]==="audio";const pr=(au?S.aprog[id]:S.prog[id])||0;return `<div class="witem"><div style="width:60px;flex:none">${cover(b)}</div><div class="wi"><b>${b.t}</b><span class="a">${b.a}</span><div class="pbar"><i style="width:${pr}%"></i></div><button class="readbtn" ${au?"data-listen":"data-read"}="${id}">${au?P(I.head,2.2):P('<path d="M6 4v16l14-8z" fill="currentColor"/>')}${au?"Гӯш кардан":"Идома додан"} <small>(${pr}%)</small></button></div></div>`}).join("")}</div>${one?"":`<div class="cdots" aria-hidden="true">${S.recent.map((_,i)=>`<i class="${i?"":"on"}"></i>`).join("")}</div>`}`;
}
function setupWheel(){
 const w=document.getElementById("wheel");if(!w)return;
 const items=[...w.querySelectorAll(".witem")];
 if(w.classList.contains("car")){
  const dots=[...document.querySelectorAll(".cdots i")];
  const upd=()=>{const i=Math.max(0,Math.min(items.length-1,Math.round(w.scrollLeft/(items[0].offsetWidth+10))));dots.forEach((d,j)=>d.classList.toggle("on",j===i));items.forEach((it,j)=>it.classList.toggle("focus",j===i))};
  w.addEventListener("scroll",upd,{passive:true});upd();
  // one-time hint: the row nudges left and back so people see it slides
  if(items.length>1&&!S.carHint2){
   setTimeout(()=>{if(!w.isConnected||w.scrollLeft>5)return;w.classList.add("nudge");
    items[0].addEventListener("animationend",()=>{w.classList.remove("nudge");S.carHint2=true;save()},{once:true})},600)}
  return}
 const ph=Math.max(0,(w.clientHeight-items[0].offsetHeight)/2);
 w.querySelector(".wpad.t").style.height=ph+"px";w.querySelector(".wpad.b").style.height=ph+"px";
 const upd=()=>{const mid=w.scrollTop+w.clientHeight/2;items.forEach(it=>{const c=it.offsetTop+it.offsetHeight/2;const d=Math.abs(c-mid)/it.offsetHeight;it.style.transform=`scale(${1-Math.min(d,2)*.09})`;it.style.opacity=String(1-Math.min(d,2)*.4);it.classList.toggle("focus",d<.55)})};
 w.addEventListener("scroll",upd,{passive:true});upd();
}
function tabs(){return mini()}
