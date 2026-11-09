// Скриншотҳои landing.html: node tools/screenshots.js  (Playwright; ба Supabase пайваст намешавад)
// Китоб: «Ёддоштҳо» — ҳамон китобе, ки дар худи APK ҳаст (apk/src/assets/books). Ягон китоби сохта нест.
const fs=require('fs'),path=require('path'),http=require('http');const {chromium}=require('playwright');
const R=path.join(__dirname,'..'),OUT=path.join(R,'landing');
const MIME={'.html':'text/html;charset=utf-8','.json':'application/json','.js':'text/javascript','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.woff2':'font/woff2','.gz':'application/gzip','.webmanifest':'application/manifest+json'};
const srv=http.createServer((q,s)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p==='/')p='/index.html';
 let f=path.join(R,p);if(p.startsWith('/books/'))f=path.join(R,'apk/src/assets',p);
 if(!fs.existsSync(f)||fs.statSync(f).isDirectory()){s.writeHead(404);return s.end()}
 s.writeHead(200,{'content-type':MIME[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(s)});
(async()=>{
 await new Promise(r=>srv.listen(0,r));const base='http://localhost:'+srv.address().port+'/';
 const b=await chromium.launch(),ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
 await ctx.route(/jsdelivr|cdnjs|supabase\.co|api\.github/,r=>r.abort());
 await ctx.addInitScript(()=>{localStorage.setItem('kitob10',JSON.stringify({view:'login',theme:'paper',gender:'',pref:{fs:16,th:'sepia',ff:'serif',v2:1}}))});
 const page=await ctx.newPage();await page.goto(base+'index.html');await page.waitForFunction(()=>window.__splDone,null,{timeout:15000});await page.waitForTimeout(600);
 const shot=async n=>{await page.waitForTimeout(500);await page.screenshot({path:path.join(OUT,n+'.png')})};
 await shot('1-kirish');
 // китоби APK: ҳамон объект, ки дар core/20-data.js барои APK эълон шудааст
 await page.evaluate(()=>{BOOKS.length=0;BOOKS.push({id:900001,slug:'sadriddin-ayni-yoddoshtho',t:'Ёддоштҳо',a:'Садриддин Айнӣ',c:'fiction',col:['#1f4f7a','#123352'],audio:false,desc:'Хотираҳои Садриддин Айнӣ дар бораи кӯдакӣ, деҳа ва замони худ. 142 боб дар 4 қисм.',local:true,src:'books/yoddoshtho/book.json.gz',size:'0,8 МБ',cover:'books/yoddoshtho/cover.jpg'});BOOKS.forEach(mkAud);S.gender='boy';S.uname='Хонанда';S.view='home';S.step='email';render()});
 await shot('2-asosi');
 await page.evaluate(()=>{openDetail(900001)});await shot('3-kitob');
 await page.evaluate(()=>{openBook(900001)});await page.waitForFunction(()=>S.view==='read',null,{timeout:15000});await page.waitForTimeout(1200);await shot('4-khondan');
 await page.evaluate(()=>{S.theme='dark';applyTheme&&applyTheme();S.view='home';render()}).catch(()=>{});await shot('5-torik');
 await b.close();srv.close();
 // PNG → WebP (хурдтар): Pillow лозим
 require('child_process').execFileSync('python3',['-I','-c','import sys,glob,os\nfrom PIL import Image\nfor f in glob.glob(sys.argv[1]+"/*.png"):\n Image.open(f).convert("RGB").save(f[:-4]+".webp","WEBP",quality=82,method=6);os.remove(f)',OUT]);
 console.log('ok');
})();
