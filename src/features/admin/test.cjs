module.exports=async t=>{
 await t.open({view:'me'});
 const vis=()=>t.page.evaluate(()=>{if(!document.querySelector('[data-sheet="admhub"]'))return[];S.sheet='admhub';render();const r=[...document.querySelectorAll('.adm-tile b')].map(b=>b.textContent);S.sheet=null;render();return r});
 await t.page.evaluate(()=>{S.role='admin';render()});
 t.ok((await vis()).includes('Ёрдамчиён')&&(await vis()).length===11,'админ ҳамаро мебинад (11 тугма)');
 await t.page.evaluate(()=>{S.role='subadmin';S.perms={maker:true,books:true,news:false};render()});
 const v=await vis();t.ok(v.includes('Омода кардани китоб')&&!v.includes('Хабар')&&!v.includes('Ёрдамчиён'),'ёрдамчӣ танҳо иҷозатдодаро мебинад');
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
 t.ok(r[0]&&r[1]&&r[2]&&r[3]===''&&r[4]==='','rightsCheck: pending, бе манба, licensed бе соҳиб — огоҳӣ (на рад); дигарҳо — холӣ');
 t.eq(await P.evaluate(()=>[rightsServerMsg('rights_pending')!=='',rightsServerMsg('source_required')!=='',rightsServerMsg('x')]),[true,true,''],'хабарҳои хатои сервер ба тоҷикӣ');
 // «Китоб ясаш» ҳам майдонҳоро дорад
 await P.evaluate(()=>{S.perms={maker:true,books:true};S.sheet='admmake';render()});await P.waitForTimeout(400);
 t.ok(await P.evaluate(()=>!!document.getElementById('mk_rs')&&!!document.getElementById('mk_sr')&&!!document.getElementById('mk_rh')),'«Китоб ясаш»: майдонҳои ҳуқуқ ҳастанд');
 // байроқҳо: тугмаҳо барои админ
 await P.evaluate(()=>{S.sheet=null;S.view='me';render()});
 await P.evaluate(()=>{S.role='admin';S.sheet='admfeat';render()});await P.waitForTimeout(200);
 t.eq(await P.evaluate(()=>document.querySelectorAll('[data-feat]').length),9,'панели админ: тугмаи ҳар бахши «Ба зудӣ»');
})(module.exports);

// китоби пинҳон: галочкаи «нашр» бе ҳуқуқ — як маротиба «Тасдиқ» (ойна), баъд нашр мешавад
module.exports=(prev=>async t=>{
 await prev(t);
 const P=t.page;
 await t.open({view:'me'});
 await P.evaluate(()=>{S.role='admin';S.view='me';BOOKS.push({id:501,t:'Санҷиш',a:'Муаллиф',c:'fiction',col:['#2d6a8f','#143a57'],db:true,pub:false,rs:'pending'});S.adm={id:501,t:'Санҷиш',a:'Муаллиф',c:'fiction',col:['#2d6a8f','#143a57'],pub:false,rs:'pending'};S.sheet='adm';render()});
 await P.waitForSelector('#a_pub');
 // рад кардан: галочка хомӯш мешавад
 await P.evaluate(()=>{window.__cf=[];window.confirm=m=>{window.__cf.push(m);return false}});
 await P.click('#a_pub');await P.waitForTimeout(250);
 t.ok(await P.evaluate(()=>!document.getElementById('a_pub').checked&&window.__cf.length===1&&/ҳуқуқ/i.test(window.__cf[0])&&/Нашр кунем/.test(window.__cf[0])),'нашр бе ҳуқуқ: ойнаи «Тасдиқ» (Нашр кунем?), рад → галочка хомӯш');
 // тасдиқ кардан: галочка мемонад, дубора напурсад
 await P.evaluate(()=>{window.__cf=[];window.confirm=m=>{window.__cf.push(m);return true}});
 await P.click('#a_pub');await P.waitForTimeout(250);
 t.ok(await P.evaluate(()=>document.getElementById('a_pub').checked&&!document.getElementById('a_err').textContent&&window.__cf.length===1),'тасдиқ: галочка мемонад, хато нест');
 // захира кардан: фиристода мешавад (нашр бо pending); дубора ойна НЕ
 await P.evaluate(()=>{window.__rows=[];window.__cf=[];sbLoad=async()=>({from:()=>({update:r=>{window.__rows.push(r);return{eq:async()=>({error:null})}},insert:r=>{window.__rows.push(r);return{select:()=>({single:async()=>({data:{id:1,slug:'x'},error:null})})}}}),storage:{from:()=>({upload:async()=>({error:null}),getPublicUrl:()=>({data:{publicUrl:''}})})},rpc:async()=>({data:null,error:null})})});
 await P.click('[data-admsave]');await P.waitForTimeout(500);
 t.ok(await P.evaluate(()=>window.__rows.some(r=>r.published===true&&r.rights_status==='pending')&&window.__cf.length===0),'захира: нашр бо ҳолати pending фиристода шуд, ойна дубора набуд');
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
 t.ok(await P.evaluate(()=>{const x=document.getElementById('app').innerText;return /Омода кардани китоб/.test(x)&&!/ясаш|Ясаш|Ўрнатиш|воронка|Воронка/.test(x)}),'матнҳои ғайритоҷикӣ (ясаш, Ўрнатиш…) дар намуд нест');
 // ёрдамчӣ доимӣ / нав: нишон ва бардоштан
 const PP=t.page;
 await PP.evaluate(()=>{S.role='admin';S.view='me';S.step='email';S.staff=[{email:'old@x.co',name:'Доимӣ',role:'subadmin',perms:{},since:null,permanent:true},{email:'new@x.co',name:'Навакак',role:'subadmin',perms:{},since:new Date().toISOString(),permanent:false}];
  window.__rp=[];window.confirm=()=>true;sbLoad=async()=>({rpc:async(n,a)=>{window.__rp.push([n,a&&a.p_email,a&&a.p_role]);if(n==='staff_list')return{data:S.staff,error:null};return{data:n==='set_role'?'ok':'ok',error:null}}});S.sheet='admstaff';render()});
 await PP.waitForTimeout(250);
 t.ok(await PP.evaluate(()=>document.querySelectorAll('.sbd.perm').length===1&&document.querySelectorAll('.sbd.beta').length===1),'нишон: доимӣ — квадрати сабз, нав — «Бета»');
 // НАВ: як тасдиқ, фавран set_role
 await PP.click('[data-sa-del="new@x.co"]');await PP.waitForTimeout(250);
 t.ok(await PP.evaluate(()=>window.__rp.some(x=>x[0]==='set_role'&&x[1]==='new@x.co'&&x[2]==='user')&&!/sadel/.test(S.sheet||'')),'нав ёрдамчӣ: як тасдиқ ва бардошта шуд');
 // ДОИМӢ: 3 ойна, ҳисобкунак 60, фақат як тугма; фавран set_role НЕ
 await PP.evaluate(()=>{window.__rp=[];S.sheet='admstaff';render()});await PP.waitForTimeout(150);
 await PP.click('[data-sa-del="old@x.co"]');await PP.waitForTimeout(200);
 t.ok(await PP.evaluate(()=>S.sheet==='sadel1'&&/ХАТАРНОК/.test(document.querySelector('.sheet').innerText)),'доимӣ: ойнаи 1 («ХАТАРНОК»)');
 await PP.click('[data-sd-next="2"]');await PP.waitForTimeout(150);
 t.ok(await PP.evaluate(()=>S.sheet==='sadel2'&&/Боз як бор/.test(document.querySelector('.sheet').innerText)),'доимӣ: ойнаи 2 (матни дигар)');
 await PP.click('[data-sd-next="3"]');await PP.waitForTimeout(400);
 t.ok(await PP.evaluate(()=>S.sheet==='sadel3'&&SD.on&&document.querySelectorAll('.sheet button').length===1&&!!document.querySelector('[data-sd-cancel]')&&window.__rp.some(x=>x[0]==='request_staff_removal')&&!window.__rp.some(x=>x[0]==='set_role')),'доимӣ: ойнаи 3, ҳисобкунак, ФАҚАТ «Бекор кардан», request_staff_removal, set_role НЕ');
 // қулф → бекор + cancel_staff_removal
 await PP.evaluate(()=>{Object.defineProperty(document,'visibilityState',{configurable:true,get:()=>'hidden'});document.dispatchEvent(new Event('visibilitychange'))});await PP.waitForTimeout(250);
 t.ok(await PP.evaluate(()=>!SD.on&&window.__rp.some(x=>x[0]==='cancel_staff_removal')&&!window.__rp.some(x=>x[0]==='set_role')),'қулф: бекор, cancel_staff_removal, набардошт');
 await PP.evaluate(()=>{delete document.visibilityState});
 // 60 сония гузашт → set_role
 await PP.evaluate(()=>{window.__rp=[];S.sheet='sadel2';render()});await PP.waitForTimeout(150);
 await PP.click('[data-sd-next="3"]');await PP.waitForTimeout(300);
 await PP.evaluate(()=>{SD.t0=Date.now()-59700});await PP.waitForTimeout(1200);
 t.ok(await PP.evaluate(()=>window.__rp.some(x=>x[0]==='set_role'&&x[1]==='old@x.co'&&x[2]==='user')),'60 сония гузашт: ёрдамчии доимӣ бардошта шуд (set_role)');
})(module.exports);

// Идоракунӣ: шарҳи рақамҳо (ҳар KPI давр дорад; «Ин рақамҳо чӣ маъно доранд?» варақи шарҳ мекушояд)
module.exports=(prev=>async t=>{
 await prev(t);
 const P=t.page;
 await t.open({view:'home',role:'admin'});
 await P.evaluate(()=>{S.role='admin';S.fn={installs:88,registered:5,read1:2,back1:1,back7:0};S.stats={total:10,admins:1,subadmins:0,users:9,unverified:2,no_profile:1};S.rs={dau:1,wau:3,sec_today:0,sec_7d:600};S.sheet='admhub';render()});
 await P.waitForTimeout(400);
 t.ok(await P.evaluate(()=>{const k=[...document.querySelectorAll('.adm-kpi>div')];return k.length===4&&k.every(d=>d.querySelector('em'))&&/30 рӯз/.test(k[3].innerText)}),'KPI: ҳар рақам давр дорад (Насб — 30 рӯз)');
 await P.click('[data-adm-go=admhelp]');await P.waitForTimeout(400);
 t.ok(await P.evaluate(()=>{const h=document.querySelector('.hlp');return !!h&&h.querySelectorAll('.hlp-r').length>=16&&/BORI AVVAL|БОРИ АВВАЛ/.test(h.innerText)&&/88/.test(h.innerText)}),'шарҳ: ҳамаи рақамҳо бо маъно ва қимат, «Насб» = дастгоҳи нав дар 30 рӯз');
 // ёрдамчӣ бе ҳуқуқи «омор» намебинад
 await P.evaluate(()=>{S.role='subadmin';S.perms={stats:false};S.sheet='admhelp';render()});await P.waitForTimeout(300);
 t.eq(await P.evaluate(()=>!!document.querySelector('.hlp')),false,'ёрдамчӣ бе ҳуқуқи омор шарҳро намебинад');
})(module.exports);

// насб ва воридшавӣ: ворид нашудагон дар Омор ва шарҳ
module.exports=(prev=>async t=>{
 await prev(t);
 const P=t.page;
 await t.open({view:'home',role:'admin'});
 await P.evaluate(()=>{S.role='admin';S.fn={installs:88,installs_anon:70,installs_apk:60,installs_web:28,registered:5,read1:2,back1:1,back7:0};S.sheet='admstat';render()});await P.waitForTimeout(400);
 t.eq(await P.evaluate(()=>[document.getElementById('fn_anon').textContent,document.getElementById('fn_apk').textContent,document.getElementById('fn_web').textContent]),['70','60','28'],'Омор: насб карданд, вале ворид нашудаанд (70), APK (60), сайт (28)');
 // дастгоҳ ба ҳисоб пайваст мешавад: баъди воридшавӣ track_install боз фиристода мешавад
 await P.evaluate(()=>{localStorage.removeItem('kitob_inst_u');localStorage.setItem('kitob_inst',todayKey());S.uid='u5';window.__ti=0;return trackInstall({rpc:async n=>{if(n==='track_install')window.__ti++;return{error:null}}})});
 await P.waitForTimeout(200);
 t.eq(await P.evaluate(()=>[window.__ti,localStorage.getItem('kitob_inst_u')]),[1,'u5'],'воридшавӣ: имрӯз боз фиристод ҳам, дастгоҳ ба ҳисоб пайваст шуд');
 await P.evaluate(()=>{window.__ti=0;return trackInstall({rpc:async()=>{window.__ti++;return{error:null}}})});
 t.eq(await P.evaluate(()=>window.__ti),0,'ҳамон корбар: такрор нафиристод');
})(module.exports);
