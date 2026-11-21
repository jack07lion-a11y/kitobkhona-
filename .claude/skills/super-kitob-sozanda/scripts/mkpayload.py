#!/usr/bin/env python3
"""spec.json -> payload.json (барои боргирӣ ба сервер, ПИНҲОН) + токени яккарата.
Истифода: mkpayload.py spec1.json [spec2.json ...] -> payload.json, tok.txt; ҳэши токенро чоп мекунад (ба Edge Function мегузорем).
spec: ҳамон spec барои mkpdf + {slug, author, category, col:[c1,c2], rights:{status,holder,source,edition,translator,note}}"""
import sys,json,secrets,hashlib
def cap(t):return t[0]+t[1:].lower() if t.isupper() else t
items=[]
for f in sys.argv[1:]:
    s=json.load(open(f));ch=[];n=0
    for sec in s['sections']:
        bl=[]
        for k,v in sec['blocks']:
            if k=='p':bl.append(['p',v])
            elif k=='v':bl.append(['v',v])
            elif k=='fn':bl.append(['sub','Шарҳи калимаҳо']);bl+=[['p',x] for x in v]
        if not bl:continue
        n+=1;ch.append({'id':f'c{n}','title':cap(sec['title']) if sec.get('title') else s['title'],'blocks':bl})
    # як боби бузург (>150 сархат) -> қисмҳо
    if len(ch)==1 and len(ch[0]['blocks'])>150:
        b=ch[0]['blocks'];k=(len(b)+2)//3;ch=[{'id':f'c{i+1}','title':f'Қисми {i+1}','blocks':b[i*k:(i+1)*k]} for i in range(3)]
    book={'id':s['slug'],'title':s['title'],'author':s['author'],'category':s.get('category','kids'),'lang':'tg','parts':[{'title':'','chapters':ch}]}
    r=s['rights']
    row={'t':s['title'],'a':s['author'],'c':s.get('category','kids'),'slug':s['slug'],'text_path':s['slug']+'/book.json.gz','col1':s.get('col',['#24443a','#122a22'])[0],'col2':s.get('col',['#24443a','#122a22'])[1],
         'published':False,'rights_status':r.get('status','pending'),'rights_holder':r.get('holder',''),'source':r.get('source',''),'edition':r.get('edition',''),'translator':r.get('translator',''),'license_note':r.get('note','')}
    items.append({'book':book,'row':row})
tok=secrets.token_hex(24);open('tok.txt','w').write(tok)
json.dump({'items':items},open('payload.json','w'),ensure_ascii=False)
print('ҳэши токен:',hashlib.sha256(tok.encode()).hexdigest());print([i['row']['slug'] for i in items])
