const FREE_PAGES=3,FREE_SEC=60;
const PREM=()=>!!(S.flags&&S.flags.premium===true);
const locked=b=>!!(PREM()&&b&&b.prem&&!S.premium&&!(typeof canPerm==="function"&&canPerm("books")));

/* муштаракии корбар аз сервер (profiles.premium_until, docs/sql-himoya.sql); хато (интернет нест) → қимати пештара мемонад */
async function loadPremium(c){try{if(!S.uid){S.pu=0;S.premium=false;return}
 const{data,error}=await c.from("profiles").select("premium_until").eq("id",S.uid).maybeSingle();if(error)return;
 S.pu=data&&data.premium_until?+new Date(data.premium_until):0;S.premium=S.pu>Date.now();save()}catch(_){}}

/* ---- пайвасти тугмаҳо: premium (аз bind() даъват мешавад) ---- */
function bindPremium($$){
 $$("[data-subscribe]",b=>b.onclick=()=>{toast("Обуна ба зудӣ кушода мешавад")});
 $$("[data-paywall]",b=>b.onclick=()=>{S.payId=null;S.sheet="pay";render()});
}

/* ---- варақи pay ---- */
SHEETS.pay=X=>{let h="";{const b=S.payId?bk(S.payId):null;
  h=`<div class="pay">${X}<span class="pay-cr">${CROWN}</span><h2>${b?"Парчаи ройгон тамом шуд":"Китобхона Премиум"}</h2><p>${b?`Барои идомаи «${escH(b.t)}» ба Премиум гузаред.`:"Ҳамаи китобҳо ва аудиокитобҳо бе маҳдудият."}</p>
  <ul>${["Ҳамаи китобҳои пулакӣ","Аудиокитобҳо пурра","Бе интернет хондан ва гӯш кардан","Тарифи оила ва мактаб"].map(x=>`<li>${P(IC_OK,2.4)}${x}</li>`).join("")}</ul>
  <div class="pay-price"><b>Ба зудӣ</b></div><p class="hint">Обуна ҳоло омода мешавад. Китобҳои ройгонро бемаҳдудият хонед.</p>
  <button class="pay-btn" data-subscribe disabled aria-disabled="true">Обуна ба зудӣ кушода мешавад</button><button class="pay-later" data-shclose>Баъдтар</button></div>`};return h};
