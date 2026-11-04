module.exports=async t=>{
 await t.open({view:'me'});
 t.ok(await t.page.evaluate(()=>typeof reportSheet==='function'&&typeof sendReport==='function'),'хабар додан: функсияҳо ҳастанд');
 t.ok(await t.page.evaluate(()=>typeof bookLink==='function'&&bookLink({id:5}).includes('?b=')),'истиноди китоб сохта мешавад');
};
