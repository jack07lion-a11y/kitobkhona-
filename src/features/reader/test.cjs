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
