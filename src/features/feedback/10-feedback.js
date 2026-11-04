// ===== Хато/пешниҳод аз корбар =====
const RPK="kitob_rep";
const rpLoad=()=>{try{return JSON.parse(localStorage.getItem(RPK)||"[]")}catch(_){return[]}};
function shrinkKeep(file,max){return new Promise((ok,no)=>{const u=URL.createObjectURL(file),im=new Image();im.onload=()=>{try{const s=Math.min(1,max/Math.max(im.width,im.height)),cv=document.createElement("canvas");cv.width=Math.round(im.width*s);cv.height=Math.round(im.height*s);cv.getContext("2d").drawImage(im,0,0,cv.width,cv.height);URL.revokeObjectURL(u);ok(cv.toDataURL("image/jpeg",.8))}catch(e){no(e)}};im.onerror=()=>{URL.revokeObjectURL(u);no(new Error("img"))};im.src=u})}
function reportSheet(X){const d=S.rp||(S.rp={kind:"bug",text:"",img:""});
 return `<div class="sh-head"><b class="sh-t">Хато фиристодан</b>${X}</div>
  <div class="seg">${[["bug","Хато"],["idea","Пешниҳод"],["book","Китоб"]].map(([k,n])=>`<button class="${d.kind===k?"on":""}" data-rpk="${k}">${n}</button>`).join("")}</div>
  <textarea class="pe-i" id="rpt" rows="5" maxlength="1500" placeholder="Чӣ шуд? Дар кадом саҳифа? Чӣ интизор будед?…">${escH(d.text)}</textarea>
  <div class="rp-img">${d.img?`<img src="${d.img}" alt=""><button class="lb-x" data-rpi-x aria-label="Бардоштан">${P(IC_X,2)}</button>`:`<button class="pill" data-rpi>${P('<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',2)}Скриншот илова кардан</button>`}</div>
  <input type="file" id="rpf" accept="image/*" hidden>
  <p class="set-note">Версия ва дастгоҳ худкор ҳамроҳ мешавад. Парол ва рамзро нанависед.</p>
  <button class="pay-btn" data-rp-send style="width:100%">Фиристодан</button>`}
async function flushReports(){if(!S.uid||!navigator.onLine)return;const q=rpLoad();if(!q.length)return;
 try{const c=await sbLoad();if(!c)return;const rest=[];
  for(const r of q){let img=null;
   if(r.img){try{const b=await(await fetch(r.img)).blob(),p=S.uid+"/"+r.t+".jpg",u=await c.storage.from("reports").upload(p,b,{upsert:true,contentType:"image/jpeg"});if(!u.error)img=p}catch(_){}}
   const{error}=await c.rpc("submit_report",{p_kind:r.k,p_body:r.b,p_info:r.i||{},p_image:img});
   if(error&&!/empty|too_many/.test(error.message||""))rest.push(r)}
  localStorage.setItem(RPK,JSON.stringify(rest))}catch(_){}}
function sendReport(){const d=S.rp;if(!d||!d.text.trim()){toast("Матн нависед");return}
 const q=rpLoad();q.push({k:d.kind,b:d.text.trim(),i:NATIVE.info(),img:d.img,t:Date.now()});try{localStorage.setItem(RPK,JSON.stringify(q.slice(-5)))}catch(_){toast("Ҷой нест. Скриншотро бардоред");return}
 S.rp=null;S.sheet=null;render();toast(navigator.onLine?"Ташаккур! Фиристода шуд":"Нигоҳ дошта шуд, бо интернет мефиристем");flushReports()}

// ===== Идоракунӣ: хатоҳо, хабарҳо =====
const KIND_N={bug:"Хато",idea:"Пешниҳод",book:"Китоб",other:"Дигар"};
const fmtT=s=>{const m=Math.round((s||0)/60);return m>=60?Math.floor(m/60)+" соат "+(m%60)+" дақ":m+" дақ"};
function admRepHTML(X){const tab=S.rpTab||0,L=S.rpl,E=S.erl;
 let body="";
 if(tab===2)body=E==null?`<p class="sh-empty">Бор мешавад…</p>`:E.length?E.map(e=>`<div class="plan er"><div><b translate="no">${escH(e.msg)}</b><span>${e.n} бор · ${new Date(e.last_at).toLocaleString()} · ${escH(e.kind||"")}</span><small translate="no">${escH(((e.info||{}).model||"")+" "+((e.info||{}).android||"")+" v"+((e.info||{}).app||""))}</small></div></div>`).join(""):`<p class="sh-empty">Ҳафтаи охир хатои техникӣ нест.</p>`;
 else{const list=(L||[]).filter(r=>tab===0?r.status==="new":r.status==="done");
  body=L==null?`<p class="sh-empty">Бор мешавад…</p>`:list.length?list.map(r=>`<div class="plan rp"><div><b translate="no">${escH(r.name||"—")} <em>${KIND_N[r.kind]||""}</em></b><span class="rp-b" translate="no">${escH(r.body)}</span><small translate="no">${new Date(r.created_at).toLocaleString()} · ${escH(((r.info||{}).model||"web")+" "+((r.info||{}).android||"")+" v"+((r.info||{}).app||""))}</small>
   <div class="rp-a">${r.image?`<button class="pill" data-rp-img="${escH(r.image)}">Скриншот</button>`:""}<button class="pill" data-rp-st="${r.id}:${tab===0?"done":"new"}">${tab===0?"Ҳал шуд ✓":"Боз кардан"}</button></div></div></div>`).join(""):`<p class="sh-empty">Холӣ аст</p>`}
 return `<div class="sh-head"><b class="sh-t">Хатоҳо ва пешниҳодҳо</b>${X}</div>
  <div class="seg">${["Нав","Ҳал шуд","Техникӣ"].map((n,i)=>`<button class="${tab===i?"on":""}" data-rptab="${i}">${n}</button>`).join("")}</div>${body}`}
async function loadRepAdmin(){const c=await sbLoad();if(!c)return;
 try{const[a,b,e]=await Promise.all([c.rpc("reports_list",{p_status:"new"}),c.rpc("reports_list",{p_status:"done"}),c.rpc("errors_list")]);
  S.rpl=[...(a.data||[]),...(b.data||[])];S.erl=e.data||[];if(S.sheet==="admrep")render()}catch(_){S.rpl=S.rpl||[];S.erl=S.erl||[]}}
function admNewsHTML(X){return `<div class="sh-head"><b class="sh-t">Хабар фиристодан</b>${X}</div>
  <p class="set-note" style="margin-top:0">Хабар ба ҳамаи APK-ҳо ҳамчун огоҳинома меравад (то 6 соат дар дастгоҳ мерасад).</p>
  <label class="pe-l" for="nwt">Сарлавҳа</label><input class="pe-i" id="nwt" maxlength="80" placeholder="Масалан: Китобҳои нав илова шуданд" autocomplete="off">
  <label class="pe-l" for="nwb">Матн</label><textarea class="pe-i" id="nwb" rows="3" maxlength="300" placeholder="Чанд сатр…"></textarea>
  <button class="pay-btn" data-nw-send style="width:100%;margin-top:14px">Фиристодан</button>`}
async function loadNewsOnce(){try{const c=await sbLoad();if(!c)return null;const{data,error}=await c.from("news").select("id,title").order("id",{ascending:false}).limit(1);if(error||!data||!data[0])return null;return data[0]}catch(_){return null}}
function bindFeedback(){
 const $$=(s,fn)=>app.querySelectorAll(s).forEach(fn);
 if(S.sheet==="report"&&S.rp){const d=S.rp,t=document.getElementById("rpt"),f=document.getElementById("rpf");
  if(t)t.oninput=()=>{d.text=t.value};
  $$("[data-rpk]",b=>b.onclick=()=>{d.kind=b.dataset.rpk;render()});
  $$("[data-rpi]",b=>b.onclick=()=>f&&f.click());$$("[data-rpi-x]",b=>b.onclick=()=>{d.img="";render()});
  if(f)f.onchange=async()=>{const x=f.files&&f.files[0];f.value="";if(!x)return;try{d.img=await shrinkKeep(x,900);render()}catch(_){toast("Расм хонда нашуд")}};
  $$("[data-rp-send]",b=>b.onclick=sendReport)}
 if(S.sheet==="admrep"){if(!S._rp2){S._rp2=1;loadRepAdmin()}
  $$("[data-rptab]",b=>b.onclick=()=>{S.rpTab=+b.dataset.rptab;render()});
  $$("[data-rp-st]",b=>b.onclick=async()=>{const[id,st]=b.dataset.rpSt.split(":");try{const c=await sbLoad();const{error}=await c.rpc("report_set",{p_id:+id,p_status:st});if(error){toast("Иҷозат дода нашуд. Аввал SQL-и алоқаро иҷро кунед");return}const r=(S.rpl||[]).find(x=>x.id==id);if(r)r.status=st;render()}catch(_){toast("Интернет нест")}});
  $$("[data-rp-img]",b=>b.onclick=async()=>{try{const c=await sbLoad();const{data}=await c.storage.from("reports").createSignedUrl(b.dataset.rpImg,3600);if(data&&data.signedUrl)NATIVE.openUrl(data.signedUrl);else toast("Расм ёфт нашуд")}catch(_){toast("Интернет нест")}})}
 else S._rp2=0;
 if(S.sheet==="admnews")$$("[data-nw-send]",b=>b.onclick=async()=>{const t=(document.getElementById("nwt").value||"").trim(),x=(document.getElementById("nwb").value||"").trim();if(!t){toast("Сарлавҳа нависед");return}
  try{const c=await sbLoad();const{error}=await c.rpc("post_news",{p_title:t,p_body:x});if(error){toast("Иҷозат дода нашуд. Аввал SQL-и алоқаро иҷро кунед");return}S.sheet=null;render();toast("Хабар фиристода шуд")}catch(_){toast("Интернет нест")}});
 $$("[data-minv]",b=>b.onclick=async()=>{const el=document.getElementById("minv"),v=Math.max(0,parseInt(el&&el.value||"0",10)||0);try{const c=await sbLoad();const{error}=await c.rpc("set_min_native",{p:v});if(error){toast("Иҷозат дода нашуд. Аввал SQL-и алоқаро иҷро кунед");return}S.flags.min=v;save();toast(v?"Ҳадди ақал: #"+v:"Ҳадди ақал хомӯш шуд")}catch(_){toast("Интернет нест")}});
}

// ===== Ҳавола ба китоб (?b=ID ё slug) =====
function openRef(r){const b=BOOKS.find(x=>String(x.id)===String(r)||(x.slug&&x.slug===r));if(!b)return false;if(S.view==="login")return false;openDetail(b.id);return true}
window.__deep=r=>{window.__pendRef=r;tryRef()};
function tryRef(){const r=window.__pendRef;if(!r)return;if(openRef(r))window.__pendRef=null}
try{const q=new URLSearchParams(location.search).get("b");if(q)window.__pendRef=q}catch(_){}
const bookLink=b=>SITE_URL+"?b="+encodeURIComponent(b.slug||b.id);

/* ---- варақи report ---- */
SHEETS.report=X=>{let h="";h=reportSheet(X);;return h};
