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
 await run(()=>{window.__R=()=>{RC.mv=0;RC.mvg=null;RC.wg=null;RC.wt=0;RC.lg=null;RC.pend=0;RC.touch=0;RC.warned=false;S.rsec={};RDG.sess=0;ST.sec=0;ST.b=0};
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
 // 4) хониши худкор: ламс набошад — 10 дақиқа ҳисоб мешавад, баъд меистад (15 дақиқа ≈ 10)
 await run(()=>__R());
 t.eq(await run(()=>{let n=0;const t0=1e6;RC.touch=t0;for(let i=0;i<900;i++){rcStep(t0+i*1000,i*12,{read:true,vis:true,as:true})}rcStep(t0+900e3,null,{read:false,vis:false});return readMin()}),10,'хониши худкор бе ламс: 10 дақиқа ҳисоб шуд, баъд меистад');
})(module.exports);
