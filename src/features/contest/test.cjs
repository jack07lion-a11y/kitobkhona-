module.exports=async t=>{
 await t.open({view:'goal'});
 t.ok(await t.page.evaluate(()=>typeof CXF==='object'&&typeof cxOpen!=='undefined'),'озмун: сохтор ҳаст');
 t.ok(await t.page.evaluate(()=>document.getElementById('app').innerText.length>10),'саҳифаи озмун нақш шуд');
};
