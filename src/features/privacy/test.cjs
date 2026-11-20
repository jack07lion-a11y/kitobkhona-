// Розигӣ ва синну сол (сабти ном), нест кардани ҳисоб
module.exports=async t=>{
 const P=t.page;
 // розигӣ: ойнаи хурд, ду аломат, худ захира мешавад (бе тугма)
 await t.open({view:'home',email:'a@b.c',uname:'Х'});
 await P.evaluate(()=>{S.uid='u1';S.consentV='';S.consPend=null;S.obFg=0;OB.shown={};OB.ret=false;S.sheet=null;
  window.__sc=[];sbLoad=async()=>({rpc:async(n,x)=>{window.__sc.push([n,x]);return{error:null}},auth:{}})});
 // 10 дақиқа нагузашт ва баромада баргашт нест — ойна нест
 await P.evaluate(()=>{S.obFg=60;obTick()});await P.waitForTimeout(300);
 t.eq(await P.evaluate(()=>!!document.getElementById('obm')),false,'1 дақиқа: ойнаи розигӣ ҳанӯз нест');
 // 10 дақиқа дар барнома → ойна
 await P.evaluate(()=>{S.obFg=OB_CONS_SEC;obTick()});await P.waitForTimeout(700);
 t.ok(await P.evaluate(()=>!!document.getElementById('ob1')&&!!document.getElementById('ob2')&&document.getElementById('obm').classList.contains('in')),'10 дақиқа: ойна бо ду аломат пайдо шуд');
 await P.click('label[for=ob1] i');await P.waitForTimeout(200);
 t.eq(await P.evaluate(()=>[!!document.getElementById('obm'),window.__sc.length]),[true,0],'як аломат: ҳанӯз захира нашуд');
 await P.click('label[for=ob2] i');await P.waitForTimeout(1500);
 const r=await P.evaluate(()=>({m:!!document.getElementById('obm'),v:S.consentV,c:window.__sc.filter(x=>x[0]==='save_consent').length}));
 t.ok(!r.m&&r.v==='2026-11'&&r.c===1,'ду аломат: захира шуд, ойна рафт (бе тугма)');
 // баромада баргашт: ойна пайдо мешавад
 await P.evaluate(()=>{S.consentV='';S.consPend=null;OB.shown={};OB.ret=false;S.obFg=5;document.dispatchEvent(new Event('visibilitychange'))});
 await P.evaluate(()=>obTick());await P.waitForTimeout(600);
 t.ok(await P.evaluate(()=>!!document.getElementById('ob1')),'баромада баргашт: розигӣ боз пайдо шуд');
 await P.evaluate(()=>{obClose()});await P.waitForTimeout(700);
 // ҷинс: баъди 30 сония
 await P.evaluate(()=>{S.gender=undefined;OB.shown={};S.consentV='2026-11';OB.fg=29;obTick()});await P.waitForTimeout(700);
 t.ok(await P.evaluate(()=>!!document.querySelector('[data-og=girl]')),'30 сония: интихоби ҷинс пайдо шуд');
 await P.evaluate(()=>{obClose()});await P.waitForTimeout(700);
 // ҳисобро нест кардан: сатр дар Танзимот (танҳо воридшуда)
 await t.open({view:'home'});
 await P.evaluate(()=>{S.uid='u1';S.sheet='app';render()});await P.waitForTimeout(250);
 t.ok(await P.evaluate(()=>!!document.querySelector('[data-sheet=delacc]')),'Танзимот: «Ҳисобро нест кардан» барои воридшуда');
 await P.evaluate(()=>{S.sheet='delacc';render()});await P.waitForTimeout(250);
 t.ok(await P.evaluate(()=>!!document.querySelector('[data-delacc-next="2"]')&&/баста мешавад/.test(document.querySelector('.sheet').innerText)&&/ХАТАРНОК/.test(document.querySelector('.sheet').innerText)),'варақи нест кардан (1): огоҳӣ «ХАТАРНОК» ва тугмаи «Давом додан»');
 // сервер ҷавоб надиҳад: ҳисоб нест намешавад, корбар воридшуда мемонад
 await P.evaluate(()=>{window.__rpc=[];sbLoad=async()=>({storage:{from:()=>({list:async()=>({data:[]}),remove:async()=>({})})},rpc:async n=>{window.__rpc.push(n);return{error:{message:'net'}}},auth:{signOut:async()=>{window.__so=1}}})});
 await P.evaluate(()=>deleteAccount());await P.waitForTimeout(300);
 t.eq(await P.evaluate(()=>[window.__rpc,S.uid,!!window.__so]),[['delete_me'],'u1',false],'хатои сервер: ҳисоб нест нашуд, корбар мебарояд не');
 // муваффақ: delete_me, баромадан, пок кардани маълумот
 await P.evaluate(()=>{S.prog={5:40};sbLoad=async()=>({storage:{from:()=>({list:async()=>({data:[{name:'a.webp'}]}),remove:async()=>({})})},rpc:async n=>{window.__rpc.push(n);return{error:null}},auth:{signOut:async()=>{window.__so=1}}})});
 await P.evaluate(()=>deleteAccount());await P.waitForTimeout(400);
 t.eq(await P.evaluate(()=>[S.uid,S.view,Object.keys(S.prog).length,!!window.__so,window.__rpc.slice(-1)[0],S.step]),['','login',0,true,'delete_me','deleted'],'нест шуд: баромад, «Ҳисоб баста шудааст», маълумоти маҳаллӣ пок');
 // 4 босқич ва ҳисобкунаки 45 сония
 await P.evaluate(()=>{S.uid='u1';S.sheet='delacc';render()});await P.waitForTimeout(200);
 await P.click('[data-delacc-next="2"]');await P.waitForTimeout(200);
 t.ok(await P.evaluate(()=>S.sheet==='delacc2'&&/ХАТАРНОК/.test(document.querySelector('.sheet').innerText)&&/Боз як бор/.test(document.querySelector('.sheet').innerText)&&!!document.querySelector('[data-delacc-next="3"]')),'босқичи 2: матни дигар ва боз «ХАТАРНОК»');
 await P.evaluate(()=>{window.__rpc2=[];sbLoad=async()=>({storage:{from:()=>({list:async()=>({data:[]}),remove:async()=>({})})},rpc:async n=>{window.__rpc2.push(n);return{error:null}},auth:{signOut:async()=>{}}})});
 await P.click('[data-delacc-next="3"]');await P.waitForTimeout(400);
 t.ok(await P.evaluate(()=>S.sheet==='delacc3'&&DF.on&&!!document.querySelector('[data-delacc-cancel]')&&document.querySelectorAll('.sheet button').length===1&&/45|44/.test(document.getElementById('delc').textContent)),'босқичи 3: ҳисобкунак 45, ФАҚАТ як тугма «Бекор кардан»');
 // экранро қулф кардан (hidden) → нест намешавад
 await P.evaluate(()=>{Object.defineProperty(document,'visibilityState',{configurable:true,get:()=>'hidden'});document.dispatchEvent(new Event('visibilitychange'))});await P.waitForTimeout(200);
 t.eq(await P.evaluate(()=>[DF.on,S.sheet,window.__rpc2.filter(x=>x==='delete_me').length]),[false,null,0],'қулф/баромад: ҳисобкунак бекор, нест НАШУД');
 await P.evaluate(()=>{delete document.visibilityState});
 // «Бекор кардан» тугмаи ягона
 await P.evaluate(()=>{S.sheet='delacc2';render()});await P.waitForTimeout(150);await P.click('[data-delacc-next="3"]');await P.waitForTimeout(300);
 await P.click('[data-delacc-cancel]');await P.waitForTimeout(250);
 t.eq(await P.evaluate(()=>[DF.on,S.sheet,window.__rpc2.filter(x=>x==='delete_me').length]),[false,null,0],'«Бекор кардан»: нест нашуд');
 // 45 сония гузашт ва экран равшан → нест мешавад
 await P.evaluate(()=>{S.sheet='delacc2';render()});await P.waitForTimeout(150);await P.click('[data-delacc-next="3"]');await P.waitForTimeout(300);
 await P.evaluate(()=>{DF.t0=Date.now()-44700});await P.waitForTimeout(1200);
 t.ok(await P.evaluate(()=>window.__rpc2.includes('delete_me')),'45 сония гузашт: ҳисоб худкор нест шуд (delete_me)');
 // админ ва ёрдамчӣ: нест карда наметавонанд, тугмаи нест кардан ва ҳисобкунак ишламайд
 for(const role of ['admin','subadmin']){
  await P.evaluate(r=>{S.uid='u1';S.role=r;S.sheet='delacc';window.__rpc3=[];sbLoad=async()=>({rpc:async n=>{window.__rpc3.push(n);return{error:null}},auth:{signOut:async()=>{}},storage:{from:()=>({list:async()=>({data:[]}),remove:async()=>({})})}});render()},role);await P.waitForTimeout(200);
  t.ok(await P.evaluate(()=>!document.querySelector('[data-delacc-next]')&&/ҳуқуқро надоред/.test(document.querySelector('.sheet').innerText)),role+': «ҳуқуқ надоред», тугмаи давом нест');
  await P.evaluate(()=>{S.sheet='delacc3';render()});await P.waitForTimeout(150);
  await P.evaluate(()=>deleteAccount());await P.waitForTimeout(200);
  t.eq(await P.evaluate(()=>[window.__rpc3.includes('delete_me'),DF.on,S.uid]),[false,false,'u1'],role+': delete_me ҳеч гоҳ даъват намешавад');
 }
 await P.evaluate(()=>{S.role='user';S.sheet=null});
};

// ҷинс интихоб нашавад: нишони бетараф; ҳар кушодани барнома боз мепурсад (бе «баъдтар»)
module.exports=(prev=>async t=>{
 await prev(t);
 const P=t.page;
 await t.open({view:'home',email:'a@b.c',uname:'Х'});
 await P.evaluate(()=>{S.uid='u1';S.gender=undefined;S.consentV='2026-11';S.sheet=null;OB.shown={};OB.fg=0;render()});await P.waitForTimeout(300);
 t.ok(await P.evaluate(()=>/^data:image\/svg\+xml/.test(art().match(/src="([^"]+)"/)[1])&&gi()===GNEUTRAL),'ҷинс нест: расм ва нишони менюи бетараф');
 await P.evaluate(()=>{OB.fg=29;obTick()});await P.waitForTimeout(700);
 t.ok(await P.evaluate(()=>!!document.querySelector('[data-og=boy]')&&!document.querySelector('[data-ogl]')),'30 сония: ойнаи ҷинс, «баъдтар» нест');
 await P.evaluate(()=>{obClose()});await P.waitForTimeout(700);
 // барнома аз нав кушода шуд (OB аз нав): боз 30 сония ва боз мепурсад
 await P.evaluate(()=>{OB.shown={};OB.fg=0;for(let i=0;i<29;i++)obTick()});
 t.eq(await P.evaluate(()=>!!document.getElementById('obm')),false,'29 сония: ҳанӯз нест');
 await P.evaluate(()=>obTick());await P.waitForTimeout(700);
 t.ok(await P.evaluate(()=>!!document.querySelector('[data-og=girl]')),'кушодани навбатӣ: баъди 30 сония боз пурсид');
 await P.click('[data-og=boy]');await P.waitForTimeout(900);
 await P.evaluate(()=>{OB.shown={};OB.fg=500;obTick()});await P.waitForTimeout(500);
 t.eq(await P.evaluate(()=>[S.gender,!!document.getElementById('obm')]),['boy',false],'интихоб шуд: дигар намепурсад');
})(module.exports);
