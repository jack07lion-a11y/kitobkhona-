/* ===== «Фикр ва хато» дар ҳама ҷо: тугмаи давра дар боло + пурсиш баъди баромадан аз китоб ===== */
// тугмаи давра бо логотип (медурахшад): дар боло, дар профил ва дар хонанда
const fabHTML=(cls)=>`<button class="round fab ${cls||""}" data-fab aria-label="Фикр ва хато" translate="no">${LOGO}</button>`;
// Android: аввал сурати экран, баъд варақ (то хато ҳамон тавр дар сурат бошад)
function fabOpen(){const A=window.KitobAndroid;const d=S.rp=S.rp||{kind:"bug",text:"",img:""};d.where=S.view;
 const go=img=>{if(img)d.img=img;S.sheet="report";render()};
 if(A&&A.snap&&!S.sheet){let done=false;window.__snap=u=>{if(done)return;done=true;go(u&&u.length>3000?u:"")};
  try{A.snap()}catch(_){done=true;go("")}setTimeout(()=>{if(!done){done=true;go("")}},900)}
 else go("")}
// қалам: бо ангушт ҷойи хаторо давра кунед
function annoOpen(){const d=S.rp;if(!d||!d.img||document.getElementById("anno"))return;
 const el=document.createElement("div");el.id="anno";el.className="anno";
 el.innerHTML=`<div class="anno-bar"><button class="pill" data-an="undo">Бозгашт</button><button class="pill" data-an="clear">Тоза</button><button class="pill on" data-an="ok">Тайёр</button></div><div class="anno-box"><canvas id="anc"></canvas></div><p>Бо ангушт ҷойи хаторо давра кунед</p>`;
 document.body.appendChild(el);requestAnimationFrame(()=>el.classList.add("in"));
 const im=new Image();im.onload=()=>{const box=el.querySelector(".anno-box"),cv=el.querySelector("#anc"),bw=box.clientWidth,bh=box.clientHeight,k=Math.min(bw/im.width,bh/im.height,1);
  cv.width=Math.round(im.width*k);cv.height=Math.round(im.height*k);const x=cv.getContext("2d");let st=[],cur=null;
  const draw=()=>{x.drawImage(im,0,0,cv.width,cv.height);x.strokeStyle="#e5322d";x.lineWidth=Math.max(4,cv.width/90);x.lineCap=x.lineJoin="round";
   for(const s of st.concat(cur?[cur]:[])){x.beginPath();s.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));if(s.length===1)x.lineTo(s[0][0]+.1,s[0][1]);x.stroke()}};
  const pt=e=>{const r=cv.getBoundingClientRect();return[(e.clientX-r.left)*cv.width/r.width,(e.clientY-r.top)*cv.height/r.height]};
  cv.onpointerdown=e=>{cur=[pt(e)];try{cv.setPointerCapture(e.pointerId)}catch(_){}draw();e.preventDefault()};
  cv.onpointermove=e=>{if(!cur)return;cur.push(pt(e));draw()};
  cv.onpointerup=cv.onpointercancel=()=>{if(cur){st.push(cur);cur=null;draw()}};
  draw();
  el.querySelector("[data-an=undo]").onclick=()=>{st.pop();draw()};
  el.querySelector("[data-an=clear]").onclick=()=>{st=[];draw()};
  el.querySelector("[data-an=ok]").onclick=()=>{try{d.img=cv.toDataURL("image/jpeg",.8)}catch(_){}el.classList.remove("in");setTimeout(()=>{el.remove();render()},250)}};
 im.src=d.img}
// пурсиш баъди баромадан аз китоб (агар ≥5 сония хонда бошад); 15 сония; ҳангоми навиштан намеравад
const FBQ={at:0,t:0,iv:0};
function fbqLeave(){const dt=Date.now()-(window.__rdT||Date.now());let last=0;try{last=+localStorage.getItem("kitob_fbq")||0}catch(_){}
 if(dt<5000||Date.now()-last<10*60*1000||!S.view||S.view!=="read")return;
 setTimeout(fbqShow,900)}
function fbqShow(){if(document.getElementById("fbq")||S.view==="read"||S.view==="login")return;
 try{localStorage.setItem("kitob_fbq",String(Date.now()))}catch(_){}
 const el=document.createElement("div");el.id="fbq";el.className="fbq";let kind="idea";
 el.innerHTML=`<div class="fbq-c"><button class="fbq-x" aria-label="Пӯшидан">${P(IC_X,2)}</button><b>Фикри худро нависед</b><p>Хато бошад — хаторо, пешниҳод бошад — пешниҳодро, хуб бошад — хубро нависед.</p>
  <div class="seg">${[["bug","Хато"],["idea","Пешниҳод"],["good","Хуб"]].map(([k,n])=>`<button data-fk="${k}" class="${k===kind?"on":""}">${n}</button>`).join("")}</div>
  <textarea class="pe-i" rows="2" maxlength="1500" placeholder="Фикри шумо…"></textarea>
  <button class="pay-btn" data-fq-send>Фиристодан</button><div class="fbq-bar"><i></i></div><span class="fbq-n">15</span></div>`;
 document.body.appendChild(el);requestAnimationFrame(()=>el.classList.add("in"));
 const ta=el.querySelector("textarea"),n=el.querySelector(".fbq-n"),bar=el.querySelector(".fbq-bar i");
 let left=15,paused=false;
 const close=()=>{clearInterval(FBQ.iv);el.classList.remove("in");setTimeout(()=>el.remove(),380)};
 const stop=()=>{if(paused)return;paused=true;el.classList.add("held");n.textContent=""};  // навишта истодааст — намеравад
 bar.style.transition="width 15s linear";requestAnimationFrame(()=>requestAnimationFrame(()=>bar.style.width="0%"));
 FBQ.iv=setInterval(()=>{if(paused)return;left--;n.textContent=left;if(left<=0)close()},1000);
 ta.onfocus=ta.oninput=()=>{stop();bar.style.transition="none"};
 el.querySelectorAll("[data-fk]").forEach(b=>b.onclick=()=>{kind=b.dataset.fk;stop();bar.style.transition="none";el.querySelectorAll("[data-fk]").forEach(x=>x.classList.toggle("on",x===b))});
 el.querySelector(".fbq-x").onclick=close;
 el.querySelector("[data-fq-send]").onclick=()=>{const t=ta.value.trim();if(!t){stop();ta.focus();return}S.rp={kind,text:t,img:"",where:"read"};close();sendReport()}}
function bindFeedbackQuick($$){
 $$("[data-fab]",b=>b.onclick=e=>{e.stopPropagation();fabOpen()});
 $$("[data-rpi-pen]",b=>b.onclick=annoOpen)}
