// Рейтинг: тугмаи боло (ҷои корбар, ҳеҷ гоҳ 0), саҳифаи Top 10, профили китобхон, доираи Озмун, танзимот, нест кардан ва тиклаш
module.exports=async t=>{
 const P=t.page;
 const mk=n=>Array.from({length:n},(_,i)=>({pos:i+1,name:'Хонанда '+(i+1),avatar:i===1?'av:3':'',bio:i===0?'Ман <b>китоб</b> дӯст медорам':'',sec:(n-i)*3600+90}));
 await t.open({view:'home'});
 // ===== 1) тугмаи боло: «F» нест, рейтинг ҳаст =====
 t.eq(await P.evaluate(()=>[!!document.querySelector('.fbtn'),document.querySelectorAll('.top .rbadge').length]),[false,1],'боло: тугмаи «F» нест, тугмаи рейтинг ҳаст');
 t.ok(await P.evaluate(()=>!document.querySelector('.rbadge b')&&!!document.querySelector('.rbadge .rb-i')),'ҷой набошад — ҷоми ғолибӣ, на рақам');
 for(const [pos,cls] of [[8,''],[1,'g'],[2,'s'],[3,'b'],[117,''],[0,''],[null,'']]){
  const r=await P.evaluate(p=>{S.myRank={pos:p,sec:100,n:200};paintBadge();const e=document.querySelector('.rbadge');return{txt:e.innerText.trim(),g:e.classList.contains('g'),s:e.classList.contains('s'),b:e.classList.contains('b'),ico:!!e.querySelector('.rb-i')}},pos);
  const want=pos?String(pos):'';
  t.ok(r.txt===want&&(pos?!r.ico:r.ico)&&r.g===(cls==='g')&&r.s===(cls==='s')&&r.b===(cls==='b'),'тугма: ҷои '+pos+(cls?' ('+{g:'тилло',s:'нуқра',b:'биринҷӣ'}[cls]+')':'')+(pos?'':' — рақами 0 нест'));
 }
 // ===== 2) саҳифаи рейтинг: 10 сатр, 1-2-3 ранг, XSS нест =====
 await P.evaluate(list=>{S.uid='u1';S.myRank={pos:27,sec:5400,n:130};window.__rpc=[];
  sbLoad=async()=>({rpc:async(n,a)=>{window.__rpc.push([n,a]);if(n==='leaderboard')return{data:list.slice(0,a.p_limit),error:null};if(n==='my_rank')return{data:{pos:27,sec:5400,n:130},error:null};return{data:null,error:null}}})},mk(12));
 await P.click('.rbadge');await P.waitForSelector('.rt-row');
 t.eq(await P.evaluate(()=>[S.view,document.querySelectorAll('.rt-row').length,window.__rpc.some(x=>x[0]==='leaderboard'&&x[1].p_limit===10)]),['rating',10,true],'рейтинг: саҳифа кушода, аниқ 10 сатр (Top 10)');
 t.eq(await P.evaluate(()=>[...document.querySelectorAll('.rt-row')].slice(0,4).map(r=>r.className.replace('rt-row','').trim())),['m1','m2','m3',''],'1-2-3: тилло, нуқра, биринҷӣ; боқӣ оддӣ');
 t.eq(await P.evaluate(()=>document.querySelector('.rt-row .rt-nm small').textContent),await P.evaluate(()=>fmtNum(Math.floor((12*3600+90)/60))+' дақ'),'дақиқа дуруст ҳисоб шуд (3600·12+90 сония)');
 t.ok(await P.evaluate(()=>document.querySelector('.rt-row').innerText.includes('Хонанда 1')),'сатр: ном ҳаст');
 t.ok(await P.evaluate(()=>/Ҷои шумо/.test(document.querySelector('.rt-me').innerText)&&/27/.test(document.querySelector('.rt-me').innerText)),'«Ҷои шумо» дар поён: 27');
 t.ok(await P.evaluate(()=>document.getElementById('app').innerText.length>50&&!document.querySelector('.tb:not([hidden])')),'саҳифаи рейтинг: менюи поён пинҳон');
 // ===== 3) профили китобхон (варақа) =====
 await P.click('.rt-row');await P.waitForSelector('.ru');
 const ru=await P.evaluate(()=>({n:document.querySelector('.ru h2').textContent,b:document.querySelector('.ru-bio').innerText,pos:document.querySelector('.ru-pos').innerText,html:document.querySelector('.ru-bio').innerHTML,st:document.querySelector('.ru-st').innerText}));
 t.ok(ru.n==='Хонанда 1'&&ru.pos.includes('Ҷои 1')&&ru.b.includes('<b>китоб</b>')&&!/<b>/.test(ru.html.replace(/&lt;b&gt;/g,'')),'варақа: ном, ҷой, маълумот; HTML-и ёзилган матн иҷро намешавад (XSS нест)');
 t.ok(/дақиқа/.test(ru.st)&&/соат/.test(ru.st),'варақа: дақиқа ва соат');
 await P.evaluate(()=>{closeSheet()});await P.waitForTimeout(150);
 // ===== 4) ҳолатҳо: пинҳон, ҳоло рейтинг нест, меҳмон, хатои шабака =====
 await P.evaluate(()=>{S.myRank={hidden:true,sec:600};render()});
 t.ok(await P.evaluate(()=>/нишон дода намешавед/.test(document.querySelector('.rt-me').innerText)&&!!document.querySelector('.rt-me [data-rt-vis]')),'пинҳон: огоҳӣ ва тугмаи «Нишон додан»');
 await P.evaluate(()=>{S.myRank={pos:null,sec:0,n:5};render()});
 t.ok(await P.evaluate(()=>/ҳоло дар рейтинг нестед/.test(document.querySelector('.rt-me').innerText)),'ҳоло рейтинг нест: «Хондан» (на «0»)');
 await P.evaluate(()=>{S.uid='';S.rt=null;S.rtCache=null;render()});
 t.ok(await P.evaluate(()=>/Барои дидани рейтинг ворид шавед/.test(document.getElementById('app').innerText)&&!!document.querySelector('[data-go=login]')),'меҳмон: «ворид шавед»');
 await P.evaluate(()=>{S.uid='u1';sbLoad=async()=>({rpc:async()=>({data:null,error:{message:'x'}})});S.rt=null;S.rtCache=null;loadRating(true)});await P.waitForTimeout(300);
 t.ok(await P.evaluate(()=>!!document.querySelector('[data-rt-retry]')),'хато: тугмаи «Аз нав»');
 await P.evaluate(()=>{S.rtCache=[{pos:1,name:'Кэш',avatar:'',bio:'',sec:120}];S.rt=null;loadRating(true)});await P.waitForTimeout(300);
 t.ok(await P.evaluate(()=>/Кэш/.test(document.querySelector('.rt-list').innerText)&&/Интернет нест/.test(document.getElementById('app').innerText)),'офлайн: рӯйхати охирин ва ёддошт');
 // бозгашт
 await P.click('[data-back]');await P.waitForTimeout(400);
 t.eq(await P.evaluate(()=>S.view),'home','тугмаи бозгашт: ба саҳифаи пештара');
 // ===== 5) Озмун: доираи «Рейтинг» дар марказ, устма-уст нест =====
 await P.evaluate(()=>{S.myRank={pos:5,sec:60,n:9};go('goal')});await P.waitForTimeout(300);
 await P.evaluate(()=>cxShow('goal'));await P.waitForTimeout(900);
 const g=await P.evaluate(()=>[...document.querySelectorAll('#cx .cx-b')].map(b=>{const r=b.getBoundingClientRect();return{k:b.dataset.cx,x:r.left+r.width/2,y:r.top+r.height/2,w:r.width}}));
 t.eq(g.map(x=>x.k),['goal','ifm','furug','bahs','rating'],'Озмун: 5 доира, рейтинг охирин');
 let overlap=false;for(let i=0;i<g.length;i++)for(let j=i+1;j<g.length;j++){const d=Math.hypot(g[i].x-g[j].x,g[i].y-g[j].y);if(d<(g[i].w+g[j].w)/2+2)overlap=true}
 t.ok(!overlap,'доираҳо ба ҳам намеафтанд ва устма-уст нестанд');
 const rt=g.find(x=>x.k==='rating'),ifm=g.find(x=>x.k==='ifm'),fu=g.find(x=>x.k==='furug');
 t.ok(Math.abs(rt.x-(ifm.x+fu.x)/2)<3&&rt.y>ifm.y,'рейтинг дар МАРКАЗ: байни ИФМ ва Фурӯғ, поёнтар');
 const W=await P.evaluate(()=>innerWidth);t.ok(g.every(x=>x.x-x.w/2>=0&&x.x+x.w/2<=W),'ҳама доира дар доираи экран');
 await P.evaluate(()=>cxPick('rating'));await P.waitForTimeout(400);
 t.eq(await P.evaluate(()=>S.view),'rating','доираи Озмун → рейтинг кушода шуд');
 // ===== 6) танзимот: рейтинг-калид ва «Бунёдгузорон» (ҷойи муваққатӣ) =====
 await P.evaluate(()=>{S.view='home';S.uid='u1';S.myRank={pos:3,sec:60,n:9};S.sheet='app';render()});await P.waitForTimeout(250);
 const st=await P.evaluate(()=>document.querySelector('.sheet').innerText);
 t.ok(/Дар рейтинг нишон дода шавам/.test(st)&&/Бунёдгузорон/.test(st),'танзимот: «Дар рейтинг нишон дода шавам» ва «Бунёдгузорон»');
 await P.click('[data-sheet=founders]');await P.waitForTimeout(250);
 t.ok(await P.evaluate(()=>S.sheet==='founders'&&/Ҷасурбек/.test(document.querySelector('.sheet').innerText)),'«Бунёдгузорон» аз танзимот кушода мешавад (ҷойи нав баъд муайян мешавад)');
 await P.evaluate(()=>{window.__c=[];sbLoad=async()=>({rpc:async(n,a)=>{window.__c.push([n,a]);return{data:n==='my_rank'?{hidden:true,sec:60,n:9}:null,error:null}}});S.sheet='app';render()});
 await P.click('[data-rt-vis]');await P.waitForTimeout(300);
 t.ok(await P.evaluate(()=>window.__c.some(x=>x[0]==='set_rating_visible'&&x[1].p_show===false)),'калид: set_rating_visible(false) — пинҳон кард');
 // ===== 7) нест кардан: ҳисоб баста, ба «Ҳисоб баста шудааст» меояд =====
 const so=await P.evaluate(async()=>{
  S.uid='u1';S.prog={5:40};S.sheet=null;window.__r=[];
  sbLoad=async()=>({rpc:async n=>{window.__r.push(n);return{error:null}},auth:{signOut:async()=>{window.__o=1}},storage:{from:()=>({list:async()=>{window.__stor=1;return{data:[]}},remove:async()=>({})})}});
  await deleteAccount();return{r:window.__r,view:S.view,step:S.step,uid:S.uid,stor:!!window.__stor,txt:document.getElementById('app').innerText}});
 t.ok(so.r.includes('delete_me')&&so.view==='login'&&so.step==='deleted'&&so.uid===''&&!so.stor,'нест кардан: delete_me, баромад; аватар файлҳо НЕ нест мешаванд (тиклаш учун)');
 t.ok(/Ҳисоб баста шудааст/.test(so.txt)&&/30 рӯз/.test(so.txt)&&!!await P.evaluate(()=>document.querySelector('[data-ext*="t.me/kitobkhona_official"]')),'экран: «Ҳисоб баста шудааст», 30 рӯз, пайванди Телеграм');
 // вуруди банӣ (Supabase: User is banned) → ҳамон экран
 const bn=await P.evaluate(async()=>{sbLoad=async()=>({auth:{signInWithOtp:async()=>({error:{message:'User is banned',code:'user_banned'}})}});return await sbSend('a@b.co')});
 t.eq(bn,'BANNED','вуруд: Supabase «banned» → ҳисоби нестшуда');
 // ===== 8) админ: нестшудагон — рӯйхат ва тиклаш =====
 await P.evaluate(()=>{S.role='admin';S.step='email';S.view='me';S.sheet='admdel';window.__a=[];window.confirm=()=>true;
  sbLoad=async()=>({rpc:async(n,a)=>{window.__a.push([n,a]);if(n==='deleted_list')return{data:[{id:'11111111-1111-4111-8111-111111111111',name:'Ном <i>X</i>',email:'a@b.co',deleted_at:new Date(Date.now()-5*864e5).toISOString()}],error:null};if(n==='restore_account')return{data:'ok',error:null};if(n==='purge_deleted')return{data:2,error:null};return{data:null,error:null}}});render()});
 await P.waitForSelector('[data-del-restore]');
 t.ok(await P.evaluate(()=>/25 рӯз монд/.test(document.querySelector('.sheet').innerText)&&!document.querySelector('.sheet i')),'нестшудагон: рӯйхат, «25 рӯз монд», HTML ёзилган матн иҷро намешавад');
 await P.click('[data-del-restore]');await P.waitForTimeout(300);
 t.ok(await P.evaluate(()=>window.__a.some(x=>x[0]==='restore_account'&&x[1].p_id==='11111111-1111-4111-8111-111111111111')),'«Тиклаш» → restore_account бо id-и дуруст');
 await P.click('[data-del-purge]');await P.waitForTimeout(300);
 t.ok(await P.evaluate(()=>window.__a.some(x=>x[0]==='purge_deleted'&&x[1].p_days===30)),'«Тоза кардан» → purge_deleted(30)');
 await P.evaluate(()=>{S.role='subadmin';S.sheet=null;S.view='me';render()});
 t.eq(await P.evaluate(()=>/Ҳисобҳои нест шуда/.test(document.getElementById('app').innerText)),false,'ёрдамчӣ (subadmin) тиклаш панелини намебинад: танҳо админ');
};
