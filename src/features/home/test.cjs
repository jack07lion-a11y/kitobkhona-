module.exports=async t=>{
 await t.open({view:'home'});
 t.ok(await t.page.evaluate(()=>!!document.getElementById('app').children.length),'саҳифаи асосӣ нақш шуд');
};

// меҳмон (бе ҳисоб): рӯйхати холӣ «ворид шавед»-ро мегӯяд
module.exports=(prev=>async t=>{
 await prev(t);
 await t.open({view:'home'});
 await t.page.evaluate(()=>{BOOKS.length=0;S.uid='';render()});await t.page.waitForTimeout(200);
 t.ok(await t.page.evaluate(()=>/Китобҳоро дидан учун ворид шавед/.test(document.getElementById('app').innerText)&&!!document.querySelector('.empty-card [data-go=login]')),'меҳмон: «ворид шавед» ва тугма');
 await t.page.evaluate(()=>{S.uid='u1';render()});await t.page.waitForTimeout(200);
 t.ok(await t.page.evaluate(()=>/Китобҳо ба зудӣ илова мешаванд/.test(document.getElementById('app').innerText)),'воридшуда: «ба зудӣ илова мешаванд»');
})(module.exports);
