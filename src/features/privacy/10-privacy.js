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
  if(!S.sheet&&!["login","read","audio"].includes(S.view)){S.cons={};S.sheet="cons";render()}}catch(_){}}
SHEETS.cons=X=>`<div class="sh-head"><b class="sh-t">Розигӣ ва синну сол</b></div><p class="hint">Барои идомаи кор розигии худро тасдиқ кунед.</p>${consBlock()}<button class="pay-btn" data-cons-ok>Тасдиқ кардан</button>`;
SHEETS.delacc=X=>`<div class="sh-head"><b class="sh-t">Ҳисобро нест кардан</b>${X}</div>
 <p class="hint">Ҳисоби шумо ҳамон дам <b>баста мешавад</b>: ворид шуда наметавонед ва дар рейтинг нишон дода намешавед. Маълумоти шумо (профил, пешравӣ, токчаҳо, дақиқаҳои хондан) то <b>30 рӯз</b> дар сервер мемонад: дар ин муддат ҳисобро танҳо бунёдгузорони Китобхона тикла метавонанд. Баъд аз 30 рӯз ҳамаи маълумот ПУРРА нест мешавад.</p>
 <p class="hint">Шумо худатон онро бозгардонида наметавонед.</p>
 <button class="pay-btn" style="background:var(--orange)" data-delacc-go>Ҳа, ҳисобро нест кунед</button><button class="pay-later" data-shclose>Не, бозгашт</button>`;
async function deleteAccount(){
 const c=await sbLoad(),btn=document.querySelector("[data-delacc-go]");
 if(!c||!navigator.onLine){toast("Интернет нест. Ҳисобро бе интернет нест кардан мумкин нест");return}
 if(btn){btn.disabled=true;btn.textContent="Нест карда истодааст…"}
 try{const uid=S.uid;
  const{error}=await c.rpc("delete_me");
  if(error){if(btn){btn.disabled=false;btn.textContent="Ҳа, ҳисобро нест кунед"}
   toast(/admin_cannot_delete/.test(error.message||"")?"Админ ҳисоби худро аз барнома нест карда наметавонад":"Нест нашуд. Интернетро санҷед ё баъдтар кӯшиш кунед");return}
  try{await c.auth.signOut()}catch(_){}
  resetUserData();S.sheet=null;S.consentV="";S.consPend=null;S.cons=null;S.myRank=null;pushNotifyCfg();S.step="deleted";go("login")}
 catch(_){if(btn){btn.disabled=false;btn.textContent="Ҳа, ҳисобро нест кунед"}toast("Нест нашуд. Баъдтар аз нав кӯшиш кунед")}}
function bindPrivacy($$){
 $$("[data-age]",b=>b.onclick=()=>{S.cons=S.cons||{};S.cons.age=b.dataset.age;
  document.querySelectorAll("[data-age]").forEach(x=>{x.classList.toggle("on",x===b);x.setAttribute("aria-checked",x===b)});
  const r=document.getElementById("grdrow");if(r)r.hidden=b.dataset.age!=="under18"});
 const g=document.getElementById("grd"),c=document.getElementById("cns");
 if(g)g.onchange=()=>{(S.cons=S.cons||{}).g=g.checked};if(c)c.onchange=()=>{(S.cons=S.cons||{}).c=c.checked};
 $$("[data-cons-ok]",b=>b.onclick=async()=>{if(!consOK())return;b.disabled=true;await consSave();S.sheet=null;render()});
 $$("[data-delacc-go]",b=>b.onclick=deleteAccount);
 $$("[data-ext]",b=>b.onclick=()=>NATIVE.openUrl(b.dataset.ext))}
