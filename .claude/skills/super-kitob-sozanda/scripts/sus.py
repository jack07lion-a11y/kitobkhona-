import json,re,collections,sys
def text_of(secs):
    out=[]
    for s in secs:
        for k,v in s['blocks']: out+= v if k!='p' else [v]
    return out
def suspects(secs,minfreq=4):
    T=text_of(secs); AL='А-Яа-яғӣқӯҳҷёҒӢҚӮҲҶЁ'
    W=collections.Counter(w for t in T for w in re.findall('['+AL+']+',t.lower()))
    alpha='абвгдежзийклмнопрстуфхцчшщъыьэюяёғӣқӯҳҷ'
    def near(w):
        c=set()
        for i in range(len(w)+1):
            for a in alpha: c.add(w[:i]+a+w[i:])
        for i in range(len(w)):
            c.add(w[:i]+w[i+1:])
            for a in alpha: c.add(w[:i]+a+w[i+1:])
        for i in range(len(w)-1): c.add(w[:i]+w[i+1]+w[i]+w[i+2:])
        return c
    res={}
    for w,c in W.items():
        if c<=1 and len(w)>=4:
            best=max(((W.get(n,0),n) for n in near(w) if n!=w),default=(0,''))
            if best[0]>=minfreq: res[w]=best
    odd=[t for t in T if re.search(r'[A-Za-z0-9ѕїіґ|\\]',t)]
    return res,odd
if __name__=='__main__':
    secs=json.load(open(sys.argv[1]));res,odd=suspects(secs)
    print(len(res));print(' | '.join(f'{w}->{n}({c})' for w,(c,n) in sorted(res.items())))
    print('ODD',len(odd));[print('  ',t[:140]) for t in odd[:40]]
