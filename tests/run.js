// Санҷиши автоматии феатурҳо: node tests/run.js [ном-и феатур ...]
// Ҳар феатур дар src/features/<ном>/test.cjs санҷиши худро дорад (экспорт: async t=>{...}).
// Барои ҷорӣ кардан: npm i playwright && npx playwright install chromium
const fs=require('fs'),path=require('path'),http=require('http');
const {chromium}=require('playwright');
const R=path.join(__dirname,'..');
const MIME={'.html':'text/html;charset=utf-8','.json':'application/json','.js':'text/javascript','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2'};
const srv=http.createServer((q,s)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p==='/')p='/index.html';const f=path.join(R,p);
 if(!f.startsWith(R)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){s.writeHead(404);return s.end()}
 s.writeHead(200,{'content-type':MIME[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(s)});
(async()=>{
 await new Promise(r=>srv.listen(0,r));const base='http://localhost:'+srv.address().port+'/';
 const b=await chromium.launch();
 const want=process.argv.slice(2);
 const feats=JSON.parse(fs.readFileSync(path.join(R,'src/features.json'),'utf8')).features.filter(f=>!want.length||want.includes(f));
 let fail=0,ran=0;
 for(const f of feats){
  const tf=path.join(R,'src/features',f,'test.cjs');if(!fs.existsSync(tf))continue;
  const test=require(tf);const ctx=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  await ctx.route(/jsdelivr|cdnjs|supabase\.co|api\.github/,r=>r.abort());
  const page=await ctx.newPage();const errs=[];page.on('pageerror',e=>errs.push(e.message));
  const res=[];
  const t={page,base,
   ok:(c,m)=>{res.push([!!c,m])},eq:(a,e,m)=>{const A=JSON.stringify(a),E=JSON.stringify(e);res.push([A===E,m+(A===E?'':'  → '+A+' ≠ '+E)])},
   async open(seed){await ctx.addInitScript(s=>{localStorage.setItem('kitob10',JSON.stringify(s))},Object.assign({view:'home',gender:'boy',uname:'Х',theme:'paper'},seed||{}));
    await page.goto(base+'index.html');await page.waitForFunction(()=>window.__splDone,null,{timeout:15000});await page.waitForTimeout(400)}};
  try{await test(t)}catch(e){res.push([false,'истисно: '+e.message])}
  res.push([!errs.length,'хатои JS нест'+(errs.length?' → '+errs.join(' | '):'')]);
  const bad=res.filter(r=>!r[0]);ran++;fail+=bad.length;
  console.log((bad.length?'✗ ':'✓ ')+f+'  ('+res.length+' санҷиш)');bad.forEach(r=>console.log('   ✗ '+r[1]));
  await ctx.close();
 }
 await b.close();srv.close();
 console.log(fail?`\n${fail} санҷиш нагузашт`:`\nҲама гузашт (${ran} феатур)`);process.exit(fail?1:0);
})();
