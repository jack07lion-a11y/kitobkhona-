import csv,collections,re,sys
def norm(t): return t.replace('ў','ӯ').replace('Ў','Ӯ').replace('ќ','қ').replace('ѓ','ғ')
def lines(f):
    rows=list(csv.reader(open(f),delimiter='\t',quoting=csv.QUOTE_NONE))[1:]
    D=collections.OrderedDict()
    for r in rows:
        if len(r)<12 or not r[11].strip(): continue
        k=(r[2],r[3],r[4]); D.setdefault(k,[]).append((float(r[10]),r[11],int(r[6]),int(r[7]),int(r[8]),int(r[9])))
    out=[]
    for k,v in D.items():
        conf=sum(c for c,*_ in v)/len(v)
        out.append(dict(conf=conf,t=norm(' '.join(w[1] for w in v)),l=v[0][2],top=min(w[3] for w in v),h=max(w[5] for w in v),r=max(w[2]+w[4] for w in v)))
    return out
if __name__=='__main__':
    d,pre,rng=sys.argv[1],sys.argv[2],range(int(sys.argv[3]),int(sys.argv[4])+1)
    for p in rng:
        print('=== page',p)
        for L in lines(f'{d}/{pre}-{p:02d}.tsv'): print(round(L['conf']),L['l'],L['top'],L['h'],L['t'][:90])
