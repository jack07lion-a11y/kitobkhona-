function tickUI(){const a=S.au;if(!a)return;const t=tracks(bk(a.id))[a.ch];const pc=a.pos/t.d*100+"%";
 const s=document.getElementById("apseek");if(s){s.style.setProperty("--p",pc);if(!s.dataset.drag)s.value=Math.floor(a.pos)}
 const c=document.getElementById("apcur");if(c)c.textContent=fmt(a.pos);
 const m=document.getElementById("mpbar");if(m)m.style.width=pc;
 const tm=document.getElementById("aptm");if(tm)tm.textContent=Math.ceil(a.sleep/60)+"′"}
function aprog(){const a=S.au,tr=tracks(bk(a.id)),tot=tr.reduce((x,t)=>x+t.d,0),dn=tr.slice(0,a.ch).reduce((x,t)=>x+t.d,0)+a.pos;S.aprog[a.id]=Math.round(dn/tot*100)}
setInterval(()=>{const a=S.au;if(!a||!a.playing)return;const b=bk(a.id),tr=tracks(b);
 a.pos+=a.speed;
 if(locked(b)&&a.pos>=FREE_SEC){a.pos=FREE_SEC;a.playing=false;S.payId=a.id;S.sheet="pay";aprog();render();return}
 if(a.sleep>0){a.sleep--;if(!a.sleep){a.sleepSet=0;a.playing=false;toast("Таймер: пахш қатъ шуд");render();return}}
 if(a.pos>=tr[a.ch].d){if(a.ch<tr.length-1){a.ch++;a.pos=0}else{a.pos=tr[a.ch].d;a.playing=false}aprog();render();return}
 aprog();tickUI();if(Math.floor(a.pos)%5===0)save()},1000);
function dl(list){const id=S.au.id,b=bk(id);if(locked(b)){S.payId=id;S.sheet="pay";render();return}
 const have=S.dl[id]||[],todo=list.filter(i=>!have.includes(i));if(!todo.length){toast("Аллакай боргирифта шудааст");return}
 todo.forEach(i=>{const e=document.getElementById("dlt"+i);if(e)e.classList.add("ing")});toast("Боргирифтан…");
 {const T=1400+250*todo.length,t0=Date.now(),iv=setInterval(()=>{const p=Math.min(99,Math.round((Date.now()-t0)/T*100));document.querySelectorAll("[data-dlall]").forEach(e=>{e.classList.add("ing");e.style.setProperty("--p",p+"%");e.textContent="Боргирӣ… "+p+"%"});todo.forEach(i=>{const e=document.getElementById("dlt"+i);if(e)e.innerHTML="<small>"+p+"%</small>"})},120);setTimeout(()=>clearInterval(iv),T)}
 setTimeout(()=>{S.dl[id]=[...new Set([...(S.dl[id]||[]),...todo])];toast(todo.length>1?"Аудиокитоб барои гӯш кардан бе интернет нигоҳ дошта шуд":"Боб боргирифта шуд");render()},1400+250*todo.length)}
function mini(){const a=S.au;if(!a)return "";const b=bk(a.id),t=tracks(b)[a.ch];
 return `<div class="mini-sp"></div><div class="mini"><button class="mini-main" data-openap aria-label="Плеерро кушодан"><span class="mini-cv">${cover(b)}</span><span class="mini-tx"><b>${b.t}</b><em>${t.n}</em></span></button><button class="mini-b" data-applay aria-label="${a.playing?"Таваққуф":"Пахш"}">${a.playing?PAUSE:PLAY}</button><button class="mini-b" data-mpclose aria-label="Пӯшидан">${P(IC_X,2)}</button><i class="mini-bar"><i id="mpbar" style="width:${a.pos/t.d*100}%"></i></i></div>`}

function nav(fn,dir){
 const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
 if(!document.startViewTransition||reduce||dir==="none"){fn();return}
 document.documentElement.dataset.vt=dir;
 try{const t=document.startViewTransition(fn);t.finished.finally(()=>{delete document.documentElement.dataset.vt})}catch(e){delete document.documentElement.dataset.vt;fn()}
}
{const o1=openDetail,o2=openBook,o3=openAudio;
 openDetail=id=>nav(()=>o1(id),"fwd");
 openBook=id=>nav(()=>o2(id),S.view==="read"?"none":"up");
 openAudio=id=>nav(()=>o3(id),S.view==="audio"?"none":"up")}
let lastSheet=null;
function closeSheet(){S.nd=null;S.ndl=null;S._rl=0;const sh=document.querySelector(".sheet"),bg=document.querySelector(".sh-bg");
 if(!sh||matchMedia("(prefers-reduced-motion: reduce)").matches){S.sheet=null;render();return}
 sh.style.transition=`transform .32s ${EASE}`;sh.style.transform="translateY(105%)";if(bg)bg.classList.add("out");{closing=true;const sec=app.firstElementChild;if(sec&&sec.classList.contains("behind")){sec.style.transform="";sec.classList.add("behind-out")}}
 setTimeout(()=>{S.sheet=null;render()},300)}
