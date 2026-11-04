module.exports=async t=>{
 await t.open({view:'me',email:'a@b.c',uname:'Ҷасурбек'});
 await t.page.click('[data-pedit]');await t.page.waitForTimeout(500);
 await t.page.fill('#peb','Ман китоб дӯст медорам');
 await t.page.click('[data-pe-save]');await t.page.waitForTimeout(600);
 t.eq(await t.page.evaluate(()=>S.pBio),'Ман китоб дӯст медорам','профил захира шуд');
};
