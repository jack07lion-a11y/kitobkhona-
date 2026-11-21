module.exports=async t=>{
 await t.open({view:'home'});
 t.ok(await t.page.evaluate(()=>!!document.getElementById('app').children.length),'саҳифаи асосӣ нақш шуд');
};

// меҳмон (бе ҳисоб): рӯйхати холӣ «ворид шавед»-ро мегӯяд
module.exports=(prev=>async t=>{
 await prev(t);
 await t.open({view:'home'});
 await t.page.evaluate(()=>{BOOKS.length=0;S.uid='';render()});await t.page.waitForTimeout(200);
 t.ok(await t.page.evaluate(()=>/Барои дидани китобҳо ворид шавед/.test(document.getElementById('app').innerText)&&!!document.querySelector('.empty-card [data-go=login]')),'меҳмон: «ворид шавед» ва тугма');
 await t.page.evaluate(()=>{S.uid='u1';render()});await t.page.waitForTimeout(200);
 t.ok(await t.page.evaluate(()=>/Китобҳо ба зудӣ илова мешаванд/.test(document.getElementById('app').innerText)),'воридшуда: «ба зудӣ илова мешаванд»');
})(module.exports);

// Асосӣ: «Нав» (ин ҳафта), корти нав, «Барои шумо», тугмаҳои жанр
module.exports=(prev=>async t=>{
 await prev(t);
 await t.open({view:'home'});
 const R=await t.page.evaluate(()=>{
  const now=Date.now(),D=864e5,mk=(id,c,a,d,ex={})=>({id,t:'К'+id,a,c,col:['#24443a','#122a22'],db:true,pub:true,ts:now-d*D,cover:'',cp:'',...ex});
  BOOKS.length=0;
  BOOKS.push(mk(1,'kids','Афсона',1),mk(2,'kids','Афсона',2),mk(3,'fiction','Айнӣ',30),mk(4,'poetry','Рӯдакӣ',40),mk(5,'fiction','Айнӣ',31));
  S.recent=[];S.prog={};S.lib={q:[],d:[],c:[]};S.qh=[];S.newSeen=0;S.hf='all';S.uid='u1';S.view='home';S.search=false;
  const out={};
  out.nw=newBooks().map(b=>b.id).join(',');           // танҳо ин ҳафта, нав аввал
  out.unseen=unseenNew().length;
  out.cold=reco(5).map(b=>b.c).join(',');              // бе нишона: жанрҳо омехта
  render();out.banner=!!document.querySelector('.newsb');out.cnt=(document.querySelector('.hchips [data-hf="new"] .cnt')||{}).textContent||'';
  out.badge=document.querySelectorAll('.shelf .book .nw').length;
  document.querySelector('[data-newx]').click();       // пӯшидан: чизи нав нест, то китоби нав наояд
  out.bannerAfter=!!document.querySelector('.newsb');out.seen=S.newSeen>0;out.cntAfter=!!document.querySelector('.hchips [data-hf="new"] .cnt');
  BOOKS.push(mk(6,'poetry','Ҳофиз',0));render();        // китоби нав омад → корт бозгашт
  out.bannerAgain=!!document.querySelector('.newsb');
  // нишона: «Рӯдакӣ» хондаам → шеър боло
  S.recent=[4];S.prog={4:10};S.hf='all';
  out.pers=reco(6).map(b=>b.id).join(',');
  // тугмаи жанр: танҳо китобҳои ҳамон жанр
  S.hf='all';render();document.querySelector('.hchips [data-hf="kids"]').click();
  out.kidsGrid=[...document.querySelectorAll('.grid .book')].length;out.kidsOn=S.hf;
  return out});
 t.eq(R.nw,'1,2','Нав: танҳо китобҳои 7 рӯзи охир, нав аввал');
 t.eq(R.unseen,2,'Нав: 2 китоб ҳанӯз дида нашудааст');
 t.ok(!R.cold.split(',').every(c=>c===R.cold.split(',')[0]),'Барои шумо (бе нишона): жанрҳо омехта: '+R.cold);
 t.ok(R.banner&&R.cnt==='2','Корти «Нав» ва ҳисоби 2 дар тугма');
 t.ok(R.badge>=2,'Нишони НАВ дар муқоваҳо');
 t.ok(!R.bannerAfter&&R.seen&&!R.cntAfter,'Пӯшидани корт: ҳисоб нест мешавад');
 t.ok(R.bannerAgain,'Китоби нав омад: корт бозмегардад');
 t.ok(/^\d/.test(R.pers)&&R.pers.split(',')[0]!=='4','Барои шумо: китоби кушодашуда такрор намешавад: '+R.pers);
 t.eq(R.kidsOn,'kids','Тугмаи жанр: «Барои кӯдакон» интихоб шуд');
 t.eq(R.kidsGrid,2,'Тугмаи жанр: 2 китоби кӯдакон');
})(module.exports);
