module.exports=async t=>{
 await t.open({view:'home'});
 t.eq(await t.page.evaluate(()=>typeof locked),'function','locked() ҳаст');
};
