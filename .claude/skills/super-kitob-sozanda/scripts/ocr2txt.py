#!/usr/bin/env python3
"""Натиҷаи ocr.sh (ПАПКА/tsv) -> матни саҳифавӣ бо чуқурӣ (пробел) ва сатри холӣ, ҳамчун pdftotext -layout. Саҳифаҳо бо \\f ҷудо.
Истифода: ocr2txt.py ПАПКА натиҷа.txt [--min-conf 55]"""
import sys,csv,glob,os,re,statistics,collections
src,out=sys.argv[1],sys.argv[2]
mc=55
if '--min-conf' in sys.argv: mc=float(sys.argv[sys.argv.index('--min-conf')+1])
LOW=set('абвгдежзийклмнопрстуфхцчшщъыьэюяёғӣқӯҳҷ')
def norm(t): return t.replace('ў','ӯ').replace('Ў','Ӯ').replace('ќ','қ').replace('ѓ','ғ').replace('љ','ҷ').replace('њ','ҳ').replace('ї','ӣ')
res=[]
for f in sorted(glob.glob(src+'/tsv/p-*.tsv')):
    rows=list(csv.reader(open(f,encoding='utf8'),delimiter='\t',quoting=csv.QUOTE_NONE))[1:]
    D=collections.OrderedDict()
    for r in rows:
        if len(r)<12 or not r[11].strip(): continue
        D.setdefault((r[2],r[3],r[4]),[]).append((float(r[10]),r[11],int(r[6]),int(r[7]),int(r[8]),int(r[9])))
    L=[]
    for k,v in D.items():
        conf=sum(c for c,*_ in v)/len(v);t=norm(' '.join(w[1] for w in v))
        al=[c for c in t if c.isalpha()]
        if conf<mc and not (len(al)>5 and sum(c in LOW for c in al)/len(al)>.85 and conf>=40): continue
        if re.search(r'[\\|]{1}',t) and conf<80: continue
        L.append(dict(t=t,l=min(w[2] for w in v),top=min(w[3] for w in v),r=max(w[2]+w[4] for w in v),h=max(w[5] for w in v)))
    if not L: res.append('');continue
    L.sort(key=lambda x:x['top'])
    cw=statistics.median([(x['r']-x['l'])/max(1,len(x['t'])) for x in L])
    lh=statistics.median([x['h'] for x in L]);left=min(x['l'] for x in L)
    # чапи асосӣ: перцентили 10
    ls=sorted(x['l'] for x in L);base=ls[len(ls)//10]
    lines=[];prev=None
    for x in L:
        if prev is not None and x['top']-prev['top']>lh*2.1: lines.append('')
        ind=max(0,round((x['l']-base)/cw)); lines.append(' '*ind+x['t']); prev=x
    res.append('\n'.join(lines))
open(out,'w',encoding='utf8').write('\f'.join(res));print(len(res),'саҳифа')
