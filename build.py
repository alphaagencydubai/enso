#!/usr/bin/env python3
"""Stamp the build before every deploy: modulepreload links for every module (so
ES imports don't arrive one level at a time), the service worker's shell and asset
lists from what's on disk, and one content hash for the worker VERSION and ?v=.

    python3 build.py
"""
import hashlib, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent
idx, sw = ROOT / "index.html", ROOT / "sw.js"
mods = sorted(p.relative_to(ROOT).as_posix() for p in ROOT.glob("js/**/*.js"))
html = idx.read_text(encoding="utf-8")
pre = "\n".join(f'<link rel="modulepreload" href="{m}">' for m in mods if m != "js/app.js")
html = re.sub(r"<!-- preload:start -->.*?<!-- preload:end -->", lambda _: f"<!-- preload:start -->\n{pre}\n<!-- preload:end -->", html, flags=re.S)
idx.write_text(html, encoding="utf-8")

shell = ["./", "./index.html", "./manifest.webmanifest", "./css/app.css"] + [f"./{m}" for m in mods]
assets = sorted(f"./{p.relative_to(ROOT).as_posix()}" for pat in
                ("assets/fonts/*.woff2", "assets/brand/*", "assets/icons/*.png", "assets/photos/*-sm.webp", "assets/video/poster.webp")
                for p in ROOT.glob(pat))
fmt = lambda xs: "\n".join(f'  "{u}",' for u in xs)
src = sw.read_text(encoding="utf-8")
src = re.sub(r"/\* shell:start \*/.*?/\* shell:end \*/", lambda _: f"/* shell:start */\n{fmt(shell)}\n  /* shell:end */", src, flags=re.S)
src = re.sub(r"/\* assets:start \*/.*?/\* assets:end \*/", lambda _: f"/* assets:start */\n{fmt(assets)}\n  /* assets:end */", src, flags=re.S)
sw.write_text(src, encoding="utf-8")

h = hashlib.sha1()
for f in sorted([*ROOT.glob("js/**/*.js"), ROOT / "css/app.css", idx, ROOT / "manifest.webmanifest", sw]):
    h.update(re.sub(rb'\?v=[0-9a-z]+|const VERSION = "enso-[^"]+";', b"", f.read_bytes()))
stamp = h.hexdigest()[:10]
sw.write_text(re.sub(r'const VERSION = "enso-[^"]+";', f'const VERSION = "enso-{stamp}";', sw.read_text(encoding="utf-8")), encoding="utf-8")
html = idx.read_text(encoding="utf-8")
html = re.sub(r"css/app\.css(\?v=[0-9a-z]+)?", f"css/app.css?v={stamp}", html)
html = re.sub(r'js/app\.js(\?v=[0-9a-z]+)?"', f'js/app.js?v={stamp}"', html)
idx.write_text(html, encoding="utf-8")
print(f"build {stamp}: {len(mods)} modules, worker lists {len(shell)} shell + {len(assets)} assets")
