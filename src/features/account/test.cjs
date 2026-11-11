module.exports=async t=>{
 await t.open({view:'me',email:'a@b.c',uname:'Ҷасурбек'});
 await t.page.click('[data-pedit]');await t.page.waitForTimeout(500);
 await t.page.fill('#peb','Ман китоб дӯст медорам');
 await t.page.click('[data-pe-save]');await t.page.waitForTimeout(600);
 t.eq(await t.page.evaluate(()=>S.pBio),'Ман китоб дӯст медорам','профил захира шуд');
 // қадами ном: хатои claim_name дигар фурӯ бурда намешавад
 await t.open({view:'login'});
 await t.page.evaluate(()=>{S.view='login';S.step='gender';S.consent=1;window.__cn=[];
  sbLoad=async()=>({rpc:async(n,a)=>{window.__cn.push(n);return{data:null,error:{message:'x'}}},auth:{updateUser:async()=>({error:null})}});render()});
 await t.page.fill('#uname','Азамат');
 await t.page.evaluate(()=>{window.consOK=()=>true});
 await t.page.click('[data-g]');await t.page.waitForTimeout(400);
 t.eq(await t.page.evaluate(()=>[S.view,S.step,!S.gender,window.__cn.includes('claim_name')]),['login','gender',true,true],'claim_name хато → дар қадами ном мемонад');
 // худтуздиҳӣ: профил нест, ном маълум → claim_name як бор
 await t.page.evaluate(async()=>{S.uid='u9';S.uname='Азамат';S.healTried=0;window.__cn=[];
  await loadProfile({from:()=>({select:()=>({eq:()=>({maybeSingle:async()=>({data:null})})})}),rpc:async n=>{window.__cn.push(n);return{data:'Азамат',error:null}}});
  await loadProfile({from:()=>({select:()=>({eq:()=>({maybeSingle:async()=>({data:null})})})}),rpc:async n=>{window.__cn.push(n);return{data:'Азамат',error:null}}})});
 t.eq(await t.page.evaluate(()=>window.__cn),['claim_name'],'loadProfile: профил нест → claim_name як бор');
};
