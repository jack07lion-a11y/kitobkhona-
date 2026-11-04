module.exports=async t=>{
 await t.open({view:'lib',role:'admin'});
 await t.page.evaluate(()=>{BOOKS.push({id:777,t:"Ёддоштҳо",a:"Айнӣ",c:"fiction",col:["#1f4f7a","#123352"]},{id:778,t:"Гулистон",a:"Саъдӣ",c:"fiction",col:["#0b7d57","#063"]});S.recent=[777,778];S.prog={777:40};render()});
 await t.page.evaluate(()=>{openDetail(778)});await t.page.waitForTimeout(300);
 await t.page.click('.bd-q [data-qtog]');await t.page.click('.bd-q [data-dtog]');
 const l=await t.page.evaluate(()=>S.lib);t.eq([l.q,l.d],[[778],[778]],'дар навбат + хондаистода');
 await t.page.evaluate(()=>{S.sheet=null;S.view='lib';render()});
 await t.page.click('[data-lib="col"]');await t.page.fill('#lbn','Дӯстдоштаҳо');await t.page.click('[data-lib-new]');
 t.eq(await t.page.evaluate(()=>S.lib.c.length),1,'маҷмӯа сохта шуд');
};
