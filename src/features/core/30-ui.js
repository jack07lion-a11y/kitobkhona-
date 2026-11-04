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
const fmt=s=>{s=Math.max(0,Math.floor(s));return String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0")};
const IC_DL='<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',IC_OK='<path d="M5 12.5l4.5 4.5L19 7"/>',IC_X='<path d="M6 6l12 12M18 6L6 18"/>',IC_MARK='<path d="M6 3h12v18l-6-4-6 4z"/>';
function gi(){return S.gender==="boy"?GLOVE:TAB[2][2]}
/* ---- Коди «танбал»: *.lazy.js дар index.html ҳамчун матни хомӯш (text/plain) мемонад ва фақат бо lazy("ном") иҷро мешавад ---- */
const LAZYD={};
function lazy(n){if(LAZYD[n])return;LAZYD[n]=1;const el=document.getElementById("lazy-"+n);if(!el){LAZYD[n]=0;throw new Error("lazy: "+n)}
 const s=document.createElement("script");s.text=el.textContent;document.head.appendChild(s);s.remove()}
