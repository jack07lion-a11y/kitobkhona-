// Синхронизатсия: қоидаи ихтилоф дар клиент + «аз нав насб» (тикланиш аз ҷавоби сервер). Қоидаи сервер: docs/sql-holat-test.sql
module.exports=async t=>{
 const P=t.page;
 // фурӯзон: корбар бо пешравӣ, токча ва хатчӯб
 await t.open({view:'home',uid:'u1',prog:{5:40,6:10},pages:{5:3},rdCh:{5:2},lib:{q:[5],d:[],c:[]},marks:{5:[1]}});
 const b=await P.evaluate(()=>buildSync());
 t.ok(b.prog['5'].v===40&&b.prog['5'].pg===3&&b.prog['5'].ch===2,'buildSync: пешравӣ + саҳифа + боб');
 t.ok(b.lib&&b.lib.t>0&&b.marks&&b.marks.t>0,'buildSync: токча ва хатчӯб бо вақт мераванд (корбари мавҷуда)');
 // тағйири токча → вақт нав мешавад
 const t1=await P.evaluate(()=>{const a=S.libT;S.lib.q.push(9);save();return[a,S.libT]});
 t.ok(t1[1]>=t1[0]&&t1[1]>0,'stamp: тағйири токча libT-ро нав мекунад');
 // «аз нав насб»: дастгоҳи холӣ + ҷавоби сервер → ҳама тикланад
 await t.open({view:'home',uid:'u1'});
 t.eq(await P.evaluate(()=>{const o=buildSync();return[Object.keys(o.prog).length,!!o.lib,!!o.marks]}),[0,false,false],'дастгоҳи холӣ: токча/хатчӯби холӣ ба сервер нафиристода мешавад (то серверро пахш накунад)');
 const ch=await P.evaluate(()=>applySync({prog:{'5':{v:75,pg:9,ch:4,t:1}},lib:{t:500,v:{q:[5],d:[7],c:[{id:1,n:'Дӯстдоштаҳо',ids:[5]}]}},marks:{t:500,v:{5:[100002]}}}));
 t.ok(ch,'applySync: тағйирот ҳаст');
 const st=await P.evaluate(()=>({p:S.prog[5],pg:S.pages[5],ch:S.rdCh[5],q:S.lib.q,d:S.lib.d,c:S.lib.c.length,m:S.marks[5],lt:S.libT}));
 t.eq([st.p,st.pg,st.ch,st.q,st.d,st.c,st.m,st.lt],[75,9,4,[5],[7],1,[100002],500],'тикланиш: пешравӣ, саҳифа, боб, токчаҳо, хатчӯб');
 // ихтилоф: пешравии маҳаллӣ баландтар → боқӣ мемонад; токчаи сервер кӯҳнатар → маҳаллӣ мемонад
 const keep=await P.evaluate(()=>{S.prog[5]=90;S.libT=900;S.lib={q:[1],d:[],c:[]};const c=applySync({prog:{'5':{v:75,pg:1,ch:1,t:1}},lib:{t:500,v:{q:[5],d:[],c:[]}}});return[c,S.prog[5],S.lib.q]});
 t.eq(keep,[false,90,[1]],'ихтилоф: баландтарин % ва токчаи нав ғолиб (маҳаллӣ)');
 // баромадан: маълумоти корбар аз телефон пок мешавад
 await P.evaluate(()=>{resetUserData()});
 t.eq(await P.evaluate(()=>[Object.keys(S.prog).length,S.lib.q.length,S.libT,S.uid,S.premium]),[0,0,0,'',false],'resetUserData: пешравӣ, токча, uid, премиум пок');
 // payload-и бад: коркард намешавад
 t.eq(await P.evaluate(()=>[applySync(null),applySync('x'),applySync({prog:{'1':null,'2':5}})]),[false,false,false],'applySync: payload-и нодуруст зарар намерасонад');
};
