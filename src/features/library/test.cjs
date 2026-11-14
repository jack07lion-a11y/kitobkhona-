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

// «Манба ва нашр»: майдонҳои ҳуқуқ дар саҳифаи китоб
module.exports=(prev=>async t=>{
 await prev(t);
 const P=t.page;
 await t.open({view:'home'});
 await P.evaluate(()=>{BOOKS.push({id:910,t:'Бо иҷозатнома',a:'Муаллиф',c:'fiction',col:['#0b7d57','#063'],rs:'licensed',rh:'Нашриёти Намуна',src2:'Нусхаи чопӣ',ed:'Душанбе, 2020',tr:'Мутарҷими Намуна',ln:'Қарордоди №1'},{id:911,t:'Номаълум',a:'Муаллиф',c:'fiction',col:['#0b7d57','#063'],rs:'pending'},{id:912,t:'Бе маълумот',a:'Муаллиф',c:'fiction',col:['#0b7d57','#063']});openDetail(910)});
 await P.waitForTimeout(200);
 const a=await P.evaluate(()=>document.querySelector('.bd').innerText);
 t.ok(/Манба ва нашр/.test(a)&&/Бо иҷозатнома ё розигӣ/.test(a)&&/Нашриёти Намуна/.test(a)&&/Нусхаи чопӣ/.test(a)&&/Душанбе, 2020/.test(a)&&/Мутарҷими Намуна/.test(a)&&/Қарордоди №1/.test(a),'«Манба ва нашр»: ҳамаи майдонҳо намоён');
 await P.evaluate(()=>{openDetail(911)});await P.waitForTimeout(150);
 t.ok(/Ҳоло тасдиқ нашудааст/.test(await P.evaluate(()=>document.querySelector('.bd').innerText)),'pending: «Ҳоло тасдиқ нашудааст»');
 await P.evaluate(()=>{openDetail(912)});await P.waitForTimeout(150);
 t.ok(/Маълумот дар бораи манба ва нашр ҳоло илова нашудааст/.test(await P.evaluate(()=>document.querySelector('.bd').innerText)),'бе маълумот: ёддошт, ҳеҷ чиз тӯқилмайди');
 // байроқҳои рейтинг/фикр/АИ: пинҳон
 const hid=await P.evaluate(()=>{const x=document.querySelector('.bd').innerText;return!/Рейтинг|Мехонанд|Фикри шумо|Аз рӯи китоб савол/.test(x)});
 t.ok(hid,'рейтинг, шарҳ ва АИ-савол бе байроқ пинҳонанд');
 await P.evaluate(()=>{S.flags.feat={social:true,ai:true};render()});await P.waitForTimeout(150);
 t.ok(await P.evaluate(()=>/Рейтинг/.test(document.querySelector('.bd').innerText)&&/Аз рӯи китоб савол/.test(document.querySelector('.bd').innerText)),'байроқ фурӯзон: намоён мешаванд');
})(module.exports);

// муқова: агар суроға кушода нашавад, нақшаи худкор намоён мешавад (ҷои холӣ не)
module.exports=(prev=>async t=>{
 await prev(t);
 const P=t.page;
 await t.open({view:'home'});
 await P.evaluate(()=>{BOOKS.push({id:888,t:'Гулистон',a:'Саъдӣ',c:'classic',col:['#0b7d57','#063'],cover:'https://example.invalid/x.jpg'});S.view='home';S.search=true;S.chip='all';S.q='';render()});
 await P.waitForTimeout(1500);
 t.ok(await P.evaluate(()=>{const f=document.querySelector('[data-book="888"] .f-front');return !!f&&!f.querySelector('img')&&!!f.querySelector('.cv-t')}),'муқова кушода нашуд → нақшаи худкори китоб намоён мешавад');
})(module.exports);
