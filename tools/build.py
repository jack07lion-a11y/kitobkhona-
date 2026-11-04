#!/usr/bin/env python3
"""index.html-ро аз қисмҳои src/ мепайвандад (бо тартиби ном).
Истифода:  python3 tools/build.py          — index.html-ро менависад
           python3 tools/build.py --check  — санҷиш: index.html бо src/ мувофиқ аст?
Қоида: ҳамеша src/-ро таҳрир кунед, index.html худкор сохта мешавад."""
import os,sys,glob
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Сохтор: src/features.json — рӯйхати феатурҳо (тартиб муҳим). Ҳар феатур — папка дар src/features/<ном>/
# бо файлҳои *.css ва *.js (тартиби номӣ). Тартиб: head → ҳамаи CSS → early → ҳамаи JS → tail.
import json as _j
M=_j.load(open(os.path.join(R,'src','features.json'),encoding='utf8'))
def rf(p): return open(os.path.join(R,'src',p),encoding='utf8',newline='').read()
def feat_files(ext):
    r=[]
    for f in M['features']:
        d=os.path.join(R,'src','features',f)
        if not os.path.isdir(d): print('ХАТО: папкаи феатур нест: '+f);sys.exit(1)
        r+=sorted(glob.glob(os.path.join(d,'*.'+ext)))
    return r
_dirs=sorted(d for d in os.listdir(os.path.join(R,'src','features')) if os.path.isdir(os.path.join(R,'src','features',d)))
_miss=[d for d in _dirs if d not in M['features']]
if _miss: print('ХАТО: папка(ҳо)и феатур дар src/features.json нест: '+', '.join(_miss));sys.exit(1)
css=feat_files('css'); js_all=feat_files('js')
lazy=[p for p in js_all if p.endswith('.lazy.js')]; js=[p for p in js_all if not p.endswith('.lazy.js')]
data=[p for p in feat_files('json')]
parts=css+js+lazy+data
rdp=lambda p: open(p,encoding='utf8',newline='').read()
def inert(tag,idp,txt,typ):
    if '</script' in txt.lower() or '<!--' in txt: print('ХАТО: '+idp+' дорои </script ё <!-- аст');sys.exit(1)
    return '<script type="%s" id="%s">%s</script>\n'%(typ,idp,txt)
# Маълумот (*.json) ва коди танбал (*.lazy.js) — матни хомӯш, то ки браузер онро ҳангоми боргирӣ иҷро/таҳлил накунад.
# JSON: id="data-<феатур>-<ном>"; lazy: id="lazy-<феатур>" ва бо lazy("<феатур>") иҷро мешавад.
inerts=''.join(inert('s','lazy-'+os.path.basename(os.path.dirname(p)),rdp(p),'text/plain') for p in lazy)
inerts+=''.join(inert('s','data-%s-%s'%(os.path.basename(os.path.dirname(p)),os.path.basename(p)[:-5]),rdp(p),'application/json') for p in data)
early=rf(M['shell']['early']);k=early.rindex('<script>')
out=rf(M['shell']['head'])+''.join(rdp(p) for p in css)+early[:k]+inerts+early[k:]+''.join(rdp(p) for p in js)+rf(M['shell']['tail'])
# Нишони нусха: ҳэши мундариҷа (бе худи нишон) → WEB_H дар index.html ва version.json
import hashlib,json
TOKEN='__WEBH__'
H=hashlib.sha256(out.encode('utf8')).hexdigest()[:10]
out=out.replace(TOKEN,H)
VER=json.dumps({'h':H},separators=(',',':'))+'\n'
tgt=os.path.join(R,'index.html'); vtgt=os.path.join(R,'version.json')
if '--check' in sys.argv:
    cur=open(tgt,encoding='utf8',newline='').read()
    vcur=open(vtgt,encoding='utf8',newline='').read() if os.path.exists(vtgt) else ''
    if cur!=out or vcur!=VER:
        print('ХАТО: index.html/version.json бо src/ мувофиқ нест. Иҷро кунед: python3 tools/build.py');sys.exit(1)
    print('ok: index.html мувофиқ аст (%d файл, %s)'%(len(parts),H));sys.exit(0)
open(tgt,'w',encoding='utf8',newline='').write(out)
open(vtgt,'w',encoding='utf8',newline='').write(VER)
print('index.html сохта шуд: %d файл, %d байт, нусха %s'%(len(parts),len(out.encode('utf8')),H))
