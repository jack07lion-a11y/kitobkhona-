#!/usr/bin/env python3
"""Матни саҳифавӣ (pdftotext -layout, бо \\f байни саҳифаҳо) -> spec.json барои mkpdf/mkpayload.
Истифода: txt2spec.py матн.txt спек.json --mode prose|verse [--title ..] [--skip-pages N] [--min-sec K]
prose: сархат бо чуқурии сатри аввал, шеър бо чуқурии калон, сарлавҳа = ҳарфи калон ё сатри кӯтоҳи миёнаҷо.
verse: ҳамаи сатрҳо шеър (бо сарлавҳа аз ҳарфи калон ё сатри миёнаҷо).
Баъд ҲАТМАН сарлавҳаҳоро бинед (--show) ва қуттӣ ислоҳ кунед."""
import sys,re,json,argparse,collections
ap=argparse.ArgumentParser();ap.add_argument('src');ap.add_argument('out');ap.add_argument('--mode',default='prose')
ap.add_argument('--title',default='');ap.add_argument('--skip-pages',type=int,default=0);ap.add_argument('--max-blocks',type=int,default=350)
ap.add_argument('--trim-regex',default='',help='саҳифаи аввалине, ки ин матн дорад ва ҳама баъдаш бурида мешавад (мундариҷаи охир)');ap.add_argument('--drop-regex',default='',help='сатрҳои дорои ин матн (сарлавҳаи такрорӣ бо хато) бурида мешаванд');ap.add_argument('--show',action='store_true');ap.add_argument('--verse-block',type=int,default=0,help='ҳадди ғайримуқаррарии сатрҳои шеър дар як блок (0=ҳама)')
a=ap.parse_args()
pages=open(a.src,encoding='utf8').read().split('\f')[a.skip_pages:]
if a.trim_regex:
    for _i,_p in enumerate(pages):
        if re.search(a.trim_regex,_p) and _i>len(pages)*0.5: pages=pages[:_i];break
pages=[re.sub(r'(?m)^.*\.{6,}.*$','',_p) for _p in pages]
if a.drop_regex: pages=[re.sub(r'(?m)^.*(?:'+a.drop_regex+').*$','',_p) for _p in pages]
EOS=re.compile(r'[.!?»…:)]\s*$')
def up(t):
    al=[c for c in t if c.isalpha()];return len(al)>=3 and sum(c.isupper() for c in al)/len(al)>.8
# сарлавҳаю пойи такрорӣ
cnt=collections.Counter()
P=[]
for pg in pages:
    L=[(len(l)-len(l.lstrip()),l.strip()) for l in pg.split('\n')]
    P.append(L)
    for t in set(t for _,t in L if t and len(t)<70): cnt[t]+=1
# сарлавҳаи болои саҳифа (бо хатои OCR гуногун): префикси 5 ҳарфи сатри аввал
def _first(pg):
    for l in pg.split('\n'):
        if l.strip(): return l.strip()
    return ''
_pre=collections.Counter(re.sub(r'[^а-яғӣқӯҳҷё]','',_first(p).lower())[:5] for p in pages if len(_first(p))<48)
_hdr={k for k,c in _pre.items() if c>=6 and len(k)>=4}
def _strip_hdr(pg):
    L=pg.split('\n')
    for i,l in enumerate(L):
        if l.strip():
            if len(l.strip())<48 and re.sub(r'[^а-яғӣқӯҳҷё]','',l.strip().lower())[:5] in _hdr: L[i]=''
            break
    return '\n'.join(L)
pages=[_strip_hdr(_p) for _p in pages]
rep={t for t,c in cnt.items() if c>=max(8,0.2*len(pages)) and not re.fullmatch(r'[*\s]+',t)}
secs=[{'title':'','blocks':[]}];cur='';verse=[];pend_head=[]
def flush():
    global cur,verse
    if cur: secs[-1]['blocks'].append(['p',cur]);cur=''
    if verse: secs[-1]['blocks'].append(['v',verse]);verse=[]
def head(t):
    global pend_head
    t=re.sub(r'[¹²³⁴⁵⁶⁷⁸⁹⁰]+','',t);t=t.lstrip(':;,.- ');t=re.sub(r'(?<=\D)\s*\d{1,3}$','',t).strip()
    flush()
    if secs[-1].get('_fresh') and not secs[-1]['blocks']: secs[-1]['title']+=' '+t;return
    secs.append({'title':t,'blocks':[],'_fresh':True})
for L in P:
    L=[(i,t) for i,t in L]
    body=[(i,t) for i,t in L if t and t not in rep and not re.fullmatch(r'\d{1,4}',t)]
    if not body: continue
    long=[i for i,t in body if len(t)>35]
    left=sorted(long)[len(long)//10] if long else min(i for i,_ in body)
    mx=max(len(t) for _,t in body)
    prev_blank=True
    nbody=len(body)
    pm=a.mode
    if a.mode=='auto':
        cs=[t for _,t in body if len(t)>12];fr=sum(t[:1].isupper() or t[:1] in '«-–—' for t in cs)/max(1,len(cs));pm='verse' if fr>.72 else 'prose'
    raw=L
    for k,(i,t) in enumerate(raw):
        if not t: prev_blank=True; 
        if not t: 
            if a.mode=='verse' or True: pass
            continue
        if t in rep or re.fullmatch(r'\d{1,4}',t): continue
        if re.fullmatch(r'[*\s·•]+',t):
            flush();continue
        nxt=next((x for x in raw[k+1:] if True),None)
        nxt_blank=(k+1>=len(raw)) or not raw[k+1][1]
        is_cap=up(t) and len(t)<90 and not re.search(r'[()\[\]|:]',t)
        toks=t.split()
        if len(toks)>=3 and sum(len(x)==1 for x in toks)/len(toks)>.6: t=''.join(toks);toks=[t]   # «Р у боӣ» -> «Рубоӣ»
        centered=i>=left+9 and len(t)<62 and not EOS.search(t) and prev_blank and nxt_blank and pm=='prose'
        if is_cap:
            head(t);prev_blank=False;continue
        if centered and len(t)<=22:   # Қитъа, Маснавӣ, Рубоӣ, Ҳикоят...
            flush();secs[-1]['blocks'].append(['sub',t]);prev_blank=False;continue
        if centered:
            head(t);prev_blank=False;continue
        if secs[-1].get('_fresh'): secs[-1]['_fresh']=False
        if pm=='verse':
            if verse is not None:
                if prev_blank and verse and a.verse_block==0 and False: flush()
                verse.append(t)
            if prev_blank and len(verse)>1 and False: pass
        else:
            if i>=left+12 and len(t)<78:
                if cur: secs[-1]['blocks'].append(['p',cur]);cur=''
                verse.append(t)
            else:
                if verse: secs[-1]['blocks'].append(['v',verse]);verse=[]
                newp=(i>=left+3) or prev_blank and cur and EOS.search(cur) is not None
                t2=re.sub(r'^[-—−–]\s*','– ',t)
                if cur and newp: secs[-1]['blocks'].append(['p',cur]);cur=''
                if cur.endswith('-') and not cur.endswith(' -') and t2[:1].islower(): cur=cur[:-1]+t2
                else: cur=(cur+' '+t2).strip()
        prev_blank=False
    # охири саҳифа: шеър бо сархат ҷудо мешавад, матн идома меёбад
    if a.mode=='verse' and False: pass
    if pm=='prose' and verse: secs[-1]['blocks'].append(['v',verse]);verse=[]
    if pm=='verse' and cur: secs[-1]['blocks'].append(['p',cur]);cur=''
    if pm=='prose' and a.mode=='auto': pass
    # шеър: байни саҳифаҳо
    if a.mode=='verse':
        pass
flush()
for s in secs: s.pop('_fresh',None)
# шеър: блокро ба байтҳо (ҷуфтҳо) нагузоред; блоки калонро тақсим кун
out=[]
for s in secs:
    bl=[]
    for k,v in s['blocks']:
        if k=='v': v=[re.sub(r'(?<=[.,;:!?»…])\d{1,3}$','',x) for x in v]
        if k=='v' and len(v)>40:
            for j in range(0,len(v),20): bl.append(['v',v[j:j+20]])
        else: bl.append([k,v])
    t=s['title'].strip()
    if len(bl)>a.max_blocks:
        n=(len(bl)+a.max_blocks-1)//a.max_blocks;k=(len(bl)+n-1)//n
        for j in range(n): out.append({'title':(t+' ('+str(j+1)+')') if t else 'Қисми '+str(len(out)+1),'blocks':bl[j*k:(j+1)*k]})
    elif bl or t: out.append({'title':t or 'Қисми '+str(len(out)+1),'blocks':bl})
json.dump({'title':a.title,'sections':out},open(a.out,'w',encoding='utf8'),ensure_ascii=False)
tot=sum(len(s['blocks']) for s in out)
print('қисм:',len(out),'блок:',tot)
if a.show:
    for i,s in enumerate(out): print(i,len(s['blocks']),s['title'][:70])
