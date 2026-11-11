function login(){
 const demo=!SB_URL||!SB_KEY;
 const email=`<h2>Ворид шавед</h2><p class="hint">Почтаи электронии худро нависед. Мо рамзи ${OTPN}-рақама мефиристем, парол лозим нест.</p>
 <label class="field" for="email"><input id="email" type="email" inputmode="email" autocomplete="email" autocapitalize="off" spellcheck="false" placeholder="nom@gmail.com" value="${escH(S.email||"")}" style="padding-left:18px"></label>
 <button class="btn" id="send">Гирифтани рамз</button><button class="btn-t" data-go="home">Аввал дидан, бе бақайдгирӣ</button>${demo?'<p class="hint"><span class="demo">Реҷаи намуна: сервер ҳанӯз пайваст нест</span></p>':''}`;
 const code=`<h2>Рамз аз почта</h2><p class="hint">Рамзи ${OTPN}-рақама ба <b>${escH(S.email||"")}</b> фиристода шуд. Агар набошад, ҷузвдони «Спам»-ро бинед.${demo?' <span class="demo">Намуна: ҳар ${OTPN} рақам</span>':''}</p>
 <div class="code">${Array.from({length:OTPN},(_,i)=>i).map(i=>`<input id="c${i}" inputmode="numeric" autocomplete="${i?"off":"one-time-code"}" maxlength="${i?1:OTPN}" aria-label="Рақами ${i+1}">`).join("")}</div>
 <button class="btn" id="verify">Тасдиқ кардан</button><button class="btn-t" id="pastecode">Рамзи нусхашударо гузоштан</button><button class="btn-t" id="resend" disabled>Рамзи нав</button><button class="btn-t" id="back">Почтаро иваз кардан</button>`;
 const deleted=`<h2>Ҳисоб баста шудааст</h2><p class="hint">Ин ҳисоб нест карда шудааст. Маълумот то 30 рӯз дар сервер мемонад. Агар хато шуда бошад ё хоҳед ҳисобро баргардонед, ба бунёдгузорони Китобхона паём нависед: онҳо ҳисобро тикла метавонанд.</p>
 <button class="btn" data-ext="https://t.me/kitobkhona_official">Навиштан дар Телеграм</button><button class="btn-t" id="back">Бозгашт</button>`;
 const gender=`<h2>Шумо кистед?</h2><p class="hint">Ном ва ҷинс барои профил ва ҷоизаи Озмун лозим аст.</p>
 <label class="field" for="uname"><input id="uname" autocomplete="given-name" placeholder="Номи шумо" maxlength="40" value="${escH(S.uname||"")}" style="padding-left:18px"></label>
 ${consBlock()}<p class="hint">Ҷинси худро интихоб кунед (бо пахш кардан давом мекунед):</p>
 <div class="gopts"><button class="gopt" data-g="girl"><span class="gart"><svg viewBox="0 0 100 100">${ROSE_ART}</svg></span><b>Духтар</b></button><button class="gopt" data-g="boy"><span class="gart"><svg viewBox="0 0 100 100">${GLOVE_ART}</svg></span><b>Писар</b></button></div>`;
 return `<section class="login"><div class="hero pad"><div class="lg">${LOGO}</div><h1 translate="no">Китобхона</h1><p>Китобҳои тоҷикӣ ва аудиокитобҳо дар телефони шумо, ҳатто бе интернет.</p></div><div class="pad" style="display:flex;flex-direction:column;gap:16px">${S.step==="code"?code:S.step==="gender"?gender:S.step==="deleted"?deleted:email}</div></section>`;
}/* ---- Профил: сурат, баннер, ном, маълумот ---- */
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
async function loadProfile(c){try{if(!S.uid)return;const{data}=await c.from("profiles").select("name,avatar,banner,bio").eq("id",S.uid).maybeSingle();
  if(!data){if(S.uname&&!S.healTried){S.healTried=1;const r=await c.rpc("claim_name",{p_name:S.uname});if(!r.error&&r.data)S.uname=r.data}return}
  if(data.name)S.uname=data.name;if(!S.pAv&&data.avatar)S.pAv=data.avatar;if(!S.pBn&&data.banner)S.pBn=data.banner;if(!S.pBio&&data.bio)S.pBio=data.bio}catch(_){}}

function me(){
 return `<section class="screen" style="gap:0">
  <div class="pcover" style="${bnStyle(S.pBn)}">${fabHTML()}<button class="round" data-sheet="app" aria-label="Танзимот">${P(I.gear)}</button></div>
  <div class="pad" style="position:relative;display:flex;flex-direction:column;gap:20px;padding-top:0">
   <div class="prow"><div class="av">${avInner(S.pAv)}</div><div class="btns"><button class="pill" data-pedit>Таҳрири профил</button></div></div>
   <div><h1 class="name">${escH(S.uname||"Номи шумо")}${S.role==="admin"||S.role==="subadmin"?VBADGE:""}</h1><p class="sub">${S.email?escH(S.email):"Ҳисоб сабт нашудааст"}</p>${S.pBio?`<p class="pbio">${escH(S.pBio)}</p>`:""}
    <div class="meta2"><span>${P(I.brief,1.8)}${S.role==="admin"?"Админи Китобхона":S.role==="subadmin"?"Ёрдамчии админ":"Ҳисоби ройгон"}</span><span>${P(I.cal,1.8)}Имрӯз пайваст шуд</span></div></div>
   ${PREM()&&FEAT("buy")?`<div class="banner2"><svg class="ico" style="width:40px;height:40px" viewBox="0 0 24 24" fill="#fff" fill-opacity=".9"><path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z"/></svg><div><b>Китобхона Премиум</b><span>Имкониятҳои махсусро кашф кунед</span></div><button class="cta" data-toast="Харид — қадами оянда">Премиум ›</button></div>`:""}
   <div class="stats">
    <button class="stat" data-sheet="khirad"><small translate="no">Тавозуни хирад</small><b>${FEAT("coin")?COIN_I+(S.coins||0):"Ба зудӣ"}</b></button>
    <div class="stat"><small>Мутолиаи умумӣ</small><b><span style="color:#3aa0d8">${P(I.clock,2)}</span>${readTotal()} дақ</b></div>
    <div class="stat"><small>Рейтинги Озмун</small><b><span style="color:#e0a820">${P(I.trophy,2)}</span>${FEAT("rank")?(S.rankNo||"—"):"Ба зудӣ"}</b></div>
    <div class="stat"><small>7 рӯзи охир</small><b><span style="color:#6a63e0">${P(I.cal,2)}</span>${read7()} дақ</b></div>
   </div>
   ${admHTML()}
   <div class="sec"><div class="sec-h"><h2>Ҷинс</h2></div><div class="plan"><span class="gart sm"><svg viewBox="0 0 100 100">${art()}</svg></span><div><b>${S.gender==="boy"?"Писар":S.gender==="girl"?"Духтар":"Интихоб нашудааст"}</b><span>${S.gender?"Ҷинсро иваз кардан мумкин нест. Фақат аз ҳисоб баромада, аз нав сабти ном кунед.":"Ҷинс ҳангоми сабти ном интихоб мешавад."}</span></div></div>
    ${S.confirmOut?`<div class="empty-card" style="flex-direction:column;align-items:stretch"><b>Аз ҳисоб мебароед?</b><span>Ҷинс ва ҷамъоварӣ нест мешавад. Бозгашт аз нав сабти ном аст.</span><div style="display:flex;gap:10px"><button class="pill" style="flex:1;background:var(--orange);color:#fff" data-logout-yes>Ҳа, мебароям</button><button class="pill" style="flex:1" data-logout-no>Бекор</button></div></div>`:`<button class="pill" style="width:100%;height:48px;justify-content:center" data-logout>Аз ҳисоб баромадан</button>`}</div>
      ${PREM()&&FEAT("buy")?`<div class="sec"><div class="sec-h"><h2>Тарифҳо</h2></div>
    <div class="plan"><span class="round">${P('<circle cx="8" cy="8" r="3"/><circle cx="17" cy="9" r="2.4"/><path d="M2.500 20c.5-4 2.800-6 5.500-6s5 2 5.500 6M14 15.200c.8-.5 1.700-.7 2.600-.7 2.200 0 3.900 1.600 4.400 5"/>')}</span><div><b>Тарифи оилавӣ</b><span>Як обуна барои 3–5 аъзои оила</span></div><button class="pill" data-toast="Тарифи оилавӣ — қадами оянда">Дидан</button></div>
    <div class="plan"><span class="round">${P('<path d="M3 9l9-5 9 5-9 5zM7 11.500V16c3 2 7 2 10 0v-4.500"/>')}</span><div><b>Тарифи мактабӣ</b><span>Мактаб як ҳисобро ба хонандагон тақсим мекунад</span></div><button class="pill" data-toast="Тарифи мактабӣ — қадами оянда">Дидан</button></div>
   </div>`:""}
  </div></section>${tabs()}`;
}
const KH_TXT="Хирад — вожаи куҳани форсӣ-тоҷикӣ буда, маъноҳои «ақл», «ҳуш», «зеҳн», «идрок» ва «дарёфт»-ро ифода мекунад. Ин вожа дар адабиёти классикии форсу тоҷик ҷойгоҳи баланд дорад. Ҳаким Абулқосим Фирдавсӣ «Шоҳнома»-и худро бо байти машҳури «Ба номи Худованди ҷону хирад» оғоз намуда, дар бахши «Ситоиши хирад» ақлу хирадро ситоиш кардааст.";
const COIN_I=`<img class="ci" src="logos/khirad-s.webp" alt="" draggable="false">`;
function coin3d(){let l="";for(let i=0;i<22;i++)l+=`<i class="c3-l" style="transform:translateZ(${-i*.85}px)"></i>`;
 return `<div class="c3" aria-hidden="true"><div class="c3-t"><div class="c3-s"><img class="c3-f" src="logos/khirad.webp" alt="" draggable="false">${l}<img class="c3-b" src="logos/khirad.webp" alt="" draggable="false" style="transform:translateZ(-19.2px) rotateY(180deg)"></div></div><span class="c3-sh"></span></div>`}

/* ---- пайвасти тугмаҳо: account (аз bind() даъват мешавад) ---- */
function bindAccount($$){
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
 $$("[data-asg]",b=>b.onclick=()=>{if(S.pe){S.pe.asG=b.dataset.asg||"";S.pe.pend=null;render()}});
 $$("[data-ptab]",b=>b.onclick=()=>{S.ptab=+b.dataset.ptab;render()});
 const send=document.getElementById("send");
 if(send)send.onclick=async()=>{const e=document.getElementById("email").value.trim().toLowerCase();
  if(!okMail(e)){toast("Почтаро дуруст нависед, масалан nom@gmail.com");return}
  S.email=e;send.disabled=true;send.textContent="Фиристода истодааст…";
  const err=await sbSend(e);
  if(err==="BANNED"){S.step="deleted";render();return}
  if(err){send.disabled=false;send.textContent="Гирифтани рамз";toast(err);return}
  S.resendAt=Date.now()+RESEND_SEC*1000;S.step="code";render();document.getElementById("c0").focus()};
 const cs=Array.from({length:OTPN},(_,i)=>i).map(i=>document.getElementById("c"+i));
 const autoGo=()=>{if(cs.every(x=>x.value))document.getElementById("verify").click()};
 const pc=document.getElementById("pastecode");
 if(pc)pc.onclick=async()=>{
  try{const d=(await navigator.clipboard.readText()).replace(/\D/g,"").slice(0,OTPN);
   if(d.length!==OTPN){toast("Дар нусха рамзи "+OTPN+"-рақама нест");return}
   d.split("").forEach((x,i)=>cs[i].value=x);autoGo()}
  catch(_){toast("Иҷозат дода нашуд. Катакчаро дарозмуддат пахш карда гузоред")}};
 if(cs[0])cs.forEach((c,i)=>{c.oninput=()=>{let v=c.value.replace(/\D/g,"");
   if(v.length>1){v.split("").slice(0,OTPN-i).forEach((d,j)=>cs[i+j].value=d);(cs[Math.min(i+v.length,OTPN-1)]).focus();autoGo();return}
   c.value=v;if(v&&cs[i+1])cs[i+1].focus();autoGo()};c.onkeydown=e=>{if(e.key==="Backspace"&&!c.value&&cs[i-1])cs[i-1].focus()}});
 const ver=document.getElementById("verify");
 if(ver)ver.onclick=async()=>{const t=cs.map(c=>c.value).join("");
  if(t.length!==OTPN){toast("Ҳар "+OTPN+" рақамро нависед");return}
  ver.disabled=true;ver.textContent="Тафтиш…";
  const c=await sbLoad();
  if(c){const{data,error}=await c.auth.verifyOtp({email:S.email,token:t,type:"email"});
   if(error&&(/ban/i.test(error.message||"")||error.code==="user_banned")){S.step="deleted";render();return}
   if(error){ver.disabled=false;ver.textContent="Тасдиқ кардан";toast("Рамз нодуруст ё кӯҳна аст");return}
   const m=data.user?.user_metadata||{};S.uid=data.user?.id||"";syncServer();
   if(m.gender){S.gender=m.gender;S.uname=m.name||"";S.step="email";go("home");return}}
  S.step="gender";render()};
 $$("[data-g]",b=>b.onclick=async()=>{const n=(document.getElementById("uname").value||"").trim();
  if(!n){toast("Номатонро нависед");return}if(!consOK())return;
  S.gender=b.dataset.g;S.uname=n;
  const c=await sbLoad();if(c){
   let nm=null,ne=null;try{const r=await c.rpc("claim_name",{p_name:n});nm=r.data;ne=r.error}catch(e){ne=e||1}
   if(ne||!nm){S.gender=undefined;toast("Профил сохта нашуд. Интернетро санҷед ва аз нав кӯшиш кунед");return}
   if(nm!==n)toast("Ин ном банд буд. Ба шумо «"+nm+"» дода шуд");S.uname=nm;
   const{error}=await c.auth.updateUser({data:{gender:S.gender,name:S.uname}});if(error)toast("Дар сервер сабт нашуд, баъдтар аз нав");await consSave();await syncServer()}
  S.step="email";go("home")});
 const rs=document.getElementById("resend");
 if(rs){
  const tick=()=>{if(!rs.isConnected)return clearInterval(S.rsT);const left=Math.ceil(((S.resendAt||0)-Date.now())/1000);
   rs.disabled=left>0;rs.textContent=left>0?"Рамзи нав ("+left+" сония)":"Рамз наомад? Аз нав фиристед"};
  clearInterval(S.rsT);S.rsT=setInterval(tick,500);tick();
  rs.onclick=async()=>{rs.disabled=true;rs.textContent="Фиристода истодааст…";
   const err=await sbSend(S.email);
   if(err){toast(err);S.resendAt=0;tick();return}
   S.resendAt=Date.now()+RESEND_SEC*1000;cs.forEach(c=>c.value="");cs[0].focus();toast("Рамзи нав фиристода шуд");tick()}}
 const back=document.getElementById("back");
 if(back)back.onclick=()=>{S.step="email";render()};
}

/* ---- варақи khirad ---- */
SHEETS.khirad=X=>{let h="";h=`<div class="sh-head"><b class="sh-t" translate="no">Тавозуни хирад</b>${X}</div>${coin3d()}<p class="kh-p">${KH_TXT}</p>`;;return h};

/* ---- варақи pedit ---- */
SHEETS.pedit=X=>{if(!(S.pe))return "";let h="";{const d=S.pe,girl=(d.asG||S.gender)==="girl";
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
  <input type="file" id="pef" accept="image/*" hidden>`};return h};

/* ---- варақи founders ---- */
SHEETS.founders=X=>{let h="";{
  const F=[["ҶХ","Ҷасурбек Холиқулов Эгамбердиев","Ғоя ва маҳсулот","#0b7d57","#63d48f"],["УҶ","Умаров Ҷумъаназар","Маълумот ба зудӣ илова мешавад","#c47a12","#f5b53c"]];
  h=`<div class="sh-head"><b class="sh-t fnd-t">Бунёдгузорон</b>${X}</div>
  <div class="fnd">${F.map(([i,n,d,c1,c2])=>`<div class="fnd-c"><span translate="no" class="fnd-av" style="background:linear-gradient(135deg,${c1},${c2})">${i}</span><b>${n}</b><em>Бунёдгузор</em><span>${d}</span></div>`).join("")}</div>`};return h};
