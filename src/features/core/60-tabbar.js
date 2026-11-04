/* ---------- Liquid-glass tab bar (persistent, outside #app) ---------- */
const TB={x:0,v:0,tx:0,lift:0,lv:0,tl:0,raf:0,drag:false,key:null,iw:0};
const tabKeys=()=>TAB.map(t=>t[0]);
function tbMeasure(){const el=document.getElementById("tabbar"),row=el.querySelector(".tb-row");TB.row=row;TB.H=el.clientHeight;TB.iw=row.clientWidth/TAB.length;TB.ox=row.offsetLeft}
const tbCenter=i=>TB.ox+TB.iw*(i+.5);
const tbClamp=x=>Math.max(tbCenter(0),Math.min(tbCenter(TAB.length-1),x));
const tbNearest=x=>Math.max(0,Math.min(TAB.length-1,Math.floor((x-TB.ox)/TB.iw)));
function tbDraw(){const el=document.getElementById("tabbar");if(!el||el.hidden||!TB.iw)return;
 const pill=el.querySelector(".tb-pill"),lens=el.querySelector(".tb-lens"),acc=el.querySelector(".tb-acc"),row=TB.row;
 const L=Math.max(0,Math.min(1.15,TB.lift)),H=TB.H,iw=TB.iw,pw=iw-4,ph=H-10;
 const w=pw+L*26,h=ph+L*24,sv=Math.min(.24,Math.abs(TB.v)*.02)*Math.min(1,L);
 const BW=document.getElementById("tabbar").clientWidth,left=Math.max(2,Math.min(BW-w-2,TB.x-w/2)),top=(H-h)/2;
 pill.style.cssText=`width:${pw}px;height:${ph}px;transform:translate3d(${TB.x-pw/2}px,5px,0);opacity:${Math.max(0,1-L*1.4)}`;
 lens.style.cssText=`width:${w}px;height:${h}px;transform:translate3d(${left}px,${top}px,0) scale(${1+sv},${1-sv*.55});opacity:${Math.min(1,L*1.6)}`;
 acc.style.cssText=`left:${row.offsetLeft-left}px;top:${row.offsetTop-top}px;width:${row.clientWidth}px;height:${row.clientHeight}px;transform-origin:${TB.x-row.offsetLeft}px 50%;transform:scale(${1+.16*Math.min(1,L)})`;
 const i=tbNearest(TB.x);el.querySelectorAll(".tb-row:not(.tb-acc) .tb-i").forEach((b,j)=>b.classList.toggle("hov",TB.lift>.05&&j===i))}
function tbLoop(){const k=TB.drag?.32:.17,d=TB.drag?.62:.72;
 TB.v=(TB.v+(TB.tx-TB.x)*k)*d;TB.x+=TB.v;
 TB.lv=(TB.lv+(TB.tl-TB.lift)*.16)*.7;TB.lift+=TB.lv;
 tbDraw();
 if(TB.drag||Math.abs(TB.tx-TB.x)>.25||Math.abs(TB.v)>.25||Math.abs(TB.tl-TB.lift)>.004||Math.abs(TB.lv)>.004)TB.raf=requestAnimationFrame(tbLoop);
 else{TB.x=TB.tx;TB.lift=TB.tl;TB.v=TB.lv=0;tbDraw();TB.raf=0}}
const tbKick=()=>{if(!TB.raf)TB.raf=requestAnimationFrame(tbLoop)};
function tbBind(el){
 const reduce=()=>matchMedia("(prefers-reduced-motion: reduce)").matches;
 el.onpointerdown=e=>{if(e.button>0)return;tbMeasure();TB.drag=true;TB.moved=false;TB.x0=e.clientX;try{el.setPointerCapture(e.pointerId)}catch(_){}
  const r=el.getBoundingClientRect();TB.tx=tbClamp(e.clientX-r.left);TB.tl=reduce()?0:1;tbKick();
  TB.fan=0;const fk=fanKey(tbNearest(e.clientX-r.left));if(fk){if(cxOpen&&cxKey===fk)TB.fan=2;else{TB.fan=1;cxShow(fk)}}else cxClose()};
 el.onpointermove=e=>{if(!TB.drag)return;if(Math.abs(e.clientX-TB.x0)>4)TB.moved=true;const r=el.getBoundingClientRect();TB.tx=tbClamp(e.clientX-r.left);if(TB.fan&&cxOpen){if(e.clientY<r.top)TB.tx=tbCenter(tabKeys().indexOf(cxKey));cxHover(e.clientX,e.clientY)}};
 el.onpointerup=el.onpointercancel=e=>{if(!TB.drag)return;TB.drag=false;const i=tbNearest(TB.tx);TB.tx=tbCenter(i);
  if(TB.moved)TB.tl=0;else setTimeout(()=>{TB.tl=0;tbKick()},170);tbKick();
  if(TB.fan){const f=TB.fan;TB.fan=0;
   if(e.type==="pointerup"){const bb=cxOpen&&cxAt(e.clientX,e.clientY);if(bb){cxPick(bb.dataset.cx);return}
    if(fanKey(i)===cxKey){if(f===2)cxClose();return}cxClose()}
   else{cxEl&&cxEl.querySelectorAll(".hov").forEach(b=>b.classList.remove("hov"));return}}
  if(e.type==="pointerup"){const k=tabKeys()[i];if(k!==S.view)go(k);else window.scrollTo({top:0,behavior:"smooth"})}};
 el.querySelectorAll(".tb-row:not(.tb-acc) .tb-i").forEach(b=>b.onclick=e=>{if(e.detail===0)go(b.dataset.k)});
}
function syncTabs(){
 let el=document.getElementById("tabbar");
 if(!el){el=document.createElement("nav");el.id="tabbar";el.className="tb";el.setAttribute("aria-label","Менюи асосӣ");document.body.appendChild(el)}
 const key=S.gender||"-";
 if(TB.key!==key){TB.key=key;
  const items=TAB.map(([k,n,d])=>`<button class="tb-i" data-k="${k}">${P(k==="goal"?gi():d,2)}<span>${n}</span></button>`).join("");
  el.innerHTML=`<div class="tb-pill"></div><div class="tb-row">${items}</div><div class="tb-lens"><div class="tb-row tb-acc" aria-hidden="true">${items.replace(/<button class="tb-i"/g,'<span class="tb-i"').replace(/<\/button>/g,"</span>")}</div></div>`;
  tbBind(el);TB.iw=0}
 const show=["home","lib","goal","comm","me"].includes(S.view);el.hidden=!show;if(!show)return;
 const i=tabKeys().indexOf(S.view);
 el.querySelectorAll(".tb-row:not(.tb-acc) .tb-i").forEach((b,j)=>{b.classList.toggle("on",j===i);if(j===i)b.setAttribute("aria-current","page");else b.removeAttribute("aria-current")});
 if(!TB.drag&&!TB.raf){tbMeasure();TB.x=TB.tx=tbCenter(i);TB.lift=TB.tl=0;tbDraw()}
}

function ring(done,goal){const r=19,C=2*Math.PI*r;return `<div class="ringmini"><svg viewBox="0 0 46 46"><circle cx="23" cy="23" r="${r}" fill="none" stroke="var(--line)" stroke-width="4.5"/><circle cx="23" cy="23" r="${r}" fill="none" stroke="var(--orange)" stroke-width="4.5" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-done/goal)}" transform="rotate(-90 23 23)"/></svg><b>${done}</b></div>`}