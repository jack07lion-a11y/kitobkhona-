/* Огоҳӣ ҳангоми кушодани китоб: 5 сония, барои ҳар китоб як бор (дар ин дастгоҳ) */
const BK_NOTICE="Дар китоб ҷо-ҷо хатои ҳарфӣ, ҷумла ё сохтор метавонад бошад: бубахшед. Корҳои техникӣ душвор аст ва вақт, қувват, маблағ ва китобҳои аслӣ мехоҳад. Агар хоҳед кумак кунед, ба мо дар Телеграм нависед (@kitobkhona_official) ва нусхаи аслии ин китобро ҳамчун PDF бо МАТНИ электронӣ (на расм) фиристед.";
let BKN_T=0;
function bookNotice(id){
 S.nsn=S.nsn||{};if(S.nsn[id])return;S.nsn[id]=1;save();
 const old=document.getElementById("bknotice");if(old)old.remove();clearTimeout(BKN_T);
 const d=document.createElement("button");d.id="bknotice";d.type="button";d.className="bknotice";d.setAttribute("role","status");d.textContent=I18N&&I18N.tr?I18N.tr(BK_NOTICE):BK_NOTICE;
 const gone=()=>{d.classList.add("out");setTimeout(()=>d.remove(),300)};d.onclick=gone;
 document.body.appendChild(d);BKN_T=setTimeout(gone,5000)}
