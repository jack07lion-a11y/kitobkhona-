/* ===== Идоракунӣ → Омор: хонандагони шубҳанок (docs/sql-halol.sql). Танҳо ном ва рақамҳо; почта нест. ===== */
function suspHTML(){const L=S.susp;
 return `<p class="set-cap">Шубҳанокони рейтинг</p>
 <p class="set-note">Огоҳӣ дошта ё дар як рӯз 6+ соат хондагон, 7 рӯзи охир</p>
 <button class="pill" data-susp-load>Санҷидан</button>
 ${L===undefined?"":L===null?`<p class="set-note">Хато. Аввал SQL-и «ҳалол»-ро иҷро кунед</p>`:!L.length?`<p class="set-note">Шубҳанок нест</p>`:L.map(r=>`<div class="nrow"><div class="ntx"><b translate="no">${escH(r.name||"—")}</b><small><span>Огоҳӣ</span> ${+r.strikes||0} · <span>Дар рӯз</span> ${fmtT(+r.max_day_sec||0)} · ${fmtT(+r.total_sec||0)}</small></div><button class="pill" data-susp-ban="${escH(r.user_id)}" data-v="${r.banned?0:1}">${r.banned?"Ба рейтинг баргардонидан":"Аз рейтинг дур кардан"}</button></div>`).join("")}`}
function bindSusp($$){
 $$("[data-susp-load]",b=>b.onclick=async()=>{const c=await sbLoad();if(!c){toast("Интернет нест");return}
  try{const{data,error}=await c.rpc("suspicious_readers",{p_days:7});S.susp=error?null:(data||[]);render()}catch(_){toast("Интернет нест")}});
 $$("[data-susp-ban]",b=>b.onclick=async()=>{if(S.role!=="admin"){toast("Танҳо админ");return}const c=await sbLoad();if(!c)return;
  try{const{error}=await c.rpc("set_rating_ban",{p_id:b.dataset.suspBan,p_ban:b.dataset.v==="1"});if(error){toast("Иҷозат дода нашуд");return}
   const r=(S.susp||[]).find(x=>x.user_id===b.dataset.suspBan);if(r)r.banned=b.dataset.v==="1";render()}catch(_){toast("Интернет нест")}});
}
