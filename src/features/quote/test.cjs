// Иқтибос: ишора кардани матн → меню → корт (амудӣ/мураббаъ) → мубодила
module.exports=async t=>{
 const P=t.page;
 await t.open({view:'home',pref:{dir:'v',th:'paper',fs:19,ff:'serif'}});
 await P.evaluate(()=>{const bl=[];for(let i=0;i<12;i++)bl.push(["p","Ин ҷумлаи санҷишӣ барои иқтибос аст, ки бояд ба корт дуруст ҷо шавад. "+"Китоб ҳаёт модар дарё. ".repeat(6)]);
  BOOKS.push({id:779,t:"Китоби санҷишӣ",a:"Муаллифи санҷишӣ",c:"fiction",col:["#1f4f7a","#123352"],tp:"x"});TX[779]={parts:[{title:"Қисми якум",chapters:[{title:"Боби 1",blocks:bl}]}]};openBook0(779)});
 await P.waitForTimeout(900);
 t.ok(await P.evaluate(()=>!!RD&&RD.vert),'хонанда дар ҳолати вертикалӣ');
 await P.evaluate(()=>{const p=document.querySelector('#rdflow p'),r=document.createRange();r.selectNodeContents(p);const s=getSelection();s.removeAllRanges();s.addRange(r)});
 await P.waitForTimeout(500);
 t.ok(await P.evaluate(()=>{const m=document.querySelector('.qt-menu');return !!m&&/Нусха/.test(m.textContent)&&/Иқтибос/.test(m.textContent)}),'ишора кардан: менюи «Нусха» / «Иқтибос» пайдо шуд');
 await P.tap('[data-qtgo]');await P.waitForTimeout(700); // ламси ҳақиқӣ (touch), на click-и барномавӣ
 t.ok(await P.evaluate(()=>!!document.querySelector('.qt-bg')&&!document.querySelector('.qt-menu')),'ламс ба «Иқтибос»: варақ кушода шуд');
 t.eq(await P.evaluate(()=>[QT_SZ.t.join('x'),document.getElementById('qtcv').width+'x'+document.getElementById('qtcv').height]),['1080x1920','1080x1920'],'корти амудӣ 1080×1920');
 await P.evaluate(()=>document.querySelector('[data-qtf="q"]').click());await P.waitForTimeout(400);
 t.eq(await P.evaluate(()=>document.getElementById('qtcv').height),1080,'корти мураббаъ 1080×1080');
 t.ok(await P.evaluate(()=>{const c=document.getElementById('qtcv'),d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let dark=0;for(let i=0;i<d.length;i+=400)if(d[i]<80)dark++;return dark>20}),'дар корт матн кашида шуд');
 await P.evaluate(()=>document.querySelector('[data-qtx]').click());await P.waitForTimeout(200);
 t.ok(await P.evaluate(()=>!document.querySelector('.qt-bg')),'пӯшидан кор мекунад');
};
