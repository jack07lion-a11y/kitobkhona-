/* ---- «Сохтани китоб»: PDF/Word/EPUB/FB2/TXT → .kitob дар худи браузер, баъд худкор фиристодан (пинҳон) ----
   Мантиқ айнан ҳамон tools/kitob_convert.py. Бе AI, бе лимит: танҳо код. */
const MK={
 HEAD:/^(қисми|боби|қисм|боб|фасли|фасл|глава|часть)(?![\p{L}\d_])/iu,
 clean(t){return String(t==null?"":t).replace(/ /g," ").replace(/[​﻿]/g,"").replace(/[ \t\r\f\v]+/g," ").trim()},
 isScene(t){t=String(t).trim();return /^[*\s·•]{3,}$/.test(t)||/^\*\s*\*\s*\*$/.test(t)||/^[-–—_]{3,}$/.test(t)},
 looksHeading(line){const s=String(line).trim();if(!s||s.length>90||(/[.,;:]$/.test(s)&&!MK.HEAD.test(s)))return null;
  if(MK.HEAD.test(s))return /^(қисми|қисм|часть)(?![\p{L}\d_])/iu.test(s)?"h1":"h2";
  const L=[...s].filter(c=>/\p{L}/u.test(c));
  if(L.length>=3&&L.filter(c=>c!==c.toLowerCase()).length/L.length>.85&&s.length<=70)return"h2";return null},
 SRC:"абвгдеёжзийклмнопрстуфхцчшщъыьэюяғӣқӯҳҷ",
 DST:["a","b","v","g","d","e","yo","zh","z","i","y","k","l","m","n","o","p","r","s","t","u","f","kh","ts","ch","sh","sh","","y","","e","yu","ya","gh","i","q","u","h","j"],
 slug(t){const m={};[...MK.SRC].forEach((c,i)=>{if(i<MK.DST.length)m[c]=MK.DST[i]});
  const o=[...String(t).toLowerCase()].map(c=>m[c]!==undefined?m[c]:c).join("").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");return o.slice(0,60)||"kitob"},
 /** Матн сифатро месанҷад: тоҷикии кирилли ҳақиқӣми ё «чиқинди» (шрифти кӯҳна)? */
 quality(text){const s=String(text),ns=s.replace(/\s+/g,"");
  if(ns.length<30)return{ok:false,why:"short"};
  let cyr=0,lat=0,sym=0;for(const ch of ns){if(ch>="\u0400"&&ch<="\u052f")cyr++;else if(/[A-Za-z]/.test(ch))lat++;else if(/[%&'*+<>=\[\]{}@#$^~|\\_]/.test(ch))sym++}
  const letters=cyr+lat,symF=sym/ns.length,cyrF=letters?cyr/letters:0;
  if(cyrF<.6||symF>.05)return{ok:false,why:"garbled",cyrF,symF};
  return{ok:true,cyrF,symF}},
 GARBLED:"Ин файлро худкор ба .kitob табдил додан мумкин нест: матни дохили он «шикаста» аст (шрифти кӯҳна, ҳарфҳо рамзи нодуруст доранд), ва натиҷа чиқинди мешавад. «Сохтани китоб» танҳо вақте кор мекунад, ки ҳарфҳоро 100% дуруст хонад. Лутфан китобро дар шакли Word (.docx), EPUB ё TXT бо ҳарфҳои тоҷикии кирилл ёбед ва бор кунед, ё худатон аз нав ясаед.",
 SCAN:"Дар файл матн ёфт нашуд (шояд расм/скан аст). «Сохтани китоб» танҳо матни ҳақиқиро мехонад. Китобро дар шакли Word, EPUB ё TXT ёбед.",
 async docx(file){const z=await (await loadJSZip()).loadAsync(file);const W="http://schemas.openxmlformats.org/wordprocessingml/2006/main";
  const dx=await z.file("word/document.xml").async("string"),doc=new DOMParser().parseFromString(dx,"application/xml");
  const styles={};if(z.file("word/styles.xml")){const sx=new DOMParser().parseFromString(await z.file("word/styles.xml").async("string"),"application/xml");
   for(const st of sx.getElementsByTagNameNS(W,"style")){const n=st.getElementsByTagNameNS(W,"name")[0];styles[st.getAttributeNS(W,"styleId")]=(n?n.getAttributeNS(W,"val"):"").toLowerCase()}}
  const items=[];
  for(const p of doc.getElementsByTagNameNS(W,"p")){
   const ppr=[...p.children].find(e=>e.localName==="pPr"),sidEl=ppr&&[...ppr.children].find(e=>e.localName==="pStyle"),sid=sidEl?sidEl.getAttributeNS(W,"val"):null;
   let sname=styles[sid]||"";if(!sname&&sid)sname=sid.toLowerCase();
   const lines=[];let cur=[];
   for(const n of p.getElementsByTagNameNS("*","*")){if(n.localName==="t"&&n.textContent)cur.push(n.textContent);else if(n.localName==="tab")cur.push(" ");else if(n.localName==="br"){lines.push(cur.join(""));cur=[]}}
   lines.push(cur.join(""));const L=lines.map(MK.clean),ne=L.filter(x=>x),text=ne.join(" ");if(!text)continue;
   const m=sname.match(/(heading|заголовок|sarlavha)\s*(\d)/u)||sname.match(/(title)/);
   if(m){const lvl=m.length>2&&m[2]?+m[2]:1;items.push([lvl===1?"h1":"h2",text])}
   else if(MK.isScene(text))items.push(["s",null]);
   else if(ne.length>1&&ne.every(x=>x.length<90))items.push(["v",ne]);
   else if(/(subtitle|подзаголовок)/u.test(sname))items.push(["sub",text]);
   else items.push(["p",text])}
  let cover=null;for(const nm of Object.keys(z.files)){if(nm.startsWith("word/media/")&&/\.(jpe?g|png)$/i.test(nm)){cover=await z.file(nm).async("blob");break}}
  return{items,cover}},
 async fb2(file){const raw=await file.text(),doc=new DOMParser().parseFromString(raw,"application/xml"),root=doc.documentElement;
  const ln=e=>e.localName,kids=e=>[...e.children],txt=e=>MK.clean(e.textContent),items=[];let cover=null,meta={};
  const cp=[...root.getElementsByTagName("*")].find(e=>ln(e)==="coverpage");
  if(cp){const im=[...cp.getElementsByTagName("*")].find(e=>ln(e)==="image");if(im){const a=[...im.attributes].find(x=>/href$/.test(x.name));if(a){const bid=a.value.replace(/^#/,"");
   for(const b of root.getElementsByTagName("*")){if(ln(b)==="binary"&&b.getAttribute("id")===bid&&b.textContent){const bin=atob(b.textContent.replace(/\s+/g,"")),u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);cover=new Blob([u],{type:"image/jpeg"})}}}}}
  const bt=[...root.getElementsByTagName("*")].find(e=>ln(e)==="book-title");if(bt)meta.title=txt(bt);
  const au=[...root.getElementsByTagName("*")].find(e=>ln(e)==="author");if(au)meta.author=MK.clean(kids(au).filter(e=>["first-name","last-name"].includes(ln(e))).map(txt).join(" "));
  const walk=(sec,depth)=>{const t=kids(sec).find(e=>ln(e)==="title"),hasSub=kids(sec).some(e=>ln(e)==="section");
   if(t)items.push([hasSub&&depth===0?"h1":"h2",txt(t)]);
   for(const c of kids(sec)){const n=ln(c);
    if(n==="section")walk(c,depth+1);
    else if(n==="p"){const x=txt(c);if(x)items.push(MK.isScene(x)?["s",null]:["p",x])}
    else if(n==="subtitle")items.push(["sub",txt(c)]);
    else if(n==="empty-line")items.push(["s",null]);
    else if(n==="poem"){const ls=[...c.getElementsByTagName("*")].filter(e=>ln(e)==="v").map(txt).filter(x=>x);if(ls.length)items.push(["v",ls])}
    else if(n==="epigraph"||n==="cite"){const x=txt(c);if(x)items.push(["p",x])}}};
  for(const body of kids(root).filter(e=>ln(e)==="body")){if(body.getAttribute("name")==="notes")continue;for(const s of kids(body).filter(e=>ln(e)==="section"))walk(s,0)}
  return{items,cover,meta}},
 htmlItems(html){const items=[];let buf=[],tag=null,lines=[],skip=0;const BL=["h1","h2","h3","h4","p","div","li","blockquote"];
  const flush=()=>{lines.push(MK.clean(buf.join("")));buf=[];const L=lines.filter(x=>x);lines=[];if(!L.length)return;const text=L.join(" "),t=tag;
   if(t==="h1"||t==="h2")items.push([t==="h1"?"h1":"h2",text]);
   else if(t==="h3"||t==="h4")items.push(["sub",text]);
   else if(MK.isScene(text))items.push(["s",null]);
   else if(L.length>1&&L.every(x=>x.length<90))items.push(["v",L]);
   else items.push(["p",text])};
  const walk=n=>{if(n.nodeType===3){if(!skip)buf.push(n.data);return}if(n.nodeType!==1)return;const t=n.localName.toLowerCase();
   if(t==="script"||t==="style"){return}
   if(BL.includes(t)){flush();tag=t;for(const c of n.childNodes)walk(c);flush();tag=null}
   else if(t==="br"){lines.push(MK.clean(buf.join("")));buf=[]}
   else for(const c of n.childNodes)walk(c)};
  const d=new DOMParser().parseFromString(html,"text/html");walk(d.body);flush();return items},
 async epub(file){const z=await (await loadJSZip()).loadAsync(file),X=s=>new DOMParser().parseFromString(s,"application/xml");
  const cont=X(await z.file("META-INF/container.xml").async("string")),rf=[...cont.getElementsByTagName("*")].find(e=>e.localName==="rootfile"),op=rf.getAttribute("full-path"),base=op.includes("/")?op.slice(0,op.lastIndexOf("/")+1):"";
  const opf=X(await z.file(op).async("string")),all=[...opf.getElementsByTagName("*")],man={};
  for(const i of all.filter(e=>e.localName==="item"))man[i.getAttribute("id")]=i;
  let cover=null;const mc=all.find(e=>e.localName==="meta"&&e.getAttribute("name")==="cover"),cands=[];if(mc)cands.push(man[mc.getAttribute("content")]);
  for(const i of Object.values(man))if((i.getAttribute("properties")||"").includes("cover-image"))cands.push(i);
  for(const i of cands){if(i){const f=z.file(base+i.getAttribute("href"));if(f){cover=await f.async("blob");break}}}
  const meta={};const dt=all.find(e=>e.localName==="title"),dc=all.find(e=>e.localName==="creator");if(dt)meta.title=MK.clean(dt.textContent);if(dc)meta.author=MK.clean(dc.textContent);
  const items=[];for(const ref of all.filter(e=>e.localName==="itemref")){const it=man[ref.getAttribute("idref")];if(!it||!(it.getAttribute("media-type")||"").includes("html"))continue;
   const f=z.file(base+it.getAttribute("href"));if(!f)continue;items.push(...MK.htmlItems(await f.async("string")))}
  return{items,cover,meta}},
 blocksToItems(blocks){const items=[];for(const b of blocks){const L=b.split("\n").map(MK.clean).filter(x=>x);if(!L.length)continue;const one=L.join(" "),h=L.length===1?MK.looksHeading(one):null;
   if(h)items.push([h,one]);else if(MK.isScene(one))items.push(["s",null]);else if(L.length>1&&L.every(x=>x.length<60)&&L.length<=12)items.push(["v",L]);else items.push(["p",one])}return items},
 async txt(file){const buf=await file.arrayBuffer();let text;try{text=new TextDecoder("utf-8",{fatal:true}).decode(buf)}catch(_){text=new TextDecoder("windows-1251").decode(buf)}text=text.replace(/^﻿/,"");
  let blocks=text.replace(/\r/g,"").split(/\n\s*\n/).filter(b=>b.trim());if(blocks.length<5)blocks=text.replace(/\r/g,"").split("\n").filter(x=>x.trim());
  return{items:MK.blocksToItems(blocks),cover:null}},
 loadPdf(){return window.pdfjsLib?Promise.resolve(window.pdfjsLib):new Promise((ok,no)=>{const t=document.createElement("script");t.src="lib/pdf.min.js";t.onload=()=>{window.pdfjsLib.GlobalWorkerOptions.workerSrc="lib/pdf.worker.min.js";ok(window.pdfjsLib)};t.onerror=()=>no(new Error("PDF китобхонаи бор нашуд (интернет?)"));document.head.appendChild(t)})},
 async pdf(file,prog){const lib=await MK.loadPdf(),doc=await lib.getDocument({data:new Uint8Array(await file.arrayBuffer())}).promise,pages=[];
  for(let n=1;n<=doc.numPages;n++){const pg=await doc.getPage(n),tc=await pg.getTextContent(),rows=[];
   for(const it of tc.items){if(it.str===undefined||!it.transform)continue;const y=it.transform[5],x=it.transform[4],h=Math.abs(it.transform[3])||it.height||10;let r=rows.find(r=>Math.abs(r.y-y)<h*.4);if(!r){r={y,h,items:[]};rows.push(r)}r.items.push({x,s:it.str,w:it.width||0})}
   rows.sort((a,b)=>b.y-a.y);
   pages.push(rows.map(r=>{r.items.sort((a,b)=>a.x-b.x);let s="",px=null;for(const i of r.items){if(px!==null&&i.x-px>r.h*.15&&!s.endsWith(" ")&&!i.s.startsWith(" "))s+=" ";s+=i.s;px=i.x+i.w}return{text:s,x:r.items[0]?r.items[0].x:0,h:r.h}}).filter(l=>MK.clean(l.text)));
   if(n===Math.min(4,doc.numPages)){const smp=pages.flat().map(l=>l.text).join(" "),q=MK.quality(smp);
    if(!q.ok&&q.why==="garbled")throw Object.assign(new Error(MK.GARBLED),{guard:true});
    if(!q.ok&&q.why==="short"&&doc.numPages>=4&&smp.replace(/\s+/g,"").length<40)throw Object.assign(new Error(MK.SCAN),{guard:true})}
   if(prog&&(n%3===0||n===doc.numPages)){prog(n/doc.numPages);await new Promise(r=>setTimeout(r,0))}}
  const cnt={};for(const p of pages){const ls=p.map(l=>MK.clean(l.text));for(const x of [...ls.slice(0,2),...ls.slice(-2)])cnt[x]=(cnt[x]||0)+1}
  const rep=new Set(Object.keys(cnt).filter(x=>cnt[x]>Math.max(3,pages.length*.3)));
  const lens=pages.flat().map(l=>MK.clean(l.text)).filter(x=>x&&!rep.has(x)).map(x=>x.length).sort((a,b)=>a-b),typical=lens.length?lens[Math.floor(lens.length*.9)]:80;
  const blocks=[];let cur=[];const end=()=>{if(cur.length){blocks.push(cur.join("\n"));cur=[]}};
  for(const p of pages){if(!p.length)continue;const base=Math.min(...p.map(l=>l.x));
   for(const l of p){const x=MK.clean(l.text);if(!x||rep.has(x)||/^[\d\s\-–—]+$/.test(x))continue;
    const indent=l.x-base;if(indent>=l.h*.6&&cur.length)end();
    if(MK.looksHeading(x)&&x.length<70){end();blocks.push(x);end();continue}
    const last=cur[cur.length-1];
    if(last&&last.endsWith("-")&&x[0]===x[0].toLowerCase()&&x[0]!==x[0].toUpperCase())cur[cur.length-1]=last.slice(0,-1)+x;else cur.push(x);
    if(/[.!?»”…]$/.test(x)&&x.length<typical*.72)end()}}
  end();
  const items=[];for(const b of blocks){const one=MK.clean(b.split("\n").join(" ")),h=MK.looksHeading(one);if(h&&!b.includes("\n"))items.push([h,one]);else if(MK.isScene(one))items.push(["s",null]);else items.push(["p",one])}
  return{items,cover:null}},
 structure(items,chunk=40){const kinds=new Set(items.map(i=>i[0])),hasParts=kinds.has("h1")&&kinds.has("h2");let parts=[],part=null,ch=null;
  const newPart=t=>{part={title:t,chapters:[]};parts.push(part);ch=null},newCh=t=>{if(!part)newPart("");ch={id:"",title:t,blocks:[]};part.chapters.push(ch)};
  for(const[k,v]of items){if(k==="h1"&&hasParts)newPart(v);else if(k==="h1"||k==="h2")newCh(v);else{if(!ch)newCh("Сарсухан");ch.blocks.push(k==="p"?["p",v]:k==="v"?["v",v]:k==="sub"?["sub",v]:["s"])}}
  if(parts.length===1&&parts[0].chapters.length===1&&parts[0].chapters[0].blocks.length>chunk*1.5){const allb=parts[0].chapters[0].blocks,out=[];for(let i=0;i<allb.length;i+=chunk)out.push({id:"",title:"Қисми "+(Math.floor(i/chunk)+1),blocks:allb.slice(i,i+chunk)});parts[0].chapters=out}
  let n=0;for(const pt of parts){pt.chapters=pt.chapters.filter(c=>c.blocks.length||c.title);for(const c of pt.chapters){n++;c.id="c"+n}}
  return parts.filter(p=>p.chapters.length)},
 report(book){let paras=0,chars=0,chs=0,longest=[0,""];for(const pt of book.parts)for(const c of pt.chapters){chs++;const n=c.blocks.length;paras+=n;if(n>longest[0])longest=[n,c.title];
   for(const b of c.blocks)chars+=b[0]==="p"||b[0]==="sub"?b[1].length:b[0]==="v"?b[1].reduce((a,x)=>a+x.length,0):0}
  const allt=JSON.stringify(book.parts),warns=[];
  if(!chs||!paras)warns.push("Матн ёфт нашуд (PDF-и скан бошад, аввал OCR лозим).");
  const bad=[...allt].filter(c=>c==="�"||(c>=""&&c<="")).length;if(allt&&bad/Math.max(1,allt.length)>.002)warns.push(bad+" ҳарфи шубҳанок (ҳарфҳои қадимии PDF): матн таҳрири даврӣ мехоҳад.");
  const cyr=[...allt].filter(c=>c>="Ѐ"&&c<="ӿ").length;if(cyr>2000&&!/[ғӣқӯҳҷҒӢҚӮҲҶ]/.test(allt))warns.push("Ҳарфҳои тоҷикӣ (ғ ӣ қ ӯ ҳ ҷ) ёфт нашуд: забони дигар ё рамзгузории нодуруст.");
  if(longest[0]>600)warns.push("Боби «"+longest[1]+"» хеле дароз ("+longest[0]+" сархат): тақсим кардан беҳтар.");
  return{chs,paras,chars,warns}},
 async shrinkCover(blob){try{const u=URL.createObjectURL(blob),im=await new Promise((ok,no)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=no;i.src=u});
   const s=Math.min(1,700/im.width,1050/im.height),cv=document.createElement("canvas");cv.width=Math.round(im.width*s);cv.height=Math.round(im.height*s);cv.getContext("2d").drawImage(im,0,0,cv.width,cv.height);URL.revokeObjectURL(u);
   return await new Promise(r=>cv.toBlob(r,"image/jpeg",.85))}catch(_){return blob}},
 /** Асосӣ: файл → {book, blob(.kitob), file, rep}. prog(0..1, матн) */
 async convert(file,o,prog){const P=(p,t)=>prog&&prog(p,t),ext=(file.name.match(/\.([^.]+)$/)||[])[1]?.toLowerCase();
  const R={docx:()=>MK.docx(file),fb2:()=>MK.fb2(file),epub:()=>MK.epub(file),txt:()=>MK.txt(file),pdf:()=>MK.pdf(file,p=>P(.1+p*.5,"Саҳифаҳо хонда мешаванд…"))}[ext];
  if(!R)throw new Error("Формат дастгирӣ намешавад: ."+ext+" (мумкин: PDF, DOCX, EPUB, FB2, TXT; .doc-ро аввал .docx кунед)");
  P(.05,"Файл хонда мешавад…");const r=await R();P(.65,"Сохтор (боб, шеър) аниқ мешавад…");
  const title=(o.title||(r.meta&&r.meta.title)||file.name.replace(/\.[^.]+$/,"").replace(/[_]+/g," ")).trim(),author=(o.author||(r.meta&&r.meta.author)||"").trim();
  if(!author)throw new Error("Муаллифро нависед");
  const book={id:o.slug||MK.slug(title),title,author,category:(GENRES.find(g=>g[0]===o.category)||GENRES[0])[1],lang:"tg"};
  book.parts=MK.structure(r.items);const rep=MK.report(book);
  if(!rep.chs||!rep.paras)throw Object.assign(new Error(MK.SCAN),{rep,guard:true});
  const all=[];for(const pt of book.parts)for(const c of pt.chapters)for(const b of c.blocks)all.push(b[0]==="v"?b[1].join(" "):b[0]==="s"?"":b[1]);
  const q=MK.quality(all.join(" "));if(!q.ok)throw Object.assign(new Error(q.why==="garbled"?MK.GARBLED:MK.SCAN),{rep,guard:true});
  let cv=o.cover||r.cover,cb=null;if(cv){cb=await MK.shrinkCover(cv);book.cover="cover.jpg"}
  P(.75,"Бастабандӣ (.kitob)…");const Z=await loadJSZip(),z=new Z();z.file("book.json",JSON.stringify(book));if(cb)z.file("cover.jpg",cb);
  const blob=await z.generateAsync({type:"blob",compression:"DEFLATE"});
  return{book,blob,file:new File([blob],book.id+".kitob"),rep,hasCover:!!cb}}
};

// ===== Тирезаи «Сохтани китоб» (админ ва ёрдамчӣ) =====
let MKS={file:null,title:"",author:"",cat:"fiction",cover:null,busy:false,res:null,err:""};
function admMakeHTML(X){const d=MKS;
 return `<div class="sh-head"><b class="sh-t">Сохтани китоб</b>${X}</div>
  <p class="set-note" style="margin-top:0">Файли китобро интихоб кунед (PDF, Word, EPUB, FB2, TXT). Барнома дар худи браузер .kitob месозад ва худкор <b>пинҳон</b> фиристода мешавад. Матн ҳеҷ гоҳ тағйир намеёбад.</p>
  <label class="mk-file${d.file?" on":""}" for="mkf">${P('<path d="M12 16V4M7 9l5-5 5 5M5 20h14"/>',2)}<span id="mkfn">${d.file?escH(d.file.name):"Файлро интихоб кунед"}</span></label><input type="file" id="mkf" accept=".pdf,.docx,.epub,.fb2,.txt" hidden>
  <label class="pe-l" for="mkt">Номи китоб</label><input class="pe-i" id="mkt" value="${escH(d.title)}" autocomplete="off" placeholder="Масалан: Гулистон">
  <label class="pe-l" for="mka">Муаллиф</label><input class="pe-i" id="mka" value="${escH(d.author)}" autocomplete="off" placeholder="Масалан: Саъдии Шерозӣ">
  <label class="pe-l" for="mkc">Бахш</label><select class="pe-i" id="mkc">${GENRES.map(g=>`<option value="${g[0]}"${d.cat===g[0]?" selected":""}>${g[1]}</option>`).join("")}</select>
  ${rightsHTML("mk",d.rt)}
  <label class="pe-l" for="mkv">Муқова (ихтиёрӣ; агар дар китоб бошад, худкор мегирад)</label><input class="pe-i" id="mkv" type="file" accept="image/*">
  ${d.err?`<p class="mk-err" translate="no">${escH(d.err)}</p>`:""}
  <div class="mk-prog" id="mkp" ${d.busy?"":"hidden"}><i id="mkbar" style="width:0%"></i></div><p class="mk-st" id="mkst" ${d.busy?"":"hidden"}></p>
  ${d.res?`<div class="mk-res"><b>Тайёр ✓ «${escH(d.res.book.title)}»</b><span>Боб: ${d.res.rep.chs} · сархат: ${d.res.rep.paras} · ҳарф: ${d.res.rep.chars}${d.res.hasCover?" · муқова ҳаст":""}</span>${d.res.rep.warns.map(w=>`<em>⚠ ${escH(w)}</em>`).join("")}<span>Китоб <b>пинҳон</b> фиристода шуд. Идоракунӣ → Китобҳо → «Таҳрир» → «Барои ҳама намоён»-ро белгилаб нашр кунед.</span></div>`:""}
  <button class="pay-btn" data-mk-go style="width:100%;margin-top:14px" ${d.busy?"disabled":""}>${d.res?"Яна як китоб":"Сохтан ва фиристодан"}</button>`}
function bindMake(){if(S.sheet!=="admmake")return;const d=MKS,$=id=>document.getElementById(id);
 const f=$("mkf");if(f)f.onchange=()=>{const x=f.files&&f.files[0];if(!x)return;d.file=x;d.res=null;d.err="";
  if(!d.title)d.title=x.name.replace(/\.[^.]+$/,"").replace(/[_]+/g," ");const n=$("mkfn");if(n)n.textContent=x.name;const t=$("mkt");if(t&&!t.value)t.value=d.title;document.querySelector(".mk-file").classList.add("on")};
 const t=$("mkt"),a=$("mka"),c=$("mkc"),v=$("mkv");if(t)t.oninput=()=>{d.title=t.value};if(a)a.oninput=()=>{d.author=a.value};if(c)c.onchange=()=>{d.cat=c.value};if(v)v.onchange=()=>{d.cover=v.files&&v.files[0]||null};
 const go=document.querySelector("[data-mk-go]");if(go)go.onclick=async()=>{
  if(d.res){MKS={file:null,title:"",author:"",cat:d.cat,cover:null,busy:false,res:null,err:""};render();return}
  if(!d.file){toast("Аввал файлро интихоб кунед");return}if(!d.author.trim()){toast("Муаллифро нависед");return}
  const rt=readRights("mk");d.rt={rs:rt.rights_status,rh:rt.rights_holder,src2:rt.source,ed:rt.edition,tr:rt.translator,ln:rt.license_note};
  d.busy=true;d.err="";go.disabled=true;const p=$("mkp"),b=$("mkbar"),s=$("mkst");p.hidden=false;s.hidden=false;
  const prog=(x,txt)=>{b.style.width=Math.round(x*100)+"%";s.textContent=Math.round(x*100)+"% · "+txt};
  try{prog(.02,"Оғоз…");const r=await MK.convert(d.file,{title:d.title,author:d.author,category:d.cat,cover:d.cover},prog);
   prog(.85,"Ба сервер фиристода мешавад…");await importZip(r.file,[],rt);prog(1,"Тайёр");d.res=r;d.busy=false;render();NATIVE.haptic(15)}
  catch(e){d.busy=false;d.err=(e&&e.message)||"Хато";if(!(e&&e.guard)){if(e&&e.rep&&e.rep.warns)d.err+=" "+e.rep.warns.join(" ");logErr("maker",d.err,e&&e.stack)}render()}}}