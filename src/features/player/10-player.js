const PLAY=FILL('<path d="M7 4.5v15l12.5-7.5z"/>'),PAUSE=FILL('<rect x="6" y="4.5" width="4" height="15" rx="1.2"/><rect x="14" y="4.5" width="4" height="15" rx="1.2"/>');
const B10=P('<path d="M4.5 12a7.5 7.5 0 107.5-7.5H8.5"/><path d="M11 1.5L8 4.5l3 3"/><text x="12.2" y="15.4" font-size="7" font-weight="800" text-anchor="middle" fill="currentColor" stroke="none" font-family="Inter">10</text>',1.7);
const F10=P('<path d="M19.5 12A7.5 7.5 0 1112 4.5h3.5"/><path d="M13 1.5l3 3-3 3"/><text x="11.8" y="15.4" font-size="7" font-weight="800" text-anchor="middle" fill="currentColor" stroke="none" font-family="Inter">10</text>',1.7);
const TIMER=P('<circle cx="12" cy="13.5" r="7.5"/><path d="M12 9.5v4l2.5 2M9.5 2.5h5"/>',1.8),EQ=P('<path d="M5 10v4M9 7v10M13 9v6M17 6v12"/>',2.2);

function player(){
 const a=S.au,b=bk(a.id),tr=tracks(b),t=tr[a.ch],lk=locked(b),done=(S.dl[b.id]||[]).length===tr.length;
 return `<section class="ap" style="--bc:${b.col[0]}">
  <div class="ap-top"><button class="ap-ic" data-apmin aria-label="Хурд кардан">${P('<path d="M6 9l6 6 6-6"/>',2.2)}</button><span class="ap-lbl">Аудиокитоб</span><button class="ap-ic" data-toast="Мубодила — қадами оянда" aria-label="Мубодила">${P('<path d="M12 3v12M7 8l5-5 5 5M5 14v6h14v-6"/>',2)}</button></div>
  <div class="ap-cover">${cover(b)}</div>
  <div class="ap-meta"><h1>${b.t}</h1><p>${t.n} · ${b.a}</p></div>
  <input class="ap-seek" type="range" id="apseek" min="0" max="${t.d}" step="1" value="${Math.floor(a.pos)}" aria-label="Мавқеи пахш" style="--p:${a.pos/t.d*100}%">
  <div class="ap-time"><span id="apcur">${fmt(a.pos)}</span><span>${fmt(t.d)}</span></div>
  <div class="ap-ctl"><button class="ap-sp" data-apspeed aria-label="Суръат">${a.speed}x</button><button class="ap-b" data-apskip="-10" aria-label="10 сония ақиб">${B10}</button><button class="ap-play" data-applay aria-label="${a.playing?"Таваққуф":"Пахш"}">${a.playing?PAUSE:PLAY}</button><button class="ap-b" data-apskip="10" aria-label="10 сония пеш">${F10}</button><button class="ap-b ap-tm ${a.sleep?"on":""}" data-aptimer aria-label="Таймери хоб">${TIMER}${a.sleep?`<small id="aptm">${Math.ceil(a.sleep/60)}′</small>`:""}</button></div>
  ${lk?`<p class="ap-free">Парчаи ройгон: 1 дақиқа · Премиум барои пурра</p>`:""}
  <div class="ap-bot"><button class="ap-pill" data-sheet="atoc">${P(I.list,2)}Мундариҷа · ${tr.length} боб</button><button class="ap-pill" data-dlall>${done?P(IC_OK,2.2):P(IC_DL,2)}${done?"Боргирифта шуд":"Боргирифтан"}</button></div>
 </section>`;
}function tickUI(){const a=S.au;if(!a)return;const t=tracks(bk(a.id))[a.ch];const pc=a.pos/t.d*100+"%";
 const s=document.getElementById("apseek");if(s){s.style.setProperty("--p",pc);if(!s.dataset.drag)s.value=Math.floor(a.pos)}
 const c=document.getElementById("apcur");if(c)c.textContent=fmt(a.pos);
 const m=document.getElementById("mpbar");if(m)m.style.width=pc;
 const tm=document.getElementById("aptm");if(tm)tm.textContent=Math.ceil(a.sleep/60)+"′"}
function aprog(){const a=S.au,tr=tracks(bk(a.id)),tot=tr.reduce((x,t)=>x+t.d,0),dn=tr.slice(0,a.ch).reduce((x,t)=>x+t.d,0)+a.pos;S.aprog[a.id]=Math.round(dn/tot*100)}
setInterval(()=>{const a=S.au;if(!a||!a.playing)return;const b=bk(a.id),tr=tracks(b);
 a.pos+=a.speed;
 if(locked(b)&&a.pos>=FREE_SEC){a.pos=FREE_SEC;a.playing=false;S.payId=a.id;S.sheet="pay";aprog();render();return}
 if(a.sleep>0){a.sleep--;if(!a.sleep){a.sleepSet=0;a.playing=false;toast("Таймер: пахш қатъ шуд");render();return}}
 if(a.pos>=tr[a.ch].d){if(a.ch<tr.length-1){a.ch++;a.pos=0}else{a.pos=tr[a.ch].d;a.playing=false}aprog();render();return}
 aprog();tickUI();if(Math.floor(a.pos)%5===0)save()},1000);
function dl(list){const id=S.au.id,b=bk(id);if(locked(b)){S.payId=id;S.sheet="pay";render();return}
 const have=S.dl[id]||[],todo=list.filter(i=>!have.includes(i));if(!todo.length){toast("Аллакай боргирифта шудааст");return}
 todo.forEach(i=>{const e=document.getElementById("dlt"+i);if(e)e.classList.add("ing")});toast("Боргирифтан…");
 {const T=1400+250*todo.length,t0=Date.now(),iv=setInterval(()=>{const p=Math.min(99,Math.round((Date.now()-t0)/T*100));document.querySelectorAll("[data-dlall]").forEach(e=>{e.classList.add("ing");e.style.setProperty("--p",p+"%");e.textContent="Боргирӣ… "+p+"%"});todo.forEach(i=>{const e=document.getElementById("dlt"+i);if(e)e.innerHTML="<small>"+p+"%</small>"})},120);setTimeout(()=>clearInterval(iv),T)}
 setTimeout(()=>{S.dl[id]=[...new Set([...(S.dl[id]||[]),...todo])];toast(todo.length>1?"Аудиокитоб барои гӯш кардан бе интернет нигоҳ дошта шуд":"Боб боргирифта шуд");render()},1400+250*todo.length)}
function mini(){const a=S.au;if(!a)return "";const b=bk(a.id),t=tracks(b)[a.ch];
 return `<div class="mini-sp"></div><div class="mini"><button class="mini-main" data-openap aria-label="Плеерро кушодан"><span class="mini-cv">${cover(b)}</span><span class="mini-tx"><b>${b.t}</b><em>${t.n}</em></span></button><button class="mini-b" data-applay aria-label="${a.playing?"Таваққуф":"Пахш"}">${a.playing?PAUSE:PLAY}</button><button class="mini-b" data-mpclose aria-label="Пӯшидан">${P(IC_X,2)}</button><i class="mini-bar"><i id="mpbar" style="width:${a.pos/t.d*100}%"></i></i></div>`}

function nav(fn,dir){
 const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
 if(!document.startViewTransition||reduce||dir==="none"){fn();return}
 document.documentElement.dataset.vt=dir;
 try{const t=document.startViewTransition(fn);t.finished.finally(()=>{delete document.documentElement.dataset.vt})}catch(e){delete document.documentElement.dataset.vt;fn()}
}
{const o1=openDetail,o2=openBook,o3=openAudio;
 openDetail=id=>nav(()=>o1(id),"fwd");
 openBook=id=>nav(()=>o2(id),S.view==="read"?"none":"up");
 openAudio=id=>nav(()=>o3(id),S.view==="audio"?"none":"up")}

/* ---- пайвасти тугмаҳо: player (аз bind() даъват мешавад) ---- */
function bindPlayer($$){
 $$("[data-listen]",b=>b.onclick=()=>openAudio(+b.dataset.listen));
 $$("[data-applay]",b=>b.onclick=()=>{const a=S.au;if(locked(bk(a.id))&&a.pos>=FREE_SEC){S.payId=a.id;S.sheet="pay";render();return}a.playing=!a.playing;render()});
 $$("[data-apspeed]",b=>b.onclick=()=>{const L=[1,1.25,1.5,2,0.75];S.au.speed=L[(L.indexOf(S.au.speed)+1)%L.length];render()});
 $$("[data-apskip]",b=>b.onclick=()=>{const a=S.au,t=tracks(bk(a.id))[a.ch];let p=a.pos+ +b.dataset.apskip;if(locked(bk(a.id)))p=Math.min(p,FREE_SEC);a.pos=Math.max(0,Math.min(t.d,p));aprog();tickUI()});
 $$("[data-aptimer]",b=>b.onclick=()=>{const L=[0,900,1800,3600],a=S.au;a.sleepSet=L[(L.indexOf(a.sleepSet||0)+1)%L.length];a.sleep=a.sleepSet;toast(a.sleep?`Таймер: пас аз ${a.sleep/60} дақиқа қатъ мешавад`:"Таймер хомӯш");render()});
 $$("[data-goat]",b=>b.onclick=()=>{const a=S.au;a.ch=+b.dataset.goat;a.pos=0;a.playing=true;S.sheet=null;render()});
 $$("[data-dlt]",b=>b.onclick=()=>dl([+b.dataset.dlt]));
 $$("[data-dlall]",b=>b.onclick=()=>dl(tracks(bk(S.au.id)).map((_,i)=>i)));
 $$("[data-openap]",b=>b.onclick=()=>nav(()=>{S.apPrev=S.view;S.view="audio";render();window.scrollTo(0,0)},"up"));
 $$("[data-apmin]",b=>b.onclick=()=>nav(()=>{S.view=S.apPrev||"home";S.sheet=null;render();window.scrollTo(0,0)},"down"));
 $$("[data-mpclose]",b=>b.onclick=()=>{S.apos[S.au.id]={ch:S.au.ch,pos:S.au.pos};S.au=null;render()});
 const sk=document.getElementById("apseek");
 if(sk){sk.oninput=()=>{sk.dataset.drag=1;const a=S.au;let p=+sk.value;if(locked(bk(a.id))&&p>FREE_SEC){p=FREE_SEC;sk.value=p}a.pos=p;aprog();tickUI()};sk.onchange=()=>{delete sk.dataset.drag}}
}

/* ---- варақи atoc ---- */
SHEETS.atoc=X=>{if(!(S.au))return "";let h="";{const b=bk(S.au.id),tr=tracks(b),d=S.dl[b.id]||[];
  h=`<div class="sh-head"><b class="sh-t">Мундариҷа</b>${X}</div><div class="sh-list">${tr.map((t,i)=>`<div class="sh-row ${S.au.ch===i?"cur":""}"><button class="sh-main" data-goat="${i}"><span>${S.au.ch===i?EQ:""}${t.n}</span><em>${fmt(t.d)} · ${Math.max(1,Math.round(t.d/60))} мб</em></button><button class="dlb ${d.includes(i)?"done":""}" data-dlt="${i}" id="dlt${i}" aria-label="${d.includes(i)?"Боргирифта шуд":"Боргирифтан"}">${d.includes(i)?P(IC_OK,2.4):P(IC_DL,2)}</button></div>`).join("")}</div>
  <button class="pay-later full" data-dlall>${P(IC_DL,2)}${d.length===tr.length?"Ҳама боргирифта шуд":"Пурра боргирифтан"}</button>`};return h};
