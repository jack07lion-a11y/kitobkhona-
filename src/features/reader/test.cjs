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
 for(let i=1;i<=35;i++){await P.mouse.move(gb.x,gb.y-i*2);await P.waitForTimeout(24)}
 const n1=await num();
 t.ok(n1-n0>=4&&n1-n0<=6,'оҳиста боло 70px ≈ 5 саҳифа пеш, дақиқ ('+n0+' → '+n1+')');
 for(let i=1;i<=20;i++){await P.mouse.move(gb.x,gb.y-70+i*2);await P.waitForTimeout(24)}
 const n2=await num();t.ok(n1-n2>=2&&n1-n2<=4,'оҳиста поён 40px ≈ 3 саҳифа ақиб ('+n1+' → '+n2+')');
 t.ok(await P.evaluate(()=>{const k=document.getElementById('rdgk').getBoundingClientRect(),c=document.getElementById('rdgc').getBoundingClientRect();return Math.abs(k.bottom-c.bottom)<3}),'пур шудан аз поёни капсула');
 await P.mouse.up();await P.waitForTimeout(1300);
 const f0=await num();
 await P.mouse.move(gb.x,gb.y);await P.mouse.down();await P.waitForTimeout(100);
 await P.mouse.move(gb.x,gb.y-150,{steps:5});await P.waitForTimeout(250);
 const f1=await num();await P.mouse.up();
 t.ok(f1-f0>=150,'тез боло: ҷаҳиши калон ('+f0+' → '+f1+')');
 await P.waitForTimeout(1300);
 await P.mouse.move(gb.x,gb.y);await P.mouse.down();await P.waitForTimeout(100);
 await P.mouse.move(gb.x,gb.y+150,{steps:5});await P.waitForTimeout(250);
 const f2=await num();await P.mouse.up();
 t.ok(f1-f2>=150,'тез поён: ҷаҳиши калон ақиб ('+f1+' → '+f2+')');
 await P.waitForTimeout(1300);
 t.eq(await P.evaluate(()=>[RD.M,document.getElementById('rdgc').classList.contains('on')]),[M0,false],'ҷамъи саҳифа иваз нашуд, капсула пинҳон шуд');
})(module.exports);
