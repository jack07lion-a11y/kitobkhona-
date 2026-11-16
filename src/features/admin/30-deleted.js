/* ---- Админ: ҳисобҳои нест шуда — тиклаш ва пурра тоза кардан (docs/sql-reyting.sql) ----
   Корбар ҳисобашро нест мекунад → ҳисоб баста мешавад (кириш манъ), маълумот дар сервер МЕМОНАД. Админ ва ёрдамчӣ ҲАР ВАҚТ тикла карда метавонанд (муҳлат нест). */
const DEL={list:null,busy:false,err:false,loaded:false};
async function loadDeleted(){if(DEL.busy)return;DEL.busy=true;DEL.err=false;
 try{const c=await sbLoad();if(!c)throw 0;const{data,error}=await c.rpc("deleted_list");if(error||!Array.isArray(data))throw 0;DEL.list=data}
 catch(_){DEL.err=true}finally{DEL.busy=false}
 if(S.sheet==="admdel")render()}
SHEETS.admdel=X=>{const L=DEL.list;
 const rows=!L?(DEL.err?`<p class="hint">Рӯйхат боргирӣ нашуд. Аввал docs/sql-reyting.sql-ро иҷро кунед ё интернетро санҷед.</p>`:`<p class="hint">Боргирӣ…</p>`)
  :!L.length?`<p class="hint">Ҳисоби нест шуда нест.</p>`
  :L.map(x=>`<div class="nrow"><div class="ntx"><b>${escH(x.name||"—")}</b><small>${escH(x.email||"")} · нест шуд: ${new Date(x.deleted_at).toLocaleDateString()}</small></div><button class="pill" data-del-restore="${escH(x.id)}">Тиклаш</button></div>`).join("");
 return `<div class="sh-head"><b class="sh-t">Ҳисобҳои нест шуда</b>${X}</div>
 <p class="set-note">Корбар ҳисобашро нест кард: кириш баста, дар рейтинг нест. Маълумот дар сервер мемонад, муҳлати тиклаш нест. «Тиклаш» ҳисобро пурра бармегардонад (профил, пешравӣ, дақиқаҳо).</p>
 ${rows}`};
function bindAdminDeleted($$){
 if(S.sheet!=="admdel"){DEL.loaded=false;return}
 if(!DEL.loaded){DEL.loaded=true;DEL.list=null;loadDeleted()}
 $$("[data-del-restore]",b=>b.onclick=async()=>{if(!confirm("Ҳисобро тикла кунем? Корбар аз нав ворид шуда метавонад."))return;
  b.disabled=true;
  try{const c=await sbLoad();const{data,error}=await c.rpc("restore_account",{p_id:b.dataset.delRestore});
   if(error||data!=="ok")throw 0;toast("Ҳисоб тикла шуд");DEL.list=null;loadDeleted()}
  catch(_){b.disabled=false;toast("Тикла нашуд. Интернет ё ҳуқуқро санҷед")}});}
