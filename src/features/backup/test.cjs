module.exports=async t=>{
 await t.open({view:'me',role:'admin'});
 t.ok(await t.page.evaluate(()=>typeof bkCheck==='function'&&typeof bkDue==='function'),'нусхаи эҳтиётӣ: функсияҳо ҳастанд');
 t.eq(await t.page.evaluate(()=>typeof bkDue()),'boolean','bkDue() boolean бармегардонад');
};
