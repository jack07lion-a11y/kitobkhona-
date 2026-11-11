function render(fq){
 if((S.view==="audio"&&!(S.au&&bk(S.au.id)))||(S.view==="read"&&!bk(S.rdId))||(S.view==="book"&&!bk(S.bookId)))S.view="home";
 const v=S.view;
 app.innerHTML=(v==="read"?reader(): v==="audio"?player(): v==="book"?detail(): v==="login"?login(): v==="home"?home(): v==="lib"?lib(): v==="me"?me():
  v==="goal"?goal(): v==="rating"?ratingView(): comm())+sheetHTML();
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
 bindFeedbackQuick($$);bindAdmin($$);bindPlayer($$);bindReader($$);bindBackup($$);bindLibrary($$);bindAccount($$);bindUpdate($$);bindNotifications($$);bindI18n($$);bindPremium($$);bindCategory($$);bindPrivacy($$);bindRating($$);bindAdminDeleted($$); // тугмаҳои ҳар феатур: функсияи bindXxx($$) дар папкаи феатури худ
 $$("[data-go]",b=>b.onclick=()=>go(b.dataset.go));
 $$("[data-toast]",b=>b.onclick=()=>toast(b.dataset.toast));
 $$("[data-book]",b=>b.onclick=()=>openDetail(+b.dataset.book));
 $$("[data-back]",b=>b.onclick=()=>nav(()=>{S.view=S.prev||"home";S.search=!!S.prevSearch;render();window.scrollTo(0,0)},"back"));
 $$("[data-read]",b=>b.onclick=()=>openBook(+b.dataset.read));
 $$("[data-logout]",b=>b.onclick=()=>{S.confirmOut=true;render()});
 $$("[data-logout-no]",b=>b.onclick=()=>{S.confirmOut=false;render()});
 
 $$("[data-fmt]",b=>b.onclick=()=>toast(b.dataset.fmt));
 
 
 
 
 $$("[data-logout-yes]",b=>b.onclick=async()=>{try{await syncState(await sbLoad(),true)}catch(_){}resetUserData();pushNotifyCfg();sbLoad().then(c=>c&&c.auth.signOut());go("login")});
 
 
 $$("[data-sheet]",b=>b.onclick=e=>{e.stopPropagation();S.sheet=b.dataset.sheet;if(S.sheet==="toc")S.tocTab=0;render()});
 $$("[data-shclose]",b=>b.onclick=closeSheet);
 
 
 
 
 
 
 
 $$("[data-privacy]",b=>b.onclick=()=>NATIVE.openUrl(SITE_URL+"maxfiyat.html"));
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 $$("[data-theme-set]",b=>b.onclick=()=>{const k=b.dataset.themeSet;if(k===(S.theme||"paper"))return;
  nav(()=>{S.theme=k;S.pref.th=k==="paper"?"sepia":k==="dark"?"dark":k==="light"?"white":(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"white");applyTheme();render()},"fade")});
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 bindFeedback();
 bindWebPub();
 bindMake();
 setupReader();
 setupSheet();
 setupWheel();
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
}
const h=location.hash.slice(1);if(["login","home","lib","goal","comm","me"].includes(h))S.view=h;
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&S.sheet){closeSheet();return}
 if(S.view==="read"&&!S.sheet&&!/INPUT|TEXTAREA/.test(document.activeElement.tagName)){if(e.key==="ArrowRight")turn(1);if(e.key==="ArrowLeft")turn(-1)}});
let rz;window.addEventListener("resize",()=>{clearTimeout(rz);rz=setTimeout(()=>{if(S.view==="read")setupReader();TB.iw=0;if(!TB.raf){const i=tabKeys().indexOf(S.view);if(i>=0){tbMeasure();TB.x=TB.tx=tbCenter(i);tbDraw()}}},150)});
if(S.step==="phone")S.step="email";
sbLoad().then(async c=>{if(!c)return;const{data}=await c.auth.getSession();const u=data.session?.user;
 if(u){const m=u.user_metadata||{};S.uid=u.id;S.email=u.email||S.email;if(m.gender){S.gender=m.gender;S.uname=m.name||S.uname;if(S.view==="login"){go("home")}}else{S.view="login";S.step="gender";if(!S.uname)S.uname=String(m.full_name||m.name||"").slice(0,40);render()}}
 else if(S.gender&&S.uid){S.gender=undefined;S.uid="";S.view="login";S.step="email";render()}});
["gesturestart","gesturechange","gestureend"].forEach(t=>document.addEventListener(t,e=>e.preventDefault(),{passive:false}));
window.__back=()=>{if(cxOpen){cxClose();return true}const q=sel=>{const e=document.querySelector(sel);if(e){e.click();return true}return false};
 if(S.sheet){closeSheet();return true}
 if(S.view==="read")return q("[data-closeread]");
 if(S.view==="audio")return q("[data-apmin]");
 if(S.view==="book"||S.view==="rating")return q("[data-back]");
 if(S.search)return q("[data-closesearch]");
 if(S.view!=="home"&&S.view!=="login"){go("home");return true}
 return false};