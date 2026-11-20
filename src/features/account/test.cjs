module.exports=async t=>{
 await t.open({view:'me',email:'a@b.c',uname:'Ҷасурбек'});
 await t.page.click('[data-pedit]');await t.page.waitForTimeout(500);
 await t.page.fill('#peb','Ман китоб дӯст медорам');
 await t.page.click('[data-pe-save]');await t.page.waitForTimeout(600);
 t.eq(await t.page.evaluate(()=>S.pBio),'Ман китоб дӯст медорам','профил захира шуд');
 // қадами ном: хатои claim_name дигар фурӯ бурда намешавад
 await t.open({view:'login'});
 await t.page.evaluate(()=>{S.view='login';S.step='name';window.__cn=[];
  sbLoad=async()=>({rpc:async(n,a)=>{window.__cn.push(n);return{data:null,error:{message:'x'}}},auth:{updateUser:async()=>({error:null})}});render()});
 await t.page.fill('#uname','Азамат');
 await t.page.click('#nmgo');await t.page.waitForTimeout(400);
 t.eq(await t.page.evaluate(()=>[S.view,S.step,window.__cn.includes('claim_name')]),['login','name',true],'claim_name хато → дар қадами ном мемонад');
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
 t.eq(await t.page.evaluate(()=>[window.__ss,S.uid,S.view,S.step,S.uname]),[{access_token:'AT',refresh_token:'RT'},'g1','home','email','Гул Номи'],'Google: ном худкор аз ҳисоб, қадами ном нест, ҷинс баъдтар → бевосита ба хона');
 // ном: рақамҳо ва аломатҳо гирифта намешаванд (Ҷасур07 Хон → Ҷасур Хон)
 t.eq(await t.page.evaluate(()=>[cleanName('Ҷасур07 Хон'),cleanName('Jack07Lion'),cleanName('  12 '),cleanName('Гул_Номи!')]),['Ҷасур Хон','Jack Lion','','Гул Номи'],'ном: рақам ва аломат нест');
 // Google бе ном → қадами ном
 await t.page.evaluate(()=>{S.uname='';sbLoad=async()=>({auth:{setSession:async()=>({data:{user:{id:'g2',email:'x@y.z',user_metadata:{}}},error:null})}})});
 await t.page.evaluate(()=>window.__oauth('access_token=A&refresh_token=B'));await t.page.waitForTimeout(300);
 t.eq(await t.page.evaluate(()=>[S.view,S.step]),['login','name'],'Google бе ном: танҳо қадами ном');
 // номи қадам: claim_name → профил → ба хона
 await t.open({view:'login'});
 await t.page.evaluate(()=>{S.view='login';S.step='name';window.__uu=null;
  sbLoad=async()=>({auth:{updateUser:async o=>{window.__uu=o;return{error:null}},getSession:async()=>({data:{session:{user:{id:'u77'}}}})},
   from:()=>({select:()=>({eq:()=>({maybeSingle:async()=>({data:null})})})}),rpc:async()=>({data:'Номи Нав 1',error:null})});render()});
 await t.page.fill('#uname','Номи Нав');
 await t.page.click('#nmgo');await t.page.waitForTimeout(500);
 t.eq(await t.page.evaluate(()=>[S.view,S.uname,window.__uu&&window.__uu.data.name,!!S.genderAt]),['home','Номи Нав 1','Номи Нав 1',true],'қадами ном: профил сохта шуд, ба хона (бе ҷинс ва розигӣ)');
 // расмҳои ҷинс (атиргул, перчатка): дар худи барнома, бе интернет ҳам намоён (ойнаи ҷинс)
 await t.open({view:'home',email:'a@b.c',uname:'Х'});
 await t.page.evaluate(()=>{S.uid='u1';S.gender=undefined;obGender()});await t.page.waitForTimeout(700);
 t.ok(await t.page.evaluate(()=>{const m=[...document.querySelectorAll('.obm .gart img')];return m.length===2&&m.every(i=>/^data:image\/webp;base64,/.test(i.src)&&i.complete&&i.naturalWidth>0)}),'атиргул ва перчатка: дар худи барнома (data-URI), дарҳол намоён, бе боркунӣ аз сервер');
 // ҷинс: «Духтар» → захира, ойна мебарояд
 await t.page.evaluate(()=>{window.__gu=null;sbLoad=async()=>({auth:{updateUser:async o=>{window.__gu=o;return{error:null}}}})});
 await t.page.click('[data-og=girl]');await t.page.waitForTimeout(900);
 t.eq(await t.page.evaluate(()=>[S.gender,!!S.genderAt,window.__gu&&window.__gu.data.gender,!document.getElementById('obm')]),['girl',true,'girl',true],'ҷинс интихоб шуд: захира, ойна рафт');
 // профил: дар 3 рӯз иваз кардан мумкин; баъд не
 await t.page.evaluate(()=>{S.view='me';S.sheet=null;render()});await t.page.waitForTimeout(400);
 t.ok(await t.page.evaluate(()=>!!document.querySelector('[data-gchg=boy]')),'профил: дар 3 рӯз «Писар» интихоб кардан мумкин');
 await t.page.click('[data-gchg=boy]');await t.page.waitForTimeout(300);
 t.eq(await t.page.evaluate(()=>S.gender),'boy','ҷинс иваз шуд');
 await t.page.evaluate(()=>{S.genderAt=Date.now()-4*864e5;S.view='me';render()});await t.page.waitForTimeout(300);
 t.eq(await t.page.evaluate(()=>[!!document.querySelector('[data-gchg]'),/Google/.test(document.querySelector('.screen').innerText)]),[false,true],'баъди 3 рӯз: иваз кардан нест, «бо Google аз нав ворид шавед»');
};
