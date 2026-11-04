module.exports=async t=>{
 await t.open({view:'me'});
 t.eq(await t.page.evaluate(()=>I18N.lang),'tg','бо тоҷикӣ ҷадвали тарҷума ҳанӯз хонда нашудааст');
 const r=await t.page.evaluate(()=>{I18N.set('ru');const x=I18N.tr('Навсозӣ');I18N.set('tg');return x});
 t.ok(r&&r!=='Навсозӣ','тарҷума ба русӣ кор мекунад: '+r);
 await t.open({view:'me',lang:'uz'});
 t.ok(await t.page.evaluate(()=>I18N.lang==='uz'),'забони захирашуда барқарор шуд');
};
