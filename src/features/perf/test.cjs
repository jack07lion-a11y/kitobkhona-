// Суръат: тахмини дараҷа, ченаки кадр, интихоби дастӣ, CSS-и сабук, save() як маротиба
module.exports=async t=>{
 const P=t.page;
 await t.open({view:'home'});
 // ===== 1) тахмин: Samsung S24 → пурра; Redmi 9/8 → миёна; Redmi 9A → сабук =====
 t.eq(await P.evaluate(()=>[
  perfEstimate({mem:8,cores:8,sdk:34,ua:'Android'}),
  perfEstimate({mem:4,cores:8,sdk:30,ua:'Android'}),
  perfEstimate({mem:2,cores:8,sdk:30,ua:'Android'}),
  perfEstimate({mem:4,cores:8,sdk:26,ua:'Android'}),
  perfEstimate({mem:3,cores:4,ua:'Android'}),
  perfEstimate({cores:4,ua:'Android'}),
  perfEstimate({mem:8,cores:8,save:true,ua:'Android'}),
  perfEstimate({cores:6,ua:'iPhone',touch:5}),
  perfEstimate({mem:8,cores:12,ua:'Windows'})]),[2,1,0,0,0,1,1,2,2],'тахмин: S24=пурра, Redmi 9=миёна, ҳотира 2ГБ=сабук, Android 8=сабук, iPhone=пурра');
 t.ok(await P.evaluate(()=>['low','mid','high'].includes(document.documentElement.dataset.perf)),'дар <html> data-perf гузошта шудааст');
 // ===== 2) интихоби дастӣ дар Танзимот =====
 await P.evaluate(()=>{S.sheet='app';render()});await P.waitForSelector('.pf-b');
 t.eq(await P.evaluate(()=>[...document.querySelectorAll('.pf-b')].map(b=>b.innerText.trim())),['Худкор','Сабук','Миёна','Пурра'],'Танзимот: «Суръати барнома» — Худкор, Сабук, Миёна, Пурра');
 await P.click('[data-perf-set="low"]');await P.waitForTimeout(150);
 t.eq(await P.evaluate(()=>[document.documentElement.dataset.perf,JSON.parse(localStorage.getItem('kitob_perf')).m]),['low','low'],'«Сабук»: низом ба low гузашт ва нигоҳ дошта шуд');
 t.eq(await P.evaluate(()=>{const e=document.querySelector('.tb');return e?(getComputedStyle(e).backdropFilter||'none'):'none'}),'none','сабук: шишаи нимшаффоф (blur) хомӯш');
 await P.click('[data-perf-set="high"]');await P.waitForTimeout(100);
 t.eq(await P.evaluate(()=>document.documentElement.dataset.perf),'high','«Пурра»: high');
 // ===== 3) ченаки кадр: 2 зарбаи пай дар пай → як зина паст; дастӣ бошад — не =====
 await P.evaluate(()=>{PF.m='auto';PF.a='high';PS=0;perfApply()});
 await P.evaluate(()=>{perfJudge(40,20,0)});
 t.eq(await P.evaluate(()=>perfTier()),'high','як зарбаи кадр ҳанӯз паст намекунад');
 await P.evaluate(()=>{perfJudge(40,20,0)});
 t.eq(await P.evaluate(()=>perfTier()),'mid','2 зарба → миёна');
 await P.evaluate(()=>{perfJudge(40,1,0);perfJudge(40,20,0)});
 t.eq(await P.evaluate(()=>perfTier()),'mid','кадри хуб зарбаро нест мекунад');
 await P.evaluate(()=>{perfJudge(40,20,0);perfJudge(40,20,0);perfJudge(40,20,0);perfJudge(40,20,0)});
 t.eq(await P.evaluate(()=>perfTier()),'low','боз паст → сабук, аз низ пасттар нест');
 await P.evaluate(()=>{PF.m='high';perfApply();perfStrike();perfStrike();perfStrike()});
 t.eq(await P.evaluate(()=>perfTier()),'high','дастӣ интихоб шуда бошад, ченак тағйир намедиҳад');
 await P.evaluate(()=>{PF.m='auto';PF.a='high';perfApply()});
 // ===== 4) CSS: миёна/сабук — спиннер мемонад, ҳаракати ороишӣ не =====
 await P.evaluate(()=>{PF.a='mid';perfApply()});
 t.ok(await P.evaluate(()=>{const d=document.createElement('div');d.className='c3-t';document.body.appendChild(d);const a=getComputedStyle(d).animationName;d.remove();return a==='none'}),'миёна: тангаи 3D-и беохир ҳаракат намекунад');
 await P.evaluate(()=>{PF.a='high';perfApply()});
 // ===== 5) save(): ҳамаи даъватҳо як маротиба навишта мешаванд; баромадан фавран =====
 await P.evaluate(()=>{window.__w=0;const o=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='kitob10')window.__w++;return o.call(this,k,v)};saveNow();window.__w=0;for(let i=0;i<30;i++)save()});
 await P.waitForTimeout(500);
 t.eq(await P.evaluate(()=>window.__w),1,'save(): 30 даъват → як навишт (на 30)');
 await P.evaluate(()=>{S.__t='x1';window.__w=0;save();window.dispatchEvent(new Event('pagehide'))});
 t.eq(await P.evaluate(()=>[window.__w,JSON.parse(localStorage.getItem('kitob10')).__t]),[1,'x1'],'баромадан (pagehide): фавран навишта мешавад, ҳолат гум намешавад');
 await P.evaluate(()=>{delete S.__t});
 // ===== 6) рӯйхати вазнин дар localStorage намеояд =====
 await P.evaluate(()=>{S.rt={list:Array.from({length:5000},(_,i)=>({pos:i,name:'N'+i}))};S.ru={name:'X'};saveNow()});
 t.ok(await P.evaluate(()=>{const j=localStorage.getItem('kitob10');return j.length<100000&&!/"rt":/.test(j)&&!/"ru":/.test(j)}),'localStorage: рейтинг (5000 сатр) ва профили кушода ҳамроҳ намешавад');
};
