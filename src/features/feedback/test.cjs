module.exports=async t=>{
 await t.open({view:'home'});
 t.ok(await t.page.evaluate(()=>typeof reportSheet==='function'&&typeof sendReport==='function'),'хабар додан: функсияҳо ҳастанд');
 t.ok(await t.page.evaluate(()=>bookLink({id:5}).includes('?b=')),'истиноди китоб сохта мешавад');
 // тугмаи давра дар боло, дар профил, дар хонанда
 t.eq(await t.page.evaluate(()=>document.querySelectorAll('.top [data-fab]').length),1,'тугмаи фикр дар боло ҳаст');
 await t.page.click('.top [data-fab]');await t.page.waitForTimeout(1200);
 t.ok(await t.page.evaluate(()=>S.sheet==='report'&&!!document.getElementById('rpt')),'тугма варақи «Фикр ва хато»-ро мекушояд');
 t.eq(await t.page.evaluate(()=>[...document.querySelectorAll('[data-rpk]')].map(b=>b.textContent)),['Хато','Пешниҳод','Хуб'],'навъҳо: Хато/Пешниҳод/Хуб');
 // сурат + қалам
 await t.page.evaluate(()=>{const c=document.createElement('canvas');c.width=300;c.height=500;const x=c.getContext('2d');x.fillStyle='#9cf';x.fillRect(0,0,300,500);S.rp.img=c.toDataURL('image/jpeg',.9);render()});
 await t.page.click('button[data-rpi-pen]');await t.page.waitForSelector('#anc');
 const bb=await t.page.evaluate(()=>{const r=document.getElementById('anc').getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height}});
 const before=await t.page.evaluate(()=>document.getElementById('anc').toDataURL());
 await t.page.mouse.move(bb.x+bb.w*.3,bb.y+bb.h*.3);await t.page.mouse.down();await t.page.mouse.move(bb.x+bb.w*.6,bb.y+bb.h*.4,{steps:6});await t.page.mouse.move(bb.x+bb.w*.4,bb.y+bb.h*.6,{steps:6});await t.page.mouse.up();
 t.ok(await t.page.evaluate(b=>document.getElementById('anc').toDataURL()!==b,before),'қалам дар сурат хат мекашад');
 const img0=await t.page.evaluate(()=>S.rp.img);
 await t.page.click('[data-an=ok]');await t.page.waitForTimeout(500);
 t.ok(await t.page.evaluate(i=>S.rp.img!==i&&!document.getElementById('anno'),img0),'«Тайёр»: сурати хатдор захира шуд');
 // фиристодан: «Хуб» → навъи other бо қайди [Хуб]
 await t.page.evaluate(()=>{S.rp.kind='good';S.rp.text='Хеле хуб аст';sendReport()});
 const q=await t.page.evaluate(()=>JSON.parse(localStorage.getItem('kitob_rep')||'[]'));
 t.ok(q.length>=1&&q[q.length-1].b==='[Хуб] Хеле хуб аст'&&q[q.length-1].k==='other','«Хуб» бо қайди [Хуб] фиристода мешавад');
 // пурсиш баъди баромадан аз китоб
 await t.page.evaluate(()=>{localStorage.removeItem('kitob_fbq');S.view='home';render();window.__rdT=Date.now()-6000;S.view='read';fbqLeave();S.view='home'});
 await t.page.waitForSelector('#fbq.in',{timeout:3000});
 t.ok(true,'пурсиш баъди ≥5 сония хондан пайдо шуд');
 await t.page.waitForTimeout(2300);
 const n1=+await t.page.evaluate(()=>document.querySelector('.fbq-n').textContent);
 t.ok(n1<=14&&n1>=11,'ҳисоби сония кор мекунад: '+n1);
 await t.page.focus('#fbq textarea');await t.page.keyboard.type('Салом');await t.page.waitForTimeout(2500);
 t.ok(await t.page.evaluate(()=>!!document.querySelector('#fbq.in.held')),'ҳангоми навиштан намеравад');
 // 15 сония: бе амал мегузарад
 await t.page.evaluate(()=>{document.getElementById('fbq').remove();clearInterval(FBQ.iv);localStorage.removeItem('kitob_fbq');window.__rdT=Date.now()-6000;S.view='read';fbqLeave();S.view='home'});
 await t.page.waitForSelector('#fbq.in');await t.page.waitForTimeout(16500);
 t.ok(await t.page.evaluate(()=>!document.getElementById('fbq')),'15 сонияда бе амал ғайб мешавад');
 // кам аз 5 сония — пайдо намешавад
 await t.page.evaluate(()=>{localStorage.removeItem('kitob_fbq');window.__rdT=Date.now()-2000;S.view='read';fbqLeave();S.view='home'});
 await t.page.waitForTimeout(1500);
 t.ok(await t.page.evaluate(()=>!document.getElementById('fbq')),'кам аз 5 сония — пурсиш нест');
};
