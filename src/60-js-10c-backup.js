/* ---- Эслатмаи захира: ҳар 30 рӯз, кунига то 5 маротиба, фақат админ ва ёрдамчӣ ---- */
const BK_DAYS=30,BK_SLOTS=[9,12,15,18,21],GH_URL="https://github.com/jack07lion-a11y/kitobkhona-.git";
function bkLast(){const f=S.flags&&S.flags.bk;if(f)return f;if(!S.bkLocal){S.bkLocal=Date.now();save()}return S.bkLocal}
const bkDays=()=>Math.floor((Date.now()-bkLast())/864e5);
const bkDue=()=>Date.now()-bkLast()>=BK_DAYS*864e5;
function bkCheck(){if(!(S.role==="admin"||S.role==="subadmin")||!bkDue())return;
 const d=new Date(),day=d.toDateString(),h=d.getHours();if(!S.bkShown||S.bkShown.day!==day)S.bkShown={day,done:[]};
 const passed=BK_SLOTS.filter(s=>h>=s);if(!passed.length)return;
 const fresh=passed.filter(s=>!S.bkShown.done.includes(s));if(!fresh.length)return;
 S.bkShown.done=[...new Set([...S.bkShown.done,...passed])];save();bkShow()}
function bkShow(){if(document.getElementById("bkb"))return;const el=document.createElement("div");el.id="bkb";el.className="bkb";
 el.innerHTML=`<div class="bkb-c"><b>Вақти нусхаи захира расид</b>
  <p>Нусхаи дуюми код дар GitLab ${bkDays()} рӯз пеш нав шуда буд. Лутфан нав кунед (5 дақиқа): GitLab → лоиҳа → Settings → General → Advanced → <i>Delete project</i>; баъд New project → Import project → Repository by URL ва ин ҳаволаро ёпиштиред:</p>
  <code translate="no">${GH_URL}</code>
  <div class="bkb-a"><button class="pill" data-bk="later">Баъдтар</button><button class="pill" data-bk="done" style="background:var(--orange);color:#fff">Анҷом шуд</button></div></div>`;
 document.body.appendChild(el);
 el.querySelector("[data-bk=later]").onclick=()=>el.remove();
 el.querySelector("[data-bk=done]").onclick=()=>{el.remove();bkDone()}}
async function bkDone(){S.bkLocal=Date.now();S.flags.bk=Date.now();S.bkShown=null;save();toast("Ташаккур! Эслатма 30 рӯзи дигар меояд");
 try{const c=await sbLoad();if(c)await c.rpc("backup_done")}catch(_){}if(S.view==="me"&&!S.sheet)render()}
setInterval(bkCheck,10*60*1000);
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")setTimeout(bkCheck,800)});
