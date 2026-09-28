#!/usr/bin/env python3
"""
11176.com static generator (runs in GitHub Actions — see .github/workflows/build-pages.yml)

Copies the site into ./_site and adds:
  * /numbers/<n>/index.html  — one SEO page per number (0–999, all dictionary codes, premium patterns, years)
  * sitemap.xml              — every page + every number page
  * assets/img/og.png        — social share image (if Pillow is installed)
Run locally:  python3 tools/generate.py && python3 -m http.server -d _site
"""
import json, re, shutil, pathlib, datetime, html

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "_site"
DOMAIN = "https://11176.com/"
TODAY = datetime.date.today().isoformat()

SOUND = {"0": ("你", "nǐ", "you"), "1": ("要", "yào", "want"), "2": ("爱", "ài", "love"), "3": ("生", "shēng", "life"),
         "4": ("死", "sǐ", "death"), "5": ("我", "wǒ", "I/me"), "6": ("溜", "liù", "smooth"), "7": ("起", "qǐ", "rise"),
         "8": ("发", "fā", "prosper"), "9": ("久", "jiǔ", "lasting")}
W = {"0": 1, "1": 2, "2": 2, "3": 1, "4": -10, "5": 0, "6": 6, "7": 1, "8": 8, "9": 5}


def load_codes():
    js = (ROOT / "assets/js/engine.js").read_text(encoding="utf-8")
    block = js[js.index("var CODES = {") + len("var CODES = "): js.index("};", js.index("var CODES = {")) + 1]
    return json.loads(block)


def quick_score(d):
    s = 55 + max(-35, min(28, round(sum(W[c] for c in d) * (4 / max(4, len(d))) * 1.6)))
    if "4" not in d: s += 4
    if len(d) >= 2 and len(set(d)) == 1: s += 12
    if d.endswith("8"): s += 6
    if d.endswith("4"): s -= 8
    for bad in ("14", "250"):
        if bad in d: s -= 8
    for good in ("168", "518", "888"):
        if good in d: s += 8
    return max(3, min(99, s))


def number_list(codes):
    nums = set(str(i) for i in range(0, 1000))
    nums |= set(codes.keys())
    for a in "0123456789":
        nums.add(a * 4); nums.add(a * 5); nums.add(a * 6)
        for b in "0123456789":
            if a != b:
                nums.add(a + a + b + b); nums.add(a + b + a + b)
    for i in range(1000, 10000):
        s = str(i)
        if s.endswith(("88", "68", "66", "99", "168", "518")) or "520" in s or "1314" in s:
            nums.add(s)
    for y in range(1940, 2041):
        nums.add(str(y))
    return sorted(nums, key=lambda x: (len(x), x))


def main():
    if OUT.exists():
        shutil.rmtree(OUT)
    ignore = shutil.ignore_patterns("_site", ".git", ".github", "tools", "plan", "*.md", "__pycache__")
    shutil.copytree(ROOT, OUT, ignore=ignore)
    (OUT / ".nojekyll").write_text("")
    codes = load_codes()
    tpl = (ROOT / "number.html").read_text(encoding="utf-8")
    nums = number_list(codes)
    for n in nums:
        c = codes.get(n)
        sc = quick_score(n)
        if c:
            ans = f"{n} means “{c[2].split('. ')[0].strip('“”.')}” ({c[0]}, {c[1]})."
            title = f"What does {n} mean in Chinese? {c[0]} — Meaning, Slang & Luck Score"
        else:
            zh = " · ".join(SOUND[x][0] for x in n)
            ans = f"{n} reads as {zh} ({' · '.join(SOUND[x][1] for x in n)}) — " + " + ".join(SOUND[x][2] for x in n) + "."
            title = f"What does {n} mean in Chinese? Meaning, Slang & Luck Score"
        desc = f"{ans} Luck score {sc}/100. Digit-by-digit breakdown, usage tips for phones, plates, prices and dates."
        page = tpl
        page = page.replace('<html lang="en">', f'<html lang="en" data-n="{n}">', 1)
        page = page.replace('<meta name="viewport" content="width=device-width,initial-scale=1">',
                            '<meta name="viewport" content="width=device-width,initial-scale=1">\n<base href="../../">', 1)
        page = re.sub(r"<title>.*?</title>", f"<title>{html.escape(title)} | 11176</title>", page, count=1)
        page = re.sub(r'(<meta name="description" content=")[^"]*', lambda m: m.group(1) + html.escape(desc, quote=True), page, count=1)
        page = re.sub(r'(<meta property="og:title" content=")[^"]*', lambda m: m.group(1) + html.escape(title, quote=True), page, count=1)
        page = re.sub(r'(<meta property="og:description" content=")[^"]*', lambda m: m.group(1) + html.escape(desc, quote=True), page, count=1)
        url = f"{DOMAIN}numbers/{n}/"
        page = re.sub(r'(<link rel="canonical" href=")[^"]*', lambda m: m.group(1) + url, page, count=1)
        page = re.sub(r'(<meta property="og:url" content=")[^"]*', lambda m: m.group(1) + url, page, count=1)
        page = page.replace('<h1 id="nH1">What does this number mean in Chinese?</h1>', f'<h1 id="nH1">What does {n} mean in Chinese?</h1>', 1)
        page = page.replace('<p class="lead" id="nAnswer">Enter a number to see its meaning, slang, homophones and luck score.</p>',
                            f'<p class="lead" id="nAnswer">{html.escape(ans)}</p>', 1)
        d = OUT / "numbers" / n
        d.mkdir(parents=True, exist_ok=True)
        (d / "index.html").write_text(page, encoding="utf-8")

    pages = sorted(p.name for p in ROOT.glob("*.html") if p.name not in ("404.html",))
    urls = [(DOMAIN + ("" if p == "index.html" else p), "1.0" if p == "index.html" else "0.8") for p in pages]
    urls += [(f"{DOMAIN}numbers/{n}/", "0.9" if n in codes else "0.5") for n in nums]
    sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    sm += [f"<url><loc>{u}</loc><lastmod>{TODAY}</lastmod><priority>{p}</priority></url>" for u, p in urls]
    sm.append("</urlset>")
    (OUT / "sitemap.xml").write_text("\n".join(sm), encoding="utf-8")

    try:
        from PIL import Image, ImageDraw, ImageFont
        img = Image.new("RGB", (1200, 630), "#C8102E")
        dr = ImageDraw.Draw(img)
        dr.rectangle([40, 40, 1160, 590], outline="#D4A017", width=6)
        def font(sz):
            for f in ("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", "DejaVuSans-Bold.ttf"):
                try: return ImageFont.truetype(f, sz)
                except Exception: pass
            return ImageFont.load_default()
        dr.text((600, 250), "11176", fill="#FFFFFF", font=font(190), anchor="mm")
        dr.text((600, 420), "Lucky Number Lab", fill="#F2C94C", font=font(64), anchor="mm")
        dr.text((600, 500), "Decode any number the Chinese way", fill="#FDE9DC", font=font(36), anchor="mm")
        (OUT / "assets/img").mkdir(parents=True, exist_ok=True)
        img.save(OUT / "assets/img/og.png")
    except Exception as e:
        print("OG image skipped:", e)

    print(f"Generated {len(nums)} number pages, {len(urls)} sitemap URLs → {OUT}")


if __name__ == "__main__":
    main()
