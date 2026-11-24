/* ===== Баъди воридшавӣ: розигӣ ва ҷинс — ойнаи хурд дар миёна, оҳиста пайдо мешавад ва худ мебарояд =====
   • Розигӣ (ду аломат): 10 дақиқа дар барнома мондан ё баромада баргаштан. Ду аломат гузошта шавад — худ захира мешавад, тугма нест.
   • Ҷинс (духтар/писар): баъди ~30 сония дар барнома; интихоб нашавад — ҳар кушодани барнома боз (бе «баъдтар»). 3 рӯз иваз кардан мумкин (дар профил); баъд — аз ҳисоб баромада, аз нав бо Google ворид шавед. */
const OB={shown:{},ret:false,fg:0}; // fg — сонияҳои ҳамин кушодани барнома (ҳар кушодан аз нав)
const OB_CONS_SEC=600,OB_GEN_SEC=30;
const consNeed=()=>!!S.uid&&S.consentV!==CONSENT_V&&!S.consPend;
function obClose(){const el=document.getElementById("obm");if(!el)return;el.classList.remove("in");setTimeout(()=>el.remove(),500)}
function obModal(html){const el=document.createElement("div");el.id="obm";el.className="obm";
 el.innerHTML=`<div class="obm-bg"></div><div class="obm-c" role="dialog" aria-modal="true">${html}</div>`;document.body.appendChild(el);
 requestAnimationFrame(()=>requestAnimationFrame(()=>el.classList.add("in")));return el}
function obConsent(){OB.shown.cons=true;
 const el=obModal(`<h3>Розигӣ ва синну сол</h3><p>Ду аломатро гузоред, шумо давом медиҳед</p>
  <label class="obc" for="ob1"><input type="checkbox" id="ob1"><i aria-hidden="true"></i><span>Ман 13-сола ё калонтарам. Агар аз 18 хурд бошам, падар, модар ё васии ман аз истифодаи Китобхона огоҳ аст</span></label>
  <label class="obc" for="ob2"><input type="checkbox" id="ob2"><i aria-hidden="true"></i><span>Ман <button class="lnk" type="button" data-obpriv>Сиёсати махфият</button>-ро хондам ва ба нигоҳ доштани маълумотам (почта, ном, омори хондан) розӣ ҳастам</span></label>`);
 const a=el.querySelector("#ob1"),b=el.querySelector("#ob2");
 el.querySelector("[data-obpriv]").onclick=e=>{e.preventDefault();e.stopPropagation();NATIVE.openUrl(SITE_URL+"maxfiyat.html")};
 const chk=()=>{if(!(a.checked&&b.checked))return;a.disabled=b.disabled=true;
  S.cons={age:"adult",g:false,c:true};consSave();
  el.querySelector(".obm-c").classList.add("ok");setTimeout(obClose,700)};
 a.onchange=chk;b.onchange=chk}
function obGender(){OB.shown.gen=true;
 const el=obModal(`<h3>Шумо кистед?</h3><p>Расм ва ҷоизаҳои профил аз рӯи ин интихоб мешаванд. 3 рӯз иваз кардан мумкин.</p>
  <div class="gopts"><button class="gopt" data-og="girl"><span class="gart"><img src="${GART_G}" alt=""></span><b>Духтар</b></button><button class="gopt" data-og="boy"><span class="gart"><img src="${GART_B}" alt=""></span><b>Писар</b></button></div>`);
 el.querySelectorAll("[data-og]").forEach(x=>x.onclick=()=>{obClose();setGender(x.dataset.og,true)})}
async function setGender(g,first){if(g!=="girl"&&g!=="boy")return;
 S.gender=g;if(first||!S.genderAt)S.genderAt=Date.now();save();
 try{const c=await sbLoad();if(c)await c.auth.updateUser({data:{gender:g}})}catch(_){}
 if(S.view!=="read")render();toast(first?"Интихоб шуд":"Иваз шуд")}
function obEligible(){return !!S.uid&&document.visibilityState==="visible"&&!["login","read","audio"].includes(S.view)&&!S.sheet&&!document.getElementById("obm")&&!(typeof AS!=="undefined"&&AS.on)}
function obTick(){
 if(document.visibilityState!=="visible"||!S.uid||S.view==="login")return;
 S.obFg=(S.obFg||0)+1;OB.fg++;if(S.obFg%15===0)save();
 if(!obEligible())return;
 if(consNeed()&&!OB.shown.cons&&(S.obFg>=OB_CONS_SEC||OB.ret))return obConsent();
 if(!S.gender&&!OB.shown.gen&&OB.fg>=OB_GEN_SEC)obGender()} // ҷинс интихоб нашавад — ҳар кушодани барнома баъди 30 сония боз мепурсад
setInterval(obTick,1000);
// баромада баргашт: розигӣ ҳамон дам хоҳад пайдо шуд (агар ҳанӯз нест)
document.addEventListener("visibilitychange",()=>{
 if(document.visibilityState==="hidden"){try{save()}catch(_){}return}
 if(S.uid&&(S.obFg||0)>0){OB.ret=true;OB.shown.cons=false}});
if((S.obFg||0)>0)OB.ret=true; // барнома аз нав кушода шуд
