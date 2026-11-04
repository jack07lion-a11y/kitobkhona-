module.exports=async t=>{
 await t.open({view:'home'});
 t.ok(await t.page.evaluate(()=>!!document.getElementById('app').children.length),'саҳифаи асосӣ нақш шуд');
};
