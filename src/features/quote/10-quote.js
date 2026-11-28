/* ===== Иқтибос: матнро дар хонанда (ҳолати «Аз боло ба поён») ишора кунед → «Нусха» / «Иқтибос» → корти зебо (матн + муқова + номи китоб ва муаллиф) → «Мубодила» ===== */
const QT={txt:"",fmt:"t",el:null,menu:null,t:0,cv:null,img:null};
const QT_MAX=600,QT_SZ={t:[1080,1920],q:[1080,1080]};
function qtClean(s){s=String(s||"").replace(/\s+/g," ").trim();if(s.length>QT_MAX){s=s.slice(0,QT_MAX);const k=s.lastIndexOf(" ");s=s.slice(0,k>QT_MAX*.6?k:QT_MAX)+"…"}return s}
function qtSel(){const sel=window.getSelection&&window.getSelection();if(!sel||!sel.rangeCount||sel.isCollapsed)return null;
 const v=document.getElementById("rdview");if(!v)return null;const r=sel.getRangeAt(0);
 if(!v.contains(r.commonAncestorContainer))return null;
 const t=qtClean(sel.toString());if(t.length<3)return null;
 const rs=r.getClientRects(),last=rs.length?rs[rs.length-1]:r.getBoundingClientRect();return{t,rect:last}}
function qtMenuHide(){clearInterval(QT.iv);if(QT.menu){QT.menu.remove();QT.menu=null}}
function qtAct(f){let lk=0;return e=>{e.preventDefault();e.stopPropagation();if(lk)return;lk=1;setTimeout(()=>lk=0,500);f()}} // iPhone: touchstart-ро манъ намекунем, амал дар touchend (дар click не: preventDefault дар touchstart click-ро мекушад)
function qtMenuShow(s){
 QT.txt=s.t;if(QT.menu)return; // меню дар поёни экран устувор меистад: ҷаҳида намегардад ва бо менюи худи iPhone (болову поён аз интихоб) бархӯрд надорад
 const m=document.createElement("div");m.className="qt-menu";m.innerHTML=`<button data-qtcopy>Нусха</button><button data-qtgo>Иқтибос</button>`;
 m.addEventListener("pointerdown",e=>e.preventDefault()); // интихоб нашавад
 m.addEventListener("touchstart",e=>e.preventDefault(),{passive:false});
 for(const [q,f] of [["[data-qtcopy]",()=>{NATIVE.copy(QT.txt);toast("Нусха шуд");qtClear()}],["[data-qtgo]",()=>qtOpen(QT.txt)]]){const bt=m.querySelector(q),h=qtAct(f);bt.addEventListener("touchend",h,{passive:false});bt.addEventListener("click",h)}
 document.body.appendChild(m);QT.menu=m;QT.iv=setInterval(()=>{if(S.view!=="read"||!qtSel())qtMenuHide()},700)} // агар аз хонанда баромада бошед, меню намемонад
function qtClear(){try{window.getSelection().removeAllRanges()}catch(_){}qtMenuHide()}
function qtWatch(){if(QT.el)return;if(S.view!=="read"){qtMenuHide();return}const s=qtSel();clearTimeout(QT.t);if(s)qtMenuShow(s);else QT.t=setTimeout(()=>{if(!qtSel())qtMenuHide()},120)} // пайдо шудан — фавран; нопадид шудан — бо таъхири хурд (дар вақти кашидани дастакҳо)
document.addEventListener("selectionchange",qtWatch);
/* ---- сурат ---- */
function qtCover(b){return new Promise(ok=>{const u=(b.cp&&typeof CVU!=="undefined"&&CVU[b.cp])||b.cover;if(!u)return ok(null);
 const im=new Image();im.crossOrigin="anonymous";im.onload=()=>ok(im);im.onerror=()=>ok(null);im.src=u;setTimeout(()=>ok(null),4000)})}
function qtRR(x,a,b,w,h,r){x.beginPath();x.moveTo(a+r,b);x.arcTo(a+w,b,a+w,b+h,r);x.arcTo(a+w,b+h,a,b+h,r);x.arcTo(a,b+h,a,b,r);x.arcTo(a,b,a+w,b,r);x.closePath()}
function qtWrap(x,t,w){const ws=t.split(" "),L=[];let c="";for(const s of ws){const n=c?c+" "+s:s;if(c&&x.measureText(n).width>w){L.push(c);c=s}else c=n}if(c)L.push(c);return L}
function qtDraw(cv,fmt,txt,b,im){
 const [W,H]=QT_SZ[fmt];cv.width=W;cv.height=H;const x=cv.getContext("2d"),F="Lora,Georgia,'Times New Roman',serif",PAD=96;
 x.fillStyle="#f1f3ee";x.fillRect(0,0,W,H);
 x.fillStyle="#13a56d";x.font=`700 260px ${F}`;x.textBaseline="alphabetic";x.fillText("“",PAD-8,PAD+210);
 const top=PAD+250,fh=fmt==="t"?230:200,bot=H-PAD-fh-40,aw=W-2*PAD;
 let fs=fmt==="t"?72:64,L,lh;
 for(;;){x.font=`500 ${fs}px ${F}`;L=qtWrap(x,txt,aw);lh=Math.round(fs*1.42);if(L.length*lh<=bot-top||fs<=30)break;fs-=2}
 x.fillStyle="#1c1b19";L.forEach((s,i)=>x.fillText(s,PAD,top+fs+i*lh));
 // поён: муқова + ном + муаллиф
 const ch=fh-20,cw=Math.round(ch*.68),cy=H-PAD-ch;
 x.save();qtRR(x,PAD,cy,cw,ch,12);x.clip();
 if(im){const s=Math.max(cw/im.width,ch/im.height),dw=im.width*s,dh=im.height*s;x.drawImage(im,PAD+(cw-dw)/2,cy+(ch-dh)/2,dw,dh)}
 else{const g=x.createLinearGradient(PAD,cy,PAD+cw,cy+ch),c=b.col||["#0b7d57","#063"];g.addColorStop(0,c[0]);g.addColorStop(1,c[1]);x.fillStyle=g;x.fillRect(PAD,cy,cw,ch)}
 x.restore();x.strokeStyle="rgba(0,0,0,.12)";x.lineWidth=2;qtRR(x,PAD,cy,cw,ch,12);x.stroke();
 const tx=PAD+cw+36,tw=W-PAD-tx;x.fillStyle="#1c1b19";x.font=`700 44px ${F}`;
 const tl=qtWrap(x,String(b.t||""),tw).slice(0,2);tl.forEach((s,i)=>x.fillText(s+(i===1&&qtWrap(x,String(b.t||""),tw).length>2?"…":""),tx,cy+54+i*54));
 x.fillStyle="#7d7a74";x.font=`500 38px ${F}`;x.fillText(qtWrap(x,String(b.a||""),tw)[0]||"",tx,cy+54+tl.length*54+10);
 x.fillStyle="#13a56d";x.font=`700 32px ${F}`;x.textAlign="right";x.fillText("Китобхона",W-PAD,H-PAD+6);x.textAlign="left"}
async function qtRender(){const cv=QT.cv;if(!cv)return;try{await (document.fonts&&document.fonts.ready)}catch(_){}
 qtDraw(cv,QT.fmt,QT.txt,bk(S.rdId),QT.img)}
async function qtOpen(txt){qtClear();if(QT.el)return;const b=bk(S.rdId);if(!b)return;QT.txt=txt;
 const el=document.createElement("div");el.className="qt-bg";QT.el=el;
 el.innerHTML=`<div class="qt-sh" role="dialog" aria-label="Иқтибос гирифтан"><div class="qt-hd"><b>Иқтибос гирифтан</b><button class="sh-x" data-qtx aria-label="Пӯшидан">${P(IC_X,2)}</button></div>
  <div class="qt-pv"><canvas id="qtcv"></canvas></div>
  <div class="qt-fm"><button data-qtf="q" aria-label="Мураббаъ"><i class="sq"></i></button><button data-qtf="t" aria-label="Амудӣ"><i class="tl"></i></button></div>
  <button class="pay-btn qt-go" data-qtshare>${P('<path d="M12 3v12M7 8l5-5 5 5M5 14v6h14v-6"/>',2)}<span>Мубодила</span></button></div>`;
 document.body.appendChild(el);QT.cv=el.querySelector("#qtcv");
 const fmk=()=>el.querySelectorAll("[data-qtf]").forEach(x=>x.classList.toggle("on",x.dataset.qtf===QT.fmt));fmk();
 const close=()=>{el.remove();QT.el=null;QT.cv=null;QT.img=null;qtClear()};
 el.onclick=e=>{if(e.target===el||e.target.closest("[data-qtx]"))close()};
 el.querySelectorAll("[data-qtf]").forEach(x=>x.onclick=()=>{QT.fmt=x.dataset.qtf;fmk();qtRender()});
 el.querySelector("[data-qtshare]").onclick=()=>qtShare(b);
 await qtRender();QT.img=await qtCover(b);if(QT.el===el)qtRender()}
async function qtShare(b){const cv=QT.cv;if(!cv)return;
 const blob=await new Promise(r=>{try{cv.toBlob(r,"image/png")}catch(_){r(null)}});
 if(!blob){toast("Иқтибос тайёр нашуд");return}
 const f=new File([blob],"iqtibos.png",{type:"image/png"});
 try{if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f]});return}}catch(e){if(e&&e.name==="AbortError")return}
 const A=window.KitobAndroid;
 if(A&&typeof A.shareImage==="function"){try{A.shareImage(cv.toDataURL("image/png").split(",")[1],SITE_URL);return}catch(_){}} // Android (APK-и нав): худи тасвир
 if(A){NATIVE.share("«"+QT.txt+"»\n— "+b.a+", "+b.t,SITE_URL);return} // APK-и кӯҳна: тасвирро намефиристад, матн мефиристад
 const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="iqtibos.png";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000);toast("Тасвир захира шуд")}
