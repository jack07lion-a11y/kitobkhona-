module.exports=async t=>{
 await t.open({view:'home'});
 t.ok(await t.page.evaluate(()=>typeof player==='function'&&typeof openAudio==='function'),'плеер: функсияҳо ҳастанд');
};
