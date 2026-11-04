module.exports=async t=>{
 await t.open({view:'me'});
 const vis=()=>t.page.evaluate(()=>['Китоб ясаш','Китобҳо','Хатоҳо ва пешниҳодҳо','Хабар фиристодан','Огоҳиномаҳо','Навсозии APK','Ёрдамчиёни админ'].filter(x=>document.body.innerText.includes(x)));
 await t.page.evaluate(()=>{S.role='admin';render()});
 t.ok((await vis()).includes('Ёрдамчиёни админ'),'админ ҳамаро мебинад');
 await t.page.evaluate(()=>{S.role='subadmin';S.perms={maker:true,books:true,news:false};render()});
 const v=await vis();t.ok(v.includes('Китоб ясаш')&&!v.includes('Хабар фиристодан')&&!v.includes('Ёрдамчиёни админ'),'ёрдамчӣ танҳо иҷозатдодаро мебинад');
 await t.page.evaluate(()=>{S.role='user';S.perms={};render()});
 t.eq(await vis(),[],'корбари оддӣ ҳеҷ чизи админро намебинад');
};
