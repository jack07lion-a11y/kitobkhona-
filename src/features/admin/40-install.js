/* ===== Идоракунӣ → Омор: насб — телефонҳои ҳақиқӣ, ворид шуданд/нашуданд, қайта насб, моделҳо (docs/sql-qurilma.sql) ===== */
const barSeg=(n,tot,cls,t)=>tot>0&&n>0?`<i class="${cls}" style="flex:${n}" title="${t}"><span>${n}</span></i>`:"";
function admInstallHTML(){const f=S.fn||{},ok=f.phones!=null,ph=+f.phones||0,reg=+f.phones_reg||0,an=+f.phones_anon||0,ap=+f.phones_apk||0,wb=+f.phones_web||0;
 const mods=Array.isArray(f.models)?f.models:[],mx=Math.max(1,...mods.map(m=>+m.n||0));
 return `<p class="set-cap">Насб (телефони ҳақиқӣ), 30 рӯзи охир</p>
  <div class="ins">
   <div class="ins-t"><b id="fn_phones">${ok?ph:"–"}</b><span>телефони нав</span></div>
   <div class="ins-b" aria-hidden="true">${ok?barSeg(reg,ph,"g","Ворид шуданд")+barSeg(an,ph,"a","Ворид нашуданд"):""}</div>
   <div class="ins-l"><span><i class="g"></i>Ворид шуданд <b id="fn_reg2">${ok?reg:"–"}</b></span><span><i class="a"></i>Ворид нашуданд <b id="fn_anon">${ok?an:"–"}</b></span></div>
   <div class="ins-b" aria-hidden="true">${ok?barSeg(ap,ph,"b","APK")+barSeg(wb,ph,"w","Сайт ва iPhone"):""}</div>
   <div class="ins-l"><span><i class="b"></i>APK <b id="fn_apk">${ok?ap:"–"}</b></span><span><i class="w"></i>Сайт ва iPhone <b id="fn_web">${ok?wb:"–"}</b></span></div>
   <div class="ins-r"><span>Қайта насб (ҳамон телефон)</span><b id="fn_re">${f.reinstalls??"–"}</b></div>
   <div class="ins-r"><span>Юкланиши APK (GitHub, тахминан)</span><b id="gh_dl">${S.ghDl??"–"}</b></div>
  </div>
  ${mods.length?`<p class="set-cap">Моделҳо</p><div class="mdl">${mods.map(m=>`<div class="mdl-r"><span translate="no">${escH(m.model||"—")}</span><i style="width:${Math.max(6,Math.round((+m.n||0)/mx*100))}%"></i><b>${+m.n||0}</b></div>`).join("")}</div>`:""}`}
async function loadGhDl(){if(!canPerm("stats"))return;if(S.ghAt&&Date.now()-S.ghAt<10*60*1000)return;
 try{const r=await fetch("https://api.github.com/repos/jack07lion-a11y/kitobkhona-/releases?per_page=100");if(!r.ok)return;const j=await r.json();let n=0;
  for(const x of j){if(!/^apk-\d+$/.test(x.tag_name||""))continue;for(const a of x.assets||[])if(/\.apk$/.test(a.name))n+=+a.download_count||0}
  S.ghDl=n;S.ghAt=Date.now();const e=document.getElementById("gh_dl");if(e)e.textContent=n}catch(_){}}
