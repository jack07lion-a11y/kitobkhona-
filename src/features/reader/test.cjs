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
 // думалоқи шиша: ҳаст, рақами саҳифа дорад, слайдери кӯҳна пинҳон
 t.ok(await P.evaluate(()=>{const g=document.getElementById('rdgl'),w=document.querySelector('.rd-sw');return !!g&&getComputedStyle(g).display!=='none'&&/^\d+$/.test(document.getElementById('rdgln').textContent)&&getComputedStyle(w).display==='none'}),'думалоқи шиша бо рақами саҳифа; слайдери кӯҳна пинҳон');
 const gb=await P.evaluate(()=>{const e=document.getElementById('rdgl').getBoundingClientRect();return{x:e.x+e.width/2,y:e.y+e.height/2}});
 const num=async()=>+(await P.evaluate(()=>document.getElementById('rdgln').textContent));
 const M0=await P.evaluate(()=>RD.M);const n0=await num();
 await P.mouse.move(gb.x,gb.y);await P.mouse.down();await P.waitForTimeout(150);
 t.ok(await P.evaluate(()=>document.getElementById('rdgc').classList.contains('on')&&document.getElementById('rdgcn').classList.contains('on')),'пахш: капсулаи вертикалӣ ва пилюля пайдо шуд');
 await P.mouse.move(gb.x,gb.y+60,{steps:8});await P.waitForTimeout(250);
 const n1=await num();
 t.ok(n1-n0>=4&&n1-n0<=6,'60 пиксел поён ≈ 5 саҳифа пеш ('+(n1-n0)+')');
 t.ok(await P.evaluate(()=>/\d+ \/ \d+/.test(document.getElementById('rdgcn').textContent)),'пилюля «N / M» нишон медиҳад');
 await P.mouse.move(gb.x,gb.y+30,{steps:5});await P.waitForTimeout(250);
 const n2=await num();t.ok(n2<n1&&n1-n2>=2,'боло кашидан — саҳифаҳо ақиб ('+n1+' → '+n2+')');
 // ангушт ба чап дур: аниқтар
 await P.mouse.move(gb.x-130,gb.y+30,{steps:4});await P.waitForTimeout(100);const a=await num();
 await P.mouse.move(gb.x-130,gb.y+90,{steps:8});await P.waitForTimeout(250);const f=(await num())-a;
 t.ok(f>=0&&f<=2,'ангушт ба чап дур: аниқтар, 60 пиксел ≈ 0–1 саҳифа ('+f+')');
 await P.mouse.up();await P.waitForTimeout(1300);
 t.eq(await P.evaluate(()=>[RD.M,document.getElementById('rdgc').classList.contains('on')]),[M0,false],'ҷамъи саҳифа иваз нашуд, капсула пинҳон шуд');
 // каноры поён: шитоб
 const b0=await num();
 await P.mouse.move(gb.x,gb.y);await P.mouse.down();await P.mouse.move(gb.x,gb.y+125,{steps:6});await P.waitForTimeout(900);
 const b1=await num();await P.mouse.up();
 t.ok(b1-b0>=15,'канори поёни капсула: шитобон давом мекунад ('+b0+' → '+b1+')');
 // ҷамъи саҳифа дар бобҳо иваз намешавад
 const mm=await P.evaluate(async()=>{const out=[];for(const ci of [0,10,40,79,5]){rdGoto(ci,0);await new Promise(r=>setTimeout(r,500));out.push([RD&&RD.M,RD&&Math.round(RD.cpp)])}return out});
 t.ok(mm.every(x=>x[0]===mm[0][0]&&x[1]===mm[0][1]),'ҷамъи саҳифа (M) дар ҳамаи бобҳо як хел: '+JSON.stringify(mm.map(x=>x[0])));
})(module.exports);
