const ADM_COLS=[["#24443a","#122a22","Сабз"],["#7a2e1f","#4a1a12","Сурх"],["#3c2f6b","#231a45","Бунафш"],["#2c4a63","#1a2f40","Кабуд"],["#8a5a14","#5a3a0a","Зарди тира"],["#6b2f4a","#45192e","Гулобӣ"],["#3b3b3b","#1f1f1f","Хокистарӣ"]];
const ADM_CATS=GENRES.map(g=>[g[0],g[1]]);
const VBADGE='<span class="vbadge" title="Админ" aria-label="Админ"><svg width="22" height="22" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#2f8cf0"/><path d="M12 5.2l1.8 4 4.4.5-3.3 3 .9 4.3L12 14.800 8.200 17l.9-4.300-3.300-3 4.400-.5z" fill="#fff"/></svg></span>';
function shrinkImage(file,maxW,maxH){return new Promise((ok,no)=>{const u=URL.createObjectURL(file),im=new Image();
 im.onload=()=>{const k=Math.min(1,maxW/im.naturalWidth,maxH/im.naturalHeight),w=Math.round(im.naturalWidth*k),h=Math.round(im.naturalHeight*k),cv=document.createElement("canvas");
  cv.width=w;cv.height=h;cv.getContext("2d").drawImage(im,0,0,w,h);URL.revokeObjectURL(u);cv.toBlob(b=>b?ok(b):no(new Error("Расм кор накард")),"image/jpeg",.92)};
 im.onerror=()=>{URL.revokeObjectURL(u);no(new Error("Расмро кушода натавонистам"))};im.src=u})}
async function uploadCover(c,id,slug,file){
 const sl=slug||("b"+id),path="b"+id+"/cover-"+Date.now()+".jpg",blob=await shrinkImage(file,900,1350); // роҳи танҳо ASCII: ҳарфи тоҷикӣ дар калид хато медод
 let e=(await c.storage.from("books").upload(path,blob,{upsert:true,contentType:"image/jpeg"})).error;if(e)throw new Error("Муқова бор нашуд: "+e.message);
 e=(await c.from("books").update({cover_path:path,slug:sl}).eq("id",id)).error;if(e)throw new Error("Муқова сабт нашуд: "+e.message)}
// Ҳуқуқҳо: [калид, ном, тавсиф, пешфарзи ёрдамчӣ]. Админ ҳамаашро дорад. «Танҳо админ» ҳуқуқҳо ба ёрдамчӣ дода намешаванд.
const CAPS=[
 ["books","Китобҳо: илова, таҳрир, нест кардан","Идоракунӣ → Китобҳо",true],
 ["maker","Китоб ясаш (PDF, Word → .kitob)","Идоракунӣ → Китоб ясаш",false],
 ["reports","Хатоҳо ва пешниҳодҳо","Дидан ва «Ҳал шуд» кардан",true],
 ["stats","Омор (корбарон, хондан)","Рақамҳо дар Идоракунӣ",true],
 ["notif","Огоҳиномаҳо (ёдоварӣ, табрик)","Матн ва вақтро таҳрир кардан",false],
 ["news","Хабар фиристодан","Огоҳинома ба ҳамаи APK-ҳо",false],
 ["release","Нашри навсозии APK","Нашр ва қатъ кардан",false],
 ["gender","Санҷиши ҷинси профил","Дар Таҳрири профил",false]];
const ADMIN_ONLY=[["Ёрдамчиёнро таъин ва бардоштан","Фақат админ"],["Тугмаи Премиум","Фақат админ"],["Версияи ҳадди ақали APK","Фақат админ"],["Ҳуқуқҳои ёрдамчиёнро иваз кардан","Фақат админ"],["Админро бардоштан ё иваз кардан","Ҳеҷ кас, ба ҷуз худи админ"]];
const capOn=(p,k)=>{const d=CAPS.find(x=>x[0]===k);if(!d)return false;const v=(p||{})[k];return v===undefined||v===null?d[3]:!!v};
const canPerm=k=>S.role==="admin"||(S.role==="subadmin"&&capOn(S.perms,k));
async function loadPerms(c){S.perms={};try{const{data:s}=await c.auth.getSession();const u=s.session?.user;if(!u)return;const{data,error}=await c.from("profiles").select("perms").eq("id",u.id).maybeSingle();if(!error&&data&&data.perms&&typeof data.perms==="object")S.perms=data.perms}catch(_){}}
async function loadStaff(){if(S.role!=="admin")return;const c=await sbLoad();if(!c)return;
 try{const{data,error}=await c.rpc("staff_list");if(!error&&Array.isArray(data)&&JSON.stringify(data)!==JSON.stringify(S.staff)){S.staff=data;if(S.view==="me"&&!S.sheet)render()}}catch(_){}}
async function setStaff(email,role){const c=await sbLoad();if(!c){toast("Интернет нест");return false}
 try{const{data,error}=await c.rpc("set_role",{p_email:email,p_role:role});
  if(error){toast("Иҷозат дода нашуд. Аввал SQL-ро иҷро кунед");return false}
  if(data==="ok"){toast(role==="subadmin"?"Ёрдамчии админ таъин шуд":"Ёрдамчӣ бардошта шуд");await loadStaff();return true}
  toast(data==="no_user"?"Бо ин почта ҳисоб ёфт нашуд. Бигӯед, ки аввал дар барнома дохил шавад":data==="no_profile"?"Ин шахс ҳоло ном сабт накардааст. Бигӯед, ки аввал дохил шуда, номашро нависад":data==="is_admin"?"Ин шахс админ аст":"Иҷозат дода нашуд");return false}
 catch(_){toast("Интернет нест ё сервер ҷавоб намедиҳад");return false}}
function loadJSZip(){return window.JSZip?Promise.resolve(window.JSZip):new Promise((ok,no)=>{const t=document.createElement("script");t.src="lib/jszip.min.js";t.onload=()=>ok(window.JSZip);t.onerror=()=>{const u=document.createElement("script");u.src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";u.onload=()=>ok(window.JSZip);u.onerror=no;document.head.appendChild(u)};document.head.appendChild(t)})}
async function gzipBlob(text){return await new Response(new Blob([text]).stream().pipeThrough(new CompressionStream("gzip"))).blob()}
/* ---- Ҳуқуқ ва манба (docs/sql-mulk.sql). Ҳолатро бунёдгузорон муайян мекунанд; «pending» = нашр мумкин нест ---- */
const RIGHTS=[["pending","Ҳоло номаълум (нашр нашавад)"],["public_domain","Умумиҷамъиятӣ (бунёдгузорон тасдиқ кардаанд)"],["licensed","Иҷозатнома ё розигӣ дорем"]];
function rightsHTML(p,a){a=a||{};const f=(id,ph,v,mx)=>`<label class="field" for="${p}_${id}"><input id="${p}_${id}" placeholder="${ph}" maxlength="${mx||200}" value="${escH(v||"")}" style="padding-left:6px"></label>`;
 return `<p class="set-cap">Ҳуқуқ ва манба (барои нашр ҳатмӣ)</p>
  <select id="${p}_rs" aria-label="Ҳолати ҳуқуқ">${RIGHTS.map(([k,n])=>`<option value="${k}"${(a.rs||"pending")===k?" selected":""}>${n}</option>`).join("")}</select>
  ${f("rh","Соҳиби ҳуқуқ (нашриёт, муаллиф ё меросхӯр)",a.rh)}${f("sr","Манба (аз куҷо гирифта шуд)",a.src2)}${f("ed","Нашр (нашриёт, сол)",a.ed)}${f("tr","Мутарҷим ё муҳаррир",a.tr)}${f("ln","Эзоҳи иҷозатнома (ихтиёрӣ)",a.ln,300)}
  <p class="hint">Ин ҷо ҳуқуқӣ хулоса нест: фақат маълумот сабт мешавад. «Ҳоло номаълум» бошад, китобро нашр кардан мумкин нест.</p>`}
/* хатои инлайн дар худи варақ (на танҳо toast): ҷойи лозимаро нишон медиҳад */
function admErr(msg,field){const e=document.getElementById("a_err");if(e){e.textContent=msg;e.hidden=!msg}
 document.querySelectorAll(".a-bad").forEach(x=>x.classList.remove("a-bad"));
 const f=field&&document.getElementById(field);if(f){f.classList.add("a-bad");try{f.scrollIntoView({block:"center",behavior:"smooth"})}catch(_){}}
 else if(e&&msg){try{e.scrollIntoView({block:"center",behavior:"smooth"})}catch(_){}}}
function rightsField(r){return !r||r.rights_status==="pending"?"a_rs":!r.source?"a_sr":"a_rh"}
function readRights(p){const v=id=>((document.getElementById(p+"_"+id)||{}).value||"").trim();
 return{rights_status:v("rs")||"pending",rights_holder:v("rh")||null,source:v("sr")||null,edition:v("ed")||null,translator:v("tr")||null,license_note:v("ln")||null}}
/* ҳамон қоидаи сервер (триггер books_rights_guard): хабар ба тоҷикӣ ё "" */
function rightsCheck(r){if(!r||r.rights_status==="pending")return"Ҳолати ҳуқуқ «Ҳоло номаълум» аст: китобро нашр кардан мумкин нест";
 if(!r.source)return"Манбаро нависед (китоб аз куҷо гирифта шуд)";if(r.rights_status==="licensed"&&!r.rights_holder)return"Соҳиби ҳуқуқро нависед";return""}
function rightsServerMsg(m){m=String(m||"");if(/rights_pending/.test(m))return"Ҳолати ҳуқуқ «Ҳоло номаълум» аст: нашр мумкин нест";if(/source_required/.test(m))return"Манбаро нависед";if(/rights_holder_required/.test(m))return"Соҳиби ҳуқуқро нависед";return""}
const RT_KEYS=["rights_status","rights_holder","source","edition","translator","license_note"];
async function importZip(file,imgs,meta){
 let z=null,raw;
 if(/\.json$/i.test(file.name)||file.type==="application/json")raw=await file.text();
 else{const JSZip=await loadJSZip();
  try{z=await JSZip.loadAsync(file)}catch(_){z=null}
  if(z){const jf=z.file("book.json")||z.file(/(^|\/)book\.json$/)[0];if(!jf)throw new Error("Дар файл book.json нест");raw=await jf.async("string")}
  else{raw=await file.text();if(!/^\s*\{/.test(raw))throw new Error("Файл китоб нест (.kitob, .zip ё book.json лозим)")}}
 let d;try{d=JSON.parse(raw)}catch(_){throw new Error("book.json нодуруст аст")}
 if(!d.title||!d.author||!Array.isArray(d.parts))throw new Error("Сохтори book.json нодуруст аст");
 const slug=String(d.id||d.title).toLowerCase().replace(/[^a-z0-9-]+/g,"-").replace(/^-+|-+$/g,"").slice(0,60)||("k"+Date.now());
 const c=await sbLoad();if(!c)throw new Error("Интернет нест");
 const st=c.storage.from("books"),tp=slug+"/book.json.gz";
 let e=(await st.upload(tp,await gzipBlob(raw),{upsert:true,contentType:"application/gzip"})).error;if(e)throw new Error("Матн бор нашуд: "+e.message);
 let cvp=null,cb=null,cn=d.cover?String(d.cover).split("/").pop():"";
 if(d.cover&&z){const cf=z.file(d.cover);if(cf)cb=await cf.async("blob")}
 if(!cb&&imgs&&imgs.length){const im=imgs.find(x=>x.name===cn)||(imgs.length===1?imgs[0]:null);if(im){cb=im;cn=cn||im.name}}
 if(cb){cvp=slug+"/"+cn;e=(await st.upload(cvp,cb,{upsert:true,contentType:/\.png$/i.test(cvp)?"image/png":"image/jpeg"})).error;if(e)throw new Error("Муқова бор нашуд: "+e.message)}
 const row={t:d.title,a:d.author,c:genreOf(d.category),slug,text_path:tp};if(cvp)row.cover_path=cvp;
 /* ҳуқуқ: аз форма (meta) ё аз book.json → "meta"; навъ нодуруст бошад — партофта мешавад. Китоби мавҷуда бо «pending» аз нав навишта намешавад */
 const dm=d.meta&&typeof d.meta==="object"?d.meta:{},rt={};RT_KEYS.forEach(k=>{const v=(meta&&meta[k])||dm[k];if(v!=null&&v!=="")rt[k]=String(v).slice(0,300)});
 if(rt.rights_status&&!RIGHTS.some(x=>x[0]===rt.rights_status))delete rt.rights_status;
 const{data:ex}=await c.from("books").select("id").eq("slug",slug).maybeSingle();
 if(!ex||(rt.rights_status&&rt.rights_status!=="pending"))Object.assign(row,rt);
 const res=ex?await c.from("books").update(row).eq("id",ex.id):await c.from("books").insert({...row,published:false});
 if(res.error)throw new Error("Дар база сабт нашуд: "+res.error.message);
 try{(await caches.open("kitob-books")).delete("https://kitob.local/"+tp)}catch(_){}
 await loadBooks(c);return d.title}
function admHTML(){if(S.role!=="admin"&&S.role!=="subadmin")return "";
 const row=(ic,t,d,sh)=>`<div class="plan"><span class="round">${P(ic,2)}</span><div><b>${t}</b><span>${d}</span></div><button class="pill" data-sheet="${sh}">Кушодан</button></div>`;
const st=S.stats||{};
 return `<div class="sec"><div class="sec-h"><h2>Идоракунӣ</h2></div>
  ${canPerm("stats")?`
  <div class="stg"><div><small>Админ</small><b id="st_admin">${st.admins??"–"}</b></div><div><small>Ёрдамчӣ</small><b id="st_sub">${st.subadmins??"–"}</b></div><div><small>Истифодабарандагон</small><b id="st_user">${st.users??"–"}</b></div><div class="all"><small>Рамзро тасдиқ кардаанд</small><b id="st_all">${st.total??"–"}</b></div><div><small>Рамз тасдиқ нашудааст</small><b id="st_unv">${st.unverified??"–"}</b></div><div><small>Профил тайёр нест</small><b id="st_np">${st.no_profile??"–"}</b></div></div>
  <div class="stg"><div><small>Имрӯз фаъол</small><b id="st_dau">${(S.rs||{}).dau??"–"}</b></div><div><small>7 рӯз фаъол</small><b id="st_wau">${(S.rs||{}).wau??"–"}</b></div><div><small>Хондан имрӯз</small><b id="st_mt" class="sm">${S.rs?fmtT(S.rs.sec_today):"–"}</b></div><div class="all"><small>Хондан дар 7 рӯз</small><b id="st_m7">${S.rs?fmtT(S.rs.sec_7d):"–"}</b></div></div>
  <p class="set-cap">Воронка, 30 рӯзи охир</p>
  <div class="stg"><div><small>Насб карданд</small><b id="fn_installs">${(S.fn||{}).installs??"–"}</b></div><div><small>Сабти ном карданд</small><b id="fn_registered">${(S.fn||{}).registered??"–"}</b></div><div><small>1 дақиқа хонданд</small><b id="fn_read1">${(S.fn||{}).read1??"–"}</b></div><div class="all"><small>Баргаштанд: рӯзи 1+ / рӯзи 7+</small><b><span id="fn_back1">${(S.fn||{}).back1??"–"}</span> / <span id="fn_back7">${(S.fn||{}).back7??"–"}</span></b></div></div>
  ${S.rs&&S.rs.top&&S.rs.top.length?`<p class="set-note" translate="no">${S.rs.top.map((t,i)=>(i+1)+". "+escH(t.title)+" — "+fmtT(t.sec)).join("<br>")}</p>`:""}
  `:""}
  <div class="nrow"><div class="ntx"><b>Нусхаи захира (GitLab)</b><small>Охирин нав кардан: ${new Date(bkLast()).toLocaleDateString()} · ${bkDays()} рӯз пеш${bkDue()?" · НАВ КАРДАН ЛОЗИМ":""}</small></div><button class="pill" data-bkdone>Анҷом шуд</button></div>
  ${S.role==="admin"?`<div class="nrow"><div class="ntx"><b>Премиум дар барнома</b><small>Хомӯш: ҳамаи китобҳо ройгон, навиштаҳои Премиум пинҳон. Ҳеҷ чиз нест намешавад</small></div><button class="swt${PREM()?" on":""}" data-flag="premium" role="switch" aria-label="Премиум"></button></div>`:""}
  ${S.role==="admin"?`<p class="set-cap">Бахшҳои «Ба зудӣ»: хомӯш = ба корбар пинҳон ё «Ба зудӣ» менамояд</p>${FEATS.map(([k,t,d])=>`<div class="nrow"><div class="ntx"><b>${t}</b><small>${d}</small></div><button class="swt${FEAT(k)?" on":""}" data-feat="${k}" role="switch" aria-label="${t}"></button></div>`).join("")}`:""}
  ${S.role==="admin"?row('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',"Ҳисобҳои нест шуда","Тиклаш ва пурра тоза кардан","admdel"):""}
  ${canPerm("maker")&&canPerm("books")?row('<path d="M12 3v4M5 7h14v14H5zM9 12h6M9 16h4"/>',"Китоб ясаш","PDF, Word, EPUB → худкор ба барнома","admmake"):""}
  ${canPerm("books")?row('<path d="M3 5c3-1.500 6-1.500 9 0v14c-3-1.500-6-1.500-9 0zM21 5c-3-1.500-6-1.500-9 0v14c3-1.500 6-1.500 9 0z"/>',"Китобҳо","Китоби нав, zip, таҳрир","admbooks"):""}
  ${canPerm("reports")?row('<path d="M12 9v4M12 17h.01M10.3 3.9L2.4 18a2 2 0 001.7 3h15.800a2 2 0 001.700-3L13.700 3.900a2 2 0 00-3.400 0z"/>',"Хатоҳо ва пешниҳодҳо","Аз корбарон ва хатоҳои техникӣ","admrep"):""}
  ${canPerm("news")?row(I.bell,"Хабар фиристодан","Огоҳинома ба ҳамаи APK-ҳо","admnews"):""}
  ${canNotif()?row(I.bell,"Огоҳиномаҳо","Ёдоварӣ ва табрик: матн, вақт, хомӯш кардан","admnotif"):""}
  ${canPerm("release")?row('<path d="M12 3v12M7 10l5 5 5-5M5 20h14"/>',"Навсозии APK"+(relNew()?'<i class="rel-dot"></i>':""),relNew()?"Версияи нав тайёр: нашр кардан мумкин":"Нашр ва қатъ кардани навсозии APK","admrel"):""}
  ${S.role==="admin"?row('<circle cx="9" cy="8" r="3.500"/><path d="M2.500 20c.6-4 3.200-6 6.500-6s5.900 2 6.500 6M17 8v6M14 11h6"/>',"Ёрдамчиёни админ","Таъин кардан ва бардоштан","admstaff"):""}</div>`}
function admBooksHTML(X){const mine=BOOKS.filter(x=>x.db);
 return `<div class="sh-head"><b class="sh-t">Китобҳо</b>${X}</div>
  <div class="plan"><span class="round">${P('<path d="M12 5v14M5 12h14"/>',2)}</span><div><b>Китоби нав илова кардан</b><span>Танҳо ном ва муаллиф, бе матн</span></div><button class="pill" data-adm="new">Илова</button></div>
  <div class="plan"><span class="round">${P('<path d="M12 16V4M7 9l5-5 5 5M5 20h14"/>',2)}</span><div><b>Бастаи китоб (.kitob, zip ё book.json)</b><span>Якчанд китобро якбора интихоб кунед. Аввал пинҳон бор мешавад</span></div><label class="pill" for="admzip">Интихоб</label><input type="file" id="admzip" multiple hidden></div>
  ${mine.map(b=>`<div class="plan"><span class="sh-cv" style="width:38px;flex:none">${cover(b)}</span><div><b translate="no">${escH(b.t)}</b><span><span translate="no">${escH(b.a)}</span>${b.pub?"":' · <i class="hidden-tag">Пинҳон</i>'}${b.cvMiss?' · <i class="hidden-tag">Муқова кушода нашуд</i>':""}</span></div><button class="pill" data-adm="edit" data-id="${b.id}">Таҳрир</button></div>`).join("")}`}
function admRelHTML(X){const pub=(S.rel&&S.rel.version)||0,b=S.rb,newer=relNew();
 return `<div class="sh-head"><b class="sh-t">Навсозии APK</b>${X}</div>
  <p class="set-note" style="margin-top:0">Тағйироти сайт (рӯйхат, дизайн, тарҷума) ҳамеша худкор ба ҳама мерасад, бе баннер. Ин ҷо танҳо навсозии иловаи Android.</p>
  ${admWebHTML()}
  ${S.role==="admin"?`<div class="nrow"><div class="ntx"><b>Версияи ҳадди ақал</b><small>Агар APK-и корбар аз ин кӯҳнатар бошад, барнома «навсозӣ кунед» мегӯяд. 0 — хомӯш</small></div><input id="minv" class="pe-i" style="width:76px;flex:none" inputmode="numeric" value="${(S.flags&&S.flags.min)||0}"><button class="pill" data-minv>Сабт</button></div>`:""}
  <div class="nrow"><div class="ntx"><b>Нашршуда</b><small>${pub?"#"+pub:"Қатъ шудааст"}</small></div></div>
  <div class="nrow"><div class="ntx"><b>Охирин сохташуда</b><small>${b?"#"+b.v+" · "+new Date(b.date).toLocaleDateString():(S.rbDone?"Ёфт нашуд":"Ҷустуҷӯ…")}</small></div></div>
  ${newer?`<button class="rel-go" data-rel-pub="${b.v}">Нашр кардан (#${b.v})</button><p class="set-note">Ҳама ба иловаи кушодашуда «Версияи нав омад»-ро мебинанд ва боргирӣ мекунанд</p>`:`<p class="set-note">${b?"Ҳама чиз нав аст":""}</p>`}
  ${pub?`<button class="pay-later" data-rel-stop>Қатъ кардан</button>`:""}`}
function admStaffHTML(X){
 const gear=`<button class="sh-gear" data-sheet="admrights" aria-label="Ҳуқуқҳо">${P('<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.200 4.200l2.100 2.100M17.700 17.700l2.100 2.100M2 12h3M19 12h3M4.200 19.800l2.100-2.100M17.700 6.300l2.100-2.100"/>',2)}</button>`;
 return `<div class="sh-head"><b class="sh-t">Ёрдамчиёни админ</b>${gear}${X}</div>
  <p class="set-note" style="margin-top:0">Почтаи шахсро нависед, то ӯ ёрдамчӣ шавад. Ҳар ёрдамчиро алоҳида танзим кунед: ҳуқуқро фурӯзон кунед — ӯ мебинад, хомӯш кунед — фавран нест мешавад. ⚙ — ҳуқуқҳои умумӣ.</p>
  <div class="sa-row"><input id="sa_mail" type="email" inputmode="email" autocapitalize="off" autocomplete="off" spellcheck="false" placeholder="nom@gmail.com"><button class="pill" data-sa-add>Таъин кардан</button></div>
  ${(S.staff||[]).filter(x=>x.role==="subadmin").map(x=>`<div class="sa-card"><div class="plan"><div><b translate="no">${escH(x.name||"")}</b><span translate="no">${escH(x.email||"")}</span></div><button class="pill" data-sa-del="${esc(x.email||"")}">Бардоштан</button></div>
   <div class="sa-all"><button class="pill" data-permall="${esc(x.email||"")}|1">Ҳамаро фурӯзон</button><button class="pill" data-permall="${esc(x.email||"")}|0">Ҳамаро хомӯш</button></div>
   ${CAPS.map(([k,t,s])=>`<div class="nrow"><div class="ntx"><b>${t}</b><small>${s}</small></div><button class="swt${capOn(x.perms,k)?" on":""}" data-perm="${k}" data-pm="${esc(x.email||"")}" role="switch" aria-label="${t}"></button></div>`).join("")}</div>`).join("")}`}
function admRightsHTML(X){
 const li=(t,ok,note)=>`<div class="hq-r ${ok?"hq-y":"hq-n"}"><i>${ok?"✓":"✕"}</i><span>${t}${note?` <small>${note}</small>`:""}</span></div>`;
 return `<div class="sh-head"><b class="sh-t">Ҳуқуқҳо</b>${X}</div>
  <p class="hq-h">Админ</p>
  ${CAPS.map(c=>li(c[1],true)).join("")}${ADMIN_ONLY.slice(0,4).map(c=>li(c[0],true)).join("")}${li("Админро бардоштан ё иваз кардан",true,"танҳо админ")}
  <p class="hq-h">Ёрдамчӣ <small>(пешфарз; ҳар ёрдамчиро алоҳида иваз кардан мумкин)</small></p>
  ${CAPS.map(c=>li(c[1],c[3])).join("")}${ADMIN_ONLY.map(c=>li(c[0],false,c[1])).join("")}
  <p class="set-note">Сабз — метавонад. Сурх — наметавонад. Ёрдамчӣ ҳеҷ гоҳ админро ҳазф ё иваз карда наметавонад.</p>`}
function admNotifHTML(X){const c=S.ncfg||{},L=S.ndl||I18N.lang,d=S.nd=S.nd||{remind_text:{...(c.remind_text||{})},congrats_tpl:{...(c.congrats_tpl||{})}};
 const sw=(k,t,s)=>`<div class="nrow"><div class="ntx"><b>${t}</b><small>${s}</small></div><button class="swt${(k==="sub_can_edit"?!!c[k]:c[k]!==false)?" on":""}" data-nc="${k}" role="switch" aria-label="${t}"></button></div>`;
 return `<div class="sh-head"><b class="sh-t">Огоҳиномаҳо</b>${X}</div>
  ${sw("remind_on","Ёдоварии ҳаррӯза","Агар имрӯз ҳатто 1 дақиқа нахонда бошанд, ба ҳама худкор меравад")}
  ${sw("congrats_on","Табрики хондан","Баъди баромадан аз барнома, дақиқаҳои имрӯзро мегӯяд")}
  <div class="nrow"><div class="ntx"><b>Ёдоварӣ: 5 маротиба дар рӯз</b><small>09:30 · 12:30 · 15:30 · 18:30 · 20:30. Агар имрӯз ба барнома даромада бошад — ҳамагӣ 3</small></div></div>
  ${S.role==="admin"?sw("sub_can_edit","Ёрдамчиён ҳам таҳрир кунанд","Агар хомӯш бошад, ёрдамчӣ ин бахшро намебинад"):""}
  <p class="set-cap" style="margin-top:14px">Матнҳо</p>
  <div class="seg sm" style="margin-bottom:8px">${LANGS.map(([k,n])=>`<button class="${L===k?"on":""}" data-ndl="${k}" translate="no">${n}</button>`).join("")}</div>
  <label class="ntl">Ёдоварӣ<textarea data-ndt="remind_text" rows="2" placeholder="${esc(cfgTxt(null,DEF_REMIND))}">${escH(d.remind_text[L]||"")}</textarea></label>
  <label class="ntl">Табрик (дақиқа: {n})<textarea data-ndt="congrats_tpl" rows="3" placeholder="${esc(cfgTxt(null,DEF_CONGRATS))}">${escH(d.congrats_tpl[L]||"")}</textarea></label>
  <button class="pay-btn" data-nsave style="margin-top:6px">Захира кардан</button>`}

/* ---- пайвасти тугмаҳо: admin (аз bind() даъват мешавад) ---- */
function bindAdmin($$){
 $$("[data-adm]",b=>b.onclick=e=>{e.stopPropagation();S.adm=b.dataset.adm==="edit"?{...bk(+b.dataset.id)}:{};S.sheet="adm";render()});
 const az=document.getElementById("admzip");
 if(az)az.onchange=async()=>{const all=[...(az.files||[])];if(!all.length)return;let ok=0,bad=[];
  const isImg=f=>/^image\//.test(f.type)||/\.(jpe?g|png|webp)$/i.test(f.name),imgs=all.filter(isImg),fs=all.filter(f=>!isImg(f));
  if(!fs.length){az.value="";toast("book.json ё .kitob ҳам интихоб кунед (расм танҳо кифоя нест)");return}
  for(let i=0;i<fs.length;i++){toast("Бор мешавад "+(i+1)+"/"+fs.length+"… "+fs[i].name);
   try{await importZip(fs[i],imgs);ok++}catch(e){bad.push(fs[i].name+": "+(e.message||"хато"))}}
  az.value="";render();
  toast(bad.length?ok+" бор шуд, "+bad.length+" нашуд. "+bad[0]:ok+" китоб бор шуд (пинҳон)")};
 const acv=document.getElementById("a_cv");
 if(acv)acv.onchange=()=>{const f=acv.files&&acv.files[0],n=document.getElementById("a_cvn");if(f&&n)n.textContent="Интихоб шуд: "+f.name};
 const rsel=document.getElementById("a_rs"),rpub=document.getElementById("a_pub");
 if(rpub)rpub.onchange=()=>{admErr("");if(!rpub.checked)return;const rt=readRights("a"),em=rightsCheck(rt);
  if(em){rpub.checked=false;admErr("Китобро ҳама бинад, аввал ҳуқуқро пур кунед: «Ҳуқуқ ва манба»-ро интихоб кунед (масалан «Умумиҷамъиятӣ») ва Манбаро нависед. "+em,rightsField(rt))}};
 ["a_rs","a_sr","a_rh"].forEach(id=>{const el=document.getElementById(id);if(el)el.addEventListener("input",()=>admErr(""))});
 const asave=document.querySelector("[data-admsave]");
 if(asave)asave.onclick=async()=>{
  const v=id=>document.getElementById(id),t=v("a_t").value.trim(),a=v("a_a").value.trim();
  if(!t||!a){toast("Ном ва муаллифро нависед");return}
  const col=ADM_COLS[+v("a_col").value]||ADM_COLS[0];
  const row={t,a,c:v("a_c").value,col1:col[0],col2:col[1],audio:v("a_au").checked,descr:v("a_d").value.trim(),published:v("a_pub").checked,ebook:v("a_eb").checked,premium:v("a_pr").checked};
  const rt=readRights("a");if(row.published){const em=rightsCheck(rt);if(em){admErr("Нашр нашуд: "+em+". Ҳуқуқ ва манбаро пур кунед ё галочкаро бардоред (китоб пинҳон захира мешавад).",rightsField(rt));toast(em);return}}admErr("");Object.assign(row,rt);
  asave.disabled=true;const c=await sbLoad();if(!c){asave.disabled=false;toast("Интернет нест");return}
  const cvf=v("a_cv").files&&v("a_cv").files[0];
  let bid=S.adm&&S.adm.id,bslug=S.adm&&S.adm.slug,error=null,sqlMiss=false;
  const save1=async rw=>{if(bid)return(await c.from("books").update(rw).eq("id",bid)).error;
   const rs=await c.from("books").insert(rw).select("id,slug").single();if(rs.data){bid=rs.data.id;bslug=rs.data.slug}return rs.error};
  error=await save1(row);
  if(error&&!rightsServerMsg(error.message)&&/rights_|source|edition|translator|license_note/i.test(error.message||"")){const o2={...row};RT_KEYS.forEach(k=>delete o2[k]);error=await save1(o2);if(!error)sqlMiss=true}
  if(error&&/premium|ebook/i.test(error.message||"")){const{ebook,premium,...old}=row;error=await save1(old);if(!error)sqlMiss=true}
  if(error){asave.disabled=false;toast(rightsServerMsg(error.message)||"Захира нашуд. Ҳуқуқи админ лозим аст ё интернет нест");return}
  if(cvf&&bid){try{await uploadCover(c,bid,bslug,cvf)}catch(e){asave.disabled=false;toast(e.message||"Муқова бор нашуд");return}}
  await loadBooks(c);S.sheet=null;S.adm=null;render();toast(sqlMiss?"Захира шуд, лекин «Премиум/Электронӣ» нигоҳ дошта нашуд. Аввал SQL-ро иҷро кунед":"Захира шуд")};
 const adel=document.querySelector("[data-admdel]");
 if(adel)adel.onclick=async()=>{
  if(!confirm("Китоб ба тамом нест мешавад. Давом медиҳед?"))return;
  const c=await sbLoad();if(!c)return;const{error}=await c.from("books").delete().eq("id",S.adm.id);
  if(error){toast("Нест нашуд");return}await loadBooks(c);S.sheet=null;S.adm=null;render();toast("Нест шуд")};
 $$("[data-sa-add]",b=>b.onclick=async()=>{const el=document.getElementById("sa_mail"),m=(el&&el.value||"").trim().toLowerCase();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m)){toast("Почтаро дуруст нависед, масалан nom@gmail.com");return}
  if(await setStaff(m,"subadmin")&&el)el.value=""});
 $$("[data-flag]",b=>b.onclick=async()=>{const on=!b.classList.contains("on");b.classList.toggle("on",on);try{const c=await sbLoad();const{error}=await c.rpc("set_flag",{p_key:b.dataset.flag,p_on:on});if(error){b.classList.toggle("on",!on);toast("Иҷозат дода нашуд. Аввал SQL-и омор ва премиумро иҷро кунед");return}S.flags.premium=on;save();render()}catch(_){b.classList.toggle("on",!on);toast("Интернет нест")}});
 $$("[data-feat]",b=>b.onclick=async()=>{const on=!b.classList.contains("on"),k=b.dataset.feat;b.classList.toggle("on",on);try{const c=await sbLoad();const{error}=await c.rpc("set_feat",{p_key:k,p_on:on});if(error){b.classList.toggle("on",!on);toast("Иҷозат дода нашуд. Аввал docs/sql-bayroq.sql-ро иҷро кунед");return}S.flags.feat=Object.assign({},S.flags.feat,{[k]:on});save();render()}catch(_){b.classList.toggle("on",!on);toast("Интернет нест")}});
 $$("[data-permall]",b=>b.onclick=async()=>{const[em,on]=b.dataset.permall.split("|"),o={};CAPS.forEach(x=>o[x[0]]=on==="1");
  try{const c=await sbLoad();const{error}=await c.rpc("set_perms",{p_email:em,p:o});if(error){toast("Иҷозат дода нашуд. Аввал SQL-и ҳуқуқҳоро иҷро кунед");return}toast(on==="1"?"Ҳамаи ҳуқуқҳо дода шуд":"Ҳамаи ҳуқуқҳо гирифта шуд");const r=(S.staff||[]).find(x=>x.email===em);if(r)r.perms={...o};render()}catch(_){toast("Интернет нест")}});
 $$("[data-perm]",b=>b.onclick=async()=>{const on=!b.classList.contains("on");b.classList.toggle("on",on);try{const c=await sbLoad();const{error}=await c.rpc("set_perm",{p_email:b.dataset.pm,p_key:b.dataset.perm,p_on:on});if(error){b.classList.toggle("on",!on);toast("Иҷозат дода нашуд. Аввал SQL-и иҷозатҳоро иҷро кунед")}else loadStaff()}catch(_){b.classList.toggle("on",!on);toast("Интернет нест")}});
 $$("[data-sa-del]",b=>b.onclick=async()=>{if(!confirm("Ин ёрдамчиро бардоред?"))return;await setStaff(b.dataset.saDel,"user")});
}

/* ---- варақи admrights ---- */
SHEETS.admrights=X=>{let h="";h=admRightsHTML(X);;return h};

/* ---- варақи admrep ---- */
SHEETS.admrep=X=>{let h="";h=admRepHTML(X);;return h};

/* ---- варақи admnews ---- */
SHEETS.admnews=X=>{let h="";h=admNewsHTML(X);;return h};

/* ---- варақи admbooks ---- */
SHEETS.admbooks=X=>{let h="";h=admBooksHTML(X);;return h};

/* ---- варақи admstaff ---- */
SHEETS.admstaff=X=>{let h="";h=admStaffHTML(X);;return h};

/* ---- варақи admrel ---- */
SHEETS.admrel=X=>{let h="";h=admRelHTML(X);;return h};

/* ---- варақи admnotif ---- */
SHEETS.admnotif=X=>{let h="";h=admNotifHTML(X);;return h};

/* ---- варақи adm ---- */
SHEETS.adm=X=>{let h="";{const a=S.adm||{},ci=Math.max(0,ADM_COLS.findIndex(x=>x[0]===(a.col||[])[0]));
  h=`<div class="sh-head"><b class="sh-t">${a.id?"Таҳрири китоб":"Китоби нав"}</b>${X}</div>
  <div class="sh-form">
   <label class="field" for="a_t"><input id="a_t" placeholder="Номи китоб" maxlength="120" value="${escH(a.t||"")}" style="padding-left:6px"></label>
   <label class="field" for="a_a"><input id="a_a" placeholder="Муаллиф" maxlength="120" value="${escH(a.a||"")}" style="padding-left:6px"></label>
   <select id="a_c" aria-label="Бахш">${ADM_CATS.map(([k,n])=>`<option value="${k}" ${(a.c||"fiction")===k?"selected":""}>${n}</option>`).join("")}</select>
   <select id="a_col" aria-label="Ранги муқова">${ADM_COLS.map((x,i)=>`<option value="${i}" ${i===ci?"selected":""}>Муқова: ${x[2]}</option>`).join("")}</select>
   <textarea id="a_d" placeholder="Тавсифи кӯтоҳ" maxlength="600">${escH(a.desc||"")}</textarea>
   ${rightsHTML("a",a)}
   <label class="chk"><input type="checkbox" id="a_eb" ${a.ebook===false?"":"checked"}>Шакли электронӣ (матн) дорад</label>
   <label class="chk"><input type="checkbox" id="a_au" ${a.audio?"checked":""}>Аудио низ дорад</label>
   <label class="chk"><input type="checkbox" id="a_pr" ${a.prem?"checked":""}>Премиум (пурра танҳо бо обуна)</label>
   <label class="chk"><input type="checkbox" id="a_pub" ${a.id&&a.pub?"checked":""}>Барои ҳама намоён (нашр)</label>
   <p class="a-err" id="a_err" hidden></p>
   <label class="chk" for="a_cv" style="flex-wrap:wrap"><span class="pill" style="pointer-events:none">Муқова (расм)</span><span id="a_cvn" style="color:var(--muted);font-size:13px">${a.cover?"Ҳоло муқова ҳаст. Иваз кардан мумкин":"Расм интихоб кунед (JPG ё PNG, 2:3)"}</span></label>
   <input type="file" id="a_cv" accept="image/*" hidden>
   <button class="btn" data-admsave>Захира кардан</button>
   ${a.id?'<button class="btn-t" data-admdel style="color:#d33">Нест кардани китоб</button>':""}
  </div>`};return h};
