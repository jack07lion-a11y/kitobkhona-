module.exports=async t=>{
 await t.open({view:'me'});
 const vis=()=>t.page.evaluate(()=>{if(!document.querySelector('[data-sheet="admhub"]'))return[];S.sheet='admhub';render();const r=[...document.querySelectorAll('.adm-tile b')].map(b=>b.textContent);S.sheet=null;render();return r});
 await t.page.evaluate(()=>{S.role='admin';render()});
 t.ok((await vis()).includes('Ёрдамчиён')&&(await vis()).length===11,'админ ҳамаро мебинад (11 тугма)');
 await t.page.evaluate(()=>{S.role='subadmin';S.perms={maker:true,books:true,news:false};render()});
 const v=await vis();t.ok(v.includes('Сохтани китоб')&&!v.includes('Хабар')&&!v.includes('Ёрдамчиён'),'ёрдамчӣ танҳо иҷозатдодаро мебинад');
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
 await P.evaluate(()=>{S.role='admin';S.sheet='admfeat';render()});await P.waitForTimeout(200);
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

// Панели нав (торӣ): тугма → варақ → пӯшидан ба панел бармегардад
module.exports=(prev=>async t=>{
 await prev(t);
 const P=t.page;
 await t.open({view:'me'});
 await P.evaluate(()=>{S.role='admin';render()});
 await P.click('[data-sheet="admhub"]');await P.waitForTimeout(500);
 t.ok(await P.evaluate(()=>S.sheet==='admhub'&&document.querySelectorAll('.adm-tile').length>=9),'панел кушода шуд: тугмаҳои торӣ');
 await P.click('[data-adm-go="admstat"]');await P.waitForTimeout(500);
 t.eq(await P.evaluate(()=>S.sheet),'admstat','тугма варақи оморро кушод');
 await P.click('.sh-x');await P.waitForTimeout(700);
 t.eq(await P.evaluate(()=>S.sheet),'admhub','пӯшидан ба панел бармегардад (на ба «Ҳисоб»)');
 await P.click('.sh-x');await P.waitForTimeout(700);
 t.eq(await P.evaluate(()=>S.sheet),null,'аз худи панел пӯшидан — ба «Ҳисоб»');
 await P.evaluate(()=>{S.sheet='admmake';render()});await P.waitForTimeout(400);
 t.ok(await P.evaluate(()=>{const x=document.getElementById('app').innerText;return /Сохтани китоб/.test(x)&&!/ясаш|Ясаш|Ўрнатиш|воронка|Воронка/.test(x)}),'матнҳои ғайритоҷикӣ (ясаш, Ўрнатиш…) дар намуд нест');
})(module.exports);
