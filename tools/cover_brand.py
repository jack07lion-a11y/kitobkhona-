#!/usr/bin/env python3
"""Муқоваи китобга нишони Китобхона (боло) ва нишони силсила (поён) мегузорад.

Намуна «A» (тасдиқи Ҷасурбек): боло — логотипи хурди Китобхона бо ном (бе лавҳа);
поён — лавҳаи сабзи торик: нишони силсила + матн дар ду сатр.

  python3 tools/cover_brand.py муқова.jpg натиҷа.jpg
  python3 tools/cover_brand.py муқова.jpg натиҷа.jpg --no-logo            # танҳо нишони силсила
  python3 tools/cover_brand.py муқова.jpg натиҷа.jpg --series "Номи дигар" # силсилаи дигар
  python3 tools/cover_brand.py муқова.jpg натиҷа.jpg --no-series          # танҳо логотипи боло

Қоида: логотипи боло ҳамеша бо ҳамин андоза (аз 700 пикселҳо ~64 px); ба кадом китоб гузоштан — Ҷасурбек мегӯяд (--no-logo ихтиёрӣ).
Муқоваи ворид: 700x1050 (нисбат 2:3) бошад беҳтар; дигар андоза ҳам кор мекунад.
Талаб: Pillow, шрифти DejaVu Serif.
"""
import argparse, math, os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
LOGO_PATH = os.path.join(HERE, "..", "logos", "kitobkhona-logo-2048.png")
SERIES = "Афсонаҳои халқи тоҷик"
TOP = "Китобхона"
GOLD = (244, 183, 60, 255); DG = (6, 60, 44, 255); CREAM = (252, 246, 228, 255)


def _font(sz, bold=True):
    name = "DejaVuSerif-Bold.ttf" if bold else "DejaVuSerif.ttf"
    for d in ("/usr/share/fonts/truetype/dejavu/", "/usr/share/fonts/dejavu/", "/Library/Fonts/", "C:/Windows/Fonts/"):
        p = os.path.join(d, name)
        if os.path.exists(p):
            return ImageFont.truetype(p, sz)
    return ImageFont.truetype(name, sz)


def _logo(w):
    lg = Image.open(LOGO_PATH).convert("RGBA")
    lg = lg.crop(lg.getbbox())
    return lg.resize((w, round(lg.size[1] * w / lg.size[0])), Image.LANCZOS)


def _shadow_text(im, xy, txt, f, fill, r=2, off=1):
    L = Image.new("RGBA", im.size, (0, 0, 0, 0))
    ImageDraw.Draw(L).text((xy[0] + off, xy[1] + off), txt, font=f, fill=(0, 0, 0, 150), anchor="mm")
    im.alpha_composite(L.filter(ImageFilter.GaussianBlur(r)))
    ImageDraw.Draw(im).text(xy, txt, font=f, fill=fill, anchor="mm")


def _rrect(im, box, rad, fill, outline=None, w=0):
    L = Image.new("RGBA", im.size, (0, 0, 0, 0))
    ImageDraw.Draw(L).rounded_rectangle(box, rad, fill=fill, outline=outline, width=w)
    im.alpha_composite(L)


def emblem(S):
    """Нишони силсила: ситораи ҳашт гӯша, китоби кушода ва ситорачаи афсонавӣ."""
    k = 4; N = S * k
    im = Image.new("RGBA", (N, N), (0, 0, 0, 0)); d = ImageDraw.Draw(im); c = N / 2; R = N * .48

    def sq(a, r):
        return [(c + r * math.cos(math.radians(a + 90 * i)), c + r * math.sin(math.radians(a + 90 * i))) for i in range(4)]

    def star(x, y, r, fill):
        d.polygon([(x, y - r), (x + r * .3, y - r * .3), (x + r, y), (x + r * .3, y + r * .3), (x, y + r),
                   (x - r * .3, y + r * .3), (x - r, y), (x - r * .3, y - r * .3)], fill=fill)
    d.polygon(sq(45, R * 1.08), fill=GOLD); d.polygon(sq(0, R * 1.08), fill=GOLD)
    d.ellipse((c - R * .80, c - R * .80, c + R * .80, c + R * .80), fill=DG)
    d.ellipse((c - R * .72, c - R * .72, c + R * .72, c + R * .72), outline=GOLD, width=int(N * .012))
    bw = R * .56; by = c + R * .30
    d.polygon([(c, by - R * .06), (c - bw, by - R * .20), (c - bw, by + R * .22), (c, by + R * .36)], fill=CREAM)
    d.polygon([(c, by - R * .06), (c + bw, by - R * .20), (c + bw, by + R * .22), (c, by + R * .36)], fill=(222, 238, 226, 255))
    d.line([(c, by - R * .06), (c, by + R * .36)], fill=DG, width=int(N * .012))
    for i in range(3):
        y = by - R * .04 + i * R * .11
        d.line([(c - bw * .8, y - R * .06), (c - bw * .15, y + R * .04)], fill=(120, 160, 140, 255), width=int(N * .008))
        d.line([(c + bw * .15, y + R * .04), (c + bw * .8, y - R * .06)], fill=(120, 160, 140, 255), width=int(N * .008))
    star(c, c - R * .34, R * .30, GOLD)
    for dx, dy, r2 in ((-.52, -.50, .09), (.55, -.40, .07), (.40, -.62, .05)):
        star(c + R * dx, c + R * dy, R * r2 * 1.6, (255, 226, 150, 255))
    return im.resize((S, S), Image.LANCZOS)


def top_logo(im):
    W = im.size[0]
    lg = _logo(64)
    g = Image.new("RGBA", im.size, (0, 0, 0, 0))
    blk = Image.new("RGBA", lg.size, (0, 0, 0, 255)); blk.putalpha(lg.split()[3].point(lambda v: int(v * .55)))
    g.paste(blk, (W // 2 - lg.size[0] // 2 + 3, 38), blk)
    im.alpha_composite(g.filter(ImageFilter.GaussianBlur(6)))
    im.alpha_composite(lg, (W // 2 - lg.size[0] // 2, 34))
    _shadow_text(im, (W // 2, 34 + lg.size[1] + 20), TOP, _font(24), (255, 248, 226, 255))


def bottom_series(im, text):
    W, H = im.size
    first, _, rest = text.partition(" ")
    line1, line2 = first.upper(), (rest or first)
    if not rest:
        line1 = ""
    em = emblem(66); f1 = _font(15); f2 = _font(27)
    t = max(f1.getlength(line1) + 10, f2.getlength(line2)); pw = int(66 + t + 64); ph = 84
    x0 = (W - pw) // 2; y0 = H - 34 - ph
    _rrect(im, (x0 + 2, y0 + 5, x0 + pw + 2, y0 + ph + 5), 20, (0, 0, 0, 70))
    _rrect(im, (x0, y0, x0 + pw, y0 + ph), 20, (8, 66, 48, 230), GOLD, 2)
    im.alpha_composite(em, (x0 + 16, y0 + (ph - 66) // 2))
    d = ImageDraw.Draw(im); tx = x0 + 16 + 66 + 14
    if line1:
        d.text((tx, y0 + 27), line1, font=f1, fill=(255, 226, 150, 255), anchor="lm")
        d.text((tx, y0 + 55), line2, font=f2, fill=(255, 248, 226, 255), anchor="lm")
    else:
        d.text((tx, y0 + ph // 2), line2, font=f2, fill=(255, 248, 226, 255), anchor="lm")


def brand(src, out, logo=True, series=SERIES):
    im = Image.open(src).convert("RGBA")
    if logo:
        top_logo(im)
    if series:
        bottom_series(im, series)
    im.convert("RGB").save(out, "JPEG", quality=82, optimize=True, progressive=True)


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("src"); ap.add_argument("out")
    ap.add_argument("--no-logo", action="store_true", help="логотипи Китобхона (боло) нест")
    ap.add_argument("--no-series", action="store_true", help="нишони силсила (поён) нест")
    ap.add_argument("--series", default=SERIES, help="матни нишони силсила (пешфарз: «%s»)" % SERIES)
    a = ap.parse_args()
    brand(a.src, a.out, logo=not a.no_logo, series=None if a.no_series else a.series)
    print("тайёр:", a.out)
