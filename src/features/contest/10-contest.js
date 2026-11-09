/* ---------- Доираҳои силлиқ: «Озмун» (4 доира) ва «Account» (Муҳаррир, танҳо барои админ) ---------- */
const CXF={
 goal:[
  ["goal","Озмун","#2dbb82","#0b7d57",'<path d="M8 4h8v5a4 4 0 01-8 0zM8 6H5a3 3 0 003 4M16 6h3a3 3 0 01-3 4M12 13v4M9 20h6"/>'],
  ["ifm","ИФМ","#f5b83d","#c47a12",'<path d="M4 5c3-1.500 5-1.500 8 0v14c-3-1.500-5-1.500-8 0zM20 5c-3-1.500-5-1.500-8 0v14c3-1.500 5-1.500 8 0z"/>'],
  ["furug","Фурӯғ","#a874e8","#6a3bb8",'<path d="M12 3a6 6 0 00-3 11v3h6v-3a6 6 0 00-3-11zM10 20h4"/>'],
  ["bahs","Баҳс","#52aaf0","#1f6fb8",'<path d="M4 5h11v7H9l-3 3v-3H4zM18 9h2v7h-2v3l-3-3h-4"/>']],
 me:[["edit","Муҳаррир","#5b6677","#232b38",'<path d="M4 20l4-1 11-11-3-3L5 16zM14 7l3 3"/>']]};
let cxEl=null,cxOpen=false,cxT=0,cxEd=false,cxSel="goal",cxGS=8,cxSync=null,cxKey="goal";
const fanKey=i=>{const k=tabKeys()[i];return k==="goal"?"goal":(k==="me"&&S.role==="admin"&&S.view==="me")?"me":null};
function cxBuild(key){cxKey=key;
 if(!cxEl){cxEl=document.createElement("div");cxEl.id="cx";cxEl.hidden=true;document.body.appendChild(cxEl)}
 cxEl.innerHTML='<div class="cx-bg"></div>'+CXF[key].map(([k,n,c1,c2,ic],i)=>{const id=key+i,fs=n.length>5?9.4:11,ls=n.length>5?.9:1.3;
  return `<button class="cx-b" data-cx="${k}" aria-label="${n}"><svg viewBox="0 0 84 84"><defs><linearGradient id="cxg${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient><path id="cxp${id}" d="M11,42A31,31 0 0 0 73,42"/></defs><circle cx="42" cy="42" r="41" fill="url(#cxg${id})"/><circle cx="42" cy="42" r="39" fill="none" stroke="#fff" stroke-opacity=".38" stroke-width="1.400"/><g transform="translate(30,12) scale(1)" fill="none" stroke="#fff" stroke-width="1.900" stroke-linecap="round" stroke-linejoin="round">${ic}</g><text font-size="${fs}" letter-spacing="${ls}" fill="#fff" text-anchor="middle"><textPath href="#cxp${id}" startOffset="50%"${k==="ifm"||k==="furug"?' translate="no"':""}>${n}</textPath></text></svg></button>`}).join("");
 cxEl.querySelector(".cx-bg").onclick=cxClose;cxEl.querySelectorAll(".cx-b").forEach(b=>b.onclick=()=>{if(!cxEd)cxPick(b.dataset.cx)})}
function cxGeo(){const r=document.getElementById("tabbar").getBoundingClientRect();tbMeasure();const gi=tabKeys().indexOf(cxKey);return{ax:r.left+tbCenter(gi),ay:r.top+r.height/2,top:r.top,W:innerWidth}}
function cxOff(i,g){const o=cxKey==="goal"&&S.cxPos&&S.cxPos[CXF.goal[i][0]];if(o)return o;
 if(cxKey==="me")return[Math.round(Math.min(g.W-46,g.ax)-g.ax),-80];
 const R=Math.min(136,g.W/2.9),t=[158,118,62,22][i]*Math.PI/180,x=Math.max(46,Math.min(g.W-46,g.ax+R*Math.cos(t)));return[Math.round(x-g.ax),Math.round(-(10+R*Math.sin(t)))]}
function cxPlace(){const g=cxGeo();
 cxEl.querySelectorAll(".cx-b").forEach((b,i)=>{const[dx,dy]=cxOff(i,g),x=g.ax+dx,y=g.top+dy;
  b.style.left=x+"px";b.style.top=y+"px";b.style.setProperty("--fx",(g.ax-x)+"px");b.style.setProperty("--fy",(g.ay-y)+"px");b.style.setProperty("--d",(i*35)+"ms")})}
function cxShow(key){cxBuild(key);clearTimeout(cxT);cxPlace();cxEl.hidden=false;void cxEl.offsetWidth;cxEl.classList.add("on");cxOpen=true;try{navigator.vibrate&&navigator.vibrate(8)}catch(_){}}
function cxClose(){if(!cxOpen)return;cxOpen=false;cxEl.classList.remove("on");cxEl.querySelectorAll(".hov").forEach(b=>b.classList.remove("hov"));clearTimeout(cxT);cxT=setTimeout(()=>{if(!cxOpen)cxEl.hidden=true},280)}
function cxAt(x,y){const e=document.elementFromPoint(x,y),b=e&&e.closest&&e.closest(".cx-b");return b&&cxEl.contains(b)?b:null}
function cxHover(x,y){const h=cxAt(x,y);let ch=false;cxEl.querySelectorAll(".cx-b").forEach(b=>{const on=b===h;if(on&&!b.classList.contains("hov"))ch=true;b.classList.toggle("hov",on)});if(ch){try{navigator.vibrate&&navigator.vibrate(5)}catch(_){}}}
/* ---- Муҳаррир (танҳо админ): доираҳои «Озмун»-ро бо ангушт ҷойгир кунед ---- */
function cxEditOn(){if(cxEd||S.role!=="admin")return;cxEd=true;if(!["home","lib","goal","comm","me"].includes(S.view)){S.view="me";render()}
 document.documentElement.classList.add("cx-editing");cxShow("goal");cxEl.classList.add("edit");
 const pan=document.createElement("div");pan.id="cxp";pan.setAttribute("translate","no");cxEl.appendChild(pan);
 const grid=document.createElement("div");grid.className="cx-grid";cxEl.insertBefore(grid,cxEl.firstChild.nextSibling);
 const list=CXF.goal,sync=()=>{const g=cxGeo(),gs=cxGS;
  grid.style.cssText=`background-size:${gs}px ${gs}px,${gs}px ${gs}px,${gs*4}px ${gs*4}px,${gs*4}px ${gs*4}px;background-position:${g.ax}px ${g.top}px`;
  const cur={};list.forEach(([k],i)=>{cur[k]=cxOff(i,g)});
  pan.innerHTML=`<b>Ҷойгиркунии доираҳо</b><span class="cxs">1 катак = ${gs}px. Нуқтаи 0,0 = болои менюи поён, маркази «Озмун»</span>
  ${list.map(([k,n,c1])=>`<button class="cxr${cxSel===k?" on":""}" data-sel="${k}"><i style="background:${c1}"></i><span>${n}</span><em>x ${cur[k][0]} · y ${cur[k][1]}</em></button>`).join("")}
  <div class="cxg">Катак: ${[1,4,8,16].map(v=>`<button class="${v===gs?"on":""}" data-gs="${v}">${v}</button>`).join("")}<span>Нишона:</span>${[["←",-1,0],["↑",0,-1],["↓",0,1],["→",1,0]].map(([a,x,y])=>`<button data-nd="${x},${y}">${a}</button>`).join("")}</div>
  <textarea readonly rows="2">${JSON.stringify(cur)}</textarea>
  <div class="cxg"><button data-cxcopy>Нусха</button><button data-cxreset>Аз нав</button><button class="go" data-cxdone>Тайёр</button></div>`;
  pan.querySelectorAll("[data-sel]").forEach(b=>b.onclick=()=>{cxSel=b.dataset.sel;sync()});
  pan.querySelectorAll("[data-gs]").forEach(b=>b.onclick=()=>{cxGS=+b.dataset.gs;sync()});
  pan.querySelectorAll("[data-nd]").forEach(b=>b.onclick=()=>{const[x,y]=b.dataset.nd.split(",").map(Number),i=list.findIndex(c=>c[0]===cxSel),o=cxOff(i,cxGeo());cxSet(cxSel,[o[0]+x,o[1]+y])});
  pan.querySelector("[data-cxcopy]").onclick=async()=>{const t=JSON.stringify(cur);try{await navigator.clipboard.writeText(t);toast("Нусха шуд")}catch(_){pan.querySelector("textarea").select();toast("Матнро нигоҳ дошта нусха кунед")}};
  pan.querySelector("[data-cxreset]").onclick=()=>{delete S.cxPos;save();cxPlace();sync()};
  pan.querySelector("[data-cxdone]").onclick=cxEditOff;
  pan.querySelector("textarea").onclick=e=>e.target.select()};
 cxSync=sync;sync();cxPlace();
 cxEl.querySelectorAll(".cx-b").forEach(b=>{b.onpointerdown=e=>{if(!cxEd)return;e.preventDefault();cxSel=b.dataset.cx;try{b.setPointerCapture(e.pointerId)}catch(_){}
  const r=b.getBoundingClientRect();b._drag={gx:e.clientX-(r.left+r.width/2),gy:e.clientY-(r.top+r.height/2)};sync()};
  b.onpointermove=e=>{if(!cxEd||!b._drag)return;const g=cxGeo(),gs=cxGS,x=e.clientX-b._drag.gx,y=e.clientY-b._drag.gy;
   cxSet(b.dataset.cx,[Math.round((x-g.ax)/gs)*gs,Math.round((y-g.top)/gs)*gs])};
  b.onpointerup=b.onpointercancel=()=>{b._drag=null}})}
function cxSet(k,o){S.cxPos=S.cxPos||{};const g=cxGeo();CXF.goal.forEach(([kk],i)=>{if(!S.cxPos[kk])S.cxPos[kk]=cxOff(i,g)});S.cxPos[k]=o;save();cxPlace();cxSync&&cxSync()}
function cxEditOff(){cxEd=false;cxSync=null;document.documentElement.classList.remove("cx-editing");cxEl.classList.remove("edit");const g=cxEl.querySelector(".cx-grid");g&&g.remove();const p=document.getElementById("cxp");p&&p.remove();
 cxEl.querySelectorAll(".cx-b").forEach(b=>{b.onpointerdown=b.onpointermove=b.onpointerup=b.onpointercancel=null});cxClose();try{history.replaceState(null,"",location.pathname+location.hash)}catch(_){}}
function cxPick(k){cxClose();if(k==="edit")setTimeout(cxEditOn,70);else if(k==="goal"){if(S.view!=="goal")go("goal")}else toast(FEAT("contest")?"Ин саҳифа ҳоло омода мешавад":"Ба зудӣ кушода мешавад")}