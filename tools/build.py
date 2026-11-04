#!/usr/bin/env python3
"""index.html-ро аз қисмҳои src/ мепайвандад (бо тартиби ном).
Истифода:  python3 tools/build.py          — index.html-ро менависад
           python3 tools/build.py --check  — санҷиш: index.html бо src/ мувофиқ аст?
Қоида: ҳамеша src/-ро таҳрир кунед, index.html худкор сохта мешавад."""
import os,sys,glob
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
parts=sorted(glob.glob(os.path.join(R,'src','*')))
out=''.join(open(p,encoding='utf8',newline='').read() for p in parts)
tgt=os.path.join(R,'index.html')
if '--check' in sys.argv:
    cur=open(tgt,encoding='utf8',newline='').read()
    if cur!=out:
        print('ХАТО: index.html бо src/ мувофиқ нест. Иҷро кунед: python3 tools/build.py');sys.exit(1)
    print('ok: index.html мувофиқ аст (%d қисм)'%len(parts));sys.exit(0)
open(tgt,'w',encoding='utf8',newline='').write(out)
print('index.html сохта шуд: %d қисм, %d байт'%(len(parts),len(out.encode('utf8'))))
