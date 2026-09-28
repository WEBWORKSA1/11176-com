# 11176.com — Phase-wise Build Prompt

Use these prompts in order with an AI coding assistant, or hand them to a developer. Each phase is self-contained and ends with acceptance checks. `{{OWNER_EMAIL}}` is the single private inbox for all forms. It must **never appear as plain text** anywhere on the site.

---

## PHASE 0 — Brief (paste first)

> You are building **11176.com — "Lucky Number Lab"**, a modern, fast, responsive, fully static website (HTML/CSS/vanilla JS, no build step required) hosted free on **GitHub Pages** (repo `WEBWORKSA1/11176-com`). The site decodes any number the Chinese way: Mandarin homophones, internet number slang (520, 1314, 666, 88, 250…), digit meanings 0–9, a luck score (0–100), and tools for phones, license plates, prices, dates and zodiac.
> The name reads **11176 = 要要要 · 起溜** ("want it ×3 — rise and roll smoothly"). 1 is read as 幺/要 in phone numbers, 7 = 起 (rise), 6 = 溜 (smooth), and the digit sum 16 = 一路 (all the way). Label this as the site's own interpretation.
> Revenue: Google AdSense, YouTube, lead generation (free report + B2B audits + referrals), sponsorships, donations, contests.
> Hard rules:
> 1. At the top of **every** page, a banner linking to `https://web.works/contact`: "Contact, if you are interested in this website / domain name / Sponsorship / Advertisement / Partnership".
> 2. All forms deliver to `{{OWNER_EMAIL}}` only. Store it encoded (reversed base64, split in chunks) in `assets/js/config.js`. Decode it only at submit time. POST via FormSubmit AJAX with a honeypot. Fall back to a JS-built `mailto:`. The address must never be rendered in HTML/text.
> 3. Include a Trademark/Copyright disclaimer: no rights are claimed in the number 11176, and there is no affiliation with any third party.
> 4. Must run on the GitHub Pages free plan: static files only, relative links, and it must work under `/11176-com/` and at the custom domain root.

## PHASE 1 — Foundation & design system
> Create `assets/css/style.css` with design tokens: Chinese red `#C8102E`, gold `#D4A017`, warm off-white `#FFF8EE`, ink `#1A1A1A`. Add a full dark theme (auto + toggle, saved in localStorage inside try/catch). Use Inter + Noto Serif SC. Components: buttons (primary/gold/ghost), cards, chips, gauge (conic-gradient), digit chips (good/bad), tags (ok/warn/bad), tables in scroll wrappers, multi-step form with progress, option tiles, FAQ `<details>`, tabs, countdown, donation bars, tiers with ribbon, toast, cookie consent, slide-in lead box, floating action button, reveal-on-scroll with reduced-motion support. Mobile-first: 16px gutters, no horizontal scroll at 375px, burger menu below 1180px.
> **Accept when:** Lighthouse accessibility ≥ 95 and no overflow at 375px.

## PHASE 2 — Number engine
> Build `assets/js/engine.js` exposing `window.NUM`:
> - `DIGITS` 0–9: hanzi, pinyin, homophones [char, pinyin, gloss], positive, negative, weight (8:+8, 6:+6, 9:+5, 4:−10…)
> - `CODES` dictionary (60+): code → [zh, pinyin, meaning, category(love|lucky|business|chat|culture|unlucky|rude), safety(ok|casual|rude)]
> - `analyze(n)`: exact match, greedy segmentation into known codes, patterns (repdigit, palindrome, rising run, AABB/ABAB, ends in 8/4, contains 14/74/250, wealth combos, love codes), score 3–99, verdict (大吉/吉/平/小凶/凶), digit sum + numerology root
> - `render(el, n)`: gauge, reading, digit chips, pattern tags, and CTAs (Full page, Free report, Share)
> - `ZODIAC` with the lucky/unlucky digits commonly cited per animal, plus `zodiacForYear`
> Emit a `numberDecoded` event for lead slide-ins and analytics.

## PHASE 3 — Layout shell & monetization plumbing
> `assets/js/config.js` (the only file the owner edits): adsenseClient, adSlots, ga4, donate links (PayPal, BuyMeACoffee, Ko-fi, GitHub Sponsors, Patreon), YouTube channel + video IDs, socials, partnerUrl, encoded email key.
> `assets/js/app.js`: inject header nav + footer (links, newsletter, legal line). Add the cookie consent gate. AdSense loads **only** when an id is set and consent is given; otherwise ad slots show a house ad selling sponsorships. Also: GA4 events (`generate_lead`, `share`), universal form handler, multi-step forms, `?n=` prefill, Web Share / clipboard, YouTube lite facade (youtube-nocookie), counters, tabs, and a once-a-week lead slide-in after a decode.

## PHASE 4 — Core pages
> Build: `index` (hero + live decoder, "Why 11176" explainer, 8 tool cards, trending codes, **dedicated lead-gen block**, guides, videos, contest/support/careers teasers, FAQ). Also `tools` (7 tabbed tools: decoder, phone, plate, price optimizer, date finder + best dates this month, zodiac, compare), `number` (dynamic `?n=`: H1 + answer box, result, digit table, usage cards, related chips, FAQ + FAQPage JSON-LD, canonical to `/numbers/{n}/`), `meanings` (searchable/filterable dictionary), `digits` (0–9 cards), `guides` (5 articles), and `quiz` (10 random questions, share, newsletter).

## PHASE 5 — Lead generation (highest priority for revenue)
> - `report.html`: 3-step form (purpose tiles → numbers, birth year, country, budget, timeline → name, email, WhatsApp, language, consent, newsletter opt-in). Trust badges, "what you get" list, FAQ.
> - Home lead block: the same 3-step form.
> - `business.html`: B2B audit form (company, industry, market, scope checkboxes, budget).
> - Micro-CTAs: in every tool result, on the number-page sidebar, and in the slide-in.
> - Success messages set expectations ("within 48 hours"). The honeypot blocks bots. Fire the GA4 `generate_lead` event.

## PHASE 6 — Community, support & growth pages
> `videos` (featured IDs from config, or topic cards linking to YouTube search; creator program; idea form). `contests` (monthly challenge, countdown to month end, prizes, rules summary, entry form). `support` (allocation bars: operations, tools, hiring, marketing, prizes; goal bar; tiers; pledge form; configured donate buttons). `careers` (6 roles + application form). `advertise` (packages, media-kit form, acquisition link to web.works/contact). `about`, `contact` (form + JS mailto link + partner link).

## PHASE 7 — Legal & trust
> `disclaimer.html` (trademark notice for "11176", copyright, DMCA-style notice via form, content disclaimer, affiliate/ads disclosure). `privacy.html` (AdSense-required cookie language, FormSubmit processor, GDPR/CCPA/PIPEDA/Law 25 rights). `terms.html` (contest rules, donations, submissions). `404.html` with a `<base>` fix and a `/numbers/N/` → `number.html?n=N` redirect.

## PHASE 8 — Programmatic SEO & publishing
> `tools/generate.py` copies the site into `_site/` and generates `/numbers/{n}/index.html` for 0–999, every dictionary code, repdigits, AABB/ABAB, 4-digit prosperity endings and years 1940–2040 (~1,700 pages). Each page gets a unique title, description, canonical, OG and a pre-rendered H1 and answer. It also writes `sitemap.xml` and `og.png`.
> A GitHub Action (`plan/build-pages.yml.txt` → `.github/workflows/build-pages.yml`) runs on each push to `main` and force-publishes `_site` to `gh-pages`. Add `robots.txt`, an `ads.txt` template, `manifest.webmanifest`, `favicon.svg` and `.nojekyll`.
> **Accept when:** a search for the owner's email across the repo finds nothing, every page shows the top banner, and every form posts successfully.

## PHASE 9 — Launch checklist (owner)
1. GitHub → Settings → Pages → Deploy from branch → `main` / root (or `gh-pages` once the Action is enabled).
2. Custom domain: add `11176.com` in Pages settings, set DNS A records to 185.199.108.153 / .109 / .110 / .111 and a `www` CNAME to `webworksa1.github.io`, then enable HTTPS.
3. Submit the first form yourself and click FormSubmit's one-time activation email.
4. Apply for AdSense. Once approved, paste the `ca-pub` id into `config.js` and uncomment `ads.txt`.
5. Add GA4 id, donation links, YouTube channel and video IDs.
6. Submit `sitemap.xml` in Google Search Console and Bing Webmaster Tools.

## PHASE 10 — Scale (months 2–12)
- Chinese (简体/繁體) and Spanish/Vietnamese versions; Cantonese readings; audio pronunciation
- Angel-number dual readings (`/angel-number/{n}`), `/phone/{pattern}`, `/plate/{region}/{pattern}`, `/price/{ending}`, `/date/{yyyy-mm-dd}`
- Share-card image generator; embeddable widget for backlinks
- Paid premium PDF report (Stripe Payment Links) and an ad-free supporter tier
- Record-sales database (plates, phones), a link-bait asset for press
- Weekly "Lucky Number" newsletter; YouTube Shorts pipeline (1 code = 1 Short)
