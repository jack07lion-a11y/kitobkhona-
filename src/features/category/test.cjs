module.exports=async t=>{
 await t.open({view:'comm'});
 t.ok(await t.page.evaluate(()=>CATS.length>0&&GENRES.length>0&&typeof genreOf==='function'),'категорияҳо ва жанрҳо ҳастанд');
};
