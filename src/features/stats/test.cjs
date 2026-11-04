module.exports=async t=>{
 await t.open({view:'home'});
 t.eq(await t.page.evaluate(()=>[typeof readMin(),typeof readTotal(),typeof read7()]),['number','number','number'],'омори хондан рақам аст');
};
