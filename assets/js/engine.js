/* 11176.com — Number meaning engine (Mandarin homophones, slang codes, luck score) */
(function (g) {
  "use strict";

  // Digit reference: hanzi, pinyin, homophones (positive / negative), weight for luck score
  var DIGITS = {
    "0": { zh: "零", py: "líng", sound: [["灵", "líng", "spirit, clever"], ["你", "nǐ", "you (in slang, e.g. 520)"]], good: "wholeness, a fresh start", bad: "emptiness", w: 1 },
    "1": { zh: "一 / 幺", py: "yī / yāo", sound: [["要", "yào", "want, will"], ["一", "yī", "one, unity, first"], ["意", "yì", "intention, heart"]], good: "leadership, unity, a beginning", bad: "loneliness (光棍, singles)", w: 2 },
    "2": { zh: "二 / 两", py: "èr / liǎng", sound: [["爱", "ài", "love (as in 520)"], ["易", "yì", "easy (Cantonese)"], ["双", "shuāng", "pair — 好事成双"]], good: "pairs, harmony, love", bad: "“250” = a fool", w: 2 },
    "3": { zh: "三", py: "sān", sound: [["生", "shēng", "life, birth (as in 1314)"], ["散", "sàn", "to scatter, split"]], good: "life, growth", bad: "separation", w: 1 },
    "4": { zh: "四", py: "sì", sound: [["死", "sǐ", "death"], ["世", "shì", "lifetime (as in 1314)"], ["是", "shì", "yes, is (as in 94)"]], good: "a lifetime (only in combos)", bad: "sounds like 死 death — avoided in floors, plates and phones", w: -10 },
    "5": { zh: "五", py: "wǔ", sound: [["我", "wǒ", "I, me (as in 520)"], ["无", "wú", "nothing, without"], ["呜", "wū", "crying — 555"]], good: "the Five Elements, the self", bad: "“without”", w: 0 },
    "6": { zh: "六", py: "liù", sound: [["溜", "liū", "smooth, slick"], ["流", "liú", "to flow"], ["了", "le", "done (as in 886)"]], good: "things going smoothly — 六六大顺", bad: "—", w: 6 },
    "7": { zh: "七", py: "qī", sound: [["起", "qǐ", "to rise, get up"], ["妻", "qī", "wife"], ["亲", "qīn", "kiss, dear"], ["气", "qì", "angry (as in 7456)"], ["去", "qù", "go (as in 748)"]], good: "rising, togetherness (Qixi 七夕 lovers' day)", bad: "anger, the Ghost Month (7th lunar month)", w: 1 },
    "8": { zh: "八", py: "bā", sound: [["发", "fā", "prosper, get rich (发财)"], ["拜", "bài", "bye (88)"], ["吧", "ba", "suggestion (918)"]], good: "wealth and prosperity — the luckiest digit", bad: "—", w: 8 },
    "9": { zh: "九", py: "jiǔ", sound: [["久", "jiǔ", "long-lasting, eternal"], ["就", "jiù", "just, exactly (94)"], ["救", "jiù", "save, help (995)"]], good: "longevity, the emperor's number", bad: "—", w: 5 }
  };

  // Curated slang / culture codes. cat: love | lucky | chat | business | rude | unlucky | culture
  // safe: ok | casual | rude
  var CODES = {
    "0": ["零", "líng", "Zero — completeness; reads as 你 (you) inside love codes.", "culture", "ok"],
    "4": ["死", "sǐ", "Sounds like “death” — the most avoided digit in Chinese-speaking regions.", "unlucky", "ok"],
    "6": ["溜 / 顺", "liù", "Smooth — everything flows. Also “cool” online.", "lucky", "ok"],
    "8": ["发", "fā", "Prosperity — the king of lucky numbers.", "lucky", "ok"],
    "9": ["久", "jiǔ", "Longevity and eternity.", "lucky", "ok"],
    "11": ["光棍", "guānggùn", "“Bare sticks” — singles. 11/11 is Singles' Day, China's biggest shopping festival.", "culture", "ok"],
    "13": ["一生", "yīshēng", "“A lifetime” (in Chinese). In the West, 13 is considered unlucky.", "love", "ok"],
    "14": ["要死", "yào sǐ", "“Want to die” — avoided; many buildings skip floor 14.", "unlucky", "ok"],
    "16": ["一路", "yī lù", "“All the way” — used in 168 一路发.", "lucky", "ok"],
    "20": ["爱你", "ài nǐ", "“Love you”.", "love", "ok"],
    "38": ["三八", "sān bā", "Insult for a gossipy woman in Taiwan slang; also 3/8 Women's Day.", "rude", "rude"],
    "44": ["死死", "sǐ sǐ", "Double death — strongly avoided.", "unlucky", "ok"],
    "56": ["无聊", "wúliáo", "“Bored”.", "chat", "casual"],
    "66": ["顺顺", "shùn shùn", "Smooth-smooth — good wishes.", "lucky", "ok"],
    "74": ["气死", "qì sǐ", "“So angry”.", "chat", "casual"],
    "77": ["亲亲", "qīn qīn", "“Kiss kiss”.", "love", "casual"],
    "88": ["拜拜 / 发发", "bāi bāi / fā fā", "“Bye-bye” online; “double prosperity” in business.", "chat", "ok"],
    "94": ["就是", "jiù shì", "“Exactly / that's right”.", "chat", "casual"],
    "99": ["久久", "jiǔ jiǔ", "“Forever and ever”; 9/9 is the Double Ninth Festival.", "love", "ok"],
    "168": ["一路发", "yī lù fā", "“Prosperity all the way” — a favorite for shops, phone and price endings.", "business", "ok"],
    "233": ["哈哈哈", "hāhāhā", "Laughing out loud (from emoticon #233 on the old Mop forum).", "chat", "casual"],
    "250": ["二百五", "èrbǎiwǔ", "“Idiot” — avoid this in prices and gifts!", "rude", "rude"],
    "514": ["我要死", "wǒ yào sǐ", "“I'm dying” (dramatic).", "chat", "casual"],
    "518": ["我要发", "wǒ yào fā", "“I will prosper” — popular in business numbers.", "business", "ok"],
    "520": ["我爱你", "wǒ ài nǐ", "“I love you.” May 20 (5/20) is an unofficial Valentine's Day.", "love", "ok"],
    "521": ["我爱你 / 我愿意", "wǒ ài nǐ / wǒ yuànyì", "“I love you” / “I do” — May 21 continues 520 celebrations.", "love", "ok"],
    "530": ["我想你", "wǒ xiǎng nǐ", "“I miss you”.", "love", "ok"],
    "555": ["呜呜呜", "wū wū wū", "Crying — boo-hoo.", "chat", "casual"],
    "584": ["我发誓", "wǒ fāshì", "“I swear”.", "love", "casual"],
    "596": ["我走了", "wǒ zǒu le", "“I'm leaving”.", "chat", "casual"],
    "666": ["溜溜溜", "liù liù liù", "“Awesome! Skillful!” — gamer praise; also very lucky (smooth).", "chat", "ok"],
    "687": ["对不起", "duìbuqǐ", "“Sorry”.", "chat", "casual"],
    "748": ["去死吧", "qù sǐ ba", "“Go to hell” — rude.", "rude", "rude"],
    "865": ["别惹我", "bié rě wǒ", "“Don't mess with me”.", "chat", "rude"],
    "886": ["拜拜了", "bāibāi le", "“Bye now”.", "chat", "casual"],
    "888": ["发发发", "fā fā fā", "Triple prosperity — a premium business number.", "business", "ok"],
    "918": ["加油吧", "jiā yóu ba", "“Go for it! You can do it!”", "chat", "ok"],
    "995": ["救救我", "jiù jiù wǒ", "“Help me!”", "chat", "casual"],
    "996": ["996工作制", "jiǔ jiǔ liù", "Work 9am–9pm, 6 days a week — tech-industry overtime culture.", "culture", "ok"],
    "999": ["久久久", "jiǔ jiǔ jiǔ", "Eternal — long-lasting love or business.", "love", "ok"],
    "1111": ["光棍节", "guānggùn jié", "Singles' Day (11 November) — four “bare sticks”; now a global e-commerce event.", "culture", "ok"],
    "1314": ["一生一世", "yī shēng yī shì", "“For a whole lifetime” — forever.", "love", "ok"],
    "1414": ["意思意思", "yìsi yìsi", "“Just a small token” (of thanks).", "chat", "casual"],
    "1688": ["一路发发", "yī lù fā fā", "Prosperity all the way, doubled.", "business", "ok"],
    "1711": ["一心一意", "yīxīn yīyì", "“Wholeheartedly”.", "love", "ok"],
    "2013": ["爱你一生", "ài nǐ yīshēng", "“Love you for life”.", "love", "ok"],
    "2014": ["爱你一世", "ài nǐ yīshì", "“Love you for a lifetime”.", "love", "ok"],
    "3344": ["生生世世", "shēng shēng shì shì", "“Life after life” — eternal love.", "love", "ok"],
    "5555": ["呜呜呜呜", "wū wū wū wū", "Sobbing.", "chat", "casual"],
    "6666": ["溜溜溜溜", "liù liù liù liù", "Super-smooth / super awesome.", "lucky", "ok"],
    "7456": ["气死我了", "qì sǐ wǒ le", "“I'm so angry!”", "chat", "casual"],
    "8013": ["伴你一生", "bàn nǐ yīshēng", "“With you all my life”.", "love", "ok"],
    "8147": ["不要生气", "bù yào shēngqì", "“Don't be angry”.", "love", "ok"],
    "8384": ["不三不四", "bù sān bù sì", "“Shady, dubious”.", "rude", "casual"],
    "8888": ["发发发发", "fā fā fā fā", "Ultimate prosperity — among the most expensive numbers ever sold.", "business", "ok"],
    "9277": ["就爱亲亲", "jiù ài qīnqīn", "“Just love kisses”.", "love", "casual"],
    "9420": ["就是爱你", "jiù shì ài nǐ", "“It's you I love”.", "love", "ok"],
    "9494": ["就是就是", "jiù shì jiù shì", "“Exactly, exactly!”", "chat", "casual"],
    "9999": ["久久久久", "jiǔ jiǔ jiǔ jiǔ", "Forever and ever.", "love", "ok"],
    "25184": ["爱我一辈子", "ài wǒ yībèizi", "“Love me for life”.", "love", "ok"],
    "11176": ["要要要·起溜", "yāo yāo yāo · qǐ liū", "Our flagship reading: “Want it, want it, want it — rise and roll smoothly.” 1 read as 幺/要 (want), 7 as 起 (rise), 6 as 溜 (smooth). Digit sum 16 = 一路 “all the way”.", "lucky", "ok"],
    "5201314": ["我爱你一生一世", "wǒ ài nǐ yī shēng yī shì", "“I love you forever.”", "love", "ok"],
    "1314520": ["一生一世我爱你", "yī shēng yī shì wǒ ài nǐ", "“Forever, I love you.”", "love", "ok"],
    "7758258": ["亲亲我吧爱我吧", "qīnqīn wǒ ba ài wǒ ba", "“Kiss me, love me.”", "love", "casual"],
    "04551": ["你是我唯一", "nǐ shì wǒ wéiyī", "“You are my only one”.", "love", "ok"],
    "5211314": ["我爱你一生一世", "wǒ ài nǐ yī shēng yī shì", "“I love you forever.”", "love", "ok"]
  };

  var ZODIAC = [
    ["Rat", "鼠", [2, 3], [5, 9]], ["Ox", "牛", [1, 4], [5, 6]], ["Tiger", "虎", [1, 3, 4], [6, 7, 8]],
    ["Rabbit", "兔", [3, 4, 6], [7, 8]], ["Dragon", "龙", [1, 6, 7], [3, 8]], ["Snake", "蛇", [2, 8, 9], [1, 6, 7]],
    ["Horse", "马", [2, 3, 7], [1, 5, 6]], ["Goat", "羊", [2, 7], [6, 9]], ["Monkey", "猴", [4, 9], [2, 7]],
    ["Rooster", "鸡", [5, 7, 8], [1, 3, 9]], ["Dog", "狗", [3, 4, 9], [1, 6, 7]], ["Pig", "猪", [2, 5, 8], [1, 7, 8]]
  ];

  function clean(s) { return String(s || "").replace(/[^0-9]/g, ""); }

  function patterns(d) {
    var p = [];
    if (d.length >= 2 && /^(\d)\1+$/.test(d)) p.push(["Repdigit", "all the same digit — premium & memorable", 12]);
    if (d.length >= 3 && d === d.split("").reverse().join("")) p.push(["Palindrome", "reads the same both ways", 5]);
    var up = true, down = true;
    for (var i = 1; i < d.length; i++) { if (+d[i] !== +d[i - 1] + 1) up = false; if (+d[i] !== +d[i - 1] - 1) down = false; }
    if (d.length >= 3 && up) p.push(["Rising run", "steps up — “步步高升” (rising step by step)", 8]);
    if (d.length >= 3 && down) p.push(["Falling run", "steps down", -3]);
    if (/(\d)\1(\d)\2$/.test(d) && d.length >= 4) p.push(["AABB ending", "double pairs — easy to remember", 6]);
    if (/(\d)(\d)\1\2$/.test(d) && d.length >= 4 && d.slice(-1) !== d.slice(-2, -1)) p.push(["ABAB ending", "rhythmic repeat", 4]);
    if (/8$/.test(d)) p.push(["Ends in 8", "prosperity at the finish", 6]);
    if (/4$/.test(d)) p.push(["Ends in 4", "an unlucky ending", -8]);
    if (/14/.test(d)) p.push(["Contains 14", "要死 “want to die”", -8]);
    if (/74/.test(d)) p.push(["Contains 74", "气死 “furious”", -4]);
    if (/250/.test(d)) p.push(["Contains 250", "“idiot” — avoid in prices", -6]);
    if (/168|518|888|1688/.test(d)) p.push(["Wealth combo", "168 / 518 / 888 prosperity sequence", 8]);
    if (/520|1314|9420/.test(d)) p.push(["Love code", "carries a romantic message", 5]);
    if (/66/.test(d)) p.push(["Double 6", "六六大顺 — everything smooth", 4]);
    if (/99/.test(d)) p.push(["Double 9", "long-lasting", 3]);
    return p;
  }

  // Greedy segmentation into known multi-digit codes
  function segment(d) {
    var out = [], i = 0, keys = Object.keys(CODES).filter(function (k) { return k.length >= 2; }).sort(function (a, b) { return b.length - a.length; });
    while (i < d.length) {
      var hit = null;
      for (var k = 0; k < keys.length; k++) { if (d.substr(i, keys[k].length) === keys[k]) { hit = keys[k]; break; } }
      if (hit) { out.push({ code: hit, zh: CODES[hit][0], py: CODES[hit][1], en: CODES[hit][2] }); i += hit.length; }
      else { var dg = DIGITS[d[i]]; out.push({ code: d[i], zh: dg.sound[0][0], py: dg.sound[0][1], en: dg.sound[0][2] }); i++; }
    }
    return out;
  }

  function reduce(n) { var s = n; while (s > 9 && s !== 11 && s !== 22 && s !== 33) { s = String(s).split("").reduce(function (a, b) { return a + (+b); }, 0); } return s; }

  function analyze(input) {
    var d = clean(input);
    if (!d) return null;
    if (d.length > 24) d = d.slice(0, 24);
    var score = 55, count = {}, i;
    for (i = 0; i < d.length; i++) { count[d[i]] = (count[d[i]] || 0) + 1; }
    var dw = 0;
    for (i = 0; i < d.length; i++) dw += DIGITS[d[i]].w;
    score += Math.max(-35, Math.min(28, Math.round(dw * (4 / Math.max(4, d.length)) * 1.6)));
    var pats = patterns(d);
    pats.forEach(function (p) { score += p[2]; });
    if (!count["4"]) score += 4;
    score = Math.max(3, Math.min(99, score));
    var verdict = score >= 85 ? ["Very lucky", "ok", "大吉"] : score >= 70 ? ["Lucky", "ok", "吉"] : score >= 55 ? ["Balanced", "warn", "平"] : score >= 40 ? ["Mixed", "warn", "小凶"] : ["Unlucky", "bad", "凶"];
    var sum = d.split("").reduce(function (a, b) { return a + (+b); }, 0);
    var exact = CODES[d] ? { zh: CODES[d][0], py: CODES[d][1], en: CODES[d][2], cat: CODES[d][3], safe: CODES[d][4] } : null;
    return {
      number: d, exact: exact, segments: segment(d), score: score, verdict: verdict, patterns: pats,
      digits: d.split("").map(function (c) { return { c: c, info: DIGITS[c] }; }),
      counts: count, sum: sum, root: reduce(sum),
      sumCode: CODES[String(sum)] ? CODES[String(sum)] : null
    };
  }

  function zodiacForYear(y) { var idx = ((y - 2020) % 12 + 12) % 12; return ZODIAC[idx]; }

  function catLabel(c) { return ({ love: "Love code", lucky: "Lucky", chat: "Chat slang", business: "Business", rude: "Rude", unlucky: "Unlucky", culture: "Culture" })[c] || c; }
  function safeLabel(s) { return ({ ok: ["Safe to use", "ok"], casual: ["Casual / friends only", "warn"], rude: ["Rude — avoid", "bad"] })[s]; }

  // Render a full result block into an element
  function render(el, input, opts) {
    opts = opts || {};
    var r = analyze(input);
    if (!r) { el.innerHTML = '<p class="muted">Enter at least one digit.</p>'; el.classList.add("show"); return null; }
    var gc = r.verdict[1] === "ok" ? "var(--good)" : r.verdict[1] === "warn" ? "var(--warn)" : "var(--bad)";
    var h = '<div class="result-head"><div class="gauge" style="--v:' + r.score + ';--gc:' + gc + '"><span>' + r.score + '<small>/ 100</small></span></div><div>' +
      '<div class="muted small">Luck score for</div><div style="font-size:1.8rem;font-weight:800;letter-spacing:.05em">' + r.number + '</div>' +
      '<div class="verdict"><span class="tag ' + r.verdict[1] + '">' + r.verdict[0] + ' · <span class="zh">' + r.verdict[2] + '</span></span></div></div></div>';
    if (r.exact) {
      var s = safeLabel(r.exact.safe);
      h += '<div class="reading"><div class="zh" style="font-size:1.5rem">' + r.exact.zh + '</div><div class="muted">' + r.exact.py + '</div><p style="margin:.4em 0 0">' + r.exact.en + '</p><span class="tag">' + catLabel(r.exact.cat) + '</span> <span class="tag ' + s[1] + '">' + s[0] + '</span></div>';
    } else {
      h += '<div class="reading"><div class="small muted">Homophone reading</div><div class="zh" style="font-size:1.35rem">' + r.segments.map(function (x) { return x.zh; }).join(" · ") + '</div><div class="muted small">' + r.segments.map(function (x) { return x.py; }).join(" · ") + '</div><p style="margin:.4em 0 0">' + r.segments.map(function (x) { return "<b>" + x.code + "</b> → " + x.en; }).join("; ") + '</p></div>';
    }
    h += '<div class="digits">' + r.digits.map(function (x) {
      var cls = x.info.w >= 5 ? "good" : x.info.w < 0 ? "bad" : "";
      return '<div class="dchip ' + cls + '"><b>' + x.c + '</b><span class="zh">' + x.info.sound[0][0] + '</span><small>' + x.info.sound[0][2].split(" (")[0] + '</small></div>';
    }).join("") + '</div>';
    if (r.patterns.length) h += '<div>' + r.patterns.map(function (p) { return '<span class="tag ' + (p[2] > 0 ? "ok" : "bad") + '" title="' + p[1] + '">' + p[0] + ' (' + (p[2] > 0 ? "+" : "") + p[2] + ')</span>'; }).join("") + '</div>';
    h += '<p class="small muted" style="margin-top:10px">Digit sum <b>' + r.sum + '</b>' + (r.sumCode ? ' = <span class="zh">' + r.sumCode[0] + '</span> (' + r.sumCode[2].split(" — ")[0] + ')' : '') + ' · numerology root <b>' + r.root + '</b>' +
      (r.counts["8"] ? ' · ' + r.counts["8"] + '× 8 (发)' : '') + (r.counts["4"] ? ' · ' + r.counts["4"] + '× 4 (死)' : '') + '</p>';
    if (!opts.noLinks) h += '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px"><a class="btn sm" href="' + (opts.base || "") + 'number.html?n=' + r.number + '">Full meaning page →</a><a class="btn sm gold" href="' + (opts.base || "") + 'report.html?n=' + r.number + '">Get my free detailed report</a><button class="btn sm ghost" data-share="' + r.number + '">Share result</button></div>';
    el.innerHTML = h; el.classList.add("show");
    try { g.dispatchEvent(new CustomEvent("numberDecoded", { detail: r })); } catch (e) {}
    return r;
  }

  g.NUM = { DIGITS: DIGITS, CODES: CODES, ZODIAC: ZODIAC, analyze: analyze, render: render, clean: clean, zodiacForYear: zodiacForYear, catLabel: catLabel, safeLabel: safeLabel };
})(window);
