const FREE_PAGES=3,FREE_SEC=60;
const PREM=()=>!!(S.flags&&S.flags.premium===true);
const locked=b=>!!(PREM()&&b&&b.prem&&!S.premium);

/* ---- пайвасти тугмаҳо: premium (аз bind() даъват мешавад) ---- */
function bindPremium($$){
 $$("[data-subscribe]",b=>b.onclick=()=>{S.premium=true;S.sheet=null;toast("Намуна: Премиум фаъол шуд");render()});
 $$("[data-paywall]",b=>b.onclick=()=>{S.payId=null;S.sheet="pay";render()});
}

/* ---- варақи pay ---- */
SHEETS.pay=X=>{let h="";{const b=S.payId?bk(S.payId):null;
  h=`<div class="pay">${X}<span class="pay-cr">${CROWN}</span><h2>${b?"Парчаи ройгон тамом шуд":"Китобхона Премиум"}</h2><p>${b?`Барои идомаи «${b.t}» ба Премиум гузаред.`:"Ҳамаи китобҳо ва аудиокитобҳо бе маҳдудият."}</p>
  <ul>${["Ҳамаи китобҳои пулакӣ","Аудиокитобҳо пурра","Бе интернет хондан ва гӯш кардан","Тарифи оила ва мактаб"].map(x=>`<li>${P(IC_OK,2.4)}${x}</li>`).join("")}</ul>
  <div class="pay-price"><b>20 сомонӣ</b> / моҳ <span class="demo">намуна</span></div>
  <button class="pay-btn" data-subscribe>Обуна шудан</button><button class="pay-later" data-shclose>Баъдтар</button></div>`};return h};
