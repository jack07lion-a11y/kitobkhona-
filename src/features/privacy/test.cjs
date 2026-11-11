// Розигӣ ва синну сол (сабти ном), нест кардани ҳисоб
module.exports=async t=>{
 const P=t.page;
 await t.open({view:'login',step:'gender',gender:''});
 await P.waitForTimeout(300);
 t.ok(await P.evaluate(()=>!!document.getElementById('cns')&&!!document.querySelector('[data-age=under18]')),'сабти ном: розигӣ ва синну сол ҳастанд');
 await P.fill('#uname','Санҷиш');
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
 await P.fill('#uname','Калон');await P.click('[data-age=adult]');await P.check('#cns');await P.click('[data-g=girl]');await P.waitForTimeout(800);
 t.eq(await P.evaluate(()=>[S.gender,S.consPend&&S.consPend.age]),['girl','adult'],'калонсол: бе огоҳии волидон идома дод');
 // ҳисобро нест кардан: сатр дар Танзимот (танҳо воридшуда)
 await t.open({view:'home'});
 await P.evaluate(()=>{S.uid='u1';S.sheet='app';render()});await P.waitForTimeout(250);
 t.ok(await P.evaluate(()=>!!document.querySelector('[data-sheet=delacc]')),'Танзимот: «Ҳисобро нест кардан» барои воридшуда');
 await P.evaluate(()=>{S.sheet='delacc';render()});await P.waitForTimeout(250);
 t.ok(await P.evaluate(()=>!!document.querySelector('[data-delacc-go]')&&/баста мешавад/.test(document.querySelector('.sheet').innerText)),'варақи нест кардан: огоҳӣ ва тугма');
 // сервер ҷавоб надиҳад: ҳисоб нест намешавад, корбар воридшуда мемонад
 await P.evaluate(()=>{window.__rpc=[];sbLoad=async()=>({storage:{from:()=>({list:async()=>({data:[]}),remove:async()=>({})})},rpc:async n=>{window.__rpc.push(n);return{error:{message:'net'}}},auth:{signOut:async()=>{window.__so=1}}})});
 await P.evaluate(()=>deleteAccount());await P.waitForTimeout(300);
 t.eq(await P.evaluate(()=>[window.__rpc,S.uid,!!window.__so]),[['delete_me'],'u1',false],'хатои сервер: ҳисоб нест нашуд, корбар мебарояд не');
 // муваффақ: delete_me, баромадан, пок кардани маълумот
 await P.evaluate(()=>{S.prog={5:40};sbLoad=async()=>({storage:{from:()=>({list:async()=>({data:[{name:'a.webp'}]}),remove:async()=>({})})},rpc:async n=>{window.__rpc.push(n);return{error:null}},auth:{signOut:async()=>{window.__so=1}}})});
 await P.evaluate(()=>deleteAccount());await P.waitForTimeout(400);
 t.eq(await P.evaluate(()=>[S.uid,S.view,Object.keys(S.prog).length,!!window.__so,window.__rpc.slice(-1)[0],S.step]),['','login',0,true,'delete_me','deleted'],'нест шуд: баромад, «Ҳисоб баста шудааст», маълумоти маҳаллӣ пок');
};
