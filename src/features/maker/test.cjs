module.exports=async t=>{
 await t.open({view:'me',role:'admin'});
 t.eq(await t.page.evaluate(()=>typeof MK),'undefined','коди китобясозӣ то лозим нашавад боргирӣ нашудааст');
 await t.page.evaluate(()=>lazy('maker'));
 const r=await t.page.evaluate(async()=>{const f=new File([new TextEncoder().encode("Боби 1\n\n"+"Ин матни санҷишӣ аст. ".repeat(20)+"\n\nБоби 2\n\n"+"Матни дуюм. ".repeat(20))],"t.txt");
  const o=await MK.convert(f,{title:"Санҷиш",author:"Али",category:"fiction",slug:"test"});const z=await (await loadJSZip()).loadAsync(o.blob);return JSON.parse(await z.file("book.json").async("string"))});
 t.ok(r&&r.parts&&r.parts.length>0,'TXT ба book.json табдил шуд');
 t.ok(await t.page.evaluate(()=>typeof MK.quality==='function'),'санҷиши сифат ҳаст');
};
