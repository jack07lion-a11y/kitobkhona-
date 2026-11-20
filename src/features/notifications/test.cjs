module.exports=async t=>{
 await t.open({view:'me'});
 t.ok(await t.page.evaluate(()=>typeof pushNotifyCfg==='function'&&typeof cfgTxt==='function'),'огоҳиномаҳо: функсияҳо ҳастанд');
};

// табрик: ҳар дақиқа (1–99) матни ҷудо, баъд зинаҳои калон; ба Android дода мешавад
module.exports=(prev=>async t=>{
 await prev(t);
 const P=t.page;
 t.eq(await P.evaluate(()=>[CONG_MIN.length,new Set(CONG_MIN).size]),[99,99],'табрик: 99 матни гуногун (1–99 дақиқа)');
 t.ok(await P.evaluate(()=>CONG_MIN[0].startsWith('1 дақиқа')&&CONG_MIN[98].startsWith('99 дақиқа')),'табрик: рақами дақиқа ба матн мувофиқ');
 t.ok(await P.evaluate(()=>CONG_BIG.map(x=>x[0]).join()==='100,150,200,300,400,500,600,750,1000'&&CONG_BIG.every(x=>x[1].includes('{n}'))),'табрик: зинаҳои калон (100…1000)');
 await P.evaluate(()=>{window.__cfg=null;window.KitobAndroid={config:j=>{window.__cfg=JSON.parse(j)}};S.ncfg={};pushNotifyCfg()});
 t.eq(await P.evaluate(()=>[window.__cfg.cm.m.length,window.__cfg.cm.b.length,window.__cfg.custom]),[99,9,false],'табрик: ба Android 99 + 9 матн дода шуд');
 await P.evaluate(()=>{I18N.set('ru');pushNotifyCfg()});
 t.ok(await P.evaluate(()=>/мин/.test(window.__cfg.cm.m[4])),'табрик: бо забони барнома (русӣ)');
 await P.evaluate(()=>{I18N.set('tg')});
})(module.exports);
