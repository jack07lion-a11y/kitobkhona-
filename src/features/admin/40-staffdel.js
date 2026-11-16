/* ---- Админ: ёрдамчиро бардоштан ----
   НАВ ёрдамчи (Бета, <30 рӯз): як тасдиқ. ДОИМӢ ёрдамчи: 3 ойнаи ҳушдор + 60 сония, фақат «Бекор кардан»; қулф/баромад → бекор.
   Сервер ҳам 60 сонияро талаб мекунад (docs/sql-yordamchi.sql: request_staff_removal + set_role). */
const SD={email:"",name:"",on:false,t0:0,iv:0},SD_SEC=60;
const sdW=t=>`<div class="del-w">⚠ ${t}</div>`;
const staffByEmail=e=>(S.staff||[]).find(x=>x.email===e);
/* нишони ёрдамчи: доимӣ — квадрати кичики сабз; нав — «Бета» */
const stBadge=x=>!x||x.permanent===undefined?"":x.permanent?`<sup class="sbd perm" title="Ёрдамчии доимӣ" aria-label="Ёрдамчии доимӣ">✓</sup>`:`<sup class="sbd beta" title="Ёрдамчии нав: ҳанӯз дар санҷиш">Бета</sup>`;
const stMeBadge=()=>S.role==="subadmin"&&S.myStaff&&S.myStaff.permanent!==undefined?stBadge({permanent:!!S.myStaff.permanent}):"";
SHEETS.sadel1=X=>`<div class="sh-head"><b class="sh-t">Ёрдамчии доимиро бардоштан</b>${X}</div>${sdW("ХАТАРНОК!")}
 <p class="hint"><b>${escH(SD.name)}</b> ёрдамчии <b>доимӣ</b> аст (30 рӯзи бештар ё аз асос). Бардоштани ӯ қарори ҷиддӣ аст: ҳуқуқҳои ӯ фавран гирифта мешаванд.</p>
 <p class="hint">Барои эҳтиёт ин амал якбора нест: пас аз се ойна, 60 сония вақти бекор кардан дода мешавад.</p>
 <button class="pay-btn del-b" data-sd-next="2">Давом додан (хатарнок)</button><button class="pay-later" data-shclose>Не, бозгашт</button>`;
SHEETS.sadel2=X=>`<div class="sh-head"><b class="sh-t">Боз як бор фикр кунед</b>${X}</div>${sdW("ХАТАРНОК! Ин ёрдамчӣ дар Китобхона вақти зиёд кор кардааст.")}
 <p class="hint">Баъд аз бардоштан <b>${escH(SD.name)}</b> дигар ба Идоракунӣ ворид шуда наметавонад. Агар хато шавад, ӯро аз нав таъин кардан лозим меояд.</p>
 <button class="pay-btn del-b" data-sd-next="3">Ман хатарро медонам, идома диҳед</button><button class="pay-later" data-shclose>Не, бозгашт</button>`;
SHEETS.sadel3=X=>{if(!SD.on)return SHEETS.sadel1(X);const left=Math.max(0,Math.ceil(SD_SEC-(Date.now()-SD.t0)/1000));
 return `<div class="sh-head"><b class="sh-t">Охирин огоҳӣ</b></div>${sdW("ХАТАРНОК! Ёрдамчӣ дар зудӣ бардошта мешавад")}
 <p class="del-t">${escH(SD.name)} баъди</p><div class="del-n"><span id="sdc">${left}</span> сония</div><div class="del-bar"><i id="sdbar" style="width:${left/SD_SEC*100}%"></i></div><p class="del-t">бардошта мешавад.</p>
 <p class="hint">Танҳо як роҳи боздоштан ҳаст: тугмаи поён. Агар экранро қулф кунед, аз барнома барояд ё ойнаро пӯшед, бардоштан <b>бекор мешавад</b>.</p>
 <button class="pay-btn" data-sd-cancel>Бекор кардан</button>`};
function sdStop(){clearInterval(SD.iv);SD.iv=0;SD.on=false}
async function sdCancelServer(){try{const c=await sbLoad();if(c)await c.rpc("cancel_staff_removal",{p_email:SD.email})}catch(_){}}
function sdAbort(msg){const was=SD.on;sdStop();if(!was)return;sdCancelServer();if(/^sadel/.test(S.sheet||"")){S.sheet="admstaff";render()}if(msg)toast(msg)}
async function sdTick(){if(!SD.on)return;
 if(document.visibilityState!=="visible"||S.sheet!=="sadel3"){sdAbort(S.sheet==="sadel3"?"Бардоштан бекор шуд":"");return}
 const el=(Date.now()-SD.t0)/1000;
 if(el>=SD_SEC){sdStop();const ok=await setStaff(SD.email,"user");S.sheet="admstaff";render();if(!ok)sdCancelServer();return}
 const n=Math.max(0,Math.ceil(SD_SEC-el)),c=document.getElementById("sdc"),b=document.getElementById("sdbar");
 if(c)c.textContent=n;if(b)b.style.width=(100-el/SD_SEC*100)+"%"}
async function sdBegin(){const c=await sbLoad();if(!c||!navigator.onLine){toast("Интернет нест");return false}
 try{const{data,error}=await c.rpc("request_staff_removal",{p_email:SD.email});if(error||data!=="ok")throw 0}
 catch(_){toast("Оғоз нашуд. Аввал SQL-ро иҷро кунед ё интернетро санҷед");return false}
 SD.on=true;SD.t0=Date.now();clearInterval(SD.iv);SD.iv=setInterval(sdTick,250);return true}
document.addEventListener("visibilitychange",()=>{if(document.visibilityState!=="visible")sdAbort("Бардоштан бекор шуд")});
window.addEventListener("pagehide",()=>sdAbort());
function bindStaffDel($$){
 $$("[data-sd-next]",b=>b.onclick=async()=>{const n=b.dataset.sdNext;
  if(n==="3"){b.disabled=true;if(!await sdBegin()){b.disabled=false;return}S.sheet="sadel3";render();return}
  S.sheet="sadel2";render()});
 $$("[data-sd-cancel]",b=>b.onclick=()=>{const was=SD.on;sdStop();if(was)sdCancelServer();S.sheet="admstaff";render();toast("Бардоштан бекор шуд")});
 if(SD.on&&S.sheet!=="sadel3")sdAbort()}
