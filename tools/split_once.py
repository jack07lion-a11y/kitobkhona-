# Бо як маротиба: index.html-ро ба қисмҳои src/ тақсим мекунад (баъд аз ин танҳо src/ таҳрир мешавад)
import re,sys
P='index.html'
L=open(P,encoding='utf8',newline='').read().splitlines(keepends=True)
def seg(a,b): return ''.join(L[a-1:b-1])  # 1-based [a,b)
def w(name,txt): open('src/'+name,'w',encoding='utf8',newline='').write(txt)
# маркерҳо
css_start=6
css_end=next(i+1 for i,l in enumerate(L) if l.startswith('</style>'))   # line of </style>
js_open=next(i+1 for i,l in enumerate(L) if i>css_end and l.startswith('<script>') and len(l.strip())==8)
js_close=next(i+1 for i in range(len(L)-1,-1,-1) if L[i].startswith('</script>'))
print(css_start,css_end,js_open,js_close,len(L))
w('00-head.html',seg(1,css_start))
cuts=[css_start]+[i+1 for i,l in enumerate(L) if css_start<i+1<css_end and (l.startswith('/* ---------- ') or l.startswith('/* Layout'))]
names={}
cuts=sorted(set(cuts))
for k,a in enumerate(cuts):
    b=cuts[k+1] if k+1<len(cuts) else css_end
    w(f'10-css-{k+1:02d}.css',seg(a,b))
w('50-early.html',seg(css_end,js_open+1))
jc=[js_open+1,1217,1293,1494,1529,1649,1705,1773,1839,2164,2228]
jn=['core','covers','reader','player','sheets','contest','tabbar','screens','app','i18n','extras']
assert L[1216].startswith('/* ---------- illustrated') , L[1216][:40]
for k,a in enumerate(jc):
    b=jc[k+1] if k+1<len(jc) else js_close
    w(f'60-js-{k+1:02d}-{jn[k]}.js',seg(a,b))
w('99-tail.html',seg(js_close,len(L)+1))
