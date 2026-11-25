module.exports=async t=>{
 await t.open({view:'home'});
 t.eq(await t.page.evaluate(()=>[typeof readMin(),typeof readTotal(),typeof read7()]),['number','number','number'],'омори хондан рақам аст');
};

// ҳисоби ҳалол: вақт танҳо ҳангоми воқеан хондан ҳисоб мешавад
module.exports=(prev=>async t=>{
 await prev(t);
 const P=t.page;
 await t.open({view:'home'});
 const run=(fn)=>P.evaluate(fn);
 // ёрдамчӣ: ҳолати тоза
 await run(()=>{window.rcTouchAt=(n)=>{RC.touch=n;if(RC.warned){RC.warned=false;RC.k++}};window.__R=()=>{RC.mv=0;RC.mvg=null;RC.wg=null;RC.wt=0;RC.lg=null;RC.pend=0;RC.touch=0;RC.warned=false;S.rsec={};RDG.sess=0;ST.sec=0;ST.b=0};
  window.__S=(n,g0,gAt,as)=>{ // n сония, ҳар сония g=gAt(i) ҳарф
   let t0=1e6;for(let i=0;i<n;i++){const t=t0+i*1000;RC.touch=as?0:t;rcStep(t,gAt(i),{read:true,vis:true,as:!!as})}rcStep(t0+n*1000,null,{read:false,vis:false});return readMin()}});
 // 1) 5 дақиқа, ҳар 20 сония ~700 ҳарф (≈ 210 калима/дақ) — ҳамааш ҳисоб мешавад
 await run(()=>__R());
 t.eq(await run(()=>__S(300,0,i=>Math.floor(i/20)*700)),5,'хондан (≈210 калима/дақ): 5 дақиқа ҳисоб шуд');
 // 2) китоб кушода, ҷой иваз намешавад: 65 сония ҳисоб мешавад, баъд меистад (5 дақиқа ≈ 1 дақиқа)
 await run(()=>__R());
 t.eq(await run(()=>__S(300,0,i=>0)),1,'ҷой иваз нашуд: фақат ~65 сония (1 дақиқа) ҳисоб шуд');
 // 3) варақ задани тез: ҳар сония 1500 ҳарф (≈ 15000 калима/дақ) — ҳисоб намешавад
 await run(()=>__R());
 t.eq(await run(()=>__S(180,0,i=>i*1500)),0,'варақ задани тез: ҳисоб нашуд');
 // 4) хониши худкор бе ламс: 3 дақиқа ҳисоб мешавад, баъд «ҳанӯз мехонед?» ва ҳисоб меистад
 await run(()=>{__R();window.__a=0;window.rcAlert=()=>{window.__a++}});
 t.eq(await run(()=>{const t0=1e6;RC.touch=t0;for(let i=0;i<900;i++){rcStep(t0+i*1000,i*12,{read:true,vis:true,as:true})}rcStep(t0+900e3,null,{read:false,vis:false});return [readMin(),window.__a]}),[3,1],'хониши худкор: 3 дақиқа, баъд назорат (1 бор) ва ҳисоб меистад');
 // 5) ламс (давом) — навбатӣ 7 дақиқа; баъд 15; баъд ҳар 25
 await run(()=>{__R();window.__a=0;window.__w=[]});
 t.eq(await run(()=>{let t0=1e6,now=t0;RC.touch=t0;RC.k=0;const mark=[];let last=t0,g=0;
   for(let i=0;i<7200;i++){now=t0+i*1000;g+=12;const before=window.__a;
     // ҳар гал назорат баромад — ламс мекунем (давом додан)
     rcStep(now,g,{read:true,vis:true,as:true});
     if(window.__a>before){mark.push(Math.round((now-last)/60000));last=now;rcTouchAt(now)}}
   return mark.slice(0,5)}),[3,7,15,25,25],'назоратҳо: 3, 7, 15, баъд ҳар 25 дақиқа');
})(module.exports);

// «Ҳоло ҳам хонда истодаед?»: ойна, хониши худкор меистад, бо тугма давом мекунад
module.exports=(prev=>async t=>{
 await prev(t);
 const P=t.page;
 await t.open({view:'home',uname:'Ҷасур'});
 await P.evaluate(()=>{window.__as=0;window.asStart=()=>{window.__as++;AS.on=true};window.asStop=()=>{AS.on=false};S.view='read';window.__rd=RD;RD={vert:true,b:null};AS.on=true;RC.k=0;RC.warned=true;rcAsk()});
 await P.waitForSelector('#rcask');
 t.eq(await P.evaluate(()=>[AS.on,AS.chk,document.querySelector('#rcask h2').textContent]),[false,true,'Ҳоло ҳам хонда истодаед, Ҷасур?'],'ойна: хониши худкор қатъ шуд ва номи профил навишта шудааст');
 t.eq(await P.evaluate(()=>{const e={read:true,vis:true,as:AS.on||AS.chk};return RC.warned&&e.as}),true,'ойна кушода: назорат (ҷадвал 3-7-15) аз нав оғоз намешавад');
 t.eq(await P.evaluate(()=>document.querySelectorAll('#rcask').length),1,'ойна такрор намешавад');
 await P.evaluate(()=>rcAsk());
 t.eq(await P.evaluate(()=>document.querySelectorAll('#rcask').length),1,'ойнаи дуюм кушода намешавад');
 await P.click('#rcask-ok');
 t.eq(await P.evaluate(()=>[!!document.querySelector('#rcask'),AS.chk,AS.on,window.__as,RC.warned,RC.k]),[false,false,true,1,false,1],'«Ҳа, мехонам»: ойна пӯшид, хониши худкор давом кард, санҷиши навбатӣ дертар (k=1)');
 await P.evaluate(()=>{RD=window.__rd;AS.on=false;rcAsk()});
 await P.evaluate(()=>{S.view='home'});await P.waitForTimeout(1300);
 t.eq(await P.evaluate(()=>[!!document.querySelector('#rcask'),AS.chk]),[false,false],'аз китоб баромад — ойна ҳам пӯшида мешавад');
})(module.exports);
