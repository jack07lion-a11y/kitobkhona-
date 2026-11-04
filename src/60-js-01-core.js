/* Supabase: Project URL ва anon key. Холӣ бошад — реҷаи намуна (demo). */
const OTPN=8,RESEND_SEC=60;
const SB_URL="https://hxtpmwxglfuabdvaeapj.supabase.co",SB_KEY="sb_publishable_hnpY6mKTu9ahVxjIbcKvkQ_gjv0tb39";
let sb=null;
async function sbSend(e){const c=await sbLoad();
 if(c){const{error}=await c.auth.signInWithOtp({email:e,options:{shouldCreateUser:true}});
  if(error)return/rate|limit|seconds/i.test(error.message)?"Каме сабр кунед ва аз нав кӯшиш кунед":"Хатоги рӯй дод. Баъдтар аз нав кӯшиш кунед";return""}
 return SB_URL?"Интернет нест ё сервер ҷавоб намедиҳад":""}
function sbLoad(){return new Promise(r=>{if(!SB_URL||!SB_KEY)return r(null);if(sb)return r(sb);
 const mk=()=>{try{sb=window.supabase.createClient(SB_URL,SB_KEY,{auth:{persistSession:true,autoRefreshToken:true}})}catch(e){sb=null}r(sb)};
 const load=(src,fail)=>{const t=document.createElement("script");t.src=src;t.onload=mk;t.onerror=fail;document.head.appendChild(t)};
 load("lib/supabase.min.js",()=>load("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js",()=>r(null)))})}
const escH=v=>String(v).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[c]);
const okMail=e=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
const IN_APK=!!window.KitobAndroid;
const BOOKS=IN_APK?[
 {id:900001,slug:"sadriddin-ayni-yoddoshtho",t:"Ёддоштҳо",a:"Садриддин Айнӣ",c:"fiction",col:["#1f4f7a","#123352"],audio:false,desc:"Хотираҳои Садриддин Айнӣ дар бораи кӯдакӣ, деҳа ва замони худ. 142 боб дар 4 қисм.",local:true,src:"books/yoddoshtho/book.json.gz",size:"0,8 МБ",cover:"books/yoddoshtho/cover.jpg"}
]:[];
const LOCALS=BOOKS.slice();
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
const P=(d,sw=1.8)=>`<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const FILL=d=>`<svg class="ico" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${d}</svg>`;
const I={
 search:'<circle cx="11" cy="11" r="7"/><path d="M16.5 16.5L21 21"/>',
 gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.6 15a1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"/>',
 bell:'<path d="M6 17V11a6 6 0 0112 0v6l1.5 2h-15zM10 21h4"/>',
 chev:'<path d="M9 5l7 7-7 7"/>',
 menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
 share:'<path d="M12 15V3M7.5 7.5L12 3l4.5 4.5M5 12v8h14v-8"/>',
 heart:'<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0112 7.5 4.3 4.3 0 0119.5 10c0 5.4-7.5 10-7.5 10z"/>',
 list:'<path d="M4 6l1.5 1.5L8 5M4 12l1.5 1.5L8 11M4 18l1.5 1.5L8 17M11 6h9M11 12h9M11 18h9"/>',
 flag:'<path d="M5 21V4M5 5c4-2 6 2 10 0 1.5-.7 3-.7 4 0v8c-1-.7-2.5-.7-4 0-4 2-6-2-10 0"/>',
 dl:'<path d="M6 3h8l4 4v14H6zM12 10v6M9.5 13.5L12 16l2.5-2.5"/>',
 head:'<path d="M4 15v-3a8 8 0 0116 0v3M4 15a2 2 0 012-2h1v6H6a2 2 0 01-2-2zM20 15a2 2 0 00-2-2h-1v6h1a2 2 0 002-2z"/>',
 shelf:'<path d="M5 3h4v18H5zM10 3h4v18h-4zM15.5 4.5l3.8-1 3.5 16.5-3.8 1z"/>',
 brief:'<rect x="3" y="7" width="18" height="13" rx="3"/><path d="M9 7V5h6v2M3 13h18"/>',
 cal:'<rect x="4" y="5" width="16" height="15" rx="3"/><path d="M4 10h16M9 3v4M15 3v4"/>',
 trophy:'<path d="M8 4h8v6a4 4 0 01-8 0zM8 6H4c0 3 1.5 4 4 4M16 6h4c0 3-1.5 4-4 4M12 14v4M8 20h8"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 star:'<path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.5 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z"/>',
};
const GLOVE='<g transform="translate(.500 3.200) scale(.9)"><path d="M1 7.500a4 4 0 014-4h1.500a4 4 0 014 4V11a2.500 2.500 0 01-2.500 2.500H3.500A2.500 2.500 0 011 11zM3 13.500V18h6.500v-4.500M3 15.800h6.500M1 9h3.200M5 6.200h3"/></g><g transform="translate(23.500 3.200) scale(-.9 .9)"><path d="M1 7.500a4 4 0 014-4h1.500a4 4 0 014 4V11a2.500 2.500 0 01-2.500 2.500H3.500A2.500 2.500 0 011 11zM3 13.500V18h6.500v-4.500M3 15.800h6.500M1 9h3.200M5 6.200h3"/></g>';
const ROSE_ART=`<defs>
<linearGradient id="rs1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c72a55"/><stop offset="1" stop-color="#8f1a3c"/></linearGradient>
<linearGradient id="rs2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e5466f"/><stop offset="1" stop-color="#c32c57"/></linearGradient>
<linearGradient id="rs3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f67d9c"/><stop offset="1" stop-color="#e04a73"/></linearGradient>
<linearGradient id="rl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3fbf7f"/><stop offset="1" stop-color="#0d7a52"/></linearGradient>
</defs>
<path d="M50 62C49 74 52 84 50 96" fill="none" stroke="#0d7a52" stroke-width="4" stroke-linecap="round"/>
<path d="M50 82C42 83 33 79 29 70c9-1 18 3 21 12z" fill="url(#rl)"/><path d="M50 82C43 78 38 75 33 72" stroke="#0a5f40" stroke-width="1.200" fill="none" stroke-linecap="round"/>
<path d="M50 74C59 75 67 71 71 62c-9-1-18 3-21 12z" fill="url(#rl)"/><path d="M50 74C58 70 63 67 68 64" stroke="#0a5f40" stroke-width="1.200" fill="none" stroke-linecap="round"/>
<path d="M44 66l-3 4M56 66l3 4" stroke="#0d7a52" stroke-width="2.600" stroke-linecap="round"/>
<g stroke="#fff" stroke-opacity=".28" stroke-width=".9">
<g fill="url(#rs1)"><ellipse cx="50" cy="22" rx="15" ry="17" transform="rotate(0 50 38)"/><ellipse cx="50" cy="22" rx="15" ry="17" transform="rotate(72 50 38)"/><ellipse cx="50" cy="22" rx="15" ry="17" transform="rotate(144 50 38)"/><ellipse cx="50" cy="22" rx="15" ry="17" transform="rotate(216 50 38)"/><ellipse cx="50" cy="22" rx="15" ry="17" transform="rotate(288 50 38)"/></g>
<g fill="url(#rs2)"><ellipse cx="50" cy="26" rx="11.500" ry="13.500" transform="rotate(36 50 38)"/><ellipse cx="50" cy="26" rx="11.500" ry="13.500" transform="rotate(108 50 38)"/><ellipse cx="50" cy="26" rx="11.500" ry="13.500" transform="rotate(180 50 38)"/><ellipse cx="50" cy="26" rx="11.500" ry="13.500" transform="rotate(252 50 38)"/><ellipse cx="50" cy="26" rx="11.500" ry="13.500" transform="rotate(324 50 38)"/></g>
<g fill="url(#rs3)"><ellipse cx="50" cy="30" rx="8.500" ry="10" transform="rotate(0 50 38)"/><ellipse cx="50" cy="30" rx="8.500" ry="10" transform="rotate(90 50 38)"/><ellipse cx="50" cy="30" rx="8.500" ry="10" transform="rotate(180 50 38)"/><ellipse cx="50" cy="30" rx="8.500" ry="10" transform="rotate(270 50 38)"/></g></g>
<circle cx="50" cy="38" r="6" fill="#b01f48"/>
<path d="M50 38c0-2.500 3-3 3.800-1 .8 2.400-1.600 4.600-4.200 4.200-3.200-.5-4.600-4-3-6.400 1.800-2.800 6-3.200 8.200-.8" fill="none" stroke="#ffd0dc" stroke-opacity=".8" stroke-width="1.300" stroke-linecap="round"/>
<path d="M38 20c3-4 7-6 12-6" stroke="#fff" stroke-opacity=".35" stroke-width="2" fill="none" stroke-linecap="round"/>`;
const GLOVE_ART=`<defs>
<linearGradient id="gb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f0504d"/><stop offset="1" stop-color="#a21c2b"/></linearGradient>
<linearGradient id="gt" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d23842"/><stop offset="1" stop-color="#8d1624"/></linearGradient>
</defs>
<g transform="translate(5 22) rotate(-12 22 40) scale(.94)"><path d="M8 24C-1 22-3 38 8 42c5 2 9-2 8-7z" fill="url(#gt)"/>
<path d="M6 24C6 9 15 2 26 2c11 0 16 9 16 20v18c0 6-4 10-10 10H14c-5 0-8-4-8-9z" fill="url(#gb)"/>
<path d="M12 30c6 3 18 3 26-2" stroke="#7d1620" stroke-opacity=".55" stroke-width="1.500" fill="none" stroke-linecap="round"/>
<rect x="10" y="48" width="26" height="14" rx="3" fill="#f6f1e4"/><path d="M10 50.500h26" stroke="#000" stroke-opacity=".12" stroke-width="2"/>
<path d="M14 54h18M14 58.500h18" stroke="#c9bfa6" stroke-width="1.500" stroke-linecap="round"/>
<path d="M16 12c4-4 12-5 18 0" stroke="#fff" stroke-opacity=".5" stroke-width="3" fill="none" stroke-linecap="round"/></g>
<g transform="translate(95 22) scale(-1 1) rotate(-12 22 40) scale(.94)"><path d="M8 24C-1 22-3 38 8 42c5 2 9-2 8-7z" fill="url(#gt)"/>
<path d="M6 24C6 9 15 2 26 2c11 0 16 9 16 20v18c0 6-4 10-10 10H14c-5 0-8-4-8-9z" fill="url(#gb)"/>
<path d="M12 30c6 3 18 3 26-2" stroke="#7d1620" stroke-opacity=".55" stroke-width="1.500" fill="none" stroke-linecap="round"/>
<rect x="10" y="48" width="26" height="14" rx="3" fill="#f6f1e4"/><path d="M10 50.500h26" stroke="#000" stroke-opacity=".12" stroke-width="2"/>
<path d="M14 54h18M14 58.500h18" stroke="#c9bfa6" stroke-width="1.500" stroke-linecap="round"/>
<path d="M16 12c4-4 12-5 18 0" stroke="#fff" stroke-opacity=".5" stroke-width="3" fill="none" stroke-linecap="round"/></g>
<path d="M50 7l1.800 3.800 4.200.6-3 3 .7 4.200L50 16.600l-3.700 2 .7-4.200-3-3 4.200-.6z" fill="#ffc93c"/>`;
const art=()=>S.gender==="boy"?GLOVE_ART:ROSE_ART;
const CROWN='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z"/></svg>';
const TAB=[
 ["home","Асосӣ",'<path d="M3 21h18M5 21v-9M19 21v-9M5 12h3M16 12h3M8 12a4 4 0 018 0M12 8V5.2M10.8 5.2h2.4M9.5 21v-4a2.5 2.5 0 015 0v4"/>'],
 ["lib","Китобхона",'<rect x="4" y="3" width="16" height="18" rx="2.2"/><path d="M4 12h16M8 12V7M11 12V5.5M14 12V8M8 21v-5M11 21v-6.5M14.500 21v-4.500"/>'],
 ["goal","Озмун",'<path d="M12 3c2.200 0 3.900.9 4.700 2.600 1.700.4 3.300 1.900 3.300 4 0 3-3.500 5-8 5s-8-2-8-5c0-2.100 1.600-3.600 3.300-4C8.100 3.900 9.800 3 12 3zM8.600 9.300c0-1.800 1.400-3 3.400-3s3.400 1.200 3.400 3c0 1.700-1.400 2.900-3.200 2.800-1.600-.1-2.500-1-2.400-2.100.1-1 1-1.700 2-1.500M12 14.500V21M12 18.600c-2.400.2-4-.7-4.800-2.400 2.200-.5 4 .1 4.800 2.400zM12 17.600c2.200-.3 3.600-1.200 4.400-2.800-2.100-.3-3.900.4-4.400 2.800z"/>'],
 ["comm","Категория",'<rect x="3.5" y="3.5" width="7.5" height="7.5" rx="2"/><rect x="13" y="3.5" width="7.5" height="7.5" rx="2"/><rect x="3.5" y="13" width="7.5" height="7.5" rx="2"/><circle cx="16.750" cy="16.750" r="3.800"/>'],
 ["me","Ҳисоб",'<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4.5 4.5-6.5 8-6.5s7 2 8 6.5"/>'],
];
const ORN='<svg class="o" viewBox="0 0 44 44"><g fill="none" stroke="#f3d99a" stroke-width="2"><rect x="12" y="12" width="20" height="20"/><rect x="12" y="12" width="20" height="20" transform="rotate(45 22 22)"/><circle cx="22" cy="22" r="4"/></g></svg>';
const LOGO=`<svg viewBox="0 0 100 100"><defs>
<linearGradient id="gl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#075a42"/><stop offset="1" stop-color="#2fb583"/></linearGradient>
<linearGradient id="gr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14a06b"/><stop offset="1" stop-color="#93e6b8"/></linearGradient>
<radialGradient id="gs" cx=".5" cy=".4" r=".7"><stop offset="0" stop-color="#ffe49a"/><stop offset="1" stop-color="#f2a928"/></radialGradient>
<radialGradient id="gh" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffd978" stop-opacity=".55"/><stop offset="1" stop-color="#ffd978" stop-opacity="0"/></radialGradient>
<clipPath id="cl"><path d="M5 78V47L21 17l11 18 8-8 10 20v37Q28 70 5 78z"/></clipPath>
<clipPath id="cr"><path d="M95 78V47L79 17 68 35l-8-8-10 20v37q22-8 45 0z"/></clipPath>
</defs>
<circle cx="50" cy="40" r="26" fill="url(#gh)"/>
<g stroke="#f4b73c" stroke-width="2.200" stroke-linecap="round"><path d="M50 17v-5M37 22l-3-4M63 22l3-4M28 33h-5M72 33h5"/></g>
<circle cx="50" cy="42" r="12" fill="url(#gs)"/>
<g transform="translate(0 12.400) scale(1 .86)"><path d="M5 78V47L21 17l11 18 8-8 10 20v37Q28 70 5 78z" fill="url(#gl)"/>
<path d="M95 78V47L79 17 68 35l-8-8-10 20v37q22-8 45 0z" fill="url(#gr)"/>
<g clip-path="url(#cl)"><path d="M21 17l11 18-7 14 6 36H50V47L40 27l-8 8z" fill="#03402c" fill-opacity=".38"/><path d="M5 47l16-30-5 22-6 14z" fill="#fff" fill-opacity=".08"/></g>
<g clip-path="url(#cr)"><path d="M79 17L68 35l7 14-6 36H50V47l10-20 8 8z" fill="#0a7a52" fill-opacity=".42"/><path d="M95 47L79 17l5 22 6 14z" fill="#fff" fill-opacity=".14"/></g>
<path clip-path="url(#cl)" d="M21 17l-8 13 4-2 4 5 3-6 4 3 3-3-3-5z" fill="#fff" fill-opacity=".95"/><path clip-path="url(#cr)" d="M79 17l8 13-4-2-4 5-3-6-4 3-3-3 3-5z" fill="#fff" fill-opacity=".95"/>
<path d="M50 47v37" stroke="#fff" stroke-opacity=".55" stroke-width="1.600"/>
<path d="M5 83Q28 75 49 88M95 83Q72 75 51 88" fill="none" stroke="#0b7d57" stroke-width="2.600" stroke-linecap="round"/>
<path d="M5 89Q28 81 49 94M95 89Q72 81 51 94" fill="none" stroke="#4fd391" stroke-width="2.600" stroke-linecap="round"/></g></svg>`;


const PARAS=[
 "Ин матни намуна аст. Дар нусхаи аслӣ дар ин ҷо матни пурраи китоб меистад. Мо онро танҳо барои санҷидани экрани хондан гузоштем.",
 "Китоб дӯсти беминнати инсон аст. Ҳар саҳифае, ки мехонем, ба мо як ҷаҳони нав мекушояд. Хонандаи доно аз ҳар сатр як дарс мегирад ва онро дар зиндагӣ ба кор мебарад.",
 "Бобоёни мо китобро азиз медоштанд. Онҳо дар шабҳои дарози зимистон дар гирди оташдон менишастанд ва достонҳои қаҳрамононро бо овози баланд мехонданд. Кӯдакон бошанд, бо чашмони пурзавқ гӯш медоданд.",
 "Имрӯз китоб ба телефони мо омадааст. Акнун дар роҳ, дар автобус ё пеш аз хоб метавонем чанд саҳифа хонем. Ҳатто бе интернет китоби боргирифта ҳамеша бо мост.",
 "Ҳар рӯз каме хондан одати хуб аст. Агар рӯзе бист дақиқа хонем, дар як сол даҳҳо китобро тамом мекунем. Барои ҳар ҳадафи иҷрошуда шумо мукофот мегиред.",
 "Барои саҳифаи нав канори рости экранро пахш кунед ё саҳифаро бо ангушт ба чап кашед. Барои бозгашт канори чапро пахш кунед."
];
const CHN=["Сарсухан","Боби якум","Боби дуюм","Боби сеюм"];
function chapters(b){return CHN.map((n,i)=>({n,ps:[0,1,2,3,4].map(j=>PARAS[(i*2+j)%PARAS.length])}))}
function tracks(b){const n=3+b.id%3;return Array.from({length:n},(_,i)=>({n:i?`Боби ${i}`:"Сарсухан",d:150+(b.id*37+i*53)%420}))}
const bk=id=>BOOKS.find(x=>x.id===id);
const ADM_COLS=[["#24443a","#122a22","Сабз"],["#7a2e1f","#4a1a12","Сурх"],["#3c2f6b","#231a45","Бунафш"],["#2c4a63","#1a2f40","Кабуд"],["#8a5a14","#5a3a0a","Зарди тира"],["#6b2f4a","#45192e","Гулобӣ"],["#3b3b3b","#1f1f1f","Хокистарӣ"]];
const ADM_CATS=GENRES.map(g=>[g[0],g[1]]);
const VBADGE='<span class="vbadge" title="Админ" aria-label="Админ"><svg width="22" height="22" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#2f8cf0"/><path d="M12 5.2l1.8 4 4.4.5-3.3 3 .9 4.3L12 14.800 8.200 17l.9-4.300-3.300-3 4.400-.5z" fill="#fff"/></svg></span>';
function shrinkImage(file,maxW,maxH){return new Promise((ok,no)=>{const u=URL.createObjectURL(file),im=new Image();
 im.onload=()=>{const k=Math.min(1,maxW/im.naturalWidth,maxH/im.naturalHeight),w=Math.round(im.naturalWidth*k),h=Math.round(im.naturalHeight*k),cv=document.createElement("canvas");
  cv.width=w;cv.height=h;cv.getContext("2d").drawImage(im,0,0,w,h);URL.revokeObjectURL(u);cv.toBlob(b=>b?ok(b):no(new Error("Расм кор накард")),"image/jpeg",.86)};
 im.onerror=()=>{URL.revokeObjectURL(u);no(new Error("Расмро кушода натавонистам"))};im.src=u})}
async function uploadCover(c,id,slug,file){
 const sl=slug||("b"+id),path=sl+"/cover-"+Date.now()+".jpg",blob=await shrinkImage(file,800,1200);
 let e=(await c.storage.from("books").upload(path,blob,{upsert:true,contentType:"image/jpeg"})).error;if(e)throw new Error("Муқова бор нашуд: "+e.message);
 e=(await c.from("books").update({cover_path:path,slug:sl}).eq("id",id)).error;if(e)throw new Error("Муқова сабт нашуд: "+e.message)}
async function loadBooks(c){try{const{data,error}=await c.from("books").select("*").order("id");if(error||!data)return;
 const cp=data.map(r=>r.cover_path).filter(Boolean);let urls={};
 if(cp.length){try{const{data:su}=await c.storage.from("books").createSignedUrls(cp,604800);(su||[]).forEach(x=>{if(x.signedUrl)urls[x.path]=x.signedUrl})}catch(_){}}
 BOOKS.length=0;LOCALS.forEach(b=>BOOKS.push(b));const sl=new Set(data.map(x=>x.slug).filter(Boolean));for(let i=BOOKS.length-1;i>=0;i--)if(BOOKS[i].local&&BOOKS[i].slug&&sl.has(BOOKS[i].slug))BOOKS.splice(i,1);data.forEach(r=>BOOKS.push({id:+r.id,t:r.t,a:r.a,c:r.c,col:[r.col1,r.col2],audio:!!r.audio,prem:!!r.premium,ebook:r.ebook!==false,desc:r.descr||"",db:true,pub:r.published!==false,slug:r.slug||"",tp:r.text_path||"",cover:urls[r.cover_path]||""}));
S.bkCache=BOOKS.filter(b=>b.db).map(b=>({...b}));save();
 S.recent=S.recent.filter(id=>bk(id))}catch(_){}}
async function loadRole(c){S.role="";try{const{data:s}=await c.auth.getSession();const u=s.session?.user;if(!u)return;
 const{data}=await c.from("profiles").select("role").eq("id",u.id).maybeSingle();S.role=data?.role==="admin"?"admin":data?.role==="subadmin"?"subadmin":""}catch(_){}}
// Ҳуқуқҳо: [калид, ном, тавсиф, пешфарзи ёрдамчӣ]. Админ ҳамаашро дорад. «Танҳо админ» ҳуқуқҳо ба ёрдамчӣ дода намешаванд.
const CAPS=[
 ["books","Китобҳо: илова, таҳрир, нест кардан","Идоракунӣ → Китобҳо",true],
 ["maker","Китоб ясаш (PDF, Word → .kitob)","Идоракунӣ → Китоб ясаш",false],
 ["reports","Хатоҳо ва пешниҳодҳо","Дидан ва «Ҳал шуд» кардан",true],
 ["stats","Омор (корбарон, хондан)","Рақамҳо дар Идоракунӣ",true],
 ["notif","Огоҳиномаҳо (ёдоварӣ, табрик)","Матн ва вақтро таҳрир кардан",false],
 ["news","Хабар фиристодан","Огоҳинома ба ҳамаи APK-ҳо",false],
 ["release","Нашри навсозии APK","Нашр ва қатъ кардан",false],
 ["gender","Санҷиши ҷинси профил","Дар Таҳрири профил",false]];
const ADMIN_ONLY=[["Ёрдамчиёнро таъин ва бардоштан","Фақат админ"],["Тугмаи Премиум","Фақат админ"],["Версияи ҳадди ақали APK","Фақат админ"],["Ҳуқуқҳои ёрдамчиёнро иваз кардан","Фақат админ"],["Админро бардоштан ё иваз кардан","Ҳеҷ кас, ба ҷуз худи админ"]];
const capOn=(p,k)=>{const d=CAPS.find(x=>x[0]===k);if(!d)return false;const v=(p||{})[k];return v===undefined||v===null?d[3]:!!v};
const canPerm=k=>S.role==="admin"||(S.role==="subadmin"&&capOn(S.perms,k));
async function loadPerms(c){S.perms={};try{const{data:s}=await c.auth.getSession();const u=s.session?.user;if(!u)return;const{data,error}=await c.from("profiles").select("perms").eq("id",u.id).maybeSingle();if(!error&&data&&data.perms&&typeof data.perms==="object")S.perms=data.perms}catch(_){}}
async function loadFlags(c){try{const{data,error}=await c.from("app_flags").select("*").eq("id",1).maybeSingle();if(!error&&data){const v=data.premium_on===true,m=+data.min_native||0;let ch=false;if(S.flags.premium!==v){S.flags.premium=v;ch=true}if((S.flags.min||0)!==m){S.flags.min=m;ch=true}const bk=data.backup_at?+new Date(data.backup_at):0;if(bk&&(S.flags.bk||0)!==bk){S.flags.bk=bk;ch=true}const wp=data.web_pub||"";if((S.flags.webPub||"")!==wp){S.flags.webPub=wp;ch=true}if(ch){save();if(S.view!=="login")render()}}}catch(_){}checkMin();webUpdCheck()}
async function loadStats(){if(S.role!=="admin"&&S.role!=="subadmin")return;try{const c=await sbLoad();if(!c)return;const{data,error}=await c.rpc("user_stats");if(error||!data)return;S.stats=data;
  const set=(k,v)=>{const e=document.getElementById("st_"+k);if(e)e.textContent=v};set("admin",data.admins);set("sub",data.subadmins);set("user",data.users);set("all",data.total);
  const{data:r}=await c.rpc("stats_summary");if(r){S.rs=r;set("dau",r.dau);set("wau",r.wau);set("mt",fmtT(r.sec_today));set("m7",fmtT(r.sec_7d))}}catch(_){}}
setInterval(()=>{if(S.view==="me"&&!S.sheet&&document.visibilityState==="visible")loadStats()},8000);
async function loadStaff(){if(S.role!=="admin")return;const c=await sbLoad();if(!c)return;
 try{const{data,error}=await c.rpc("staff_list");if(!error&&Array.isArray(data)&&JSON.stringify(data)!==JSON.stringify(S.staff)){S.staff=data;if(S.view==="me"&&!S.sheet)render()}}catch(_){}}
async function setStaff(email,role){const c=await sbLoad();if(!c){toast("Интернет нест");return false}
 try{const{data,error}=await c.rpc("set_role",{p_email:email,p_role:role});
  if(error){toast("Иҷозат дода нашуд. Аввал SQL-ро иҷро кунед");return false}
  if(data==="ok"){toast(role==="subadmin"?"Ёрдамчии админ таъин шуд":"Ёрдамчӣ бардошта шуд");await loadStaff();return true}
  toast(data==="no_user"?"Бо ин почта ҳисоб ёфт нашуд. Бигӯед, ки аввал дар барнома дохил шавад":data==="no_profile"?"Ин шахс ҳоло ном сабт накардааст. Бигӯед, ки аввал дохил шуда, номашро нависад":data==="is_admin"?"Ин шахс админ аст":"Иҷозат дода нашуд");return false}
 catch(_){toast("Интернет нест ё сервер ҷавоб намедиҳад");return false}}
async function syncServer(){const c=await sbLoad();if(!c)return;await loadBooks(c);await loadRole(c);await loadPerms(c);await loadFlags(c);await loadProfile(c);loadStats();save();await markHave();loadNotifCfg();if(S.view!=="login")render();pushNotifyCfg();tryRef();flushReports();flushErrs();sendRead();trackActive();bkCheck();if(canPerm("release"))loadRelAdmin();if(S.role==="admin"){loadStaff();if(/[?&]doira\b/.test(location.search))cxEditOn()}}
const TX={};
function txChapters(b){const d=TX[b.id];if(!d)return null;if(d._ch)return d._ch;const out=[];(d.parts||[]).forEach(pt=>(pt.chapters||[]).forEach((c,i)=>out.push({n:c.title||"",part:i===0?pt.title||"":"",bl:c.blocks||[]})));return d._ch=out}
let RQ="",RQT="",HITS=[],HI=-1,HITCI=-1,HITK=-1,HC=0,HCI=0;
function hl(s){s=String(s);if(!RQ)return escH(s);const l=s.toLowerCase(),q=RQ.toLowerCase();let i=0,o="",j;
 while((j=l.indexOf(q,i))>=0){o+=escH(s.slice(i,j))+`<mark class="rd-hit${HCI===HITCI&&HC===HITK?" cur":""}">`+escH(s.slice(j,j+q.length))+"</mark>";i=j+q.length;HC++}
 return o+escH(s.slice(i))}
function blocksHTML(bl){return bl.map(x=>x[0]==="p"?`<p>${hl(x[1])}</p>`:x[0]==="v"?`<div class="rd-v">${(x[1]||[]).map(hl).join("<br>")}</div>`:x[0]==="sub"?`<p class="rd-sub">${hl(x[1])}</p>`:x[0]==="s"?`<p class="rd-sep">* * *</p>`:"").join("")}
async function gunzipJSON(blob){const st=blob.stream().pipeThrough(new DecompressionStream("gzip"));return JSON.parse(await new Response(st).text())}
const bpath=b=>b&&(b.tp||b.src);
const cacheOK=()=>typeof caches!=="undefined";
async function cacheGet(k){try{if(!cacheOK())return null;return await (await caches.open("kitob-books")).match(k)}catch(_){return null}}
async function cachePut(k,r){try{if(cacheOK())await (await caches.open("kitob-books")).put(k,r)}catch(_){}}
async function haveBook(b){if(S.hv&&S.hv[b.id])return true;return !!(await cacheGet("https://kitob.local/"+bpath(b)))}
async function markHave(){let ch=false;for(const b of BOOKS)if(bpath(b)){const h=await haveBook(b);if(h!==!!b.have){b.have=h;ch=true}}if(ch&&S.view!=="login"&&S.view!=="read")render()}
async function readAsset(b){
 if(window.KitobAndroid){const bin=atob(window.KitobAndroid.asset(b.src)),u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);return new Blob([u])}
 const rs=await fetch(b.src);if(!rs.ok)throw new Error("asset");return await rs.blob()}
const DLP={};
async function fetchProg(url,onP){const rs=await fetch(url);if(!rs.ok)throw new Error("net");const tot=+rs.headers.get("content-length")||0,out=[];let got=0;
 if(!rs.body||!rs.body.getReader){const bl=await rs.blob();onP&&onP(99);return bl}
 const rd=rs.body.getReader();for(;;){const{done,value}=await rd.read();if(done)break;out.push(value);got+=value.length;
  onP&&onP(Math.min(99,tot?Math.round(got/tot*100):Math.round(got/(got+250000)*90)))}
 return new Blob(out)}
function setDLP(id,p){if(p==null)delete DLP[id];else DLP[id]=p;
 document.querySelectorAll(`.bd-btn[data-read="${id}"],[data-dlbook="${id}"]`).forEach(e=>{
  if(e.classList.contains("bd-btn")){e.classList.toggle("ing",p!=null);if(p==null)e.style.removeProperty("--p");else{e.style.setProperty("--p",p+"%");const l=e.querySelector(".lb");if(l)l.textContent="Боргирӣ… "+p+"%"}}
  else if(p!=null){e.classList.add("ing");e.innerHTML="<small>"+p+"%</small>"}else e.classList.remove("ing")})}
async function fetchBook(b){if(DLP[b.id]!=null)return false;setDLP(b.id,0);try{return await loadText(b,p=>setDLP(b.id,p))}finally{setDLP(b.id,null)}}
async function loadText(b,onP){if(TX[b.id])return true;const key="https://kitob.local/"+bpath(b);
 try{let blob=null;const hit=await cacheGet(key);if(hit)blob=await hit.blob();
  if(!blob&&b.src){blob=await readAsset(b);await cachePut(key,new Response(blob))}
  if(!blob){const c=await sbLoad();if(!c)return false;let data=null;try{const{data:su}=await c.storage.from("books").createSignedUrl(b.tp,3600);if(su&&su.signedUrl)data=await fetchProg(su.signedUrl,onP)}catch(_){data=null}
   if(!data){const r=await c.storage.from("books").download(b.tp);if(r.error||!r.data)return false;data=r.data}
   blob=data;await cachePut(key,new Response(data))}
  TX[b.id]=await gunzipJSON(blob);b.have=true;if(b.src){S.hv=S.hv||{};S.hv[b.id]=true;save()}return true}catch(_){return false}}
const GENRE_ALIAS={"адабиёт":"fiction","адабиёти бадеӣ":"fiction","шеър":"poetry","таърих":"history"};
function genreOf(n){const k=String(n||"").trim().toLowerCase();if(GENRE_ALIAS[k])return GENRE_ALIAS[k];const g=GENRES.find(x=>x[1].toLowerCase()===k||x[0]===k);return g?g[0]:"fiction"}
function loadJSZip(){return window.JSZip?Promise.resolve(window.JSZip):new Promise((ok,no)=>{const t=document.createElement("script");t.src="lib/jszip.min.js";t.onload=()=>ok(window.JSZip);t.onerror=()=>{const u=document.createElement("script");u.src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";u.onload=()=>ok(window.JSZip);u.onerror=no;document.head.appendChild(u)};document.head.appendChild(t)})}
async function gzipBlob(text){return await new Response(new Blob([text]).stream().pipeThrough(new CompressionStream("gzip"))).blob()}
async function importZip(file,imgs){
 let z=null,raw;
 if(/\.json$/i.test(file.name)||file.type==="application/json")raw=await file.text();
 else{const JSZip=await loadJSZip();
  try{z=await JSZip.loadAsync(file)}catch(_){z=null}
  if(z){const jf=z.file("book.json")||z.file(/(^|\/)book\.json$/)[0];if(!jf)throw new Error("Дар файл book.json нест");raw=await jf.async("string")}
  else{raw=await file.text();if(!/^\s*\{/.test(raw))throw new Error("Файл китоб нест (.kitob, .zip ё book.json лозим)")}}
 let d;try{d=JSON.parse(raw)}catch(_){throw new Error("book.json нодуруст аст")}
 if(!d.title||!d.author||!Array.isArray(d.parts))throw new Error("Сохтори book.json нодуруст аст");
 const slug=String(d.id||d.title).toLowerCase().replace(/[^a-z0-9-]+/g,"-").replace(/^-+|-+$/g,"").slice(0,60)||("k"+Date.now());
 const c=await sbLoad();if(!c)throw new Error("Интернет нест");
 const st=c.storage.from("books"),tp=slug+"/book.json.gz";
 let e=(await st.upload(tp,await gzipBlob(raw),{upsert:true,contentType:"application/gzip"})).error;if(e)throw new Error("Матн бор нашуд: "+e.message);
 let cvp=null,cb=null,cn=d.cover?String(d.cover).split("/").pop():"";
 if(d.cover&&z){const cf=z.file(d.cover);if(cf)cb=await cf.async("blob")}
 if(!cb&&imgs&&imgs.length){const im=imgs.find(x=>x.name===cn)||(imgs.length===1?imgs[0]:null);if(im){cb=im;cn=cn||im.name}}
 if(cb){cvp=slug+"/"+cn;e=(await st.upload(cvp,cb,{upsert:true,contentType:/\.png$/i.test(cvp)?"image/png":"image/jpeg"})).error;if(e)throw new Error("Муқова бор нашуд: "+e.message)}
 const row={t:d.title,a:d.author,c:genreOf(d.category),slug,text_path:tp};if(cvp)row.cover_path=cvp;
 const{data:ex}=await c.from("books").select("id").eq("slug",slug).maybeSingle();
 const res=ex?await c.from("books").update(row).eq("id",ex.id):await c.from("books").insert({...row,published:false});
 if(res.error)throw new Error("Дар база сабт нашуд: "+res.error.message);
 try{(await caches.open("kitob-books")).delete("https://kitob.local/"+tp)}catch(_){}
 await loadBooks(c);return d.title}
function fmtPill(b,mini){const bits=[],T=mini?"span":"button",at=(txt,lab)=>mini?"":` data-fmt="${txt}" aria-label="${lab}"`,sz=mini?1.9:1.9;
 if(b.ebook!==false)bits.push(`<${T}${at("Шакли электронӣ: китобро дар барнома мехонед","Шакли электронӣ")}>${P('<path d="M3 5c3-1.500 6-1.500 9 0v14c-3-1.500-6-1.500-9 0zM21 5c-3-1.500-6-1.500-9 0v14c3-1.500 6-1.500 9 0z"/>',sz)}</${T}>`);
 if(b.audio)bits.push(`<${T}${at("Аудиокитоб: китобро гӯш мекунед","Аудиокитоб")}>${P(I.head,sz)}</${T}>`);
 if(b.prem&&PREM())bits.push(`<${T} class="pr"${at("Премиум: пурра хондан бо обуна","Премиум")}>${CROWN}</${T}>`);
 return bits.length?`<div class="fmt${mini?" sm":""}"${mini?"":' role="group" aria-label="Шаклҳои китоб"'}>${bits.join("")}</div>`:""}
function updBanner(){return "";const A=window.KitobAndroid,nat=!!(A&&A.downloadUpdate),st=S.updSt||"",x=`<button class="upd-x" data-updno aria-label="Пӯшидан">${P(IC_X,2.2)}</button>`;
 if(nat&&st==="down")return `<div class="upd"><div><b>Навсозӣ</b><span class="upd-sub">Боргирӣ… ${S.updP||0}%</span><i class="upd-bar" style="--p:${S.updP||0}%"></i></div></div>`;
 if(nat&&st==="ready")return `<div class="upd"><div><b>Навсозӣ тайёр аст</b><span>Барномаро аз нав оғоз кунед. Android «Навсозӣ»-ро мепурсад, пахш кунед</span></div><button class="upd-go" data-upd-install>Аз нав оғоз кардан</button></div>`;
 const err=nat&&st==="err",go=nat?`<button class="upd-go" data-upd-go>${err?"Аз нав кӯшиш кардан":"Боргирӣ"}</button>`:`<a class="upd-go" href="${esc(S.upd.url)}">Боргирӣ</a>`;
 return `<div class="upd"><div><b>Версияи нав омад</b><span>${err?"Боргирӣ нашуд. Интернетро санҷед":"Барои навсозӣ версияи навро боргирӣ кунед"}</span></div>${go}${x}</div>`}
window.__upd=(p,st)=>{S.updSt=st;S.updP=p;if(st==="down"){const el=document.querySelector(".upd-bar");if(el)el.style.setProperty("--p",p+"%");const sp=document.querySelector(".upd-sub");if(sp)sp.textContent="Боргирӣ… "+p+"%"}else render()};
function admHTML(){if(S.role!=="admin"&&S.role!=="subadmin")return "";
 const row=(ic,t,d,sh)=>`<div class="plan"><span class="round">${P(ic,2)}</span><div><b>${t}</b><span>${d}</span></div><button class="pill" data-sheet="${sh}">Кушодан</button></div>`;
const st=S.stats||{};
 return `<div class="sec"><div class="sec-h"><h2>Идоракунӣ</h2></div>
  ${canPerm("stats")?`
  <div class="stg"><div><small>Админ</small><b id="st_admin">${st.admins??"–"}</b></div><div><small>Ёрдамчӣ</small><b id="st_sub">${st.subadmins??"–"}</b></div><div><small>Истифодабарандагон</small><b id="st_user">${st.users??"–"}</b></div><div class="all"><small>Ҳамагӣ ба қайд гирифта шудаанд</small><b id="st_all">${st.total??"–"}</b></div></div>
  <div class="stg"><div><small>Имрӯз фаъол</small><b id="st_dau">${(S.rs||{}).dau??"–"}</b></div><div><small>7 рӯз фаъол</small><b id="st_wau">${(S.rs||{}).wau??"–"}</b></div><div><small>Хондан имрӯз</small><b id="st_mt" class="sm">${S.rs?fmtT(S.rs.sec_today):"–"}</b></div><div class="all"><small>Хондан дар 7 рӯз</small><b id="st_m7">${S.rs?fmtT(S.rs.sec_7d):"–"}</b></div></div>
  ${S.rs&&S.rs.top&&S.rs.top.length?`<p class="set-note" translate="no">${S.rs.top.map((t,i)=>(i+1)+". "+escH(t.title)+" — "+fmtT(t.sec)).join("<br>")}</p>`:""}
  `:""}
  <div class="nrow"><div class="ntx"><b>Нусхаи захира (GitLab)</b><small>Охирин нав кардан: ${new Date(bkLast()).toLocaleDateString()} · ${bkDays()} рӯз пеш${bkDue()?" · НАВ КАРДАН ЛОЗИМ":""}</small></div><button class="pill" data-bkdone>Анҷом шуд</button></div>
  ${S.role==="admin"?`<div class="nrow"><div class="ntx"><b>Премиум дар барнома</b><small>Хомӯш: ҳамаи китобҳо ройгон, навиштаҳои Премиум пинҳон. Ҳеҷ чиз нест намешавад</small></div><button class="swt${PREM()?" on":""}" data-flag="premium" role="switch" aria-label="Премиум"></button></div>`:""}
  ${canPerm("maker")&&canPerm("books")?row('<path d="M12 3v4M5 7h14v14H5zM9 12h6M9 16h4"/>',"Китоб ясаш","PDF, Word, EPUB → худкор ба барнома","admmake"):""}
  ${canPerm("books")?row('<path d="M3 5c3-1.500 6-1.500 9 0v14c-3-1.500-6-1.500-9 0zM21 5c-3-1.500-6-1.500-9 0v14c3-1.500 6-1.500 9 0z"/>',"Китобҳо","Китоби нав, zip, таҳрир","admbooks"):""}
  ${canPerm("reports")?row('<path d="M12 9v4M12 17h.01M10.3 3.9L2.4 18a2 2 0 001.7 3h15.800a2 2 0 001.700-3L13.700 3.900a2 2 0 00-3.400 0z"/>',"Хатоҳо ва пешниҳодҳо","Аз корбарон ва хатоҳои техникӣ","admrep"):""}
  ${canPerm("news")?row(I.bell,"Хабар фиристодан","Огоҳинома ба ҳамаи APK-ҳо","admnews"):""}
  ${canNotif()?row(I.bell,"Огоҳиномаҳо","Ёдоварӣ ва табрик: матн, вақт, хомӯш кардан","admnotif"):""}
  ${canPerm("release")?row('<path d="M12 3v12M7 10l5 5 5-5M5 20h14"/>',"Навсозии APK"+(relNew()?'<i class="rel-dot"></i>':""),relNew()?"Версияи нав тайёр: нашр кардан мумкин":"Нашр ва қатъ кардани навсозии APK","admrel"):""}
  ${S.role==="admin"?row('<circle cx="9" cy="8" r="3.500"/><path d="M2.500 20c.6-4 3.200-6 6.500-6s5.900 2 6.500 6M17 8v6M14 11h6"/>',"Ёрдамчиёни админ","Таъин кардан ва бардоштан","admstaff"):""}</div>`}
function admBooksHTML(X){const mine=BOOKS.filter(x=>x.db);
 return `<div class="sh-head"><b class="sh-t">Китобҳо</b>${X}</div>
  <div class="plan"><span class="round">${P('<path d="M12 5v14M5 12h14"/>',2)}</span><div><b>Китоби нав илова кардан</b><span>Танҳо ном ва муаллиф, бе матн</span></div><button class="pill" data-adm="new">Илова</button></div>
  <div class="plan"><span class="round">${P('<path d="M12 16V4M7 9l5-5 5 5M5 20h14"/>',2)}</span><div><b>Бастаи китоб (.kitob, zip ё book.json)</b><span>Якчанд китобро якбора интихоб кунед. Аввал пинҳон бор мешавад</span></div><label class="pill" for="admzip">Интихоб</label><input type="file" id="admzip" multiple hidden></div>
  ${mine.map(b=>`<div class="plan"><span class="sh-cv" style="width:38px;flex:none">${cover(b)}</span><div><b translate="no">${escH(b.t)}</b><span><span translate="no">${escH(b.a)}</span>${b.pub?"":' · <i class="hidden-tag">Пинҳон</i>'}</span></div><button class="pill" data-adm="edit" data-id="${b.id}">Таҳрир</button></div>`).join("")}`}
function admRelHTML(X){const pub=(S.rel&&S.rel.version)||0,b=S.rb,newer=relNew();
 return `<div class="sh-head"><b class="sh-t">Навсозии APK</b>${X}</div>
  <p class="set-note" style="margin-top:0">Тағйироти сайт (рӯйхат, дизайн, тарҷума) ҳамеша худкор ба ҳама мерасад, бе баннер. Ин ҷо танҳо навсозии иловаи Android.</p>
  ${admWebHTML()}
  ${S.role==="admin"?`<div class="nrow"><div class="ntx"><b>Версияи ҳадди ақал</b><small>Агар APK-и корбар аз ин кӯҳнатар бошад, барнома «навсозӣ кунед» мегӯяд. 0 — хомӯш</small></div><input id="minv" class="pe-i" style="width:76px;flex:none" inputmode="numeric" value="${(S.flags&&S.flags.min)||0}"><button class="pill" data-minv>Сабт</button></div>`:""}
  <div class="nrow"><div class="ntx"><b>Нашршуда</b><small>${pub?"#"+pub:"Қатъ шудааст"}</small></div></div>
  <div class="nrow"><div class="ntx"><b>Охирин сохташуда</b><small>${b?"#"+b.v+" · "+new Date(b.date).toLocaleDateString():(S.rbDone?"Ёфт нашуд":"Ҷустуҷӯ…")}</small></div></div>
  ${newer?`<button class="rel-go" data-rel-pub="${b.v}">Нашр кардан (#${b.v})</button><p class="set-note">Ҳама ба иловаи кушодашуда «Версияи нав омад»-ро мебинанд ва боргирӣ мекунанд</p>`:`<p class="set-note">${b?"Ҳама чиз нав аст":""}</p>`}
  ${pub?`<button class="pay-later" data-rel-stop>Қатъ кардан</button>`:""}`}
function admStaffHTML(X){
 const gear=`<button class="sh-gear" data-sheet="admrights" aria-label="Ҳуқуқҳо">${P('<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.200 4.200l2.100 2.100M17.700 17.700l2.100 2.100M2 12h3M19 12h3M4.200 19.800l2.100-2.100M17.700 6.300l2.100-2.100"/>',2)}</button>`;
 return `<div class="sh-head"><b class="sh-t">Ёрдамчиёни админ</b>${gear}${X}</div>
  <p class="set-note" style="margin-top:0">Почтаи шахсро нависед, то ӯ ёрдамчӣ шавад. Ҳар ёрдамчиро алоҳида танзим кунед: ҳуқуқро фурӯзон кунед — ӯ мебинад, хомӯш кунед — фавран нест мешавад. ⚙ — ҳуқуқҳои умумӣ.</p>
  <div class="sa-row"><input id="sa_mail" type="email" inputmode="email" autocapitalize="off" autocomplete="off" spellcheck="false" placeholder="nom@gmail.com"><button class="pill" data-sa-add>Таъин кардан</button></div>
  ${(S.staff||[]).filter(x=>x.role==="subadmin").map(x=>`<div class="sa-card"><div class="plan"><div><b translate="no">${escH(x.name||"")}</b><span translate="no">${escH(x.email||"")}</span></div><button class="pill" data-sa-del="${esc(x.email||"")}">Бардоштан</button></div>
   <div class="sa-all"><button class="pill" data-permall="${esc(x.email||"")}|1">Ҳамаро фурӯзон</button><button class="pill" data-permall="${esc(x.email||"")}|0">Ҳамаро хомӯш</button></div>
   ${CAPS.map(([k,t,s])=>`<div class="nrow"><div class="ntx"><b>${t}</b><small>${s}</small></div><button class="swt${capOn(x.perms,k)?" on":""}" data-perm="${k}" data-pm="${esc(x.email||"")}" role="switch" aria-label="${t}"></button></div>`).join("")}</div>`).join("")}`}
function admRightsHTML(X){
 const li=(t,ok,note)=>`<div class="hq-r ${ok?"hq-y":"hq-n"}"><i>${ok?"✓":"✕"}</i><span>${t}${note?` <small>${note}</small>`:""}</span></div>`;
 return `<div class="sh-head"><b class="sh-t">Ҳуқуқҳо</b>${X}</div>
  <p class="hq-h">Админ</p>
  ${CAPS.map(c=>li(c[1],true)).join("")}${ADMIN_ONLY.slice(0,4).map(c=>li(c[0],true)).join("")}${li("Админро бардоштан ё иваз кардан",true,"танҳо админ")}
  <p class="hq-h">Ёрдамчӣ <small>(пешфарз; ҳар ёрдамчиро алоҳида иваз кардан мумкин)</small></p>
  ${CAPS.map(c=>li(c[1],c[3])).join("")}${ADMIN_ONLY.map(c=>li(c[0],false,c[1])).join("")}
  <p class="set-note">Сабз — метавонад. Сурх — наметавонад. Ёрдамчӣ ҳеҷ гоҳ админро ҳазф ё иваз карда наметавонад.</p>`}
function admNotifHTML(X){const c=S.ncfg||{},L=S.ndl||I18N.lang,d=S.nd=S.nd||{remind_text:{...(c.remind_text||{})},congrats_tpl:{...(c.congrats_tpl||{})}};
 const sw=(k,t,s)=>`<div class="nrow"><div class="ntx"><b>${t}</b><small>${s}</small></div><button class="swt${(k==="sub_can_edit"?!!c[k]:c[k]!==false)?" on":""}" data-nc="${k}" role="switch" aria-label="${t}"></button></div>`;
 return `<div class="sh-head"><b class="sh-t">Огоҳиномаҳо</b>${X}</div>
  ${sw("remind_on","Ёдоварии ҳаррӯза","Агар имрӯз ҳатто 1 дақиқа нахонда бошанд, ба ҳама худкор меравад")}
  ${sw("congrats_on","Табрики хондан","Баъди баромадан аз барнома, дақиқаҳои имрӯзро мегӯяд")}
  <div class="nrow"><div class="ntx"><b>Соати ёдоварӣ</b><small>Аз 9 то 21</small></div><div class="stepper"><button data-nh="-1" aria-label="Камтар">−</button><b>${String(c.remind_hour||20).padStart(2,"0")}:00</b><button data-nh="1" aria-label="Бештар">+</button></div></div>
  ${S.role==="admin"?sw("sub_can_edit","Ёрдамчиён ҳам таҳрир кунанд","Агар хомӯш бошад, ёрдамчӣ ин бахшро намебинад"):""}
  <p class="set-cap" style="margin-top:14px">Матнҳо</p>
  <div class="seg sm" style="margin-bottom:8px">${LANGS.map(([k,n])=>`<button class="${L===k?"on":""}" data-ndl="${k}" translate="no">${n}</button>`).join("")}</div>
  <label class="ntl">Ёдоварӣ<textarea data-ndt="remind_text" rows="2" placeholder="${esc(cfgTxt(null,DEF_REMIND))}">${escH(d.remind_text[L]||"")}</textarea></label>
  <label class="ntl">Табрик (дақиқа: {n})<textarea data-ndt="congrats_tpl" rows="3" placeholder="${esc(cfgTxt(null,DEF_CONGRATS))}">${escH(d.congrats_tpl[L]||"")}</textarea></label>
  <button class="pay-btn" data-nsave style="margin-top:6px">Захира кардан</button>`}
const fmt=s=>{s=Math.max(0,Math.floor(s));return String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0")};
const FREE_PAGES=3,FREE_SEC=60;
const PREM=()=>!!(S.flags&&S.flags.premium===true);
const locked=b=>!!(PREM()&&b&&b.prem&&!S.premium);
const IC_DL='<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',IC_OK='<path d="M5 12.5l4.5 4.5L19 7"/>',IC_X='<path d="M6 6l12 12M18 6L6 18"/>',IC_MARK='<path d="M6 3h12v18l-6-4-6 4z"/>';
function gi(){return S.gender==="boy"?GLOVE:TAB[2][2]}
let S={view:"login",step:"email",email:"",uname:"",uid:"",chip:"all",q:"",ptab:0,search:false,recent:[],prog:{},confirmOut:false,pref:{fs:16,th:"sepia",ff:"serif",v2:1},pages:{},marks:{},mode:{},aprog:{},apos:{},dl:{},dlBook:{},premium:false,sheet:null,tocTab:0,au:null};
const app=document.getElementById("app");
try{const o=JSON.parse(localStorage.getItem("kitob10")||"null");if(o){Object.assign(S,o);S.upd=null;S.updSt="";S.updP=0;S.staff=null;S.sheet=null;S.loading=false;if(S.au)S.au.playing=false}}catch(e){}
if(["read","audio","book"].includes(S.view))S.view="home";S.au=null;if(!S.rdCh)S.rdCh={};if(!S.rdFr)S.rdFr={};if(!S.lib)S.lib={q:[],d:[],c:[]};if(!S.flags)S.flags={premium:false};if(!S.pref.v2){S.pref.fs=16;S.pref.v2=1}S.pref.fs=Math.max(13,Math.min(28,Math.round((S.pref.fs-13)/3)*3+13));S.rdUI=false;if(Array.isArray(S.bkCache))S.bkCache.forEach(b=>{if(b&&b.id&&!BOOKS.some(x=>x.id===b.id))BOOKS.push(b)});if(!S.pref.lh)S.pref.lh=1.6;
function save(){try{localStorage.setItem("kitob10",JSON.stringify({...S,sheet:null,loading:false}))}catch(e){}}
const esc=s=>s.replace(/"/g,"&quot;");

