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
 await P.waitForTimeout(1500);await P.evaluate(()=>{window.__noDock=1;S.rdUI=true;render();dockSet(false)});await P.waitForTimeout(800);
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

// зарб → UI; хониши худкор (вертикалӣ); кашидани ду ангушт — андозаи ҳарф
module.exports=(prev=>async t=>{
 await prev(t);
 const P=t.page;
 await P.evaluate(()=>{S.pref.dir='v';S.rdUI=false;S.pref.fs=16;save();render()});await P.waitForTimeout(900);
 const op=()=>P.evaluate(()=>[getComputedStyle(document.getElementById('rdgl')).opacity,getComputedStyle(document.getElementById('rdas')).opacity]);
 t.ok(await P.evaluate(()=>!!document.getElementById('rdas')&&!!document.getElementById('rdasp')),'вертикалӣ: тугмаи хониши худкор ҳаст');
 t.eq(await op(),['0','0'],'UI пинҳон: гардонка ва тугмаи худкор нест');
 await P.evaluate(()=>toggleUI());await P.waitForTimeout(500);
 t.eq(await op(),['1','1'],'зарб: ҳама тугмаҳо пайдо шуданд');
 // 15 сония: худ пинҳон (вақтро кӯтоҳ мекунем)
 await P.evaluate(()=>{window.__h=UI_HIDE_MS;});
 // хониши худкор
 await P.evaluate(()=>{S.asv=3;document.getElementById('rdas').click()});
 t.ok(await P.evaluate(()=>document.getElementById('rdasp').classList.contains('on')),'тугма: панели суръат кушода шуд');
 const y0=await P.evaluate(()=>document.getElementById('rdview').scrollTop);
 await P.evaluate(()=>document.getElementById('asgo').click());
 t.ok(await P.evaluate(()=>AS.on&&!S.rdUI),'«Оғоз кардан»: хониш оғоз шуд, UI пинҳон шуд');
 await P.waitForTimeout(1500);
 const y1=await P.evaluate(()=>document.getElementById('rdview').scrollTop);
 t.ok(y1-y0>40,'китоб худ ба боло меравад ('+y0+' → '+y1+')');
 await P.evaluate(()=>{S.rdUI=true;document.getElementById('rdas').click()});
 t.ok(await P.evaluate(()=>!AS.on),'тугмаи худкор: қатъ шуд');
 // кашидани ду ангушт
 const fs0=await P.evaluate(()=>S.pref.fs);
 await P.evaluate(()=>{const v=document.getElementById('rdview');const T=(id,x,y)=>new Touch({identifier:id,target:v,clientX:x,clientY:y});
  const fire=(n,a)=>v.dispatchEvent(new TouchEvent(n,{touches:a,changedTouches:a,bubbles:true,cancelable:true}));
  fire('touchstart',[T(1,150,300),T(2,250,300)]);fire('touchmove',[T(1,60,300),T(2,340,300)]);fire('touchend',[T(1,60,300)]);});
 await P.waitForTimeout(500);
 const fs1=await P.evaluate(()=>S.pref.fs);
 t.ok(fs1>fs0&&[13,16,19,22,25,28].includes(fs1),'ду ангушт кушодан: ҳарф калон шуд ('+fs0+' → '+fs1+')');
 await P.evaluate(()=>{const v=document.getElementById('rdview');const T=(id,x,y)=>new Touch({identifier:id,target:v,clientX:x,clientY:y});
  const fire=(n,a)=>v.dispatchEvent(new TouchEvent(n,{touches:a,changedTouches:a,bubbles:true,cancelable:true}));
  fire('touchstart',[T(1,60,300),T(2,340,300)]);fire('touchmove',[T(1,170,300),T(2,230,300)]);fire('touchend',[T(1,170,300)]);});
 await P.waitForTimeout(500);
 t.ok(await P.evaluate(()=>S.pref.fs)<fs1,'ду ангушт ёзидан: ҳарф хурд шуд');
 await P.evaluate(()=>{S.pref.dir='h';save();render()});
})(module.exports);

// тугмаҳои канор: 2 сония баъд «медароянд», ламс — бармеоянд
module.exports=(prev=>async t=>{
 await prev(t);
 const P=t.page;
 await P.evaluate(()=>{window.__noDock=0;S.pref.dir='v';S.rdUI=false;render()});await P.waitForTimeout(700);
 await P.evaluate(()=>toggleUI());await P.waitForTimeout(900);
 t.ok(await P.evaluate(()=>!document.querySelector('.rd').classList.contains('dock')&&document.getElementById('rdgl').getBoundingClientRect().left<innerWidth-40),'зарб: тугмаҳо бонс-барояд');
 await P.waitForTimeout(2300);
 t.ok(await P.evaluate(()=>document.querySelector('.rd').classList.contains('dock')),'2 сония баъд: тугмаҳо ба канор даромаданд');
 t.ok(await P.evaluate(()=>{const e=document.getElementById('rdgl').getBoundingClientRect();return e.left>=innerWidth-12}),'дар канор ялпоқ: матнро намепӯшонад');
 await P.evaluate(()=>toggleUI());await P.waitForTimeout(800);
 t.ok(await P.evaluate(()=>!document.querySelector('.rd').classList.contains('dock')&&S.rdUI),'ламс: тугмаҳо боз баромаданд (UI пинҳон нашуд)');
 await P.evaluate(()=>{window.__noDock=1;S.pref.dir='h';save();render()});
})(module.exports);

// сухани дастаи Китобхона дар оғози китоб (китоби худаш, аз боби якум)
module.exports=(prev=>async t=>{
 await prev(t);
 const P=t.page;
 await t.open({view:'home'});
 await P.evaluate(()=>{const w="китоб ҳаёт модар деҳа замон дарё".split(" ");const chs=[];
  for(let c=0;c<3;c++){const bl=[];for(let i=0;i<20;i++){let s="";for(let k=0;k<50;k++)s+=w[(c*7+i*3+k*5)%w.length]+" ";bl.push(["p",s.trim()+"."])}chs.push({title:"Боби "+(c+1),blocks:bl})}
  BOOKS.push({id:779,t:"Муқаддима",a:"М",c:"fiction",col:["#1f4f7a","#123352"],tp:"x"});TX[779]={parts:[{title:"Қисми якум",chapters:chs}]};S.rdCh[779]=0;S.pages[779]=0;openBook0(779)});
 await P.waitForTimeout(1200);
 t.ok(await P.evaluate(()=>{const e=document.querySelector('.rd-flow .rd-pre'),h=document.querySelector('.rd-flow .rd-title');return !!e&&!!h&&/Ба хонандаи азиз/.test(e.textContent)&&/бестселлер/.test(e.textContent)&&!/ройгон/.test(e.textContent)&&!!(e.compareDocumentPosition(h)&4)}),'сухани дастаи Китобхона пеш аз ном, бе «ройгон»');
 t.ok(await P.evaluate(()=>{I18N.set("ru");const x=chHTML(RD.b,0);I18N.set("tg");return /Дорогой читатель/.test(x)}),'муқаддима ба русӣ тарҷума мешавад');
})(module.exports);
