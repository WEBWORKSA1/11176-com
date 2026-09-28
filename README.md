# 11176.com — Lucky Number Lab

Static website that decodes numbers the Chinese way: meanings, slang, homophones, luck score, and tools for phones, plates, prices, dates and zodiac signs. Monetized with AdSense, YouTube, lead generation, sponsorships, donations and contests.

**Live (GitHub Pages):** https://webworksa1.github.io/11176-com/
**Buy / sponsor / partner:** https://web.works/contact

## Structure
```
index.html, tools.html, number.html, meanings.html, digits.html, guides.html, quiz.html
report.html (lead gen), business.html (B2B lead gen), videos.html, contests.html
support.html (donations), careers.html, advertise.html, about.html, contact.html
privacy.html, terms.html, disclaimer.html (trademark/copyright), 404.html
assets/css/style.css   assets/js/{config,engine,app,pages}.js
tools/generate.py      → builds ~1,700 /numbers/{n}/ SEO pages + sitemap + og.png into _site/
plan/build-pages.yml.txt → GitHub Action (move to .github/workflows/build-pages.yml to enable) that runs generate.py and publishes to gh-pages
plan/RESEARCH.md, plan/BUILD-PROMPT.md
```

## Go-live checklist
1. **Pages:** Settings → Pages → *Deploy from a branch* → `main` / `(root)`. The site works as-is, and `/numbers/N/` links fall back to `number.html?n=N`.
   **SEO boost (recommended):** move `plan/build-pages.yml.txt` to `.github/workflows/build-pages.yml` using the GitHub web editor. The Action then generates ~1,700 static number pages + a full sitemap into the `gh-pages` branch. After that, switch the Pages source to `gh-pages` / `(root)`.
2. **Custom domain:** in Pages, set `11176.com`. DNS: A records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`; `www` CNAME → `webworksa1.github.io`. Then tick *Enforce HTTPS*.
3. **Forms:** all forms send to the owner inbox, kept encoded in `assets/js/config.js` and never shown on the site. Submit any form once, then confirm FormSubmit's activation email.
4. **AdSense:** after approval, set `adsenseClient` and slot ids in `config.js`, then uncomment the line in `ads.txt`.
5. **Donations / YouTube / GA4 / socials:** fill in `config.js`.
6. Submit `https://11176.com/sitemap.xml` to Google Search Console.

## Local preview
```
python3 tools/generate.py && python3 -m http.server -d _site 8000
```

## Legal
“11176” is used as a descriptive domain name. No trademark rights are claimed in the number. See `disclaimer.html`.
