module.exports=async t=>{
 await t.open({view:'home'});
 t.ok(await t.page.evaluate(()=>/^[0-9a-f]{10}$/.test(WEB_H)),'нишони нусха (WEB_H) ҳаст');
 t.ok(await t.page.evaluate(()=>typeof webUpdCheck==='function'&&typeof apkNag==='function'&&typeof checkUpdate==='function'),'функсияҳои навсозӣ ҳастанд');
 // корбари оддӣ: бе нашр шиддат надорад
 t.eq(await t.page.evaluate(()=>wuDue()),false,'бе Android навсозии саҳифа даъват намешавад');
};
