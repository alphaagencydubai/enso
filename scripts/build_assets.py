#!/usr/bin/env python3
"""ENSO's own material -> the app's assets.

Sources (kept on the assets-src branch): twelve Instagram screenshots of
@ensocafebakery and their cold-brew film. Photographs are cut out of the posts at
the exact frame Instagram shows them in, saved as WebP at two sizes; the film is
trimmed before its end card, muted, and given a poster. The ENSO lockup is
rebuilt as vectors: E N S from Jost Light (the closest open geometric face to
their wordmark) and their broken circle for the O, measured off the film's end
card — three cuts of 12 degrees at 90, 210 and 330.

    python3 -I scripts/build_assets.py <uploads-dir> <jost300.ttf> <manrope.woff2>
"""
import math
import pathlib
import subprocess
import sys

from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = pathlib.Path(sys.argv[1])
JOST = sys.argv[2]
MANROPE = sys.argv[3]
PH = ROOT / "assets" / "photos"
PH.mkdir(parents=True, exist_ok=True)

POSTS = {  # name: (file, top, bottom)
    "pistachio": ("12092461-image.png", 501, 1975),
    "nutella": ("ba29d2e7-image.png", 501, 1975),
    "lotus": ("41256ae6-image.png", 501, 1975),
    "layers": ("21e68dec-image.png", 501, 1680),
    "comfort": ("6aeb40fe-image.png", 501, 1680),
    "twist": ("f773c5ee-image.png", 501, 1680),
    "rack": ("69557bf7-image.png", 501, 1975),
    "trio": ("0896fd86-image.png", 501, 1975),
    "egg": ("7c235fec-image.png", 501, 1975),
    "cups": ("d52208bd-image.png", 501, 1973),
    "box": ("f1b27875-image.png", 501, 1973),
}
GRID = {  # profile grid tiles (smaller, so only one size)
    "bag": ("f93535ca-image.png", (0, 1592, 390, 2110)),
    "bread": ("f93535ca-image.png", (0, 2116, 390, 2556)),
    "parsley": ("f93535ca-image.png", (789, 2116, 1179, 2556)),
}


def save(im, name, widths=(1080, 480)):
    for w, suf in zip(widths, ("", "-sm")):
        if im.width < w and suf:
            continue
        out = im if im.width <= w else im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        out.save(PH / f"{name}{suf}.webp", "WEBP", quality=80 if not suf else 72, method=6)


for name, (f, t, b) in POSTS.items():
    im = Image.open(SRC / f).convert("RGB").crop((0, t, 1179, b))
    save(im, name)
for name, (f, box) in GRID.items():
    im = Image.open(SRC / f).convert("RGB").crop(box)
    im.save(PH / f"{name}-sm.webp", "WEBP", quality=78, method=6)
    im.save(PH / f"{name}.webp", "WEBP", quality=78, method=6)

# --- the film -------------------------------------------------------------
film = next(SRC.glob("*.mp4"))
V = ROOT / "assets" / "video"
V.mkdir(parents=True, exist_ok=True)
ff = ["ffmpeg", "-v", "error", "-y"]
subprocess.run(ff + ["-i", str(film), "-t", "9.7", "-an", "-vf", "scale=720:-2,fps=30",
                     "-c:v", "libx264", "-preset", "veryfast", "-crf", "27", "-pix_fmt", "yuv420p",
                     "-movflags", "+faststart", str(V / "film.mp4")], check=True)
subprocess.run(ff + ["-ss", "1.6", "-i", str(film), "-frames:v", "1", "-vf", "scale=720:-2",
                     "-c:v", "libwebp", "-quality", "74", str(V / "poster.webp")], check=True)
for t, name in ((2.2, "room"), (9.2, "coldbrew"), (5.4, "pour")):
    tmp = PH / f"_{name}.png"
    subprocess.run(ff + ["-ss", str(t), "-i", str(film), "-frames:v", "1", str(tmp)], check=True)
    save(Image.open(tmp).convert("RGB"), name, (720, 400))
    tmp.unlink()

# --- the lockup -----------------------------------------------------------
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

font = TTFont(JOST)
gs = font.getGlyphSet()
cmap = font.getBestCmap()
upm = font["head"].unitsPerEm
cap = font["OS/2"].sCapHeight or 700
stem = 52 * upm / 1000  # Jost Light stem, close to their wordmark


def glyph_path(ch, x, scale=1.0, y0=0.0):
    pen = SVGPathPen(gs)
    tp = TransformPen(pen, (scale, 0, 0, -scale, x, y0 + cap * scale))
    gs[cmap[ord(ch)]].draw(tp)
    return pen.getCommands(), gs[cmap[ord(ch)]].width * scale


def ring(cx, cy, r, w, cuts=(90, 210, 330), gap=12):
    """Their broken circle: three arcs, each cut square, the cuts 12 degrees wide."""
    segs = []
    starts = [c + gap / 2 for c in cuts]
    ends = [c - gap / 2 for c in cuts[1:] + (cuts[0] + 360,)]
    for a0, a1 in zip(starts, ends):
        p0 = (cx + r * math.cos(math.radians(a0)), cy + r * math.sin(math.radians(a0)))
        p1 = (cx + r * math.cos(math.radians(a1)), cy + r * math.sin(math.radians(a1)))
        segs.append(f"M{p0[0]:.2f} {p0[1]:.2f}A{r:.2f} {r:.2f} 0 0 1 {p1[0]:.2f} {p1[1]:.2f}")
    return f'<path d="{"".join(segs)}" fill="none" stroke="currentColor" stroke-width="{w:.2f}"/>'


x = -font["hmtx"]["E"][1] + 10
paths = []
for ch in "ENS":
    d, adv = glyph_path(ch, x)
    paths.append(d)
    x += adv - 6
r = cap / 2 - stem / 2
o_cx = x + cap / 2 + 4
o = ring(o_cx, cap / 2, r, stem)
W = o_cx + cap / 2 + 4
word = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W:.0f} {cap:.0f}" fill="currentColor">'
        f'<path d="{"".join(paths)}"/>{o}</svg>')
(ROOT / "assets" / "brand" / "enso-word.svg").write_text(word)

# the mark alone, at the end card's proportions (stroke 0.23 of the radius)
mark = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">'
        + ring(60, 60, 50.5, 12).replace('stroke="currentColor"', 'stroke="#0A0A0A"') + "</svg>")
(ROOT / "assets" / "brand" / "enso-mark.svg").write_text(mark)

# app icons: their avatar — the broken circle in black on their sage
import io
try:
    import cairosvg  # noqa
    have_cairo = True
except ImportError:
    have_cairo = False


def icon(size, pad, bg=(158, 169, 155)):
    s = size * 4
    im = Image.new("RGB", (s, s), bg)
    from PIL import ImageDraw
    dr = ImageDraw.Draw(im)
    R = (s / 2 - pad * 4)
    w = R * 0.23
    for a0 in (96, 216, 336):
        a1 = a0 + 108
        dr.arc((s / 2 - R, s / 2 - R, s / 2 + R, s / 2 + R), a0, a1, fill=(26, 28, 26), width=round(w))
    return im.resize((size, size), Image.LANCZOS)


I = ROOT / "assets" / "icons"
I.mkdir(parents=True, exist_ok=True)
icon(512, 150).save(I / "icon-512.png")
icon(192, 56).save(I / "icon-192.png")
icon(512, 190).save(I / "maskable-512.png")
icon(180, 52).save(I / "apple-touch-icon.png")
icon(32, 7).save(I / "favicon-32.png")

# og image: their pistachio roll beside the lockup
og = Image.new("RGB", (1200, 630), (243, 242, 238))
p = Image.open(PH / "rack.webp").convert("RGB")
p = p.crop((0, (p.height - p.width) // 2, p.width, (p.height + p.width) // 2)).resize((630, 630))
og.paste(p, (570, 0))
og.paste(icon(300, 70), (135, 165))
og.save(ROOT / "assets" / "og.jpg", quality=84)

# fonts: Manrope (Island's face), Google's latin subset as served
import shutil
shutil.copy(MANROPE, ROOT / "assets" / "fonts" / "manrope.woff2")
print("assets done")
