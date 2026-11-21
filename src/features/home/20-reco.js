/* ===== Асосӣ: «Нав» (китобҳои ин ҳафта) ва «Барои шумо» (тавсия аз рӯи хондан ва ҷустуҷӯ) ===== */
const DAY7=7*864e5;
const newBooks=()=>{const t=Date.now();return BOOKS.filter(b=>b.db&&b.pub!==false&&b.ts&&t-b.ts<=DAY7).sort((a,b)=>b.ts-a.ts)};
const unseenNew=()=>newBooks().filter(b=>b.ts>(S.newSeen||0));
const isNewB=b=>!!(b&&b.db&&b.ts&&Date.now()-b.ts<=DAY7);
function markNewSeen(){const n=newBooks();if(n.length){S.newSeen=n[0].ts;save()}}
/* ҷустуҷӯи шумо: танҳо пас аз таваққуф (на ҳар ҳарф) ва ҳадди 12 то */
function pushQ(q){q=String(q||"").trim();if(q.length<3)return;S.qh=[q,...(S.qh||[]).filter(x=>x!==q)].slice(0,12);save()}
/* Нишонаҳои шумо: китобҳои кушодашуда, хондашуда, дар навбат, ҷустуҷӯ. Гуфтаҳо: жанр ва муаллиф */
function recoSignals(){
 const g={},a={};const add=(m,k,w)=>{if(k)m[k]=(m[k]||0)+w};
 (S.recent||[]).forEach((id,i)=>{const b=bk(id);if(b){add(g,b.c,2-i*.1);add(a,b.a,2-i*.1)}});
 Object.keys(S.prog||{}).forEach(id=>{const b=bk(+id);if(b&&S.prog[id]>0){add(g,b.c,3);add(a,b.a,3)}});
 [...((S.lib&&S.lib.q)||[]),...((S.lib&&S.lib.d)||[])].forEach(id=>{const b=bk(id);if(b){add(g,b.c,2);add(a,b.a,2)}});
 (S.qh||[]).forEach(q=>{const ts=q.toLowerCase().split(/\s+/).filter(x=>x.length>=3);
  GENRES.forEach(x=>{if(ts.some(w=>x[1].toLowerCase().includes(w)))add(g,x[0],1.5)});
  BOOKS.forEach(b=>{const h=(b.t+" "+b.a).toLowerCase();if(ts.some(w=>h.includes(w))){add(g,b.c,.6);add(a,b.a,.6)}})});
 return{g,a,has:Object.keys(g).length>0}}
function reco(n){
 n=n||12;const sg=recoSignals();
 const pool=BOOKS.filter(b=>b.pub!==false&&!isDone(b.id)&&!((S.prog&&S.prog[b.id])>0)).sort((x,y)=>(y.ts||0)-(x.ts||0));
 if(!pool.length)return[];
 if(!sg.has){ /* ҳанӯз нишона нест: жанрҳоро навбат ба навбат омехта мекунем, то ки танҳо як жанр набошад */
  const by={};pool.forEach(b=>(by[b.c]=by[b.c]||[]).push(b));const ks=Object.keys(by),out=[];
  for(let i=0;out.length<Math.min(n,pool.length);i++){let any=false;ks.forEach(k=>{if(by[k][i]&&out.length<n){out.push(by[k][i]);any=true}});if(!any)break}
  return out}
 const sc=b=>(sg.g[b.c]||0)+(sg.a[b.a]||0)*1.5+(isNewB(b)?1:0)+(b.ts||0)/1e14;
 const L=pool.slice().sort((x,y)=>sc(y)-sc(x));
 const top=Object.entries(sg.g).sort((x,y)=>y[1]-x[1])[0][0];
 const pref=L.filter(b=>b.c===top||(sg.a[b.a]||0)>0),oth=L.filter(b=>!pref.includes(b));
 const out=[];let pi=0,oi=0;
 while(out.length<n&&(pi<pref.length||oi<oth.length)){ /* ҳар чорумӣ — аз жанри дигар, то ки ҷаҳон танг нашавад */
  if(out.length%4===3&&oi<oth.length)out.push(oth[oi++]);else if(pi<pref.length)out.push(pref[pi++]);else out.push(oth[oi++])}
 return out}
const recoSub=()=>recoSignals().has?"Аз рӯи хондан ва ҷустуҷӯи шумо":"Барои оғоз, китобҳои гуногун";
