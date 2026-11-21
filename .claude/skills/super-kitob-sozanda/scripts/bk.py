import re, json, collections
from lines import lines

LOW = set('абвгдежзийклмнопрстуфхцчшщъыьэюяёғӣқӯҳҷ')
FN_RE = re.compile(r'^[\W\d]{0,4}\s*(?:\d\s*[.,]\s*)?[А-ЯЁҒӢҚӮҲҶ][а-яғӣқӯҳҷё()]+(?:[ -][а-яғӣқӯҳҷё]+){0,2}\s*[-–—−]{1,2}\s')


def clean_ratio(t):
    al = [c for c in t if c.isalpha()]
    return sum(c in LOW for c in al) / max(1, len(al))


def is_caps(t):
    al = [c for c in t if c.isalpha()]
    return len(al) >= 4 and sum(c.isupper() for c in al) / len(al) > .85


def extract(tsv_fmt, pages, head_fix=None, verse_delta=100, indent_delta=24, foot_top=1270, foot_h=31,
            skip_lines=None, page_h=None, min_conf=72, head_conf=60):
    """-> sections [{title, blocks:[[kind, payload]]}]; kind: p | v | fn"""
    head_fix = head_fix or {}
    secs = [{'title': '', 'blocks': []}]
    cur = ''
    verse = []
    foot = []

    def flush():
        nonlocal cur, verse
        if cur:
            secs[-1]['blocks'].append(['p', cur]); cur = ''
        if verse:
            secs[-1]['blocks'].append(['v', verse]); verse = []

    def flush_foot():
        nonlocal foot
        if foot:
            secs[-1]['blocks'].append(['fn', foot]); foot = []

    for p in pages:
        L = lines(tsv_fmt % p)
        body = []
        FNL = []
        for x in L:
            t0 = x['t'].strip()
            if x['top'] > foot_top - 250 and x['conf'] >= 40 and FN_RE.match(t0) and (x['h'] <= foot_h or re.match(r'^\W*\d\s*[.,]', t0)) and len(t0) > 8:
                FNL.append(x)
        for x in L:
            if x in FNL:
                continue
            t = x['t'].strip()
            if skip_lines and any(re.search(s, t) for s in skip_lines):
                continue
            if x['conf'] >= min_conf or (x['conf'] >= 58 and clean_ratio(t) >= .75 and len(t) >= 4 and not re.search(r'[0-9)(]', t)):
                if re.fullmatch(r'\W*\d{0,3}\W*', t):
                    continue
                body.append(x)
        # heading lines
        heads = [x for x in body if is_caps(x['t']) and x['conf'] >= head_conf]
        isfn = FNL
        txt = [x for x in body if x not in heads and x not in isfn]
        lm = sorted(x['l'] for x in txt)[len(txt) // 10] if txt else 0
        # keep reading order by top
        items = sorted([(x['top'], 'h', x) for x in heads] + [(x['top'], 't', x) for x in txt] + [(x['top'], 'f', x) for x in isfn], key=lambda z: z[0])
        for _, k, x in items:
            t = x['t'].strip()
            if k == 'h':
                flush(); flush_foot()
                t = head_fix.get(t, t)
                secs.append({'title': t, 'blocks': []})
            elif k == 'f':
                t = re.sub(r'^[\W\d]{0,4}\s*(?:\d\s*[.,]\s*)?', '', t)
                foot.append(re.sub(r'\s*[-–—−]{1,2}\s*', ' – ', t, count=1))
            else:
                isverse = x['l'] > lm + verse_delta
                if isverse:
                    if cur:
                        secs[-1]['blocks'].append(['p', cur]); cur = ''
                    verse.append(t)
                else:
                    if verse:
                        secs[-1]['blocks'].append(['v', verse]); verse = []
                    t = re.sub(r'^[-—−]\s*', '– ', t)
                    new = (x['l'] > lm + indent_delta) or t.startswith('– ')
                    if cur and new:
                        secs[-1]['blocks'].append(['p', cur]); cur = ''
                    if cur.endswith('-') and not cur.endswith(' -') and t[:1].islower():
                        cur = cur[:-1] + t
                    else:
                        cur = (cur + ' ' + t).strip()
    flush(); flush_foot()
    return secs
