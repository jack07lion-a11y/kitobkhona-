module.exports=async t=>{
 await t.open({view:'home'});
 t.ok(await t.page.evaluate(()=>/^[0-9a-f]{10}$/.test(WEB_H)),'нишони нусха (WEB_H) ҳаст');
 t.ok(await t.page.evaluate(()=>typeof webUpdCheck==='function'&&typeof apkAuto==='function'&&typeof apkNag==='undefined'&&typeof wuSheet==='undefined'&&typeof checkUpdate==='function'),'функсияҳои навсозӣ ҳастанд');
 // корбари оддӣ: бе нашр шиддат надорад
 t.eq(await t.page.evaluate(()=>wuDue()),false,'бе Android навсозии саҳифа даъват намешавад');
 // ХУДКОР: бе ойна, бе тугма
 const P=t.page;
 await P.evaluate(()=>{window.__c={dl:0,inst:0,shell:0};window.KitobAndroid={version:()=>'1',downloadUpdate:()=>{window.__c.dl++},installUpdate:()=>{window.__c.inst++;return 'ok'},canInstall:()=>true,updateShell:()=>{window.__c.shell++},setShellAuto:()=>{},flavor:()=>'direct'};
  S.view='home';S.sheet=null;S.upd={v:99,url:'https://github.com/jack07lion-a11y/kitobkhona-/releases/download/apk-99/kitobkhona.apk'};AU.busy=false;AU.ready=false;AU.installing=false;AU.auto=false;S.apkTry=null;apkAuto()});
 t.eq(await P.evaluate(()=>[window.__c.dl,!!document.getElementById('aus'),!!document.getElementById('wup')]),[1,false,false],'APK худкор: боргирӣ оғоз шуд, ойна ва доира нест');
 await P.evaluate(()=>{S.view='read';window.__upd(100,'ready')});
 t.eq(await P.evaluate(()=>[window.__c.inst,AU.ready]),[0,true],'дар вақти хондан: насб интизор (халал намеояд)');
 await P.evaluate(()=>{S.view='home';apkInstallIdle()});
 t.eq(await P.evaluate(()=>[window.__c.inst,!!document.getElementById('aur')]),[1,false],'аз хондан баромад: насб худкор, тугма нест');
 // саҳифаи веб (шелл)
 await P.evaluate(()=>{S.role='user';S.flags=Object.assign({},S.flags,{webPub:'aaaaaaaaaa'});S.webDone=null;WU.busy=false;WU.ready=false;WU.auto=false;webUpdCheck()});
 t.eq(await P.evaluate(()=>[window.__c.shell,!!document.getElementById('wus'),WU.auto]),[1,false,true],'саҳифаи веб: худкор фаро мешавад, ойна нест');
 await P.evaluate(()=>{S.view='read';window.__shellP(100,'ready')});
 t.eq(await P.evaluate(()=>[WU.ready,!!document.getElementById('wur'),!!document.getElementById('wup')]),[true,false,false],'тайёр: тугма ва доира нест, дар хондан ишга намеафтад');
};
