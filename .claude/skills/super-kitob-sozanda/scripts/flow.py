import sys,re,json
sys.path.insert(0,'.')
from lines import lines
LOW=set('абвгдежзийклмнопрстуфхцчшщъыьэюяёғӣқӯҳҷ')
def ok(x):
    t=x['t']; al=[c for c in t if c.isalpha()]
    if len(t.strip())<3 or not al: return False
    cr=sum(c in LOW for c in al)/len(al)
    if x['conf']>=70: return cr>=.7
    return x['conf']>=55 and cr>=.85 and not re.search(r'[0-9)(\"|\\/]',t) and len(t)>=8
def flow(fmt,pages,xmin_ratio=.0):
    paras=[];cur=''
    for p in pages:
        L=[x for x in lines(fmt%p) if ok(x)]
        L=[x for x in L if not re.fullmatch(r'\W*\d{1,3}\W*',x['t'])]
        if not L: continue
        mr=sorted(x['r'] for x in L)[int(len(L)*.8)]
        for x in L:
            t=re.sub(r'^[-—−–]{1,3}\s*','– ',x['t'].strip())
            t=re.sub(r'(?<=\s)[-–—]{1,3}(?=\s)','–',t)
            if cur and (t.startswith('– ')):
                paras.append(cur);cur=''
            if cur.endswith('-') and not cur.endswith(' -') and t[:1].islower(): cur=cur[:-1]+t
            else: cur=(cur+' '+t).strip()
            if x['r']<mr*0.90 and re.search(r'[.!?:»…]$|\.\.\.$',t):
                paras.append(cur);cur=''
    if cur: paras.append(cur)
    return paras
if __name__=='__main__':
    z=flow('tz/p-%02d.tsv',range(4,18)); h=flow('th/p-%02d.tsv',[4,5,7,8,9,11,12,14,15,16,18,19,21,22,23])
    json.dump({'z':z,'h':h},open('flow_raw.json','w'),ensure_ascii=False,indent=1)
    print(len(z),sum(map(len,z)),len(h),sum(map(len,h)))
    for p in z[:8]: print('Z',p[:160])
    print(z[-1][-200:])
    for p in h[-3:]: print('H',p[:200])
