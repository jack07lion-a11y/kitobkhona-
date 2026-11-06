const DEF_REMIND="Вақти китоб хондан расид. Ба Китобхона ворид шавед",DEF_CONGRATS="Табрик шумо имрӯз {n} дақиқа хондед!🎉 боз хонда боз доно шавед!";
const cfgTxt=(o,d)=>(o&&o[I18N.lang])||I18N.tr(d);
const canNotif=()=>S.role==="admin"||(S.role==="subadmin"&&(canPerm("notif")||!!(S.ncfg&&S.ncfg.sub_can_edit)));
function pushNotifyCfg(){const A=window.KitobAndroid;if(!A||!A.config)return;const c=S.ncfg||{};
 try{A.config(JSON.stringify({remind:c.remind_on!==false,congrats:c.congrats_on!==false,reg:!!S.uid,hour:c.remind_hour||20,role:S.role==="admin"?"АДМИН":S.role==="subadmin"?"СУБАДМИН":"",title:"Китобхона",remindText:cfgTxt(c.remind_text,DEF_REMIND),tpl:cfgTxt(c.congrats_tpl,DEF_CONGRATS),sbUrl:SB_URL,sbKey:SB_KEY,news:true}))}catch(_){}}
async function loadNotifCfg(){const c=await sbLoad();if(!c)return;
 try{const{data,error}=await c.from("notif_cfg").select("*").eq("id",1).maybeSingle();if(!error&&data){S.ncfg=data;save();pushNotifyCfg();if(S.view==="me"&&(S.sheet==="admnotif"||!S.sheet))render()}}catch(_){}}
async function saveNotif(p){const c=await sbLoad();if(!c){toast("Интернет нест");return false}
 try{const{error}=await c.rpc("save_notif_cfg",{p});if(error){toast("Иҷозат дода нашуд. Аввал SQL-ро иҷро кунед");return false}
  if(p.remind_text||p.congrats_tpl)S.nd=null;await loadNotifCfg();toast("Захира шуд");return true}catch(_){toast("Интернет нест ё сервер ҷавоб намедиҳад");return false}}

/* ---- пайвасти тугмаҳо: notifications (аз bind() даъват мешавад) ---- */
function bindNotifications($$){
 $$("[data-nc]",b=>b.onclick=async()=>{const k=b.dataset.nc,c=S.ncfg||{},cur=k==="sub_can_edit"?!!c[k]:c[k]!==false;await saveNotif({[k]:!cur})});
 $$("[data-nh]",b=>b.onclick=async()=>{const c=S.ncfg||{},v=Math.max(9,Math.min(21,(c.remind_hour||20)+ +b.dataset.nh));if(v!==(c.remind_hour||20))await saveNotif({remind_hour:v})});
 $$("[data-ndl]",b=>b.onclick=()=>{S.ndl=b.dataset.ndl;render()});
 $$("[data-ndt]",t=>t.oninput=()=>{const L=S.ndl||I18N.lang;S.nd=S.nd||{remind_text:{},congrats_tpl:{}};S.nd[t.dataset.ndt]=S.nd[t.dataset.ndt]||{};S.nd[t.dataset.ndt][L]=t.value});
 $$("[data-nsave]",b=>b.onclick=()=>{const d=S.nd||{},clean=o=>{const r={};Object.keys(o||{}).forEach(k=>{if((o[k]||"").trim())r[k]=o[k].trim()});return r};saveNotif({remind_text:clean(d.remind_text),congrats_tpl:clean(d.congrats_tpl)})});
}
