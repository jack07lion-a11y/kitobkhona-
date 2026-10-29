#!/usr/bin/env python3
"""Китобхона: китобро (Word, PDF, EPUB, FB2, TXT) ба бастаи zip табдил медиҳад.

Натиҷа: <slug>.zip, ки дар дохилаш book.json (+ cover.jpg) аст. Онро дар барнома
Account → Идоракунӣ → «Бастаи китоб (zip)» бор кунед. Матни китоб ҳеҷ гоҳ тағйир
намеёбад: фақат фосилаҳо тоза мешаванд ва сохтор (боб, шеър) муайян мешавад.

Истифода:
  python3 tools/kitob_convert.py КИТОБ.docx --title "Ном" --author "Муаллиф" --category fiction
  python3 tools/kitob_convert.py КИТОБ.pdf  --title ... --author ... --cover муқова.jpg --out натиҷа/

Категорияҳо (--category): fiction, poetry, classic, science, history, religion,
kids, text, exam, self, bio (ё номи тоҷикии онҳо).
"""
import argparse
import base64
import io
import json
import re
import sys
import zipfile
import xml.etree.ElementTree as ET
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path

CATEGORIES = {
    "fiction": "Адабиёти бадеӣ", "poetry": "Шеър ва достон", "classic": "Классикаи тоҷик",
    "science": "Илмӣ-оммавӣ", "history": "Таърих", "religion": "Динӣ-маърифатӣ",
    "kids": "Барои кӯдакон", "text": "Китобҳои дарсӣ", "exam": "Омодагӣ ба ММТ",
    "self": "Рушди шахсӣ", "bio": "Тарҷумаи ҳол",
}
TJ_LETTERS = set("ғӣқӯҳҷҒӢҚӮҲҶ")
TRANSLIT = dict(zip(
    "абвгдеёжзийклмнопрстуфхцчшщъыьэюяғӣқӯҳҷ",
    ["a", "b", "v", "g", "d", "e", "yo", "zh", "z", "i", "y", "k", "l", "m", "n", "o", "p", "r", "s", "t", "u",
     "f", "kh", "ts", "ch", "sh", "sh", "", "y", "", "e", "yu", "ya", "gh", "i", "q", "u", "h", "j"]))

# Унсурҳо: (намуд, маълумот). Намудҳо: h1 (қисм), h2 (боб), p, v (шеър), sub, s
Item = tuple


def slugify(text):
    out = "".join(TRANSLIT.get(c, c) for c in text.lower())
    out = re.sub(r"[^a-z0-9]+", "-", out).strip("-")
    return out[:60] or "kitob"


def clean(t):
    t = t.replace("\xa0", " ").replace("​", "").replace("﻿", "")
    return re.sub(r"[ \t\r\f\v]+", " ", t).strip()


def is_scene_break(t):
    return bool(re.fullmatch(r"[\*\s·•]{3,}|\*\s*\*\s*\*|[-–—_]{3,}", t.strip()))


HEAD_RE = re.compile(r"^(қисми|боби|қисм|боб|фасли|фасл|глава|часть)\b", re.I)


def looks_heading(line):
    s = line.strip()
    if not s or len(s) > 90 or s.endswith((".", ",", ";", ":")) and not HEAD_RE.match(s):
        return None
    if HEAD_RE.match(s):
        return "h1" if re.match(r"^(қисми|қисм|часть)\b", s, re.I) else "h2"
    letters = [c for c in s if c.isalpha()]
    if len(letters) >= 3 and sum(c.isupper() for c in letters) / len(letters) > 0.85 and len(s) <= 70:
        return "h2"
    return None


# ───────────────────────────── DOCX ─────────────────────────────
W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"


def read_docx(path):
    z = zipfile.ZipFile(path)
    root = ET.fromstring(z.read("word/document.xml"))
    styles = {}
    if "word/styles.xml" in z.namelist():
        for st in ET.fromstring(z.read("word/styles.xml")).iter(W + "style"):
            n = st.find(W + "name")
            styles[st.get(W + "styleId")] = (n.get(W + "val") if n is not None else "").lower()
    items, cover = [], None
    for p in root.iter(W + "p"):
        sid_el = p.find(f"{W}pPr/{W}pStyle")
        sname = styles.get(sid_el.get(W + "val") if sid_el is not None else None, "")
        sname = sname or (sid_el.get(W + "val").lower() if sid_el is not None else "")
        lines, cur = [], []
        for node in p.iter():
            if node.tag == W + "t" and node.text:
                cur.append(node.text)
            elif node.tag == W + "tab":
                cur.append(" ")
            elif node.tag == W + "br":
                lines.append("".join(cur)); cur = []
        lines.append("".join(cur))
        lines = [clean(x) for x in lines]
        text = " ".join(x for x in lines if x)
        if not text:
            continue
        m = re.search(r"(heading|заголовок|sarlavha)\s*(\d)", sname) or re.search(r"(title)", sname)
        if m:
            lvl = int(m.group(2)) if m.lastindex and m.lastindex >= 2 else 1
            items.append(("h1" if lvl == 1 else "h2", text))
        elif is_scene_break(text):
            items.append(("s", None))
        elif len([x for x in lines if x]) > 1 and all(len(x) < 90 for x in lines if x):
            items.append(("v", [x for x in lines if x]))
        elif re.search(r"(subtitle|подзаголовок)", sname):
            items.append(("sub", text))
        else:
            items.append(("p", text))
    for name in z.namelist():
        if name.startswith("word/media/") and name.lower().endswith((".jpg", ".jpeg", ".png")):
            cover = z.read(name)
            break
    return items, cover


# ───────────────────────────── FB2 ─────────────────────────────
def _txt(e):
    return clean("".join(e.itertext()))


def read_fb2(path):
    raw = Path(path).read_bytes()
    root = ET.fromstring(raw)
    ns = root.tag.split("}")[0] + "}" if root.tag.startswith("{") else ""
    items, cover = [], None
    cp = root.find(f".//{ns}coverpage/{ns}image")
    if cp is not None:
        href = [v for k, v in cp.attrib.items() if k.endswith("href")]
        if href:
            bid = href[0].lstrip("#")
            for b in root.iter(ns + "binary"):
                if b.get("id") == bid and b.text:
                    cover = base64.b64decode(b.text)

    def walk(sec, depth):
        title = sec.find(ns + "title")
        has_sub = any(c.tag == ns + "section" for c in sec)
        if title is not None:
            items.append(("h1" if has_sub and depth == 0 else "h2", _txt(title)))
        for c in sec:
            t = c.tag.replace(ns, "")
            if t == "section":
                walk(c, depth + 1)
            elif t == "p":
                x = _txt(c)
                if x:
                    items.append(("s", None) if is_scene_break(x) else ("p", x))
            elif t == "subtitle":
                items.append(("sub", _txt(c)))
            elif t == "empty-line":
                items.append(("s", None))
            elif t == "poem":
                lines = [_txt(v) for v in c.iter(ns + "v") if _txt(v)]
                if lines:
                    items.append(("v", lines))
            elif t == "epigraph" or t == "cite":
                x = _txt(c)
                if x:
                    items.append(("p", x))

    for body in root.findall(ns + "body"):
        if body.get("name") == "notes":
            continue
        for sec in body.findall(ns + "section"):
            walk(sec, 0)
    return items, cover


# ───────────────────────────── EPUB ─────────────────────────────
def local_iter(root, name):
    """Ҳамаи унсурҳо бо номи дода шуда, бе назардошти namespace."""
    return [e for e in root.iter() if isinstance(e.tag, str) and e.tag.rsplit("}", 1)[-1] == name]


class _Html(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.items, self.buf, self.tag, self.lines, self.skip = [], [], None, [], 0

    def handle_starttag(self, tag, attrs):
        if tag in ("script", "style"):
            self.skip += 1
        elif tag in ("h1", "h2", "h3", "h4", "p", "div", "li", "blockquote"):
            self.flush()
            self.tag = tag
        elif tag == "br":
            self.lines.append(clean("".join(self.buf))); self.buf = []

    def handle_endtag(self, tag):
        if tag in ("script", "style"):
            self.skip = max(0, self.skip - 1)
        elif tag in ("h1", "h2", "h3", "h4", "p", "div", "li", "blockquote"):
            self.flush()
            self.tag = None

    def handle_data(self, data):
        if not self.skip:
            self.buf.append(data)

    def flush(self):
        self.lines.append(clean("".join(self.buf)))
        self.buf = []
        lines = [x for x in self.lines if x]
        self.lines = []
        if not lines:
            return
        text = " ".join(lines)
        t = self.tag
        if t in ("h1", "h2"):
            self.items.append(("h1" if t == "h1" else "h2", text))
        elif t in ("h3", "h4"):
            self.items.append(("sub", text))
        elif is_scene_break(text):
            self.items.append(("s", None))
        elif len(lines) > 1 and all(len(x) < 90 for x in lines):
            self.items.append(("v", lines))
        else:
            self.items.append(("p", text))


def read_epub(path):
    z = zipfile.ZipFile(path)
    cont = ET.fromstring(z.read("META-INF/container.xml"))
    opf_path = cont.find(".//{*}rootfile").get("full-path")
    base = opf_path.rsplit("/", 1)[0] + "/" if "/" in opf_path else ""
    opf = ET.fromstring(z.read(opf_path))
    manifest = {i.get("id"): i for i in local_iter(opf, "item")}
    cover = None
    meta = [m for m in local_iter(opf, "meta") if m.get("name") == "cover"]
    cands = [manifest.get(meta[0].get("content"))] if meta else []
    cands += [i for i in manifest.values() if "cover-image" in (i.get("properties") or "")]
    for i in cands:
        if i is not None:
            try:
                cover = z.read(base + i.get("href")); break
            except KeyError:
                pass
    items = []
    for ref in local_iter(opf, "itemref"):
        it = manifest.get(ref.get("idref"))
        if it is None or "html" not in (it.get("media-type") or ""):
            continue
        h = _Html()
        h.feed(z.read(base + it.get("href")).decode("utf-8", "replace"))
        h.flush()
        items += h.items
    return items, cover


# ───────────────────────────── TXT ─────────────────────────────
def read_txt(path):
    raw = Path(path).read_bytes()
    for enc in ("utf-8-sig", "cp1251"):
        try:
            text = raw.decode(enc); break
        except UnicodeDecodeError:
            continue
    blocks = [b for b in re.split(r"\n\s*\n", text.replace("\r", "")) if b.strip()]
    if len(blocks) < 5:  # ҳар сатр як сархат
        blocks = [x for x in text.replace("\r", "").split("\n") if x.strip()]
    return _blocks_to_items(blocks), None


def _blocks_to_items(blocks):
    items = []
    for b in blocks:
        lines = [clean(x) for x in b.split("\n") if clean(x)]
        if not lines:
            continue
        one = " ".join(lines)
        h = looks_heading(one) if len(lines) == 1 else None
        if h:
            items.append((h, one))
        elif is_scene_break(one):
            items.append(("s", None))
        elif len(lines) > 1 and all(len(x) < 60 for x in lines) and len(lines) <= 12:
            items.append(("v", lines))
        else:
            items.append(("p", one))
    return items


# ───────────────────────────── PDF ─────────────────────────────
def read_pdf(path):
    try:
        from pypdf import PdfReader
    except ImportError:
        sys.exit("PDF учун лозим: pip install pypdf")
    reader = PdfReader(str(path))
    pages = []
    for pg in reader.pages:
        try:
            pages.append(pg.extract_text(extraction_mode="layout") or "")  # ҷойгиршавии сатр (абзац) нигоҳ дошта мешавад
        except TypeError:
            pages.append(pg.extract_text() or "")
    # сархат/пойи такроршаванда ва рақами саҳифаро тоза мекунем
    first_last = Counter()
    for t in pages:
        ls = [clean(x) for x in t.split("\n") if clean(x)]
        for x in ls[:2] + ls[-2:]:
            first_last[x] += 1
    repeat = {x for x, n in first_last.items() if n > max(3, len(pages) * 0.3)}
    lines_all = [clean(x) for t in pages for x in t.split("\n") if clean(x)]
    lens = sorted(len(x) for x in lines_all if x not in repeat)
    typical = lens[int(len(lens) * 0.9)] if lens else 80  # дарозии маъмулии сатр
    blocks, cur = [], []

    def end_para():
        nonlocal cur
        if cur:
            blocks.append("\n".join(cur)); cur = []

    for t in pages:
        raw_lines = [l.rstrip() for l in t.split("\n") if l.strip()]
        base = min((len(l) - len(l.lstrip()) for l in raw_lines), default=0)
        for raw in raw_lines:
            x = clean(raw)
            if not x or x in repeat or re.fullmatch(r"[\d\s\-–—]+", x):
                continue
            indent = len(raw) - len(raw.lstrip()) - base
            if indent >= 2 and cur:
                end_para()  # хати сурх: сархати нав
            if looks_heading(x) and len(x) < 70:
                end_para(); blocks.append(x); end_para(); continue
            if cur and cur[-1].endswith("-") and x[:1].islower():
                cur[-1] = cur[-1][:-1] + x  # тире-бурида
            else:
                cur.append(x)
            # охири сархат: қатори нисбатан кӯтоҳ, бо аломати охири ҷумла
            if re.search(r"[.!?»”…]$", x) and len(x) < typical * 0.72:
                end_para()
    end_para()
    items = []
    for b in blocks:
        one = clean(" ".join(b.split("\n")))
        h = looks_heading(one)
        if h and "\n" not in b:
            items.append((h, one))
        elif is_scene_break(one):
            items.append(("s", None))
        else:
            items.append(("p", one))
    return items, None


# ───────────────────────────── сохтор ─────────────────────────────
def structure(items, chunk=40):
    """items -> parts[{title, chapters[{id,title,blocks}]}]"""
    kinds = {k for k, _ in items}
    has_parts = "h1" in kinds and "h2" in kinds
    parts, part, ch = [], None, None

    def new_part(title):
        nonlocal part, ch
        part = {"title": title, "chapters": []}
        parts.append(part)
        ch = None

    def new_ch(title):
        nonlocal part, ch
        if part is None:
            new_part("")
        ch = {"id": "", "title": title, "blocks": []}
        part["chapters"].append(ch)

    for k, v in items:
        if k == "h1" and has_parts:
            new_part(v)
        elif k in ("h1", "h2"):
            new_ch(v)
        else:
            if ch is None:
                new_ch("Сарсухан")
            ch["blocks"].append(["p", v] if k == "p" else ["v", v] if k == "v" else ["sub", v] if k == "sub" else ["s"])
    # сарлавҳа надошт: худкор ба қисмҳо
    if len(parts) == 1 and len(parts[0]["chapters"]) == 1 and len(parts[0]["chapters"][0]["blocks"]) > chunk * 1.5:
        allb = parts[0]["chapters"][0]["blocks"]
        parts[0]["chapters"] = [{"id": "", "title": f"Қисми {i // chunk + 1}", "blocks": allb[i:i + chunk]}
                                for i in range(0, len(allb), chunk)]
    n = 0
    for pt in parts:
        pt["chapters"] = [c for c in pt["chapters"] if c["blocks"] or c["title"]]
        for c in pt["chapters"]:
            n += 1
            c["id"] = f"c{n}"
    return [p for p in parts if p["chapters"]]


def report(book):
    paras = chars = chs = 0
    longest = (0, "")
    for pt in book["parts"]:
        for c in pt["chapters"]:
            chs += 1
            n = len(c["blocks"])
            paras += n
            if n > longest[0]:
                longest = (n, c["title"])
            for b in c["blocks"]:
                chars += len(b[1]) if b[0] in ("p", "sub") else sum(map(len, b[1])) if b[0] == "v" else 0
    allt = json.dumps(book["parts"], ensure_ascii=False)
    warns = []
    if chs == 0 or paras == 0:
        warns.append("МАТН ЁФТ НАШУД (PDF-и скан бошад, аввал OCR лозим).")
    cyr = sum("Ѐ" <= c <= "ӿ" for c in allt)
    bad = sum(c in "�" or "" <= c <= "" for c in allt)
    if allt and bad / max(1, len(allt)) > 0.002:
        warns.append(f"{bad} ҳарфи шубҳанок (ҳарфҳои қадимии PDF): матн таҳрири даврӣ мехоҳад.")
    if cyr > 2000 and not (TJ_LETTERS & set(allt)):
        warns.append("Ҳарфҳои тоҷикӣ (ғ ӣ қ ӯ ҳ ҷ) ёфт нашуд: забони дигар ё рамзгузории нодуруст.")
    if longest[0] > 600:
        warns.append(f"Боби «{longest[1]}» хеле дароз ({longest[0]} сархат): тақсим кардан беҳтар.")
    return chs, paras, chars, warns


def build(args):
    src = Path(args.input)
    ext = src.suffix.lower()
    readers = {".docx": read_docx, ".fb2": read_fb2, ".epub": read_epub, ".txt": read_txt, ".pdf": read_pdf}
    if ext not in readers:
        sys.exit(f"Формат дастгирӣ намешавад: {ext}. Мумкин: {', '.join(readers)} (.doc-ро аввал ба .docx кунед).")
    items, cover = readers[ext](src)
    cat = CATEGORIES.get(args.category, args.category)
    slug = args.slug or slugify(args.title)
    book = {"id": slug, "title": args.title, "author": args.author, "category": cat, "lang": "tg"}
    book["parts"] = structure(items)
    if args.cover:
        cover = Path(args.cover).read_bytes()
    cover_bytes = None
    if cover:
        try:
            from PIL import Image
            im = Image.open(io.BytesIO(cover)).convert("RGB")
            im.thumbnail((700, 1050))
            buf = io.BytesIO()
            im.save(buf, "JPEG", quality=85)
            cover_bytes = buf.getvalue()
        except Exception:
            cover_bytes = cover
        book["cover"] = "cover.jpg"
    out = Path(args.out or ".")
    out.mkdir(parents=True, exist_ok=True)
    zpath = out / f"{slug}.zip"
    with zipfile.ZipFile(zpath, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("book.json", json.dumps(book, ensure_ascii=False, separators=(",", ":")))
        if cover_bytes:
            z.writestr("cover.jpg", cover_bytes)
    chs, paras, chars, warns = report(book)
    print(f"✔ {zpath}  ({zpath.stat().st_size // 1024} КБ)")
    print(f"  Ном: {book['title']} | Муаллиф: {book['author']} | Бахш: {cat}")
    print(f"  Қисм: {len(book['parts'])}, боб: {chs}, сархат: {paras}, ҳарф: {chars}, муқова: {'ҳа' if cover_bytes else 'не'}")
    for w in warns:
        print("  ⚠", w)
    if not cover_bytes:
        print("  ℹ Муқова надорад: --cover муқова.jpg илова кунед ё баъд дар Идоракунӣ ранг интихоб кунед.")
    return 1 if any("ЁФТ НАШУД" in w for w in warns) else 0


def main():
    ap = argparse.ArgumentParser(description="Китобро ба бастаи Китобхона (zip) табдил медиҳад")
    ap.add_argument("input", help="файли китоб: .docx .pdf .epub .fb2 .txt")
    ap.add_argument("--title", required=True, help="номи китоб")
    ap.add_argument("--author", required=True, help="муаллиф")
    ap.add_argument("--category", default="fiction", help="fiction, poetry, classic, ... ё номи тоҷикӣ")
    ap.add_argument("--cover", help="файли муқова (jpg/png), агар дар китоб набошад")
    ap.add_argument("--slug", help="шиносаи лотинӣ (бо ҳамин номи такрорӣ китоб навсозӣ мешавад)")
    ap.add_argument("--out", help="папкаи натиҷа")
    sys.exit(build(ap.parse_args()))


if __name__ == "__main__":
    main()
