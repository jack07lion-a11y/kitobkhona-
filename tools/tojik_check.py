"""Санҷиши тоҷикии софи матнҳои барнома (src/**/*.js ва ҷадвали тарҷума).
Гузориш: python3 tools/tojik_check.py — ҳар сатри ёфтшуда калимаи ӯзбекӣ/русӣ дар матни тоҷикӣ аст.
Қоида: docs/ ва CLAUDE.md («Тоҷикии софи»). Рӯйхати калимаҳоро дар SUS пурра кунед."""
import os, re, json, collections, sys
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
SUS = {
 r'ҳазф': 'ҳазф → нест кардан',
 r'кириш': 'кириш (ӯзбекӣ) → воридшавӣ / ворид шудан',
 r'ёпиштир': 'ёпиштир- (ӯзбекӣ) → гузоштан / часпондан',
 r'ясае|ясам': 'ясаед (ӯзбекӣ) → созед',
 r'галочк|флешкарт': 'калимаҳои русӣ → аломат / кортчаи ёддошт',
 r'тикл': 'тикла/тиклаш (ӯзбекӣ tiklash) → барқарор кардан / аз нав баргардондан',
 r'ўзбек|ў': 'ҳарфи «ў» (ӯзбекӣ) → «ӯ»',
 r'учун': 'учун → барои',
 r'билан': 'билан → бо',
 r'керак': 'керак → лозим / даркор',
 r'қил(иш|ин|ад|ма|мо|са|ди)': 'қилиш/қилинг/қилади → кардан/кунед/мекунад',
 r'бўл': 'бўл- → шудан/буд',
 r'рўйхат': 'рўйхат → рӯйхат',
 r'юбор': 'юбор- → фиристодан',
 r'танла': 'танла- → интихоб кардан',
 r'кирит': 'кирит- → ворид кардан / нависед',
 r'ёзинг|ёзиш': 'ёзинг → нависед',
 r'очиш|очинг|очилма': 'очиш/очинг → кушодан/кушоед',
 r'ёпиш|ёпинг': 'ёпиш/ёпинг → пӯшидан/пӯшед',
 r'қўш': 'қўш- → илова кардан',
 r'ўчир': 'ўчир- → нест/тоза кардан',
 r'сўров': 'сўров → дархост',
 r'хатолик': 'хатолик → хато',
 r'\bёки\b': 'ёки → ё',
 r'бошла': 'бошла- → оғоз кардан',
 r'жавоб': 'жавоб → ҷавоб',
 r'ёрдамчи\b': 'ёрдамчи → ёрдамчӣ',
 r'маълумот(лар|ни)': 'маълумотлар → маълумот',
 r'(ла|лар)нг': 'ӯзбекӣ -ланг',
}
SUS = {k: v for k, v in SUS.items() if v}
# матнҳои UI: сатрҳои дар «», '', `` ва дар rows.json
def strings(src):
    out = []
    for m in re.finditer(r'"((?:[^"\\\n]|\\.)*)"|`((?:[^`\\]|\\.)*)`|\'((?:[^\'\\\n]|\\.)*)\'', src):
        s = m.group(1) or m.group(2) or m.group(3) or ''
        if re.search('[А-Яа-яЁёӢӣӮӯҒғҚқҲҳҶҷ]', s): out.append(s)
    return out
hits = collections.defaultdict(list)
for dp, _, fs in os.walk('src'):
    for f in fs:
        if not f.endswith('.js'): continue
        p = os.path.join(dp, f)
        src = open(p, encoding='utf8').read()
        src = re.sub(r'/\*.*?\*/', '', src, flags=re.S)
        src = re.sub(r'(?m)^\s*//.*$', '', src)
        src = re.sub(r'(?<![:"\'`])//[^\n]*', '', src)
        for s in strings(src):
            for pat, adv in SUS.items():
                for m in re.finditer(pat, s, flags=re.I):
                    w = re.search(r'[А-Яа-яЁёӢӣӮӯҒғҚқҲҳҶҷЎў\-]*' + re.escape(m.group(0)) + r'[А-Яа-яЁёӢӣӮӯҒғҚқҲҳҶҷЎў\-]*', s, flags=re.I)
                    hits[(adv, (w.group(0) if w else m.group(0)).lower())].append((p, s[:90].replace('\n', ' ')))
rows = json.load(open('src/features/i18n/rows.json', encoding='utf8'))
for r in rows:
    s = r[0]
    for pat, adv in SUS.items():
        for m in re.finditer(pat, s, flags=re.I):
            hits[(adv, m.group(0).lower())].append(('rows.json', s[:90]))
res = []
for (adv, w), L in sorted(hits.items(), key=lambda x: -len(x[1])):
    res.append((adv, w, len(L), L[0]))
for adv, w, n, ex in res:
    print(f'{n:3d} × «{w}»  [{adv}]  мисол: {ex[1][:70]}  ({ex[0].split("/")[-1]})')
print('---- ҳамаги:', sum(n for _, _, n, _ in res))
sys.exit(1 if res else 0)
