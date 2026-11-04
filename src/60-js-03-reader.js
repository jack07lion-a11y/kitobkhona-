const PLAY=FILL('<path d="M7 4.5v15l12.5-7.5z"/>'),PAUSE=FILL('<rect x="6" y="4.5" width="4" height="15" rx="1.2"/><rect x="14" y="4.5" width="4" height="15" rx="1.2"/>');
const B10=P('<path d="M4.5 12a7.5 7.5 0 107.5-7.5H8.5"/><path d="M11 1.5L8 4.5l3 3"/><text x="12.2" y="15.4" font-size="7" font-weight="800" text-anchor="middle" fill="currentColor" stroke="none" font-family="Inter">10</text>',1.7);
const F10=P('<path d="M19.5 12A7.5 7.5 0 1112 4.5h3.5"/><path d="M13 1.5l3 3-3 3"/><text x="11.8" y="15.4" font-size="7" font-weight="800" text-anchor="middle" fill="currentColor" stroke="none" font-family="Inter">10</text>',1.7);
const TIMER=P('<circle cx="12" cy="13.5" r="7.5"/><path d="M12 9.5v4l2.5 2M9.5 2.5h5"/>',1.8),EQ=P('<path d="M5 10v4M9 7v10M13 9v6M17 6v12"/>',2.2);

function nch(b){return isTx(b)?txChapters(b).length:1}
function rdInfo(b){if(!isTx(b))return{tc:null,cum:[0,1],tot:1};const d=TX[b.id];if(d._inf)return d._inf;const tc=txChapters(b),cum=[0];
 tc.forEach(c=>{if(!c._t){c._t=[];c._o=[];let o=0;c.bl.forEach(x=>{const a=x[0]==="p"||x[0]==="sub"?[x[1]]:x[0]==="v"?(x[1]||[]):[];a.forEach(s=>{s=String(s==null?"":s);c._t.push(s);c._o.push(o);o+=s.length})});c._len=Math.max(1,o)}cum.push(cum[cum.length-1]+c._len)});
 return d._inf={tc,cum,tot:Math.max(1,cum[cum.length-1])}}
function chHTML(b,ci){HC=0;HCI=ci;
 if(isTx(b)){const c=txChapters(b)[ci];return `${c.part?`<p class="rd-part">${escH(c.part)}</p>`:""}${ci===0?`<h1 class="rd-title">${escH(b.t)}</h1><p class="rd-au">${escH(b.a)}</p>`:""}<h2 class="rd-h" data-ch="0" style="break-before:auto">${escH(c.n)}</h2>${blocksHTML(c.bl)}`}
 const chs=chapters(b);return `<p class="rd-note">${locked(b)?"Парчаи ройгон · Премиум":"Матни намуна"}</p><h1 class="rd-title">${b.t}</h1><p class="rd-au">${b.a}</p>${chs.map((c,i)=>`<h2 class="rd-h" data-ch="${i}">${c.n}</h2>${c.ps.map(p=>`<p>${p}</p>`).join("")}`).join("")}`}
function reader(){
 const b=bk(S.rdId),f=S.pref,ci=Math.min(S.rdCh[b.id]||0,nch(b)-1),vm=f.dir==="v";
 const CH=d=>P(d,2.2);
 return `<section class="rd t-${f.th}${vm?" vm":""}${S.rdUI?" ui":""}${RQ?" hq":""}" style="--lh:${f.lh||1.6};--fs:${f.fs}px;--ff:${f.ff==="serif"?'\'Lora\',Georgia,serif':'var(--font)'}">
  <div class="rd-top"><button class="rd-ic x" data-closeread aria-label="Пас">${CH('<path d="M15 5l-7 7 7 7"/>')}</button><span class="rd-ch" id="rdch" translate="no">${escH(b.t)}</span>
   <button class="rd-ic" id="rdmark" aria-label="Хатчӯб">${P(IC_MARK,2)}</button><button class="rd-ic rd-aa" data-sheet="set" aria-label="Танзимоти хондан"><b translate="no">Аа</b></button></div>
  <div class="rd-view${vm?" vm":""}" id="rdview"><div class="rd-flow" id="rdflow">${vm?"":chHTML(b,ci)}</div>${vm?"":`<i class="rd-dim" id="rddim"></i><div class="rd-tsheet" id="rdtop" aria-hidden="true"></div>`}</div>
  <span class="rd-mini" id="rdmini"></span>
  <div class="rd-foot"><div class="rf-t"><span id="rdnum" class="rd-pg">1/1</span><span id="rdpct" class="rd-pc">0%</span></div><input type="range" class="rd-scr big" id="rdscr" min="0" max="1000" step="1" value="0" aria-label="Гузариш ба саҳифа"><div class="rf-b"><button class="rd-ic" data-sheet="rds" aria-label="Ҷустуҷӯ дар китоб">${P(I.search,2)}</button><button class="rd-ic" data-sheet="toc" aria-label="Мундариҷа">${P(I.list,2)}</button></div></div>
  <div class="rd-sbar"><b id="rdsn" translate="no">${RQ&&HI>=0?`${HI+1} / ${HITS.length}`:""}</b><button class="rd-ic" data-hit="-1" aria-label="Пешина">${CH('<path d="M15 5l-7 7 7 7"/>')}</button><button class="rd-ic" data-hit="1" aria-label="Оянда">${CH('<path d="M9 5l7 7-7 7"/>')}</button><button class="rd-ic" data-hitx aria-label="Пӯшидани ҷустуҷӯ">${P(IC_X,2.2)}</button></div>
 </section>`;
}
let RD=null,CAL=null;
const EASE="cubic-bezier(.32,.72,0,1)";
function cppEst(W,H){const fs=S.pref.fs,lh=S.pref.lh||1.6;return Math.max(300,Math.round((W-48)/(fs*.5)*((H-118)/(fs*lh))*.88))}
function toggleUI(){S.rdUI=!S.rdUI;const r=document.querySelector(".rd");if(r)r.classList.toggle("ui",S.rdUI)}
function payNow(){S.payId=S.rdId;S.sheet="pay";render()}
function rdUpdate(b,ci,fr,frE){const R=RD,inf=rdInfo(b);let gf,gfE;
 if(inf.tc){const L=inf.tc[ci]._len,c0=inf.cum[ci];gf=(c0+fr*L)/inf.tot;gfE=(c0+frE*L)/inf.tot}else{gf=fr;gfE=frE}
 const M=R.M=inf.tc?Math.max(1,Math.round(inf.tot/R.cpp)):Math.max(1,R.total||1);
 const N=Math.min(M,Math.floor(gf*M+1e-6)+1),pct=Math.min(100,Math.round(gfE*100));S.prog[b.id]=pct;R.gf=gf;
 const set=(id,t)=>{const e=document.getElementById(id);if(e)e.textContent=t};
 set("rdch",inf.tc&&inf.tc[ci].n?inf.tc[ci].n:b.t);set("rdnum",N+"/"+M);set("rdmini",N+" / "+M);set("rdpct",pct+"%");
 const s=document.getElementById("rdscr");if(s&&!s.dataset.drag){s.value=Math.round(gf*1000);s.style.setProperty("--p",gf*100+"%")}
 const m=document.getElementById("rdmark");if(m)m.classList.toggle("on",(S.marks[b.id]||[]).includes(mkey(b.id)))}
let TK=null,SCRN=-1,PAYASK=0,SVT=0;
function tick(){let ok=false;try{if(navigator.vibrate)ok=navigator.vibrate(7)}catch(_){}
 if(ok)return;try{if(!TK){TK=document.createElement("label");TK.style.cssText="position:fixed;left:-9999px;top:0;opacity:0;pointer-events:none";TK.innerHTML='<input type="checkbox" switch tabindex="-1">';document.body.appendChild(TK)}TK.click()}catch(_){}}
function rdLive(ci,fr){const R=RD,b=R.b,id=b.id;
 if(R.vert){const sec=R.f.querySelector(`[data-ci="${ci}"]`);if(sec){R.v.scrollTop=sec.offsetTop+fr*sec.offsetHeight-R.H*.3;return}S.rdCh[id]=ci;S.rdFr[id]=fr;setupVert();return}
 if(ci===Math.min(S.rdCh[id]||0,nch(b)-1)){const p=Math.max(0,Math.min(R.total-1,Math.floor(fr*R.total)));if(p!==(S.pages[id]||0)){R.f.style.transition="none";placeBase(p);hideTop();showPage(p)}return}
 S.rdCh[id]=ci;S.rdFr[id]=fr;R.f.innerHTML=chHTML(b,ci);setupReader()}
function bindScr(){const s=document.getElementById("rdscr");if(!s)return;const R=RD,b=R.b,inf=rdInfo(b);
 const loc=g=>{if(!inf.tc)return{ci:0,fr:g};const t=g*inf.tot;let ci=0;while(ci<inf.tc.length-1&&inf.cum[ci+1]<=t)ci++;return{ci,fr:Math.min(.9999,Math.max(0,(t-inf.cum[ci])/inf.tc[ci]._len))}};
 let raf=0,pend=0;
 s.oninput=()=>{s.dataset.drag=1;let g=+s.value/1000;const M=R.M||1;
  if(locked(b)){const lim=(FREE_PAGES-.5)/M;if(g>lim){g=lim;s.value=Math.round(g*1000);PAYASK=1}}
  const N=Math.min(M,Math.floor(g*M)+1),set=(id,t)=>{const e=document.getElementById(id);if(e)e.textContent=t};
  set("rdnum",N+"/"+M);set("rdpct",Math.round(g*100)+"%");
  if(N!==SCRN){SCRN=N;tick()}
  pend=g;if(!raf)raf=requestAnimationFrame(()=>{raf=0;const l=loc(pend);rdLive(l.ci,l.fr)})};
 s.onchange=()=>{delete s.dataset.drag;SCRN=-1;if(PAYASK){PAYASK=0;payNow()}}}
function rdGoto(ci,fr){const R=RD,b=R.b,id=b.id,inf=rdInfo(b);
 const gf=inf.tc?(inf.cum[ci]+fr*inf.tc[ci]._len)/inf.tot:fr;
 if(locked(b)&&Math.floor(gf*(R.M||1))>=FREE_PAGES){const s=document.getElementById("rdscr");if(s)s.value=Math.round(R.gf*1000);payNow();return}
 if(R.vert){const sec=R.f.querySelector(`[data-ci="${ci}"]`);if(sec){R.v.scrollTop=sec.offsetTop+fr*sec.offsetHeight-R.H*.3;return}}
 else if(ci===Math.min(S.rdCh[id]||0,nch(b)-1)){const p=Math.min(R.total-1,Math.floor(fr*R.total));R.f.style.transition="none";placeBase(p);hideTop();showPage(p);return}
 S.rdCh[id]=ci;S.rdFr[id]=fr;render()}
function hitInPlace(){const R=RD;if(!R)return false;const h=HITS[HI];if(!h)return false;
 if(R.vert){const sec=R.f.querySelector(`[data-ci="${h[0]}"]`);if(!sec)return false;const ms=sec.querySelectorAll(".rd-hit"),el=ms[h[1]];if(!el)return false;
  R.f.querySelectorAll(".rd-hit.cur").forEach(e=>e.classList.remove("cur"));el.classList.add("cur");
  R.v.scrollTop=el.getBoundingClientRect().top-R.v.getBoundingClientRect().top+R.v.scrollTop-R.H*.3;return true}
 if(h[0]!==Math.min(S.rdCh[R.b.id]||0,nch(R.b)-1))return false;
 const ms=R.f.querySelectorAll(".rd-hit"),el=ms[h[1]];if(!el)return false;
 R.f.querySelectorAll(".rd-hit.cur").forEach(e=>e.classList.remove("cur"));R.tf.querySelectorAll(".rd-hit.cur").forEach(e=>e.classList.remove("cur"));
 el.classList.add("cur");const t2=R.tf.querySelectorAll(".rd-hit")[h[1]];if(t2)t2.classList.add("cur");
 const p=Math.min(R.total-1,Math.floor(el.offsetLeft/R.W));R.f.style.transition="none";placeBase(p);hideTop();showPage(p);return true}
function hitGo(){const h=HITS[HI];if(!h)return;HITCI=h[0];HITK=h[1];RQ=RQT.trim();
 const e=document.getElementById("rdsn");if(e)e.textContent=`${HI+1} / ${HITS.length}`;
 if(S.sheet===null&&hitInPlace())return;
 const id=S.rdId;S.rdCh[id]=h[0];delete S.rdFr[id];S.rdGo={k:h[1]};S.sheet=null;render()}
function runSearch(q){HITS=[];HI=-1;q=q.trim();if(q.length<2)return;const b=bk(S.rdId);if(!isTx(b))return;const ql=q.toLowerCase(),inf=rdInfo(b);
 inf.tc.forEach((c,ci)=>{let k=0;c._t.forEach((s,ti)=>{const l=s.toLowerCase();let i=0,j;while(HITS.length<30000&&(j=l.indexOf(ql,i))>=0){HITS.push([ci,k++,ti,j]);i=j+ql.length}})})}
function rdsFill(){const cnt=document.getElementById("rdscnt"),res=document.getElementById("rdsres");if(!cnt||!res)return;
 const q=RQT.trim(),b=bk(S.rdId),inf=rdInfo(b);
 if(q.length<2){cnt.textContent=q.length?"Ақалли 2 ҳарф нависед":"";res.innerHTML="";return}
 if(!HITS.length){cnt.textContent="Натиҷа ёфт нашуд";res.innerHTML="";return}
 cnt.textContent=`${HITS.length>=30000?"30000+":HITS.length} натиҷа ёфт шуд`;
 const ql=q.length,M=(RD&&RD.M)||1,out=[];
 for(let i=0;i<Math.min(HITS.length,200);i++){const [ci,,ti,j]=HITS[i],c=inf.tc[ci],s=c._t[ti],a=Math.max(0,j-30),z=Math.min(s.length,j+ql+60);
  const gf=(inf.cum[ci]+c._o[ti]+j)/inf.tot,pg=Math.min(M,Math.floor(gf*M)+1);
  out.push(`<button class="rds-row" style="--i:${Math.min(i,12)}" data-rdhit="${i}"><span class="rds-pg">Саҳифаи ${pg}</span><svg class="rds-ch" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg><span class="rds-sn" translate="no">${a>0?"…":""}${escH(s.slice(a,j))}<mark class="rd-hit">${escH(s.slice(j,j+ql))}</mark>${escH(s.slice(j+ql,z))}${z<s.length?"…":""}</span></button>`)}
 if(HITS.length>200)out.push(`<p class="sh-empty">Танҳо 200 натиҷаи аввал нишон дода шуд. Калимаро дақиқтар нависед.</p>`);
 res.innerHTML=out.join("")}
function setupReader(){
 if(S.pref.dir==="v")return setupVert();
 const v=document.getElementById("rdview"),f=document.getElementById("rdflow"),top=document.getElementById("rdtop");if(!v){RD=null;return}
 const b=bk(S.rdId),W=v.clientWidth,PADX=24,inf=rdInfo(b);
 f.style.columnWidth=(W-2*PADX)+"px";f.style.columnGap=2*PADX+"px";
 top.innerHTML=`<div class="rd-flow">${f.innerHTML}</div>`;const tf=top.firstChild;tf.style.columnWidth=f.style.columnWidth;tf.style.columnGap=f.style.columnGap;
 const last=f.lastElementChild,total=Math.max(1,Math.floor((last.offsetLeft+last.offsetWidth-1)/W)+1);
 const heads=[...f.querySelectorAll("[data-ch]")].map(h=>Math.floor(h.offsetLeft/W));
 const ci=Math.min(S.rdCh[b.id]||0,nch(b)-1),key=W+"|"+S.pref.fs+"|"+(S.pref.lh||1.6)+"|"+S.pref.ff+"|"+v.clientHeight;
 if(inf.tc&&total>=4)CAL={key,cpp:Math.max(100,inf.tc[ci]._len/total)};
 const cpp=CAL&&CAL.key===key?CAL.cpp:cppEst(W,v.clientHeight);
 RD={b,W,total,heads,f,v,top,tf,busy:false,cpp,ci};
 let p;const go=S.rdGo;S.rdGo=null;
 if(go&&go.k!=null){const el=f.querySelectorAll(".rd-hit")[go.k];p=el?Math.floor(el.offsetLeft/W):0}
 else{const fr=S.rdFr[b.id];p=fr!=null?Math.min(total-1,Math.floor(fr*total+1e-6)):Math.min(S.pages[b.id]||0,total-1)}
 p=Math.max(0,Math.min(p,total-1));if(locked(b))p=Math.min(p,FREE_PAGES-1);
 placeBase(p);hideTop();showPage(p);bindScr();
 document.querySelectorAll("[data-chp]").forEach(el=>el.textContent=heads[+el.dataset.chp]+1);
 let g=null;
 const dim=o=>{const e=document.getElementById("rddim");if(e)e.style.opacity=o},P0=()=>S.pages[b.id]||0;
 const RES=x=>x<.8?x:Math.min(.96,.8+(x-.8)*.35); // оғирлик: охирида бармоқ қарши мекунад, то қўйилмагунча саҳифа ўтмайди
 const prep=d=>{const p0=P0();if(d>0){placeBase(p0,0);setTop(p0+1,W,0)}else{placeBase(p0-1,-.24*W);setTop(p0,0,0)}};
 const frame=(d,pr)=>{const p0=P0();
  if(d>0){setTop(p0+1,(1-pr)*W,0);placeBase(p0,-pr*.24*W);dim(pr*.3)}
  else{setTop(p0,pr*W,0);placeBase(p0-1,-(1-pr)*.24*W);dim((1-pr)*.3)}};
 const unprep=()=>{hideTop();dim(0);placeBase(P0(),0)};
 v.onpointerdown=e=>{if(RD.busy||S.sheet||e.button>0)return;g={x0:e.clientX,y0:e.clientY,t:performance.now(),dx:0,dir:0,lock:"",vx:0,p:0,lx:e.clientX,lt:performance.now()};try{v.setPointerCapture(e.pointerId)}catch(_){}};
 v.onpointermove=e=>{if(!g)return;const dx=e.clientX-g.x0,dy=e.clientY-g.y0,now=performance.now();
  g.vx=.7*g.vx+.3*((e.clientX-g.lx)/Math.max(1,now-g.lt));g.lx=e.clientX;g.lt=now;g.dx=dx;
  if(!g.lock){if(Math.abs(dx)<8&&Math.abs(dy)<8)return;g.lock=Math.abs(dx)>=Math.abs(dy)*1.2?"h":"v"}
  if(g.lock!=="h")return;
  const d=dx<0?1:-1;
  if(Math.abs(dx)>1&&d!==g.dir&&!(g.dir===2&&d===g.side)){ // аввалин ҳаракат ё бармоқ ба тарафи муқобил гузашт
   if(g.dir===1||g.dir===-1)unprep();else RD.f.style.transform=`translateX(${-P0()*W}px)`;
   if(canGo(d,false)){g.dir=d;prep(d)}else{g.dir=2;g.side=d}}
  if(g.dir===1||g.dir===-1){g.p=RES(Math.min(1,Math.abs(dx)/(W*.95)));frame(g.dir,g.p)}
  else if(g.dir===2)RD.f.style.transform=`translateX(${-P0()*W+dx*.18}px)`};
 v.onpointerup=v.onpointercancel=e=>{if(!g)return;const G0=g;g=null;
  if(!G0.lock){if(e.type==="pointerup"&&performance.now()-G0.t<400)toggleUI();return} // зарб задан: танҳо панелро нишон/пинҳон мекунад, саҳифа намегардад
  if(G0.lock!=="h"||!G0.dir)return;
  if(G0.dir===2){RD.f.style.transition=`transform .35s ${EASE}`;placeBase(P0());setTimeout(()=>RD&&(RD.f.style.transition="none"),360);canGo(G0.dx<0?1:-1,true);return}
  const d=G0.dir,pr=G0.p,toward=d>0?G0.vx<0:G0.vx>0,speed=Math.abs(G0.vx);
  finishTurn(d,pr,pr>.4||(toward&&speed>.5&&pr>.06),speed)};
}
function setupVert(){
 const v=document.getElementById("rdview"),f=document.getElementById("rdflow");if(!v){RD=null;return}
 const b=bk(S.rdId),id=b.id,n=nch(b),inf=rdInfo(b),W=v.clientWidth,H=v.clientHeight,lk=locked(b);
 const cpp=cppEst(W,H);let ci0=lk?0:Math.min(S.rdCh[id]||0,n-1);
 RD={b,vert:true,v,f,W,H,cpp,total:0,busy:false,lo:Math.max(0,ci0-1),hi:ci0,ci:ci0};const R=RD;
 const sec=ci=>`<section class="rd-chap" data-ci="${ci}">${chHTML(b,ci)}</section>`;
 const go=S.rdGo;S.rdGo=null;
 if(lk){f.innerHTML=sec(0)+`<div class="rd-paywall"><button class="pay-btn" data-paynow>Бо Премиум идома диҳед</button></div>`;f.firstChild.style.cssText=`max-height:${Math.round(H*FREE_PAGES*.9)}px;overflow:hidden`}
 else{let s="";R.hi=Math.min(n-1,ci0+1);for(let c=R.lo;c<=R.hi;c++)s+=sec(c);f.innerHTML=s}
 f.onclick=e=>{if(e.target.closest("[data-paynow]"))payNow()};
 const s0=f.querySelector(`[data-ci="${ci0}"]`);let y=0;
 if(go&&go.k!=null){const el=s0.querySelectorAll(".rd-hit")[go.k];y=el?el.getBoundingClientRect().top-v.getBoundingClientRect().top+v.scrollTop-H*.3:s0.offsetTop-H*.3}
 else{let fr=S.rdFr[id];if(fr==null){const L=inf.tc?inf.tc[ci0]._len:1;fr=Math.min(1,(S.pages[id]||0)/Math.max(1,Math.round(L/cpp)))}y=s0.offsetTop+fr*s0.offsetHeight-H*.3}
 v.scrollTop=Math.max(0,y);
 const chPg=ci=>Math.max(1,Math.round((inf.tc?inf.tc[ci]._len:1)/cpp));
 let raf=0,sv=0;
 const upd=()=>{const line=v.scrollTop+H*.3;let cur=R.lo;const ss=f.querySelectorAll(".rd-chap");ss.forEach(s=>{if(s.offsetTop<=line)cur=+s.dataset.ci});
  const s=f.querySelector(`[data-ci="${cur}"]`),fr=Math.max(0,Math.min(1,(line-s.offsetTop)/Math.max(1,s.offsetHeight)));
  S.rdCh[id]=cur;S.rdFr[id]=fr;S.pages[id]=Math.floor(fr*chPg(cur));R.ci=cur;
  rdUpdate(b,cur,fr,Math.min(1,fr+H*.4/Math.max(1,s.offsetHeight)));
  if(!lk){
   if(v.scrollHeight-v.scrollTop-H<H*1.5&&R.hi<n-1){R.hi++;f.insertAdjacentHTML("beforeend",sec(R.hi))}
   if(v.scrollTop<H*1.2&&R.lo>0){R.lo--;const h0=v.scrollHeight,t0=v.scrollTop;f.insertAdjacentHTML("afterbegin",sec(R.lo));v.scrollTop=t0+(v.scrollHeight-h0)}}
  clearTimeout(sv);sv=setTimeout(save,800)};
 v.onscroll=()=>{if(raf)return;raf=requestAnimationFrame(()=>{raf=0;if(RD===R)upd()})};
 v.onclick=e=>{if(e.target.closest("button,a"))return;const sl=window.getSelection&&String(window.getSelection());if(sl)return;toggleUI()};
 R.M=0;upd();bindScr();
}
function finishTurn(d,from,done,speed){
 const R=RD,W=R.W,p0=S.pages[R.b.id]||0,to=done?1:0,dur=Math.max(180,Math.min(380,Math.abs(to-from)*W/Math.max(.9,speed||0)));
 R.busy=true;const t0=performance.now(),dimEl=document.getElementById("rddim");
 const fr=pr=>{const q=pr;if(d>0){setTop(p0+1,(1-q)*W,0);placeBase(p0,-q*.24*W);if(dimEl)dimEl.style.opacity=q*.3}else{setTop(p0,q*W,0);placeBase(p0-1,-(1-q)*.24*W);if(dimEl)dimEl.style.opacity=(1-q)*.3}};
 const step=now=>{if(RD!==R)return;const k=Math.min(1,(now-t0)/dur),e=1-Math.pow(1-k,3);fr(from+(to-from)*e);
  if(k<1){requestAnimationFrame(step);return}
  hideTop();if(dimEl)dimEl.style.opacity=0;
  if(done)placeBase(p0+d,0);else placeBase(p0,0);
  R.busy=false;if(done)showPage(p0+d)};
 requestAnimationFrame(step)}
function placeBase(p,dx){RD.f.style.transform=`translateX(${-p*RD.W+(dx||0)}px)`}
function setTop(p,x,ms){const t=RD.top;RD.tf.style.transform=`translateX(${-p*RD.W}px)`;t.style.transition=ms?`transform ${ms}ms ${EASE}`:"none";t.style.visibility="visible";t.style.transform=`translate3d(${x}px,0,0)`}
function hideTop(){const t=RD.top;t.style.transition="none";t.style.visibility="hidden";t.style.transform="none"}
function showPage(p){
 const R=RD,b=R.b;S.pages[b.id]=p;S.rdFr[b.id]=p/R.total;
 rdUpdate(b,Math.min(S.rdCh[b.id]||0,nch(b)-1),p/R.total,(p+1)/R.total);
 clearTimeout(SVT);SVT=setTimeout(save,400);
}
function canGo(d,act){const p=(S.pages[RD.b.id]||0)+d,id=RD.b.id,tc=isTx(RD.b)?txChapters(RD.b):null,ci=S.rdCh[id]||0;
 if(tc&&p<0){if(ci>0&&act)goChap(id,ci-1,1e9);return false}
 if(tc&&p>=RD.total){if(ci<tc.length-1){if(act)goChap(id,ci+1,0)}else if(act)toast("Китоб тамом шуд!");return false}
 if(p<0)return false;
 if(locked(RD.b)&&p>=FREE_PAGES){if(act){S.payId=RD.b.id;S.sheet="pay";render()}return false}
 if(p>=RD.total){if(act)toast("Китоб тамом шуд! +5 мукофот (намуна)");return false}
 return true}
function turn(d){if(!RD||RD.vert||S.sheet||RD.busy)return;if(!canGo(d,true))return;
 const W=RD.W,p0=S.pages[RD.b.id]||0;
 if(d>0){placeBase(p0,0);setTop(p0+1,W,0)}else{placeBase(p0-1,-.24*W);setTop(p0,0,0)}
 void RD.top.offsetWidth;finishTurn(d,0,true,.9)}

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
}
