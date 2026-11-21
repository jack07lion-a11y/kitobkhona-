/* ---- Махфият: розигӣ, синну сол (18-сола хурд → огоҳии ота-она), ҳисобро нест кардан ----
   Сервер: docs/sql-maxfiyat.sql (save_consent, delete_me). Матни сиёсат: maxfiyat.html (қоралама, бунёдгузорон тасдиқ мекунанд). */
const CONSENT_V="2026-11";
function consBlock(){const c=S.cons||{};
 return `<div class="cons"><p class="hint">Синну соли шумо:</p>
 <div class="cons-age" role="radiogroup" aria-label="Синну сол"><button class="pill${c.age==="adult"?" on":""}" data-age="adult" role="radio" aria-checked="${c.age==="adult"}">18 ва боло</button><button class="pill${c.age==="under18"?" on":""}" data-age="under18" role="radio" aria-checked="${c.age==="under18"}">Аз 18 хурд</button></div>
 <label class="chk" id="grdrow"${c.age==="under18"?"":" hidden"}><input type="checkbox" id="grd"${c.g?" checked":""}>Падар, модар ё васии ман аз истифодаи Китобхона огоҳ аст</label>
 <label class="chk"><input type="checkbox" id="cns"${c.c?" checked":""}><span>Ман <button class="lnk" type="button" data-privacy>Сиёсати махфият</button>-ро хондам ва ба нигоҳ доштани маълумотам (почта, ном, омори хондан) розӣ ҳастам</span></label></div>`}
function consOK(){const c=S.cons||{};
 if(!c.age){toast("Синну солро интихоб кунед");return false}
 if(c.age==="under18"&&!c.g){toast("Барои хурдсолон огоҳии падар ё модар лозим аст");return false}
 if(!c.c){toast("Бе розигӣ идома додан мумкин нест");return false}return true}
async function consSave(){const c0=S.cons||{},p={age:c0.age,g:!!c0.g};
 try{const c=await sbLoad();if(!c)throw new Error("net");const{error}=await c.rpc("save_consent",{p_age_group:p.age,p_guardian:p.g,p_ver:CONSENT_V});if(error)throw error;S.consentV=CONSENT_V;S.consPend=null}
 catch(_){S.consPend=p}save()}
async function flushConsent(c){if(!S.consPend||!S.uid)return;
 try{const{error}=await c.rpc("save_consent",{p_age_group:S.consPend.age,p_guardian:!!S.consPend.g,p_ver:CONSENT_V});if(!error){S.consentV=CONSENT_V;S.consPend=null;save()}}catch(_){}}
/* ҳисобҳои пештара (бе розигӣ): як маротиба пурсем */
async function checkConsent(c){
 try{if(!S.uid||S.consentV===CONSENT_V||S.consPend)return;
  const{data,error}=await c.from("profiles").select("consent_at").eq("id",S.uid).maybeSingle();if(error||!data)return;
  if(data.consent_at){S.consentV=CONSENT_V;save();return}
  /* ойнаи розигӣ худаш пайдо мешавад (40-onboard.js): 10 дақиқа баъд ё баъди баромада баргаштан */}catch(_){}}
SHEETS.cons=X=>`<div class="sh-head"><b class="sh-t">Розигӣ ва синну сол</b></div><p class="hint">Барои идомаи кор розигии худро тасдиқ кунед.</p>${consBlock()}<button class="pay-btn" data-cons-ok>Тасдиқ кардан</button>`;
/* ---- Ҳисобро нест кардан: 4 босқич, ҳар кадом бо ҳушдор; охирин — 45 сония, фақат «Бекор кардан»; қулф/баромад → нест намешавад ---- */
const DEL_SEC=45,DF={on:false,t0:0,iv:0};
const delStaff=()=>S.role==="admin"||S.role==="subadmin";
const delW=t=>`<div class="del-w">⚠ ${t}</div>`;
const delNo=X=>`<div class="sh-head"><b class="sh-t">Ҳисобро нест кардан</b>${X}</div>${delW("МАНЪ АСТ")}
 <p class="hint">Шумо <b>${S.role==="admin"?"админ":"ёрдамчӣ"}</b> ҳастед. Ин ҳисобро нест кардан ва аз Китобхона баромада рафтан имконнопазир аст: шумо ин ҳуқуқро надоред.</p>
 <button class="pay-btn" data-shclose>Фаҳмидам</button>`;
SHEETS.delacc=X=>delStaff()?delNo(X):`<div class="sh-head"><b class="sh-t">Ҳисобро нест кардан</b>${X}</div>${delW("ХАТАРНОК!")}
 <p class="hint">Ҳисоби шумо ҳамон дам <b>баста мешавад</b>: ворид шуда наметавонед ва дар рейтинг нишон дода намешавед. Профил, пешравӣ, токчаҳо ва дақиқаҳои хондан аз дастрасии шумо мебароянд.</p>
 <p class="hint">Ҳисобро танҳо бунёдгузорони Китобхона барқарор карда метавонанд. Худатон онро баргардонида наметавонед.</p>
 <button class="pay-btn del-b" data-delacc-next="2">Давом додан (хатарнок)</button><button class="pay-later" data-shclose>Не, бозгашт</button>`;
SHEETS.delacc2=X=>delStaff()?delNo(X):`<div class="sh-head"><b class="sh-t">Боз як бор фикр кунед</b>${X}</div>${delW("ХАТАРНОК! Аз ин амал баргаштан душвор аст.")}
 <p class="hint">Шумо ин чизҳоро аз даст медиҳед: <b>ҷойи худатон дар рейтинг</b>, <b>дақиқаҳои хондаатон</b>, <b>китобҳои нигоҳдошташуда</b> ва <b>пешравии хондан</b>.</p>
 <p class="hint">Агар ҳоло ҳам мехоҳед, тугмаи поёнро пахш кунед. Баъд 45 сония вақти бекор кардан медиҳем.</p>
 <button class="pay-btn del-b" data-delacc-next="3">Ман хатарро медонам, идома диҳед</button><button class="pay-later" data-shclose>Не, бозгашт</button>`;
SHEETS.delacc3=X=>{if(delStaff())return delNo(X);if(!DF.on)return SHEETS.delacc(X);const left=Math.max(0,Math.ceil(DEL_SEC-(Date.now()-DF.t0)/1000));
 return `<div class="sh-head"><b class="sh-t">Охирин огоҳӣ</b></div>${delW("ХАТАРНОК! Ҳисоб дар зудӣ нест мешавад")}
 <p class="del-t">Ҳисоби шумо баъди</p><div class="del-n"><span id="delc">${left}</span> сония</div><div class="del-bar"><i id="delbar" style="width:${left/DEL_SEC*100}%"></i></div><p class="del-t">нест карда мешавад.</p>
 <p class="hint">Нест кардан худ ба худ оғоз мешавад. Танҳо як роҳи боздоштан ҳаст: тугмаи поён. Агар экранро қулф кунед, аз барнома барояд ё ин ойнаро пӯшед, ҳисоб <b>нест намешавад</b>.</p>
 <button class="pay-btn" data-delacc-cancel>Бекор кардан</button>`};
function delStop(){clearInterval(DF.iv);DF.iv=0;DF.on=false}
function delAbort(msg){const was=DF.on;delStop();if(!was)return;if(/^delacc/.test(S.sheet||"")){S.sheet=null;render()}if(msg)toast(msg)}
function delTick(){if(!DF.on)return;
 if(document.visibilityState!=="visible"||S.sheet!=="delacc3"){delAbort(S.sheet==="delacc3"?"Нест кардан бекор шуд":"");return}
 const el=(Date.now()-DF.t0)/1000;
 if(el>=DEL_SEC){delStop();deleteAccount();return}
 const n=Math.max(0,Math.ceil(DEL_SEC-el)),c=document.getElementById("delc"),b=document.getElementById("delbar");
 if(c)c.textContent=n;if(b)b.style.width=(100-el/DEL_SEC*100)+"%"}
function delStart(){delStop();DF.on=true;DF.t0=Date.now();DF.iv=setInterval(delTick,250)}
document.addEventListener("visibilitychange",()=>{if(document.visibilityState!=="visible")delAbort("Нест кардан бекор шуд")});
window.addEventListener("pagehide",()=>delAbort());
async function deleteAccount(){
 if(delStaff()){delStop();S.sheet="delacc";render();return}
 const c=await sbLoad(),btn=document.querySelector("[data-delacc-go]");
 if(!c||!navigator.onLine){toast("Интернет нест. Ҳисобро бе интернет нест кардан мумкин нест");return}
 toast("Ҳисоб нест карда истодааст…")
 try{const uid=S.uid;
  const{error}=await c.rpc("delete_me");
  if(error){
   toast(/admin_cannot_delete/.test(error.message||"")?"Админ ҳисоби худро аз барнома нест карда наметавонад":"Нест нашуд. Интернетро санҷед ё баъдтар кӯшиш кунед");return}
  try{await c.auth.signOut()}catch(_){}
  resetUserData();S.sheet=null;S.consentV="";S.consPend=null;S.cons=null;S.myRank=null;pushNotifyCfg();S.step="deleted";go("login")}
 catch(_){toast("Нест нашуд. Баъдтар аз нав кӯшиш кунед")}}
function bindPrivacy($$){
 $$("[data-age]",b=>b.onclick=()=>{S.cons=S.cons||{};S.cons.age=b.dataset.age;
  document.querySelectorAll("[data-age]").forEach(x=>{x.classList.toggle("on",x===b);x.setAttribute("aria-checked",x===b)});
  const r=document.getElementById("grdrow");if(r)r.hidden=b.dataset.age!=="under18"});
 const g=document.getElementById("grd"),c=document.getElementById("cns");
 if(g)g.onchange=()=>{(S.cons=S.cons||{}).g=g.checked};if(c)c.onchange=()=>{(S.cons=S.cons||{}).c=c.checked};
 $$("[data-cons-ok]",b=>b.onclick=async()=>{if(!consOK())return;b.disabled=true;await consSave();S.sheet=null;render()});
 $$("[data-delacc-next]",b=>b.onclick=()=>{const n=b.dataset.delaccNext;if(n==="3"&&!delStaff())delStart();S.sheet=n==="3"?"delacc3":"delacc2";render()});
 $$("[data-delacc-cancel]",b=>b.onclick=()=>{delStop();S.sheet=null;render();toast("Нест кардан бекор шуд")});
 if(DF.on&&S.sheet!=="delacc3")delStop();
 $$("[data-ext]",b=>b.onclick=()=>NATIVE.openUrl(b.dataset.ext))}
