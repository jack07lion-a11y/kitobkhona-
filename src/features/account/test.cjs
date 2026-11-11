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
 await t.page.evaluate(async()=>{S.uid='u9';S.uname='Азамат';S.gender='boy';S.healTried=0;window.__cn=[];
  await loadProfile({from:()=>({select:()=>({eq:()=>({maybeSingle:async()=>({data:null})})})}),rpc:async n=>{window.__cn.push(n);return{data:'Азамат',error:null}}});
  await loadProfile({from:()=>({select:()=>({eq:()=>({maybeSingle:async()=>({data:null})})})}),rpc:async n=>{window.__cn.push(n);return{data:'Азамат',error:null}}})});
 t.eq(await t.page.evaluate(()=>window.__cn),['claim_name'],'loadProfile: профил нест → claim_name як бор');
 // «Бо Google ворид шудан»
 await t.open({view:'login',step:'email'});
 await t.page.evaluate(()=>{window.__oa=null;sbLoad=async()=>({auth:{signInWithOAuth:async o=>{window.__oa=o;return{error:null}}}})});
 await t.page.click('#google');await t.page.waitForTimeout(300);
 t.eq(await t.page.evaluate(()=>[window.__oa&&window.__oa.provider,!!(window.__oa&&window.__oa.options.redirectTo),window.__oa&&window.__oa.options.queryParams.prompt]),['google',true,'select_account'],'Google: signInWithOAuth бо интихоби ҳисоб');
 // Android: Chrome орқали Google, баъд бозгашт бо токенҳо
 await t.open({view:'login',step:'email'});
 await t.page.evaluate(()=>{window.__au=null;window.__ss=null;window.KitobAndroid={openAuth:u=>{window.__au=u}};
  sbLoad=async()=>({auth:{signInWithOAuth:async o=>{window.__oo=o;return{data:{url:'https://x.supabase.co/auth/v1/authorize?provider=google'},error:null}},
   setSession:async x=>{window.__ss=x;return{data:{user:{id:'g1',email:'g@x.co',user_metadata:{full_name:'Гул Номи'}}},error:null}}}})});
 await t.page.click('#google');await t.page.waitForTimeout(300);
 t.eq(await t.page.evaluate(()=>[window.__au,window.__oo.options.redirectTo,window.__oo.options.skipBrowserRedirect]),['https://x.supabase.co/auth/v1/authorize?provider=google','tj.kitobkhona.app://auth',true],'Android: Chrome кушода мешавад, бозгашт ба tj.kitobkhona.app://auth');
 await t.page.evaluate(()=>{S.uname=''});await t.page.evaluate(()=>window.__oauth('access_token=AT&refresh_token=RT&x=1'));await t.page.waitForTimeout(300);
 t.eq(await t.page.evaluate(()=>[window.__ss,S.uid,S.view,S.step,S.uname]),[{access_token:'AT',refresh_token:'RT'},'g1','login','gender','Гул Номи'],'бозгашт: сессия гузошта шуд, қадами ном (исм аз Google)');
};
