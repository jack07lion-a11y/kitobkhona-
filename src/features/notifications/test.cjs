module.exports=async t=>{
 await t.open({view:'me'});
 t.ok(await t.page.evaluate(()=>typeof pushNotifyCfg==='function'&&typeof cfgTxt==='function'),'огоҳиномаҳо: функсияҳо ҳастанд');
};
