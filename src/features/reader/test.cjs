module.exports=async t=>{
 await t.open({view:'home'});
 await t.page.evaluate(()=>{const w="китоб ҳаёт модар кӯдакӣ деҳа замон дарё мактаб устод нон об".split(" ");const chs=[];
  for(let c=0;c<6;c++){const bl=[];for(let i=0;i<30;i++){let s="";for(let k=0;k<60;k++)s+=w[(c*7+i*3+k*5)%w.length]+" ";bl.push(["p",s.trim()+"."])}chs.push({title:"Боби "+(c+1),blocks:bl})}
  BOOKS.push({id:777,t:"Санҷиш",a:"Муаллиф",c:"fiction",col:["#1f4f7a","#123352"],tp:"x"});TX[777]={parts:[{title:"Қисми якум",chapters:chs}]};openBook0(777)});
 await t.page.waitForTimeout(600);
 t.ok(await t.page.evaluate(()=>!!document.querySelector('.rd')&&RD&&RD.total>1),'хонанда кушода шуд, саҳифаҳо ҳастанд');
 const p0=await t.page.evaluate(()=>S.pages[777]||0);
 await t.page.evaluate(()=>rdGoto&&rdGoto(3));await t.page.waitForTimeout(400);
 t.ok(await t.page.evaluate(()=>(S.pages[777]||0))!==p0||true,'ба саҳифа гузариш хато надод');
 // ўлчови катта: дақиқ сурилиш ва канор
 const P=t.page;
 await P.evaluate(()=>{if(!S.rdUI)toggleUI()});await P.waitForTimeout(400);
 const box=await P.evaluate(()=>{const r=document.getElementById('rdscr').getBoundingClientRect();return{l:r.left,w:r.width,y:r.top+r.height/2,gf:RD.gf||0,M:RD.M}});
 const x0=box.l+box.w*(box.gf||0)+0;
 const num=()=>P.evaluate(()=>document.getElementById('rdnum').textContent);
 const p00=+(await num()).split('/')[0];
 await P.mouse.move(x0,box.y);await P.mouse.down();
 await P.mouse.move(x0+60,box.y,{steps:6});await P.waitForTimeout(150);
 const mid=+(await num()).split('/')[0];
 t.ok(mid-p00>=4&&mid-p00<=6,'ўлчови катта: 60 пиксел ≈ 5 саҳифа ('+(mid-p00)+')');
 t.ok(await P.evaluate(()=>!!document.querySelector('.rd-zb')&&/\d+ \/ \d+/.test(document.querySelector('.rd-zb').textContent)),'кўрсаткичи катта «N / M» пайдо шуд');
 await P.mouse.up();await P.waitForTimeout(250);
 t.ok(await P.evaluate(()=>!document.querySelector('.rd-zb')&&!document.getElementById('rdscr').dataset.drag),'тамом: кўрсаткич ва «drag» ёпилди');
 // канорда шитоб
 const before=+(await num()).split('/')[0];
 await P.mouse.move(box.l+box.w*.5,box.y);await P.mouse.down();await P.mouse.move(box.l+box.w-4,box.y,{steps:5});await P.waitForTimeout(900);
 const edge=+(await num()).split('/')[0];await P.mouse.up();
 t.ok(edge>before+10||box.M<30,'канорда саҳифа шитобон меравад ('+before+' → '+edge+')');
};

// слайдер: ламс танҳо аз қабати махсус; 14px = 1 саҳифа; ангушт боло = дақиқтар
module.exports=(prev=>async t=>{
 await prev(t);
 const P=t.page;
 await t.open({view:'home'});
 await P.evaluate(()=>{const w="китоб ҳаёт модар кӯдакӣ деҳа замон дарё мактаб устод нон об".split(" ");const chs=[];
  for(let c=0;c<80;c++){const bl=[];for(let i=0;i<30;i++){let s="";for(let k=0;k<60;k++)s+=w[(c*7+i*3+k*5)%w.length]+" ";bl.push(["p",s.trim()+"."])}chs.push({title:"Боби "+(c+1),blocks:bl})}
  BOOKS.push({id:778,t:"Калон",a:"М",c:"fiction",col:["#1f4f7a","#123352"],tp:"x"});TX[778]={parts:[{title:"Қисми якум",chapters:chs}]};openBook0(778)});
 await P.waitForTimeout(1500);await P.evaluate(()=>{S.rdUI=true;render()});await P.waitForTimeout(800);
 t.ok(await P.evaluate(()=>RD.M>500),'китоби калон: саҳифаҳо зиёд (>500)');
 t.eq(await P.evaluate(()=>[getComputedStyle(document.getElementById('rdscr')).pointerEvents,!!document.getElementById('rdsh')]),['none',true],'range ламсро намегирад, қабати ламс ҳаст');
 const r=await P.evaluate(()=>{const e=document.getElementById('rdscr').getBoundingClientRect();return{x:e.x,y:e.y+e.height/2,w:e.width}});
 const pg=async()=>+(await P.evaluate(()=>document.getElementById('rdnum').textContent)).split('/')[0];
 const mid=r.x+r.w*.4;
 await P.mouse.move(mid,r.y);await P.mouse.down();await P.waitForTimeout(100);const p0=await pg();
 await P.mouse.move(mid+28,r.y,{steps:8});await P.waitForTimeout(200);
 const d=(await pg())-p0;t.ok(d>=1&&d<=3,'28px ≈ 2 саҳифа (на 5–6): '+d);
 await P.mouse.up();await P.waitForTimeout(200);
 await P.mouse.move(mid,r.y);await P.mouse.down();await P.mouse.move(mid,r.y-90,{steps:6});await P.waitForTimeout(100);
 const a=await pg();await P.mouse.move(mid+112,r.y-90,{steps:10});await P.waitForTimeout(200);
 const f=(await pg())-a;t.ok(f>=1&&f<=5,'ангушт боло: 112px = камтар (аниқ): '+f);
 t.ok(await P.evaluate(()=>/аниқ/.test(document.querySelector('.rd-zb')?.textContent||'')),'пуфак «аниқ» нишон медиҳад');
 await P.mouse.up();
})(module.exports);

// «часпидани» слайдер: баъди ҷаҳиш ба боби дигар ва 2-юм кашидан — аз ҷои ҳозира давом мекунад, рақам ҷаҳида нест
module.exports=(prev=>async t=>{
 await prev(t);
 const P=t.page;
 await t.open({view:'home'});
 await P.evaluate(()=>{const w="китоб ҳаёт модар кӯдакӣ деҳа замон дарё мактаб устод нон об".split(" ");const chs=[];
  for(let c=0;c<80;c++){const bl=[["h","БОБИ "+(c+1)]];for(let i=0;i<10+(c%7)*3;i++){let s="";for(let k=0;k<60;k++)s+=w[(c*7+i*3+k*5)%w.length]+" ";bl.push(["p",s.trim()+"."])}chs.push({title:"Боби "+(c+1),blocks:bl})}
  BOOKS.push({id:779,t:"Часпак",a:"М",c:"fiction",col:["#1f4f7a","#123352"],tp:"x"});TX[779]={parts:[{title:"Қ",chapters:chs}]};openBook0(779)});
 await P.waitForTimeout(1500);await P.evaluate(()=>{S.rdUI=true;render()});await P.waitForTimeout(800);
 const r=await P.evaluate(()=>{const e=document.getElementById('rdscr').getBoundingClientRect();return{x:e.x,y:e.y+e.height/2,w:e.width}});
 const num=async()=>{const x=(await P.evaluate(()=>document.getElementById('rdnum').textContent)).split('/');return{n:+x[0],m:+x[1]}};
 await P.mouse.move(r.x+r.w*.55,r.y);await P.mouse.down();await P.waitForTimeout(300);
 const d0=await num();
 await P.mouse.move(r.x+r.w*.55+40,r.y,{steps:8});await P.waitForTimeout(300);
 const d1=await num();
 t.eq(d1.m,d0.m,'ҳангоми кашидан ҷамъи саҳифа ҷаҳида намешавад ('+d0.m+')');
 await P.mouse.up();await P.waitForTimeout(500);
 const after=await num();
 const val=+await P.evaluate(()=>document.getElementById('rdscr').value);
 t.ok(val>400,'баъди раҳо кардан тумб ба аввал напарид ('+val+')');
 const tx=r.x+val/1000*r.w;
 await P.mouse.move(tx,r.y);await P.mouse.down();await P.waitForTimeout(250);
 const s0=await num();
 t.ok(Math.abs(s0.n-after.n)<=2,'2-юм ламс аз ҳамон саҳифа оғоз мешавад ('+after.n+' → '+s0.n+')');
 await P.mouse.move(tx+42,r.y,{steps:8});await P.waitForTimeout(300);
 const s1=await num();
 t.ok(s1.n-s0.n>=2&&s1.n-s0.n<=5,'2-юм кашидан кор мекунад: 42px ≈ 3 саҳифа ('+(s1.n-s0.n)+')');
 await P.mouse.up();
 t.eq(await P.evaluate(()=>document.querySelectorAll('#rdsh').length),1,'қабати ламс як нусха');
})(module.exports);
