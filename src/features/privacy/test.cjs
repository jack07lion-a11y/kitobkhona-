// Розигӣ ва синну сол (сабти ном), нест кардани ҳисоб
module.exports=async t=>{
 const P=t.page;
 await t.open({view:'login',step:'gender',gender:''});
 await P.waitForTimeout(300);
 t.ok(await P.evaluate(()=>!!document.getElementById('cns')&&!!document.querySelector('[data-age=under18]')),'сабти ном: розигӣ ва синну сол ҳастанд');
 await P.fill('#uname','Санҷиш');
 await P.evaluate(()=>{sbLoad=async()=>({rpc:async(n,x)=>n==='claim_name'?{data:x.p_name,error:null}:{data:null,error:{message:'net'}},auth:{updateUser:async()=>({error:null})}})});
 // бе синну сол ва розигӣ — идома намедиҳад
 await P.click('[data-g=boy]');await P.waitForTimeout(150);
 t.eq(await P.evaluate(()=>[S.gender,S.view]),['','login'],'бе розигӣ идома надод');
 // хурдсол бе огоҳии волидон
 await P.click('[data-age=under18]');
 t.eq(await P.evaluate(()=>document.getElementById('grdrow').hidden),false,'«аз 18 хурд»: сатри огоҳии ота-она пайдо шуд');
 await P.check('#cns');await P.click('[data-g=boy]');await P.waitForTimeout(150);
 t.eq(await P.evaluate(()=>S.view),'login','хурдсол бе тасдиқи ота-она идома надод');
 // бо тасдиқ — идома медиҳад; сервер набошад ҳам розигӣ дар навбат мемонад
 await P.check('#grd');await P.click('[data-g=boy]');await P.waitForTimeout(800);
 const r=await P.evaluate(()=>({g:S.gender,v:S.view,p:S.consPend}));
 t.ok(r.g==='boy'&&r.v==='home'&&r.p&&r.p.age==='under18'&&r.p.g===true,'бо розигӣ ва тасдиқи ота-она идома дод; розигӣ барои фиристодан дар навбат');
 // калонсол: огоҳии волидон лозим нест
 await t.open({view:'login',step:'gender',gender:''});await P.waitForTimeout(300);
 await P.evaluate(()=>{sbLoad=async()=>({rpc:async(n,x)=>n==='claim_name'?{data:x.p_name,error:null}:{data:null,error:{message:'net'}},auth:{updateUser:async()=>({error:null})}})});
 await P.fill('#uname','Калон');await P.click('[data-age=adult]');await P.check('#cns');await P.click('[data-g=girl]');await P.waitForTimeout(800);
 t.eq(await P.evaluate(()=>[S.gender,S.consPend&&S.consPend.age]),['girl','adult'],'калонсол: бе огоҳии волидон идома дод');
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
