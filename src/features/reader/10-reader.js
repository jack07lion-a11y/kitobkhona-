let RQ="",RQT="",HITS=[],HI=-1,HITCI=-1,HITK=-1,HC=0,HCI=0;
function hl(s){s=String(s);if(!RQ)return escH(s);const l=s.toLowerCase(),q=RQ.toLowerCase();let i=0,o="",j;
 while((j=l.indexOf(q,i))>=0){o+=escH(s.slice(i,j))+`<mark class="rd-hit${HCI===HITCI&&HC===HITK?" cur":""}">`+escH(s.slice(j,j+q.length))+"</mark>";i=j+q.length;HC++}
 return o+escH(s.slice(i))}
function blocksHTML(bl){return bl.map(x=>x[0]==="p"?`<p>${hl(x[1])}</p>`:x[0]==="v"?`<div class="rd-v">${(x[1]||[]).map(hl).join("<br>")}</div>`:x[0]==="sub"?`<p class="rd-sub">${hl(x[1])}</p>`:x[0]==="s"?`<p class="rd-sep">* * *</p>`:"").join("")}

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
   ${fabHTML("rd-ic")}<button class="rd-ic" id="rdmark" aria-label="Хатчӯб">${P(IC_MARK,2)}</button><button class="rd-ic rd-aa" data-sheet="set" aria-label="Танзимоти хондан"><b translate="no">Аа</b></button></div>
  <div class="rd-view${vm?" vm":""}" id="rdview"><div class="rd-flow" id="rdflow">${vm?"":chHTML(b,ci)}</div>${vm?"":`<i class="rd-dim" id="rddim"></i><div class="rd-tsheet" id="rdtop" aria-hidden="true"></div>`}</div>
  <span class="rd-mini" id="rdmini"></span>
  <div class="rd-foot"><div class="rf-t"><span id="rdnum" class="rd-pg">1/1</span><span id="rdpct" class="rd-pc">0%</span></div><div class="rd-sw"><input type="range" class="rd-scr big" id="rdscr" min="0" max="1000" step="1" value="0" aria-label="Гузариш ба саҳифа"><i class="rd-sh" id="rdsh" aria-hidden="true"></i></div><div class="rf-b"><button class="rd-ic" data-sheet="rds" aria-label="Ҷустуҷӯ дар китоб">${P(I.search,2)}</button><button class="rd-ic" data-sheet="toc" aria-label="Мундариҷа">${P(I.list,2)}</button></div></div>
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
function tick(){let ok=false;try{if(navigator.vibrate)ok=navigator.vibrate(4)}catch(_){}
 if(ok)return;try{if(!TK){TK=document.createElement("label");TK.style.cssText="position:fixed;left:-9999px;top:0;opacity:0;pointer-events:none";TK.innerHTML='<input type="checkbox" switch tabindex="-1">';document.body.appendChild(TK)}TK.click()}catch(_){}}
function rdLive(ci,fr){const R=RD,b=R.b,id=b.id;
 if(R.vert){const sec=R.f.querySelector(`[data-ci="${ci}"]`);if(sec){R.v.scrollTop=sec.offsetTop+fr*sec.offsetHeight-R.H*.3;return}S.rdCh[id]=ci;S.rdFr[id]=fr;setupVert();return}
 if(ci===Math.min(S.rdCh[id]||0,nch(b)-1)){const p=Math.max(0,Math.min(R.total-1,Math.floor(fr*R.total)));if(p!==(S.pages[id]||0)){R.f.style.transition="none";placeBase(p);hideTop();showPage(p)}return}
 S.rdCh[id]=ci;S.rdFr[id]=fr;R.f.innerHTML=chHTML(b,ci);setupReader()}
function bindScr(){const s=document.getElementById("rdscr");if(!s)return;const R=RD,b=R.b,inf=rdInfo(b);
 const loc=g=>{if(!inf.tc)return{ci:0,fr:g};const t=g*inf.tot;let ci=0;while(ci<inf.tc.length-1&&inf.cum[ci+1]<=t)ci++;return{ci,fr:Math.min(.9999,Math.max(0,(t-inf.cum[ci])/inf.tc[ci]._len))}};
 let raf=0,pend=0;
 /* g — ҷои умумии китоб (0..1): ҳам аз клавиатура/ангушт (oninput), ҳам аз «ўлчови катта» (поён) */
 const apply=g0=>{let g=g0;const M=R.M||1;
  if(locked(b)){const lim=(FREE_PAGES-.5)/M;if(g>lim){g=lim;PAYASK=1}}
  const N=Math.min(M,Math.floor(g*M)+1),set=(id,t)=>{const e=document.getElementById(id);if(e)e.textContent=t};
  set("rdnum",N+"/"+M);set("rdpct",Math.round(g*100)+"%");
  if(N!==SCRN){SCRN=N;tick()}
  pend=g;if(!raf)raf=requestAnimationFrame(()=>{raf=0;const l=loc(pend);rdLive(l.ci,l.fr)});return{g,N}};
 s.oninput=()=>{s.dataset.drag=1;const r=apply(+s.value/1000);if(r.g*1000<+s.value)s.value=Math.round(r.g*1000)};
 s.onchange=()=>{delete s.dataset.drag;SCRN=-1;if(PAYASK){PAYASK=0;payNow()}};
 /* «Ўлчови катта»: сурилиш аз ҷои ангушт оғоз мешавад ва ҳар ~12 пикселӣ = 1 саҳифа (дақиқ). Ба канор расед — шитобон давом мекунад. */
 const PPG=14;let st=null,bub=null,loop=0;const H=document.getElementById("rdsh")||s; // H — ягона ҷойи ламс: сабти худи range дар iPhone шитобон мепарид
 /* ангушт аз навор боло барад — суръат камтар (аниқ): 0–40px — оддӣ; 40–110px — 40%; боло — 12% (тақрибан 1 саҳифа ба 100 пиксел) */
 const fine=dy=>dy<40?1:dy<110?.4:.12;
 const bubble=()=>{if(!bub){bub=document.createElement("div");bub.className="rd-zb";(s.parentNode||document.body).appendChild(bub)}return bub};
 const stop=ok=>{if(!st)return;const id=st.id;st=null;cancelAnimationFrame(loop);try{H.releasePointerCapture(id)}catch(_){}
  if(bub){bub.remove();bub=null}delete s.dataset.drag;SCRN=-1;s.classList.remove("zoom");
  if(PAYASK){PAYASK=0;payNow()}setTimeout(()=>{const e=document.getElementById("rdscr");if(e&&!e.dataset.drag&&R.gf!=null){e.value=Math.round(R.gf*1000);e.style.setProperty("--p",R.gf*100+"%")}},120)};
 const step=t=>{if(!st)return;const r=s.getBoundingClientRect(),M=R.M||1,dt=Math.min(.05,(t-st.t)/1000||0);st.t=t;
  const fk=fine(Math.max(0,r.top-st.cy));st.acc+=(st.cx-st.lx)/PPG*fk;st.lx=st.cx;
  const zone=64,l=st.cx-r.left,rr=r.right-st.cx;let dir=0,prox=0;
  if(l<zone){dir=-1;prox=Math.min(1,(zone-l)/zone)}else if(rr<zone){dir=1;prox=Math.min(1,(zone-rr)/zone)}
  if(dir)st.extra+=dir*prox*prox*Math.max(120,M/6)*dt;
  st.extra=Math.max(-st.p0-st.acc,Math.min(M-1-st.p0-st.acc,st.extra));
  const page=Math.max(0,Math.min(M-1,Math.round(st.p0+st.acc+st.extra)));
  const res=apply((page+.5)/M),tf=Math.max(0,Math.min(1,(st.cx-r.left)/(r.width||1)));
  s.value=Math.round(tf*1000);s.style.setProperty("--p",tf*100+"%");
  const bb=bubble();bb.textContent=res.N+" / "+M+(fk<1?" · аниқ":"");bb.classList.toggle("fine",fk<1);bb.style.left=Math.max(8,Math.min(r.width-8,tf*r.width+(r.left-(bb.parentNode.getBoundingClientRect().left))))+"px";
  loop=requestAnimationFrame(step)};
 const down=e=>{if(st||(e.button!=null&&e.button>0))return;e.preventDefault();
  const r=s.getBoundingClientRect(),M=R.M||1;let g0=R.gf||0;const tx=r.left+g0*r.width;
  if(Math.abs(e.clientX-tx)>34)g0=Math.max(0,Math.min(1,(e.clientX-r.left)/(r.width||1)));
  st={id:e.pointerId,x:e.clientX,cx:e.clientX,cy:e.clientY,lx:e.clientX,acc:0,p0:Math.max(0,Math.min(M-1,Math.floor(g0*M+1e-6))),extra:0,t:performance.now()};
  s.dataset.drag=1;s.classList.add("zoom");try{H.setPointerCapture(e.pointerId)}catch(_){}
  cancelAnimationFrame(loop);loop=requestAnimationFrame(step)};
 H.addEventListener("pointerdown",down);
 H.addEventListener("pointermove",e=>{if(st&&e.pointerId===st.id){st.cx=e.clientX;st.cy=e.clientY}});
 ["pointerup","pointercancel","lostpointercapture"].forEach(n=>H.addEventListener(n,e=>{if(st&&e.pointerId===st.id)stop()}));
 H.addEventListener("touchstart",e=>e.preventDefault(),{passive:false});
 H.addEventListener("touchmove",e=>e.preventDefault(),{passive:false});
 H.addEventListener("mousedown",e=>e.preventDefault())}
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

/* ---- пайвасти тугмаҳо: reader (аз bind() даъват мешавад) ---- */
function bindReader($$){
 $$("[data-closeread]",b=>b.onclick=()=>{fbqLeave();nav(()=>{S.view=S.rdPrev||"home";S.sheet=null;render();window.scrollTo(0,0)},"down")});
 $$("[data-toct]",b=>b.onclick=()=>{S.tocTab=+b.dataset.toct;render()});
 const jump=p=>{const id=S.rdId;if(locked(bk(id))&&p>=FREE_PAGES){S.payId=id;S.sheet="pay";render();return}S.pages[id]=p;delete S.rdFr[id];S.sheet=null;render()};
 $$("[data-goch]",b=>b.onclick=()=>jump(RD&&RD.heads?RD.heads[+b.dataset.goch]:0));
 $$("[data-gopg]",b=>b.onclick=()=>{const k=+b.dataset.gopg,id=S.rdId;if(isTx(bk(id)))goChap(id,Math.floor(k/1e5),k%1e5);else jump(k)});
 $$("[data-gotch]",b=>b.onclick=()=>goChap(S.rdId,+b.dataset.gotch,0));
 $$("[data-lh]",b=>b.onclick=()=>{S.pref.lh=Math.round(Math.max(1.2,Math.min(2.2,(S.pref.lh||1.6)+ +b.dataset.lh*.1))*10)/10;render()});
 $$("[data-dir]",b=>b.onclick=()=>{S.pref.dir=b.dataset.dir;save();render()});
 {const fr=document.getElementById("fsr");if(fr){fr.oninput=()=>{const v=+fr.value,q=(v-13)/15*100;fr.style.setProperty("--p",q+"%");const t=document.getElementById("fsv");if(t){t.textContent=v;t.style.left=q+"%"}const r=document.querySelector(".rd");if(r)r.style.setProperty("--fs",v+"px")};fr.onchange=()=>{S.pref.fs=+fr.value;save();render()}}}
 {const q=document.getElementById("rdsq");if(q){let tm=0;const go=()=>{RQT=q.value;runSearch(RQT);rdsFill()};rdsFill();
   q.oninput=()=>{clearTimeout(tm);tm=setTimeout(go,220)};q.onkeydown=e=>{if(e.key==="Enter"){clearTimeout(tm);go();q.blur()}};
   if(!RQT)setTimeout(()=>{try{q.focus()}catch(_){}},350);
   const rs=document.getElementById("rdsres");if(rs)rs.onclick=e=>{const r=e.target.closest("[data-rdhit]");if(!r)return;HI=+r.dataset.rdhit;hitGo()}}}
 $$("[data-hit]",b=>b.onclick=()=>{if(!HITS.length)return;HI=(HI+ +b.dataset.hit+HITS.length)%HITS.length;hitGo()});
 $$("[data-hitx]",b=>b.onclick=()=>{RQ="";HITS=[];HI=-1;HITCI=-1;HITK=-1;RQT="";render()});
 $$("[data-th]",b=>b.onclick=()=>{S.pref.th=b.dataset.th;render()});
 $$("[data-ff]",b=>b.onclick=()=>{S.pref.ff=b.dataset.ff;render()});
 const mk=document.getElementById("rdmark");
 if(mk)mk.onclick=()=>{const id=S.rdId,p=mkey(id),a=S.marks[id]||[],had=a.includes(p);S.marks[id]=had?a.filter(x=>x!==p):[...a,p];mk.classList.toggle("on",!had);toast(had?"Хатчӯб бардошта шуд":"Хатчӯб гузошта шуд");save()};
}

/* ---- варақи toc ---- */
SHEETS.toc=X=>{let h="";{const b=bk(S.rdId),mk=(S.marks[b.id]||[]).slice().sort((x,y)=>x-y),tcs=isTx(b)?txChapters(b):null;
  h=`<div class="sh-head"><div class="sh-cv">${cover(b)}</div><div><b>${b.t}</b><span>${b.a}</span></div>${X}</div>
  <div class="seg">${["Мундариҷа","Хатчӯб"].map((n,i)=>`<button class="${S.tocTab===i?"on":""}" data-toct="${i}">${n}</button>`).join("")}</div>
  ${S.tocTab===0?(tcs?`<div class="sh-list">${tcs.map((c,i)=>`${c.part?`<p class="sh-empty" style="text-align:left;margin:10px 4px 2px">${escH(c.part)}</p>`:""}<button class="sh-row toc-r" data-gotch="${i}"><span translate="no"><svg class="toc-i" viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="18" rx="3"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>${escH(c.n)}</span><em>${(S.rdCh[b.id]||0)===i?"Ҳозир":""}</em></button>`).join("")}</div>`:`<div class="sh-list">${CHN.map((n,i)=>`<button class="sh-row" data-goch="${i}"><span>${n}</span><em><span data-chp="${i}">–</span>-саҳифа</em></button>`).join("")}</div>`)
   :S.tocTab===1?(mk.length?`<div class="sh-list">${mk.map(p=>`<button class="sh-row" data-gopg="${p}"><span>${P(IC_MARK)}${mlabel(b.id,p)}</span><em>Гузаштан ›</em></button>`).join("")}</div>`:`<p class="sh-empty">Ҳоло хатчӯб нест. Дар боло тугмаи ${P(IC_MARK)} -ро пахш кунед.</p>`)
   :""}`};return h};

/* ---- варақи set ---- */
SHEETS.set=X=>{let h="";{const f=S.pref;
  h=`<div class="sh-head"><b class="sh-t">Танзимоти хондан</b>${X}</div>
  <div class="set-row col"><span>Андозаи ҳарф</span><div class="fsr"><i>А</i><div class="fsw"><output id="fsv" style="left:${(f.fs-13)/15*100}%">${f.fs}</output><input type="range" class="rd-scr" id="fsr" min="13" max="28" step="3" value="${f.fs}" style="--p:${(f.fs-13)/15*100}%" aria-label="Андозаи ҳарф"><div class="fsd">${[0,1,2,3,4,5].map(i=>`<u></u>`).join("")}</div></div><i class="big">А</i></div></div>
  <div class="set-row"><span>Самти хондан</span><div class="seg sm">${[["h","Уфуқӣ",'<path d="M4 8h14M14 4l4 4-4 4M20 16H6M10 12l-4 4 4 4"/>'],["v","Амудӣ",'<path d="M8 20V6M4 10l4-4 4 4M16 4v14M12 14l4 4 4-4"/>']].map(([k,n,ic])=>`<button class="${(f.dir||"h")===k?"on":""}" data-dir="${k}">${P(ic,2)}${n}</button>`).join("")}</div></div>
  <div class="set-row"><span>Фосилаи сатрҳо</span><div class="stepper"><button data-lh="-1" aria-label="Зичтар">−</button><b>${(f.lh||1.6).toFixed(1)}</b><button data-lh="1" aria-label="Кушодатар">+</button></div></div>
  <div class="set-row"><span>Ҳуруф</span><div class="seg sm">${[["serif","Китобӣ"],["sans","Оддӣ"]].map(([k,n])=>`<button class="${f.ff===k?"on":""}" data-ff="${k}">${n}</button>`).join("")}</div></div>
  <div class="set-row" style="border:0"><span>Ранги саҳифа</span><div class="sw">${[["white","Сафед"],["sepia","Зардча"],["dark","Торик"]].map(([k,n])=>`<button class="swb t-${k} ${f.th===k?"on":""}" data-th="${k}" aria-label="${n}"><i translate="no" style="font-style:normal">Аа</i></button>`).join("")}</div></div>`};return h};

/* ---- варақи rds ---- */
SHEETS.rds=X=>{let h="";{
  h=`<div class="sh-head"><b class="sh-t">Ҷустуҷӯ дар китоб</b>${X}</div>
  <label class="rds-in" for="rdsq">${P(I.search,2)}<input id="rdsq" type="search" enterkeyhint="search" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Калима ё ҳарфҳоро нависед…" value="${escH(RQT)}"></label>
  <p class="rds-cnt" id="rdscnt"></p><div class="rds-res" id="rdsres"></div>`};return h};
