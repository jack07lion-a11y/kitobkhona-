// Премиум: гейтинг (сервер ҳал мекунад, клиент намоиш медиҳад), демо-тугма нест, байроқҳои «Ба зудӣ»
module.exports=async t=>{
 const P=t.page,fut=Date.now()+30*864e5,past=Date.now()-864e5;
 // 1) Премиум фурӯзон, корбар муштарак нест: китоби премиум баста
 await t.open({view:'home',flags:{premium:true,feat:{}}});
 await P.evaluate(()=>{BOOKS.push({id:801,t:'Пулакӣ',a:'А',c:'fiction',col:['#0b7d57','#063'],prem:true,db:true,tp:'x/book.json.gz',slug:'x'},{id:802,t:'Ройгон',a:'Б',c:'fiction',col:['#0b7d57','#063'],prem:false,db:true,tp:'y/book.json.gz',slug:'y'})});
 t.eq(await P.evaluate(()=>[locked(bk(801)),locked(bk(802))]),[true,false],'муштарак нест: премиум баста, ройгон кушода');
 // кушодани китоби баста → варақи обуна, бе дархости шабака
 let net=0;await P.route(/supabase\.co/,r=>{net++;r.abort()});
 await P.evaluate(()=>openBook(801));await P.waitForTimeout(300);
 t.eq(await P.evaluate(()=>[S.sheet,S.view]),['pay','home'],'китоби премиум: варақи обуна, китоб кушода нашуд');
 t.eq(net,0,'китоби премиум: ба сервер матн дархост нашуд');
 // нарх ва тугмаи демо нест
 const pay=await P.evaluate(()=>document.querySelector('.pay')?.innerText||'');
 t.ok(!/20 сомонӣ/.test(pay)&&/Ба зудӣ/.test(pay),'варақи обуна: нархи намуна нест, «Ба зудӣ» ҳаст');
 await P.evaluate(()=>{const b=document.querySelector('[data-subscribe]');if(b)b.disabled=false;b&&b.click()});
 t.eq(await P.evaluate(()=>S.premium),false,'тугмаи обуна Премиумро маҳаллӣ фаъол намекунад');
 // 2) муштараки амалкунанда
 await t.open({view:'home',flags:{premium:true,feat:{}}});
 await P.evaluate(()=>{BOOKS.push({id:801,t:'Пулакӣ',a:'А',c:'fiction',col:['#0b7d57','#063'],prem:true})});
 // loadPremium бо клиенти қалбакӣ: сервер premium_until-ро медиҳад
 const lp=await P.evaluate(async f=>{S.uid='u1';const mk=(d,e)=>({from:()=>({select:()=>({eq:()=>({maybeSingle:async()=>({data:d,error:e})})})})});
  await loadPremium(mk({premium_until:new Date(f).toISOString()},null));const a=[S.premium,locked(bk(801))];
  await loadPremium(mk(null,{message:'net'}));const b=[S.premium];   // хато (интернет нест) → қимати пештара мемонад
  await loadPremium(mk(null,null));const c=[S.premium,locked(bk(801))]; // сатр нест/муддат нест → премиум нест
  return{a,b,c}},fut);
 t.eq(lp.a,[true,false],'premium_until дар оянда: китоб кушода');
 t.eq(lp.b,[true],'хатои шабака: муштаракӣ гум намешавад (офлайн)');
 t.eq(lp.c,[false,true],'premium_until нест: китоб баста');
 // 3) муддат тамом шуд
 await t.open({view:'home',flags:{premium:true,feat:{}},pu:past,premium:true});
 await P.evaluate(()=>{S.premium=!!(S.pu&&S.pu>Date.now());BOOKS.push({id:801,t:'Пулакӣ',a:'А',c:'fiction',col:['#0b7d57','#063'],prem:true})});
 t.eq(await P.evaluate(()=>[S.premium,locked(bk(801))]),[false,true],'муддат тамом шуд: пеш маълумоти маҳаллии «premium:true» назар гирифта намешавад');
 // 4) Премиум хомӯш: ҳама ройгон
 await t.open({view:'home',flags:{premium:false,feat:{}}});
 await P.evaluate(()=>{BOOKS.push({id:801,t:'Пулакӣ',a:'А',c:'fiction',col:['#0b7d57','#063'],prem:true})});
 t.eq(await P.evaluate(()=>locked(bk(801))),false,'premium_on хомӯш: ҳама ройгон');
 // 5) админ бо ҳуқуқи «books» баста намебинад
 await t.open({view:'home',flags:{premium:true,feat:{}}});
 await P.evaluate(()=>{S.role='admin';BOOKS.push({id:801,t:'Пулакӣ',a:'А',c:'fiction',col:['#0b7d57','#063'],prem:true})});
 t.eq(await P.evaluate(()=>locked(bk(801))),false,'админ: китоб баста нест');
 // 6) байроқҳои «Ба зудӣ»: аудио
 await t.open({view:'home',flags:{premium:false,feat:{}}});
 await P.evaluate(()=>{BOOKS.push({id:803,t:'Аудио',a:'В',c:'fiction',col:['#0b7d57','#063'],audio:true});BOOKS.forEach(mkAud);render()});
 t.eq(await P.evaluate(()=>[bk(803).audio,chipList().some(c=>c[0]==='audio'),document.body.innerText.includes('Аудио дар роҳ')]),[false,false,false],'аудио хомӯш: плеер, чип ва бахш пинҳон');
 await t.open({view:'home',flags:{premium:false,feat:{audio:true}}});
 await P.evaluate(()=>{BOOKS.push({id:803,t:'Аудио',a:'В',c:'fiction',col:['#0b7d57','#063'],audio:true});BOOKS.forEach(mkAud);render()});
 t.eq(await P.evaluate(()=>[bk(803).audio,chipList().some(c=>c[0]==='audio')]),[true,true],'аудио фурӯзон: намоён');
 // 7) танга ва мақом: «Ба зудӣ», на «0»
 await t.open({view:'goal',flags:{premium:false,feat:{}}});
 const g=await P.evaluate(()=>document.getElementById('app').innerText);
 t.ok(/Ба зудӣ/.test(g)&&!/Мақоми шумо/.test(g)&&!/мукофот/.test(g),'Озмун: «Мақоми шумо», танга-0 ва «мукофот» нест');
 await t.open({view:'me',flags:{premium:false,feat:{}}});
 t.ok(await P.evaluate(()=>!/Рейтинги Озмун\s*0/.test(document.getElementById('app').innerText)&&/Ба зудӣ/.test(document.getElementById('app').innerText)),'Профил: рейтинг ва танга «Ба зудӣ»');
 // 8) доираҳои Озмун: «Ба зудӣ»
 await t.open({view:'goal',flags:{premium:false,feat:{}}});
 await P.evaluate(()=>cxPick('ifm'));await P.waitForTimeout(200);
 t.ok(await P.evaluate(()=>/Ба зудӣ/.test(document.getElementById('toast').textContent)),'ИФМ: «Ба зудӣ кушода мешавад»');
};
