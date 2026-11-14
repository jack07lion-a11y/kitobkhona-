module.exports=async t=>{
 await t.open({view:'me'});
 const vis=()=>t.page.evaluate(()=>['Китоб ясаш','Китобҳо','Хатоҳо ва пешниҳодҳо','Хабар фиристодан','Огоҳиномаҳо','Навсозии APK','Ёрдамчиёни админ'].filter(x=>document.body.innerText.includes(x)));
 await t.page.evaluate(()=>{S.role='admin';render()});
 t.ok((await vis()).includes('Ёрдамчиёни админ'),'админ ҳамаро мебинад');
 await t.page.evaluate(()=>{S.role='subadmin';S.perms={maker:true,books:true,news:false};render()});
 const v=await vis();t.ok(v.includes('Китоб ясаш')&&!v.includes('Хабар фиристодан')&&!v.includes('Ёрдамчиёни админ'),'ёрдамчӣ танҳо иҷозатдодаро мебинад');
 await t.page.evaluate(()=>{S.role='user';S.perms={};render()});
 t.eq(await vis(),[],'корбари оддӣ ҳеҷ чизи админро намебинад');
};

// Ҳуқуқ дар формаи китоб: pending → нашр мумкин нест
module.exports=(prev=>async t=>{
 await prev(t);
 const P=t.page;
 await t.open({view:'me'});
 await P.evaluate(()=>{S.role='admin';S.adm={};S.sheet='adm';render()});await P.waitForTimeout(250);
 t.eq(await P.evaluate(()=>[document.getElementById('a_rs').value,document.getElementById('a_pub').disabled,document.getElementById('a_pub').checked]),['pending',false,false],'китоби нав: ҳуқуқ «pending», нашр хомӯш (аммо галочка фаъол: хатои равшан мебарад)');
 await P.selectOption('#a_rs','public_domain');
 t.eq(await P.evaluate(()=>document.getElementById('a_pub').disabled),false,'ҳолат аниқ шуд: нашр фаъол');
 await P.selectOption('#a_rs','pending');
 t.eq(await P.evaluate(()=>[document.getElementById('a_pub').disabled,document.getElementById('a_pub').checked]),[false,false],'боз pending: галочка хомӯш');
 // қоидаҳои санҷиш (ҳамон қоидаи сервер)
 const r=await P.evaluate(()=>[rightsCheck({rights_status:'pending'}),rightsCheck({rights_status:'public_domain',source:null}),rightsCheck({rights_status:'licensed',source:'С',rights_holder:null}),rightsCheck({rights_status:'licensed',source:'С',rights_holder:'Н'}),rightsCheck({rights_status:'public_domain',source:'С'})]);
 t.ok(r[0]&&r[1]&&r[2]&&r[3]===''&&r[4]==='','rightsCheck: pending, бе манба, licensed бе соҳиб — рад; дигарҳо — қабул');
 t.eq(await P.evaluate(()=>[rightsServerMsg('rights_pending')!=='',rightsServerMsg('source_required')!=='',rightsServerMsg('x')]),[true,true,''],'хабарҳои хатои сервер ба тоҷикӣ');
 // «Китоб ясаш» ҳам майдонҳоро дорад
 await P.evaluate(()=>{S.perms={maker:true,books:true};S.sheet='admmake';render()});await P.waitForTimeout(400);
 t.ok(await P.evaluate(()=>!!document.getElementById('mk_rs')&&!!document.getElementById('mk_sr')&&!!document.getElementById('mk_rh')),'«Китоб ясаш»: майдонҳои ҳуқуқ ҳастанд');
 // байроқҳо: тугмаҳо барои админ
 await P.evaluate(()=>{S.sheet=null;S.view='me';render()});
 t.eq(await P.evaluate(()=>document.querySelectorAll('[data-feat]').length),9,'панели админ: тугмаи ҳар бахши «Ба зудӣ»');
})(module.exports);

// китоби пинҳон: галочкаи «нашр» бе ҳуқуқ — хатои инлайн; бо ҳуқуқ — мемонад
module.exports=(prev=>async t=>{
 await prev(t);
 const P=t.page;
 await t.open({view:'me'});
 await P.evaluate(()=>{S.role='admin';S.view='me';BOOKS.push({id:501,t:'Санҷиш',a:'Муаллиф',c:'fiction',col:['#2d6a8f','#143a57'],db:true,pub:false,rs:'pending'});S.adm={id:501,t:'Санҷиш',a:'Муаллиф',c:'fiction',col:['#2d6a8f','#143a57'],pub:false,rs:'pending'};S.sheet='adm';render()});
 await P.waitForSelector('#a_pub');
 t.eq(await P.evaluate(()=>[document.getElementById('a_pub').disabled,document.getElementById('a_pub').checked]),[false,false],'галочка фаъол, аввал хомӯш');
 await P.click('#a_pub');await P.waitForTimeout(300);
 t.ok(await P.evaluate(()=>!document.getElementById('a_pub').checked&&!document.getElementById('a_err').hidden&&/ҳуқуқ/i.test(document.getElementById('a_err').textContent)&&document.getElementById('a_rs').classList.contains('a-bad')),'ҳуқуқ пур нест → хато дар худи варақ ва майдон ранг мешавад');
 await P.selectOption('#a_rs','public_domain');await P.fill('#a_sr','Нашри соли 1960');
 await P.click('#a_pub');await P.waitForTimeout(200);
 t.ok(await P.evaluate(()=>document.getElementById('a_pub').checked&&document.getElementById('a_err').hidden),'ҳуқуқ ва манба пур → галочка мемонад');
})(module.exports);
