const GENRES=[
 ["fiction","Адабиёти бадеӣ","Роман, ҳикоя ва повест",'<path d="M4 5c3-1.500 6-1.500 8 0v14c-2-1.500-5-1.500-8 0zM20 5c-3-1.500-6-1.500-8 0v14c2-1.500 5-1.500 8 0z"/>'],
 ["poetry","Шеър ва достон","Ғазал, рубоӣ, достон",'<path d="M5 20c4-1 8-5 11-13M9 14h6M12 11h6"/>'],
 ["classic","Классикаи тоҷик","Рӯдакӣ, Фирдавсӣ, Ҷомӣ, Айнӣ",'<path d="M3 9l9-5 9 5-9 5zM7 11.500V16c3 2 7 2 10 0v-4.500"/>'],
 ["science","Илмӣ-оммавӣ","Илм ба забони содда",'<circle cx="12" cy="12" r="2"/><path d="M12 4c5 0 8 8 0 16M12 4c-5 0-8 8 0 16M4 12c0-5 16-5 16 0M4 12c0 5 16 5 16 0"/>'],
 ["history","Таърих","Таърихи тоҷикон ва ҷаҳон",'<path d="M5 4h12v16H5zM9 8h4M9 12h4M9 16h2"/>'],
 ["religion","Динӣ-маърифатӣ","Китобҳои динӣ ва маънавӣ",'<path d="M12 3c2 3 5 4 5 8a5 5 0 01-10 0c0-4 3-5 5-8zM8 21h8"/>'],
 ["kids","Барои кӯдакон","Афсона, ҳикоя, алифбо",'<circle cx="12" cy="9" r="4"/><path d="M5 21c1-4 4-6 7-6s6 2 7 6"/>'],
 ["text","Китобҳои дарсӣ","Аз синф ба синф",'<path d="M3 9l9-5 9 5-9 5zM7 11.500V16c3 2 7 2 10 0v-4.500M21 9v6"/>'],
 ["exam","Омодагӣ ба ММТ","Тест ва маводҳои имтиҳон",'<path d="M6 3h9l4 4v14H6zM15 3v4h4M9.500 14l2 2 3.500-4"/>'],
 ["self","Рушди шахсӣ","Равоншиносӣ ва малака",'<path d="M12 3l2.500 5.500L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.500-.5z"/>'],
 ["bio","Тарҷумаи ҳол","Зиндагии шахсони бузург",'<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4.500 4.500-6.500 8-6.500s7 2 8 6.500"/>'],
];
const CHIPS=[["all","Ҳама"],["audio","Аудио дар роҳ"],...GENRES.map(g=>[g[0],g[1]])];
const GENRE_ALIAS={"адабиёт":"fiction","адабиёти бадеӣ":"fiction","шеър":"poetry","таърих":"history"};
function genreOf(n){const k=String(n||"").trim().toLowerCase();if(GENRE_ALIAS[k])return GENRE_ALIAS[k];const g=GENRES.find(x=>x[1].toLowerCase()===k||x[0]===k);return g?g[0]:"fiction"}

const chipList=()=>CHIPS.filter(c=>c[0]!=="audio"||FEAT("audio"));
const CATS=[["audio","Аудио дар роҳ","Дар нақлиёт ва кор гӯш кунед",'<path d="M4 15v-3a8 8 0 0116 0v3M4 15a2 2 0 012-2h1v6H6a2 2 0 01-2-2zM20 15a2 2 0 00-2-2h-1v6h1a2 2 0 002-2z"/>'],...GENRES];
function comm(){
 const cnt={audio:BOOKS.filter(b=>b.audio).length};GENRES.forEach(g=>cnt[g[0]]=BOOKS.filter(b=>b.c===g[0]).length);
 return `<section class="screen pad"><h1 class="title">Категория</h1>
  <div class="catlist">${CATS.filter(c=>c[0]!=="audio"||FEAT("audio")).map(([k,n,d,ic])=>`<button class="catrow" data-cat="${k}"><span class="cico">${P(ic,1.7)}</span><span class="txt"><b>${n}</b><span>${d}</span></span><span class="num">${cnt[k]}</span>${P(I.chev).replace('class="ico"','class="chev"')}</button>`).join("")}</div>
 </section>${tabs()}`;
}

/* ---- пайвасти тугмаҳо: category (аз bind() даъват мешавад) ---- */
function bindCategory($$){
 $$("[data-opensearch]",b=>b.onclick=()=>{S.q="";S.chip="all";openSearch()});
 $$("[data-closesearch]",b=>b.onclick=()=>{S.search=false;S.q="";S.chip="all";render()});
 $$("[data-cat]",b=>b.onclick=()=>{S.view="home";S.search=true;S.chip=b.dataset.cat;S.q="";render(true)});
 $$("[data-chip]",b=>b.onclick=()=>{S.chip=b.dataset.chip;render()});
 $$("[data-chip2]",b=>b.onclick=()=>{S.chip=b.dataset.chip2;S.q="";openSearch()});
 const q=document.getElementById("q");
 if(q)q.oninput=()=>{S.q=q.value;render(true)};
}
