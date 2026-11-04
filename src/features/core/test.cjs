// Асос: барнома бе хато боз мешавад ва 6 саҳифаи поёнӣ кор мекунанд.
module.exports=async t=>{
 await t.open({view:'home'});
 for(const v of ['home','lib','goal','comm','me']){
  await t.page.evaluate(v=>{S.view=v;render()},v);
  t.ok(await t.page.evaluate(()=>document.getElementById('app').innerText.length>20),'саҳифа '+v+' пур аст');
 }
 t.ok(await t.page.evaluate(()=>typeof render==='function'&&typeof bind==='function'&&typeof sheetHTML==='function'),'функсияҳои асосӣ ҳастанд');
};
