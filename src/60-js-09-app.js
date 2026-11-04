/* ---- Профил: сурат, баннер, ном, маълумот ---- */
const BGS=["linear-gradient(135deg,#4a52b4,#8a8fe0)","linear-gradient(135deg,#0b7d57,#63d48f)","linear-gradient(135deg,#c47a12,#f5b53c)","linear-gradient(135deg,#b4476a,#f09abb)","linear-gradient(135deg,#1f4f7a,#5fb0e6)","linear-gradient(135deg,#2b2b2b,#6b6b6b)"];
// Аватарҳо барои духтарон: бе рӯй. Баъд расмҳои ҳақиқӣ ба папкаи avatars/ меоянд (img:"avatars/1.png")
const AVN=20; // avatars/1.webp … 20.webp (духтарон)
const AV_DEF='<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4.5 4.5-6.5 8-6.5s7 2 8 6.5"/></svg>';
const isImg=a=>typeof a==="string"&&(a.startsWith("data:")||/^https?:/.test(a));
function avInner(a){if(isImg(a))return `<img src="${escH(a)}" alt="">`;const m=/^av:(\d+)$/.exec(a||"");if(m&&+m[1]>=1&&+m[1]<=AVN)return `<img class="avc" src="avatars/${m[1]}.webp" alt="">`;return AV_DEF}
function bnStyle(b){if(isImg(b))return `background:url('${b.replace(/'/g,"%27")}') center/cover`;const m=/^g:(\d)$/.exec(b||"");return m&&BGS[m[1]]?`background:${BGS[m[1]]}`:""}
let PET="av";
function readImg(file,w,hh){return new Promise((ok,no)=>{const u=URL.createObjectURL(file),im=new Image();im.onload=()=>{try{const cv=document.createElement("canvas");cv.width=w;cv.height=hh;const x=cv.getContext("2d"),s=Math.max(w/im.width,hh/im.height),dw=im.width*s,dh=im.height*s;x.drawImage(im,(w-dw)/2,(hh-dh)/2,dw,dh);URL.revokeObjectURL(u);ok(cv)}catch(e){no(e)}};im.onerror=()=>{URL.revokeObjectURL(u);no(new Error("img"))};im.src=u})}
async function faceCount(cv){try{if(!window.FaceDetector)return null;return(await new FaceDetector({fastMode:true,maxDetectedFaces:4}).detect(cv)).length}catch(_){return null}}
function loadImg(file){return new Promise((ok,no)=>{const u=URL.createObjectURL(file),im=new Image();im.onload=()=>ok(im);im.onerror=()=>{URL.revokeObjectURL(u);no(new Error("img"))};im.src=u})}
function openCrop(img,type){return new Promise(res=>{
 const bn=type==="bn",vw=Math.min(innerWidth,460),fw=Math.round(bn?Math.min(vw-32,420):Math.min(vw*.78,320)),fh=bn?Math.round(fw*.34):fw,OW=bn?1000:600,OH=bn?340:600;
 const iw=img.naturalWidth,ih=img.naturalHeight,cover=Math.max(fw/iw,fh/ih);let z=1,x=0,y=0;
 const el=document.createElement("div");el.className="crp t-"+(S.pref.th||"sepia");
 el.innerHTML=`<div class="crp-t">${bn?"Баннерро танзим кунед":"Суратро танзим кунед"}</div>
  <div class="crp-s"><img src="${img.src}" draggable="false" alt="" style="width:${iw}px;height:${ih}px"><i class="crp-f${bn?"":" rnd"}" style="width:${fw}px;height:${fh}px"></i></div>
  <p class="crp-h">Бо як ангушт ҷойро иваз кунед, бо ду ангушт калон ё хурд кунед</p>
  <input type="range" class="rd-scr" min="50" max="400" step="1" value="100" aria-label="Андоза">
  <div class="crp-b"><button class="pill" data-c="0">Бекор</button><button class="pill" data-c="1" style="background:var(--orange);color:#fff">Тасдиқ</button></div>`;
 document.body.appendChild(el);
 const st=el.querySelector(".crp-s"),im=st.querySelector("img"),sl=el.querySelector("input"),ps=new Map();let d0=1,z0=1;
 const clampZ=v=>Math.max(.5,Math.min(4,v)),paint=()=>{const s=cover*z,mx=(iw*s+fw)/2-40,my=(ih*s+fh)/2-40;x=Math.max(-mx,Math.min(mx,x));y=Math.max(-my,Math.min(my,y));
  im.style.transform=`translate(-50%,-50%) translate(${x}px,${y}px) scale(${s})`;sl.value=Math.round(z*100);sl.style.setProperty("--p",(z*100-50)/350*100+"%")};
 st.onpointerdown=e=>{try{st.setPointerCapture(e.pointerId)}catch(_){}ps.set(e.pointerId,[e.clientX,e.clientY]);if(ps.size===2){const a=[...ps.values()];d0=Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1])||1;z0=z}};
 st.onpointermove=e=>{const p=ps.get(e.pointerId);if(!p)return;const dx=e.clientX-p[0],dy=e.clientY-p[1];ps.set(e.pointerId,[e.clientX,e.clientY]);
  if(ps.size===1){x+=dx;y+=dy}else if(ps.size===2){const a=[...ps.values()];z=clampZ(z0*(Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1])||1)/d0)}paint()};
 st.onpointerup=st.onpointercancel=e=>{ps.delete(e.pointerId);if(ps.size===1){const a=[...ps.values()];}};
 st.onwheel=e=>{e.preventDefault();z=clampZ(z*Math.exp(-e.deltaY/300));paint()};
 sl.oninput=()=>{z=clampZ(+sl.value/100);paint()};
 const done=ok=>{el.remove();if(!ok){res(null);return}
  const cv=document.createElement("canvas");cv.width=OW;cv.height=OH;const c=cv.getContext("2d"),r=OW/fw,s=cover*z;c.fillStyle="#e9e2d0";c.fillRect(0,0,OW,OH);c.imageSmoothingQuality="high";
  c.drawImage(img,(fw/2+x-iw*s/2)*r,(fh/2+y-ih*s/2)*r,iw*s*r,ih*s*r);res(cv)};
 el.querySelectorAll("[data-c]").forEach(b=>b.onclick=()=>done(b.dataset.c==="1"));paint()})}
async function peFile(file){const d=S.pe;if(!d||!file)return;const girl=(d.asG||S.gender)==="girl";
 try{const bn=PET==="bn",img=await loadImg(file),cv=await openCrop(img,bn?"bn":"av");URL.revokeObjectURL(img.src);if(!cv)return;const url=cv.toDataURL("image/jpeg",.86),n=await faceCount(cv);
  if(bn&&girl){if(n>0){toast("Расми духтар ҳамчун баннер қабул намешавад");return}if(n===null){d.pend={t:"bn",url,msg:"Мо наметавонем санҷем, ки дар сурат шахс ҳаст ё не. Тасдиқ мекунед, ки дар сурат шахс нест?",ok:"Дар сурат шахс нест, тасдиқ мекунам"};render();return}}
  if(!bn&&!girl&&n!==null&&n!==1){d.pend={t:"av",url,msg:"Тавсия: расми худатонро рӯ ба рӯ, аз сина боло гузоред (як нафар).",ok:"Ба ҳар ҳол гузоштан"};render();return}
  d[bn?"bn":"av"]=url;render()}catch(_){toast("Расм хонда нашуд")}}
async function peSave(){const d=S.pe;if(!d)return;const nm=(d.name||"").trim().slice(0,40);if(!nm){toast("Ном холӣ аст");return}
 S.pAv=d.av;S.pBn=d.bn;S.pBio=(d.bio||"").trim().slice(0,200);
 if(nm!==S.uname){const c=await sbLoad();if(!c||!S.uid)toast("Барои иваз кардани ном интернет лозим аст");else{try{const{data,error}=await c.rpc("rename_me",{p_name:nm});if(error||!data)toast("Ном иваз нашуд. Аввал SQL-и профилро иҷро кунед");else{S.uname=data;if(data!==nm)toast("Ин ном банд буд. Ба шумо «"+data+"» дода шуд")}}catch(_){toast("Ном иваз нашуд")}}}
 S.pe=null;S.sheet=null;save();render();toast("Профил сабт шуд");pushProfile()}
async function pushProfile(){try{const c=await sbLoad();if(!c||!S.uid)return;let av=S.pAv||null,bn=S.pBn||null;
  const up=async(v,nm)=>{if(!v||!v.startsWith("data:"))return v;const b=await(await fetch(v)).blob(),p=S.uid+"/"+nm+".jpg",r=await c.storage.from("avatars").upload(p,b,{upsert:true,contentType:"image/jpeg"});if(r.error)return v;return c.storage.from("avatars").getPublicUrl(p).data.publicUrl+"?t="+Date.now()};
  av=await up(av,"avatar");bn=await up(bn,"banner");
  await c.rpc("save_profile",{p_avatar:isImg(av)&&av.startsWith("data:")?null:av,p_banner:isImg(bn)&&bn.startsWith("data:")?null:bn,p_bio:S.pBio||null})}catch(_){}}
async function loadProfile(c){try{if(!S.uid)return;const{data}=await c.from("profiles").select("name,avatar,banner,bio").eq("id",S.uid).maybeSingle();if(!data)return;
  if(data.name)S.uname=data.name;if(!S.pAv&&data.avatar)S.pAv=data.avatar;if(!S.pBn&&data.banner)S.pBn=data.banner;if(!S.pBio&&data.bio)S.pBio=data.bio}catch(_){}}

function me(){
 return `<section class="screen" style="gap:0">
  <div class="pcover" style="${bnStyle(S.pBn)}"><button class="round" data-sheet="app" aria-label="Танзимот">${P(I.gear)}</button></div>
  <div class="pad" style="position:relative;display:flex;flex-direction:column;gap:20px;padding-top:0">
   <div class="prow"><div class="av">${avInner(S.pAv)}</div><div class="btns"><button class="pill" data-pedit>Таҳрири профил</button></div></div>
   <div><h1 class="name">${escH(S.uname||"Номи шумо")}${S.role==="admin"||S.role==="subadmin"?VBADGE:""}</h1><p class="sub">${S.email?escH(S.email):"Ҳисоб сабт нашудааст"}</p>${S.pBio?`<p class="pbio">${escH(S.pBio)}</p>`:""}
    <div class="meta2"><span>${P(I.brief,1.8)}${S.role==="admin"?"Админи Китобхона":S.role==="subadmin"?"Ёрдамчии админ":"Ҳисоби ройгон"}</span><span>${P(I.cal,1.8)}Имрӯз пайваст шуд</span></div></div>
   ${PREM()?`<div class="banner2"><svg class="ico" style="width:40px;height:40px" viewBox="0 0 24 24" fill="#fff" fill-opacity=".9"><path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z"/></svg><div><b>Китобхона Премиум</b><span>Имкониятҳои махсусро кашф кунед</span></div><button class="cta" data-toast="Харид — қадами оянда">Премиум ›</button></div>`:""}
   <div class="stats">
    <button class="stat" data-sheet="khirad"><small translate="no">Тавозуни хирад</small><b>${COIN_I}0</b></button>
    <div class="stat"><small>Мутолиаи умумӣ</small><b><span style="color:#3aa0d8">${P(I.clock,2)}</span>${readTotal()} дақ</b></div>
    <div class="stat"><small>Рейтинги Озмун</small><b><span style="color:#e0a820">${P(I.trophy,2)}</span>0</b></div>
    <div class="stat"><small>7 рӯзи охир</small><b><span style="color:#6a63e0">${P(I.cal,2)}</span>${read7()} дақ</b></div>
   </div>
   ${admHTML()}
   <div class="sec"><div class="sec-h"><h2>Ҷинс</h2></div><div class="plan"><span class="gart sm"><svg viewBox="0 0 100 100">${art()}</svg></span><div><b>${S.gender==="boy"?"Писар":S.gender==="girl"?"Духтар":"Интихоб нашудааст"}</b><span>${S.gender?"Ҷинсро иваз кардан мумкин нест. Фақат аз ҳисоб баромада, аз нав сабти ном кунед.":"Ҷинс ҳангоми сабти ном интихоб мешавад."}</span></div></div>
    ${S.confirmOut?`<div class="empty-card" style="flex-direction:column;align-items:stretch"><b>Аз ҳисоб мебароед?</b><span>Ҷинс ва ҷамъоварӣ нест мешавад. Бозгашт аз нав сабти ном аст.</span><div style="display:flex;gap:10px"><button class="pill" style="flex:1;background:var(--orange);color:#fff" data-logout-yes>Ҳа, мебароям</button><button class="pill" style="flex:1" data-logout-no>Бекор</button></div></div>`:`<button class="pill" style="width:100%;height:48px;justify-content:center" data-logout>Аз ҳисоб баромадан</button>`}</div>
      ${PREM()?`<div class="sec"><div class="sec-h"><h2>Тарифҳо</h2></div>
    <div class="plan"><span class="round">${P('<circle cx="8" cy="8" r="3"/><circle cx="17" cy="9" r="2.4"/><path d="M2.500 20c.5-4 2.800-6 5.500-6s5 2 5.500 6M14 15.200c.8-.5 1.700-.7 2.600-.7 2.200 0 3.900 1.600 4.400 5"/>')}</span><div><b>Тарифи оилавӣ</b><span>Як обуна барои 3–5 аъзои оила</span></div><button class="pill" data-toast="Тарифи оилавӣ — қадами оянда">Дидан</button></div>
    <div class="plan"><span class="round">${P('<path d="M3 9l9-5 9 5-9 5zM7 11.500V16c3 2 7 2 10 0v-4.500"/>')}</span><div><b>Тарифи мактабӣ</b><span>Мактаб як ҳисобро ба хонандагон тақсим мекунад</span></div><button class="pill" data-toast="Тарифи мактабӣ — қадами оянда">Дидан</button></div>
   </div>`:""}
  </div></section>${tabs()}`;
}

const CATS=[["audio","Аудио дар роҳ","Дар нақлиёт ва кор гӯш кунед",'<path d="M4 15v-3a8 8 0 0116 0v3M4 15a2 2 0 012-2h1v6H6a2 2 0 01-2-2zM20 15a2 2 0 00-2-2h-1v6h1a2 2 0 002-2z"/>'],...GENRES];
function comm(){
 const cnt={audio:BOOKS.filter(b=>b.audio).length};GENRES.forEach(g=>cnt[g[0]]=BOOKS.filter(b=>b.c===g[0]).length);
 return `<section class="screen pad"><h1 class="title">Категория</h1>
  <div class="catlist">${CATS.map(([k,n,d,ic])=>`<button class="catrow" data-cat="${k}"><span class="cico">${P(ic,1.7)}</span><span class="txt"><b>${n}</b><span>${d}</span></span><span class="num">${cnt[k]}</span>${P(I.chev).replace('class="ico"','class="chev"')}</button>`).join("")}</div>
 </section>${tabs()}`;
}
const KH_TXT="Хирад — вожаи куҳани форсӣ-тоҷикӣ буда, маъноҳои «ақл», «ҳуш», «зеҳн», «идрок» ва «дарёфт»-ро ифода мекунад. Ин вожа дар адабиёти классикии форсу тоҷик ҷойгоҳи баланд дорад. Ҳаким Абулқосим Фирдавсӣ «Шоҳнома»-и худро бо байти машҳури «Ба номи Худованди ҷону хирад» оғоз намуда, дар бахши «Ситоиши хирад» ақлу хирадро ситоиш кардааст.";
const COIN_I=`<img class="ci" src="logos/khirad-s.webp" alt="" draggable="false">`;
function coin3d(){let l="";for(let i=0;i<22;i++)l+=`<i class="c3-l" style="transform:translateZ(${-i*.85}px)"></i>`;
 return `<div class="c3" aria-hidden="true"><div class="c3-t"><div class="c3-s"><img class="c3-f" src="logos/khirad.webp" alt="" draggable="false">${l}<img class="c3-b" src="logos/khirad.webp" alt="" draggable="false" style="transform:translateZ(-19.2px) rotateY(180deg)"></div></div><span class="c3-sh"></span></div>`}
function goal(){
 const b=S.gender==="boy";
 const cur="Тавозуни хирад";
 return `<section class="screen pad"><h1 class="title">Озмун</h1>
  <div class="empty-card"><span class="gart sm">${COIN_I}</span><div><b translate="no">${cur}</b><span>Ин валютаи Китобхона. Бо хондан ҷамъ мекунед.</span></div></div>
  <div class="stats"><div class="stat"><small>Мақоми шумо</small><b>0</b></div><button class="stat" data-sheet="khirad"><small translate="no">${cur}</small><b>${COIN_I}0</b></button></div>
  </section>${tabs()}`;
}

function soon(ic,t,p){return `<section class="screen pad"><h1 class="title">${t}</h1><div class="soon"><span class="big">${P(ic,1.8)}</span><h2>Дар қадами оянда</h2><p>${p}</p></div></section>${tabs()}`}

function render(fq){
 if((S.view==="audio"&&!(S.au&&bk(S.au.id)))||(S.view==="read"&&!bk(S.rdId))||(S.view==="book"&&!bk(S.bookId)))S.view="home";
 const v=S.view;
 app.innerHTML=(v==="read"?reader(): v==="audio"?player(): v==="book"?detail(): v==="login"?login(): v==="home"?home(): v==="lib"?lib(): v==="me"?me():
  v==="goal"?goal(): comm())+sheetHTML();
 if(fq){const q=document.getElementById("q");if(q){q.focus();q.setSelectionRange(q.value.length,q.value.length)}}
 bind();
 syncTabs();
 polish(v);
 save();
}
let lastView=null,lastView0=null,sheetWas=false,closing=false;
const NBT={home:"Китобхона",lib:"Китобхонаи ман",goal:"Озмун",comm:"Категория"};
function polish(v){const sec=app.firstElementChild,de=document.documentElement;
 const changed=v!==lastView;if(sec&&changed&&!de.dataset.vt)sec.classList.add("enter");lastView=v;
 const can=sec&&S.sheet&&!sec.querySelector(".mini")&&!["read","audio"].includes(v);
 if(can){sec.style.transformOrigin=`50% ${scrollY+innerHeight/2}px`;
  const top=scrollY,bot=Math.max(0,sec.offsetHeight-scrollY-innerHeight);sec.style.clipPath=`inset(${top}px 0 ${bot}px 0 round 14px)`;
  sec.classList.add("behind");if(!sheetWas)sec.classList.add("behind-in")}
 else if(sec&&sheetWas&&!S.sheet&&!closing&&v===lastView0&&!sec.querySelector(".mini")&&!["read","audio"].includes(v)){sec.style.transformOrigin=`50% ${scrollY+innerHeight/2}px`;sec.classList.add("unbehind")}
 closing=false;lastView0=v;
 de.classList.toggle("sheet-on",!!can);sheetWas=!!S.sheet;
 navbar()}
function navbar(){let nb=document.getElementById("nb");
 if(!nb){nb=document.createElement("div");nb.id="nb";nb.className="nb";nb.setAttribute("aria-hidden","true");nb.innerHTML="<b></b>";document.body.appendChild(nb)}
 const t=S.view==="me"?(S.uname||"Ҳисоб"):NBT[S.view];
 nb.firstChild.textContent=t||"";nb.classList.toggle("on",!!t&&!S.search&&scrollY>64)}
addEventListener("scroll",()=>{const nb=document.getElementById("nb");if(nb){const t=nb.firstChild.textContent;nb.classList.toggle("on",!!t&&!S.search&&scrollY>64)}},{passive:true});
document.addEventListener("pointerdown",e=>{const b=e.target.closest(".tb-i");if(!b)return;
 b.classList.remove("pop");void b.offsetWidth;b.classList.add("pop");setTimeout(()=>b.classList.remove("pop"),520);try{navigator.vibrate&&navigator.vibrate(6)}catch(_){}},{passive:true});
let tt,tt2;function toast(m){const t=document.getElementById("toast");t.textContent=m;clearTimeout(tt);clearTimeout(tt2);t.classList.remove("out");t.hidden=true;void t.offsetWidth;t.hidden=false;t.classList.toggle("hi",!!document.querySelector(".mini"));tt=setTimeout(()=>{t.classList.add("out");tt2=setTimeout(()=>t.hidden=true,250)},2200)}
function go(v){cxClose();S.view=v;S.search=false;try{history.replaceState(null,"","#"+v)}catch(e){}render();window.scrollTo(0,0)}
function bind(){
 if(S.sheet==="admrel"&&!S._rl){S._rl=1;loadRelAdmin()}
 Object.keys(DLP).forEach(k=>setDLP(+k,DLP[k]));
 const $$=(s,f)=>app.querySelectorAll(s).forEach(f);
 $$("[data-go]",b=>b.onclick=()=>go(b.dataset.go));
 $$("[data-toast]",b=>b.onclick=()=>toast(b.dataset.toast));
 $$("[data-book]",b=>b.onclick=()=>openDetail(+b.dataset.book));
 $$("[data-back]",b=>b.onclick=()=>nav(()=>{S.view=S.prev||"home";S.search=!!S.prevSearch;render();window.scrollTo(0,0)},"back"));
 $$("[data-read]",b=>b.onclick=()=>openBook(+b.dataset.read));
 $$("[data-logout]",b=>b.onclick=()=>{S.confirmOut=true;render()});
 $$("[data-logout-no]",b=>b.onclick=()=>{S.confirmOut=false;render()});
 $$("[data-adm]",b=>b.onclick=e=>{e.stopPropagation();S.adm=b.dataset.adm==="edit"?{...bk(+b.dataset.id)}:{};S.sheet="adm";render()});
 $$("[data-fmt]",b=>b.onclick=()=>toast(b.dataset.fmt));
 const az=document.getElementById("admzip");if(az)az.onchange=async()=>{const all=[...(az.files||[])];if(!all.length)return;let ok=0,bad=[];
  const isImg=f=>/^image\//.test(f.type)||/\.(jpe?g|png|webp)$/i.test(f.name),imgs=all.filter(isImg),fs=all.filter(f=>!isImg(f));
  if(!fs.length){az.value="";toast("book.json ё .kitob ҳам интихоб кунед (расм танҳо кифоя нест)");return}
  for(let i=0;i<fs.length;i++){toast("Бор мешавад "+(i+1)+"/"+fs.length+"… "+fs[i].name);
   try{await importZip(fs[i],imgs);ok++}catch(e){bad.push(fs[i].name+": "+(e.message||"хато"))}}
  az.value="";render();
  toast(bad.length?ok+" бор шуд, "+bad.length+" нашуд. "+bad[0]:ok+" китоб бор шуд (пинҳон)")};
 const acv=document.getElementById("a_cv");if(acv)acv.onchange=()=>{const f=acv.files&&acv.files[0],n=document.getElementById("a_cvn");if(f&&n)n.textContent="Интихоб шуд: "+f.name};
 const asave=document.querySelector("[data-admsave]");if(asave)asave.onclick=async()=>{
  const v=id=>document.getElementById(id),t=v("a_t").value.trim(),a=v("a_a").value.trim();
  if(!t||!a){toast("Ном ва муаллифро нависед");return}
  const col=ADM_COLS[+v("a_col").value]||ADM_COLS[0];
  const row={t,a,c:v("a_c").value,col1:col[0],col2:col[1],audio:v("a_au").checked,descr:v("a_d").value.trim(),published:v("a_pub").checked,ebook:v("a_eb").checked,premium:v("a_pr").checked};
  asave.disabled=true;const c=await sbLoad();if(!c){asave.disabled=false;toast("Интернет нест");return}
  const cvf=v("a_cv").files&&v("a_cv").files[0];
  let bid=S.adm&&S.adm.id,bslug=S.adm&&S.adm.slug,error=null,sqlMiss=false;
  const save1=async rw=>{if(bid)return(await c.from("books").update(rw).eq("id",bid)).error;
   const rs=await c.from("books").insert(rw).select("id,slug").single();if(rs.data){bid=rs.data.id;bslug=rs.data.slug}return rs.error};
  error=await save1(row);
  if(error&&/premium|ebook/i.test(error.message||"")){const{ebook,premium,...old}=row;error=await save1(old);if(!error)sqlMiss=true}
  if(error){asave.disabled=false;toast("Захира нашуд. Ҳуқуқи админ лозим аст ё интернет нест");return}
  if(cvf&&bid){try{await uploadCover(c,bid,bslug,cvf)}catch(e){asave.disabled=false;toast(e.message||"Муқова бор нашуд");return}}
  await loadBooks(c);S.sheet=null;S.adm=null;render();toast(sqlMiss?"Захира шуд, лекин «Премиум/Электронӣ» нигоҳ дошта нашуд. Аввал SQL-ро иҷро кунед":"Захира шуд")};
 const adel=document.querySelector("[data-admdel]");if(adel)adel.onclick=async()=>{
  if(!confirm("Китоб ба тамом нест мешавад. Давом медиҳед?"))return;
  const c=await sbLoad();if(!c)return;const{error}=await c.from("books").delete().eq("id",S.adm.id);
  if(error){toast("Нест нашуд");return}await loadBooks(c);S.sheet=null;S.adm=null;render();toast("Нест шуд")};
 $$("[data-logout-yes]",b=>b.onclick=()=>{S.role="";S.staff=null;S.bkCache=[];for(let i=BOOKS.length-1;i>=0;i--)if(BOOKS[i].db)BOOKS.splice(i,1);S.gender=undefined;S.recent=[];S.prog={};S.confirmOut=false;S.step="email";S.email="";S.uname="";S.uid="";sbLoad().then(c=>c&&c.auth.signOut());go("login")});
 $$("[data-listen]",b=>b.onclick=()=>openAudio(+b.dataset.listen));
 $$("[data-closeread]",b=>b.onclick=()=>nav(()=>{S.view=S.rdPrev||"home";S.sheet=null;render();window.scrollTo(0,0)},"down"));
 $$("[data-sheet]",b=>b.onclick=e=>{e.stopPropagation();S.sheet=b.dataset.sheet;if(S.sheet==="toc")S.tocTab=0;render()});
 $$("[data-shclose]",b=>b.onclick=closeSheet);
 $$("[data-toct]",b=>b.onclick=()=>{S.tocTab=+b.dataset.toct;render()});
 const jump=p=>{const id=S.rdId;if(locked(bk(id))&&p>=FREE_PAGES){S.payId=id;S.sheet="pay";render();return}S.pages[id]=p;delete S.rdFr[id];S.sheet=null;render()};
 $$("[data-goch]",b=>b.onclick=()=>jump(RD&&RD.heads?RD.heads[+b.dataset.goch]:0));
 $$("[data-gopg]",b=>b.onclick=()=>{const k=+b.dataset.gopg,id=S.rdId;if(isTx(bk(id)))goChap(id,Math.floor(k/1e5),k%1e5);else jump(k)});
 $$("[data-gotch]",b=>b.onclick=()=>goChap(S.rdId,+b.dataset.gotch,0));
 $$("[data-lh]",b=>b.onclick=()=>{S.pref.lh=Math.round(Math.max(1.2,Math.min(2.2,(S.pref.lh||1.6)+ +b.dataset.lh*.1))*10)/10;render()});
 $$("[data-bkdone]",b=>b.onclick=bkDone);
 $$("[data-privacy]",b=>b.onclick=()=>NATIVE.openUrl(SITE_URL+"maxfiyat.html"));
 $$("[data-share]",b=>b.onclick=()=>{const bb=bk(+b.dataset.share)||bk(b.dataset.share);if(bb)NATIVE.share("«"+bb.t+"» — "+bb.a+"\nДар Китобхона бихонед:",bookLink(bb))});
 $$("[data-dir]",b=>b.onclick=()=>{S.pref.dir=b.dataset.dir;save();render()});
 {const fr=document.getElementById("fsr");if(fr){fr.oninput=()=>{const v=+fr.value,q=(v-13)/15*100;fr.style.setProperty("--p",q+"%");const t=document.getElementById("fsv");if(t){t.textContent=v;t.style.left=q+"%"}const r=document.querySelector(".rd");if(r)r.style.setProperty("--fs",v+"px")};fr.onchange=()=>{S.pref.fs=+fr.value;save();render()}}}
 {const q=document.getElementById("rdsq");if(q){let tm=0;const go=()=>{RQT=q.value;runSearch(RQT);rdsFill()};rdsFill();
   q.oninput=()=>{clearTimeout(tm);tm=setTimeout(go,220)};q.onkeydown=e=>{if(e.key==="Enter"){clearTimeout(tm);go();q.blur()}};
   if(!RQT)setTimeout(()=>{try{q.focus()}catch(_){}},350);
   const rs=document.getElementById("rdsres");if(rs)rs.onclick=e=>{const r=e.target.closest("[data-rdhit]");if(!r)return;HI=+r.dataset.rdhit;hitGo()}}}
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
 $$("[data-pedit]",b=>b.onclick=()=>{S.pe={name:S.uname||"",bio:S.pBio||"",av:S.pAv||"",bn:S.pBn||"",pend:null};S.sheet="pedit";render()});
 if(S.sheet==="pedit"&&S.pe){const d=S.pe,f=document.getElementById("pef"),n=document.getElementById("pen"),t=document.getElementById("peb");
  if(n)n.oninput=()=>{d.name=n.value};if(t)t.oninput=()=>{d.bio=t.value};
  if(f)f.onchange=()=>{const x=f.files&&f.files[0];f.value="";if(x)peFile(x)};
  $$("[data-pe-av]",b=>b.onclick=()=>{PET="av";f&&f.click()});$$("[data-pe-bn]",b=>b.onclick=()=>{PET="bn";f&&f.click()});
  $$("[data-pe-bg]",b=>b.onclick=()=>{d.bn="g:"+b.dataset.peBg;d.pend=null;render()});
  $$("[data-pe-a]",b=>b.onclick=()=>{d.av="av:"+b.dataset.peA;render()});
  $$("[data-pe-more]",b=>b.onclick=()=>{const s=+((/^av:(\d+)$/.exec(d.av||"")||[])[1]||0);d.more=!(d.more||s>5);render()});
  $$("[data-pe-clr]",b=>b.onclick=()=>{d.av="";render()});
  $$("[data-pe-ok]",b=>b.onclick=()=>{if(d.pend){d[d.pend.t]=d.pend.url;d.pend=null;render()}});
  $$("[data-pe-no]",b=>b.onclick=()=>{d.pend=null;render()});
  $$("[data-pe-save]",b=>b.onclick=peSave)}
 $$("[data-hit]",b=>b.onclick=()=>{if(!HITS.length)return;HI=(HI+ +b.dataset.hit+HITS.length)%HITS.length;hitGo()});
 $$("[data-hitx]",b=>b.onclick=()=>{RQ="";HITS=[];HI=-1;HITCI=-1;HITK=-1;RQT="";render()});
 $$("[data-theme-set]",b=>b.onclick=()=>{const k=b.dataset.themeSet;if(k===(S.theme||"paper"))return;
  nav(()=>{S.theme=k;S.pref.th=k==="paper"?"sepia":k==="dark"?"dark":k==="light"?"white":(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"white");applyTheme();render()},"fade")});
 $$("[data-upd-go]",b=>b.onclick=()=>{const A=window.KitobAndroid;if(!A||!A.downloadUpdate||!S.upd)return;S.updSt="down";S.updP=0;render();try{A.downloadUpdate(S.upd.url)}catch(_){S.updSt="err";render()}});
 $$("[data-upd-install]",b=>b.onclick=()=>{const A=window.KitobAndroid;let r="err";try{r=A.installUpdate()}catch(_){}
  if(r==="perm")toast("Иҷозат диҳед ва баргашта аз нав пахш кунед");else if(r!=="ok"){S.updSt="err";render()}});
 $$("[data-updno]",b=>b.onclick=()=>{S.updNo=S.upd&&S.upd.v;render()});
 $$("[data-sa-add]",b=>b.onclick=async()=>{const el=document.getElementById("sa_mail"),m=(el&&el.value||"").trim().toLowerCase();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m)){toast("Почтаро дуруст нависед, масалан nom@gmail.com");return}
  if(await setStaff(m,"subadmin")&&el)el.value=""});
 $$("[data-flag]",b=>b.onclick=async()=>{const on=!b.classList.contains("on");b.classList.toggle("on",on);try{const c=await sbLoad();const{error}=await c.rpc("set_flag",{p_key:b.dataset.flag,p_on:on});if(error){b.classList.toggle("on",!on);toast("Иҷозат дода нашуд. Аввал SQL-и омор ва премиумро иҷро кунед");return}S.flags.premium=on;save();render()}catch(_){b.classList.toggle("on",!on);toast("Интернет нест")}});
 $$("[data-perm]",b=>b.onclick=async()=>{const on=!b.classList.contains("on");b.classList.toggle("on",on);try{const c=await sbLoad();const{error}=await c.rpc("set_perm",{p_email:b.dataset.pm,p_key:b.dataset.perm,p_on:on});if(error){b.classList.toggle("on",!on);toast("Иҷозат дода нашуд. Аввал SQL-и иҷозатҳоро иҷро кунед")}else loadStaff()}catch(_){b.classList.toggle("on",!on);toast("Интернет нест")}});
 $$("[data-asg]",b=>b.onclick=()=>{if(S.pe){S.pe.asG=b.dataset.asg||"";S.pe.pend=null;render()}});
 $$("[data-sa-del]",b=>b.onclick=async()=>{if(!confirm("Ин ёрдамчиро бардоред?"))return;await setStaff(b.dataset.saDel,"user")});
 $$("[data-rel-pub]",b=>b.onclick=async()=>{if(!S.rb||!confirm("Ҳамаро навсозӣ мекунед?"))return;const c=await sbLoad();if(!c){toast("Интернет нест");return}
  try{const{error}=await c.rpc("publish_release",{p_version:+b.dataset.relPub,p_url:S.rb.url});if(error){toast("Иҷозат дода нашуд. Аввал SQL-ро иҷро кунед");return}await loadRelease();toast("Нашр шуд");render()}catch(_){toast("Интернет нест ё сервер ҷавоб намедиҳад")}});
 $$("[data-rel-stop]",b=>b.onclick=async()=>{if(!confirm("Навсозиро қатъ мекунед? Баннер намеояд"))return;const c=await sbLoad();if(!c)return;
  try{const{error}=await c.rpc("publish_release",{p_version:0,p_url:null});if(error){toast("Иҷозат дода нашуд");return}await loadRelease();toast("Қатъ шуд");render()}catch(_){toast("Интернет нест")}});
 $$("[data-nc]",b=>b.onclick=async()=>{const k=b.dataset.nc,c=S.ncfg||{},cur=k==="sub_can_edit"?!!c[k]:c[k]!==false;await saveNotif({[k]:!cur})});
 $$("[data-nh]",b=>b.onclick=async()=>{const c=S.ncfg||{},v=Math.max(9,Math.min(21,(c.remind_hour||20)+ +b.dataset.nh));if(v!==(c.remind_hour||20))await saveNotif({remind_hour:v})});
 $$("[data-ndl]",b=>b.onclick=()=>{S.ndl=b.dataset.ndl;render()});
 $$("[data-ndt]",t=>t.oninput=()=>{const L=S.ndl||I18N.lang;S.nd=S.nd||{remind_text:{},congrats_tpl:{}};S.nd[t.dataset.ndt]=S.nd[t.dataset.ndt]||{};S.nd[t.dataset.ndt][L]=t.value});
 $$("[data-nsave]",b=>b.onclick=()=>{const d=S.nd||{},clean=o=>{const r={};Object.keys(o||{}).forEach(k=>{if((o[k]||"").trim())r[k]=o[k].trim()});return r};saveNotif({remind_text:clean(d.remind_text),congrats_tpl:clean(d.congrats_tpl)})});
 $$("[data-lang]",b=>b.onclick=()=>{I18N.set(b.dataset.lang);pushNotifyCfg();S.sheet="app";render();toast("Забон иваз шуд")});
 $$("[data-th]",b=>b.onclick=()=>{S.pref.th=b.dataset.th;render()});
 $$("[data-ff]",b=>b.onclick=()=>{S.pref.ff=b.dataset.ff;render()});
 $$("[data-subscribe]",b=>b.onclick=()=>{S.premium=true;S.sheet=null;toast("Намуна: Премиум фаъол шуд");render()});
 $$("[data-paywall]",b=>b.onclick=()=>{S.payId=null;S.sheet="pay";render()});
 $$("[data-dlbook]",b=>b.onclick=async()=>{const id=+b.dataset.dlbook,bb=bk(id);if(locked(bb)){S.payId=id;S.sheet="pay";render();return}
  if(bb&&bpath(bb)){if(bb.have){toast("Китоб аллакай дар телефон аст");return}if(DLP[id]!=null)return;
   if(await fetchBook(bb)){render();toast("Боргирӣ шуд. Акнун бе интернет ҳам мехонед")}else toast("Боргирӣ нашуд. Интернетро санҷед");return}S.dlBook[id]=!S.dlBook[id];toast(S.dlBook[id]?"Барои хондан бе интернет нигоҳ дошта шуд":"Аз хотираи телефон тоза шуд");render()});
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
 $$("[data-author]",b=>b.onclick=()=>{S.q=b.dataset.author;S.chip="all";openSearch()});
 const sk=document.getElementById("apseek");if(sk){sk.oninput=()=>{sk.dataset.drag=1;const a=S.au;let p=+sk.value;if(locked(bk(a.id))&&p>FREE_SEC){p=FREE_SEC;sk.value=p}a.pos=p;aprog();tickUI()};sk.onchange=()=>{delete sk.dataset.drag}}
 const mk=document.getElementById("rdmark");if(mk)mk.onclick=()=>{const id=S.rdId,p=mkey(id),a=S.marks[id]||[],had=a.includes(p);S.marks[id]=had?a.filter(x=>x!==p):[...a,p];mk.classList.toggle("on",!had);toast(had?"Хатчӯб бардошта шуд":"Хатчӯб гузошта шуд");save()};
 bindFeedback();
 bindMake();
 setupReader();
 setupSheet();
 setupWheel();
 $$("[data-opensearch]",b=>b.onclick=()=>{S.q="";S.chip="all";openSearch()});
 $$("[data-closesearch]",b=>b.onclick=()=>{S.search=false;S.q="";S.chip="all";render()});
 $$("[data-cat]",b=>b.onclick=()=>{S.view="home";S.search=true;S.chip=b.dataset.cat;S.q="";render(true)});
 $$("[data-chip]",b=>b.onclick=()=>{S.chip=b.dataset.chip;render()});
 $$("[data-chip2]",b=>b.onclick=()=>{S.chip=b.dataset.chip2;S.q="";openSearch()});
 $$("[data-ptab]",b=>b.onclick=()=>{S.ptab=+b.dataset.ptab;render()});
 const q=document.getElementById("q");if(q)q.oninput=()=>{S.q=q.value;render(true)};
 const send=document.getElementById("send");
 if(send)send.onclick=async()=>{const e=document.getElementById("email").value.trim().toLowerCase();
  if(!okMail(e)){toast("Почтаро дуруст нависед, масалан nom@gmail.com");return}
  S.email=e;send.disabled=true;send.textContent="Фиристода истодааст…";
  const err=await sbSend(e);
  if(err){send.disabled=false;send.textContent="Гирифтани рамз";toast(err);return}
  S.resendAt=Date.now()+RESEND_SEC*1000;S.step="code";render();document.getElementById("c0").focus()};
 const cs=Array.from({length:OTPN},(_,i)=>i).map(i=>document.getElementById("c"+i));
 const autoGo=()=>{if(cs.every(x=>x.value))document.getElementById("verify").click()};
 const pc=document.getElementById("pastecode");if(pc)pc.onclick=async()=>{
  try{const d=(await navigator.clipboard.readText()).replace(/\D/g,"").slice(0,OTPN);
   if(d.length!==OTPN){toast("Дар нусха рамзи "+OTPN+"-рақама нест");return}
   d.split("").forEach((x,i)=>cs[i].value=x);autoGo()}
  catch(_){toast("Иҷозат дода нашуд. Катакчаро дарозмуддат пахш карда гузоред")}};
 if(cs[0])cs.forEach((c,i)=>{c.oninput=()=>{let v=c.value.replace(/\D/g,"");
   if(v.length>1){v.split("").slice(0,OTPN-i).forEach((d,j)=>cs[i+j].value=d);(cs[Math.min(i+v.length,OTPN-1)]).focus();autoGo();return}
   c.value=v;if(v&&cs[i+1])cs[i+1].focus();autoGo()};c.onkeydown=e=>{if(e.key==="Backspace"&&!c.value&&cs[i-1])cs[i-1].focus()}});
 const ver=document.getElementById("verify");if(ver)ver.onclick=async()=>{const t=cs.map(c=>c.value).join("");
  if(t.length!==OTPN){toast("Ҳар "+OTPN+" рақамро нависед");return}
  ver.disabled=true;ver.textContent="Тафтиш…";
  const c=await sbLoad();
  if(c){const{data,error}=await c.auth.verifyOtp({email:S.email,token:t,type:"email"});
   if(error){ver.disabled=false;ver.textContent="Тасдиқ кардан";toast("Рамз нодуруст ё кӯҳна аст");return}
   const m=data.user?.user_metadata||{};S.uid=data.user?.id||"";syncServer();
   if(m.gender){S.gender=m.gender;S.uname=m.name||"";S.step="email";go("home");return}}
  S.step="gender";render()};
 $$("[data-g]",b=>b.onclick=async()=>{const n=(document.getElementById("uname").value||"").trim();
  if(!n){toast("Номатонро нависед");return}
  S.gender=b.dataset.g;S.uname=n;
  const c=await sbLoad();if(c){
   try{const{data:nm,error:ne}=await c.rpc("claim_name",{p_name:n});if(!ne&&nm){if(nm!==n)toast("Ин ном банд буд. Ба шумо «"+nm+"» дода шуд");S.uname=nm}}catch(_){}
   const{error}=await c.auth.updateUser({data:{gender:S.gender,name:S.uname}});if(error)toast("Дар сервер сабт нашуд, баъдтар аз нав");await syncServer()}
  S.step="email";go("home")});
 const rs=document.getElementById("resend");if(rs){
  const tick=()=>{if(!rs.isConnected)return clearInterval(S.rsT);const left=Math.ceil(((S.resendAt||0)-Date.now())/1000);
   rs.disabled=left>0;rs.textContent=left>0?"Рамзи нав ("+left+" сония)":"Рамз наомад? Аз нав фиристед"};
  clearInterval(S.rsT);S.rsT=setInterval(tick,500);tick();
  rs.onclick=async()=>{rs.disabled=true;rs.textContent="Фиристода истодааст…";
   const err=await sbSend(S.email);
   if(err){toast(err);S.resendAt=0;tick();return}
   S.resendAt=Date.now()+RESEND_SEC*1000;cs.forEach(c=>c.value="");cs[0].focus();toast("Рамзи нав фиристода шуд");tick()}}
 const back=document.getElementById("back");if(back)back.onclick=()=>{S.step="email";render()};
}
const h=location.hash.slice(1);if(["login","home","lib","goal","comm","me"].includes(h))S.view=h;
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&S.sheet){closeSheet();return}
 if(S.view==="read"&&!S.sheet&&!/INPUT|TEXTAREA/.test(document.activeElement.tagName)){if(e.key==="ArrowRight")turn(1);if(e.key==="ArrowLeft")turn(-1)}});
let rz;window.addEventListener("resize",()=>{clearTimeout(rz);rz=setTimeout(()=>{if(S.view==="read")setupReader();TB.iw=0;if(!TB.raf){const i=tabKeys().indexOf(S.view);if(i>=0){tbMeasure();TB.x=TB.tx=tbCenter(i);tbDraw()}}},150)});
if(S.step==="phone")S.step="email";
sbLoad().then(async c=>{if(!c)return;const{data}=await c.auth.getSession();const u=data.session?.user;
 if(u){const m=u.user_metadata||{};S.uid=u.id;S.email=u.email||S.email;if(m.gender){S.gender=m.gender;S.uname=m.name||S.uname;if(S.view==="login"){go("home")}}else if(S.view==="login"){S.step="gender";render()}}
 else if(S.gender&&S.uid){S.gender=undefined;S.uid="";S.view="login";S.step="email";render()}});
["gesturestart","gesturechange","gestureend"].forEach(t=>document.addEventListener(t,e=>e.preventDefault(),{passive:false}));
window.__back=()=>{if(cxOpen){cxClose();return true}const q=sel=>{const e=document.querySelector(sel);if(e){e.click();return true}return false};
 if(S.sheet){closeSheet();return true}
 if(S.view==="read")return q("[data-closeread]");
 if(S.view==="audio")return q("[data-apmin]");
 if(S.view==="book")return q("[data-back]");
 if(S.search)return q("[data-closesearch]");
 if(S.view!=="home"&&S.view!=="login"){go("home");return true}
 return false};
