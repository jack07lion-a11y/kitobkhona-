#!/usr/bin/env python3
"""index.html-ро аз қисмҳои src/ мепайвандад (бо тартиби ном).
Истифода:  python3 tools/build.py          — index.html-ро менависад
           python3 tools/build.py --check  — санҷиш: index.html бо src/ мувофиқ аст?
Қоида: ҳамеша src/-ро таҳрир кунед, index.html худкор сохта мешавад."""
import os,sys,glob
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
parts=sorted(glob.glob(os.path.join(R,'src','*')))
out=''.join(open(p,encoding='utf8',newline='').read() for p in parts)
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
    print('ok: index.html мувофиқ аст (%d қисм, %s)'%(len(parts),H));sys.exit(0)
open(tgt,'w',encoding='utf8',newline='').write(out)
open(vtgt,'w',encoding='utf8',newline='').write(VER)
print('index.html сохта шуд: %d қисм, %d байт, нусха %s'%(len(parts),len(out.encode('utf8')),H))
