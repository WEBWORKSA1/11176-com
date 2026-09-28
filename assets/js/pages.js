/* 11176.com — page-specific interactivity */
(function () {
  "use strict";
  var N = window.NUM, S = window.SITE || {};
  var BASE = document.documentElement.getAttribute("data-base") || "";
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  var qs = new URLSearchParams(location.search);

  /* ---------- home decoder ---------- */
  var hf = $("#homeForm");
  if (hf) {
    var hr = $("#homeResult"), hi = $("#homeNum");
    hf.onsubmit = function (e) { e.preventDefault(); N.render(hr, hi.value, { base: BASE }); };
    $$(".chip[data-n]").forEach(function (c) { c.href = "#decode"; c.onclick = function (e) { e.preventDefault(); hi.value = c.getAttribute("data-n"); N.render(hr, hi.value, { base: BASE }); }; });
    N.render(hr, hi.value, { base: BASE });
  }

  /* ---------- trending grid ---------- */
  var tr = $("#trending");
  if (tr) {
    ["520", "1314", "666", "888", "168", "9420", "250", "748", "88", "996", "5201314", "11176"].forEach(function (k) {
      var c = N.CODES[k];
      tr.insertAdjacentHTML("beforeend", '<a class="card num-card reveal in" href="' + BASE + 'number.html?n=' + k + '"><div class="n">' + k + '</div><div class="zh">' + c[0] + '</div><p class="small">' + esc(c[2].split(" — ")[0].split(". ")[0]) + '</p></a>');
    });
  }

  /* ---------- videos (home + videos page) ---------- */
  var TOPICS = [["Chinese lucky numbers explained", "🍀"], ["520 meaning I love you Chinese", "❤️"], ["Chinese number slang 666 88", "💬"], ["why 4 is unlucky in China", "⚠️"], ["lucky phone numbers China auction", "📱"], ["Hong Kong license plate auction", "🚗"], ["Singles Day 11.11 history", "🛍️"], ["Chinese zodiac lucky numbers", "🐉"]];
  function ytCards(el, n) {
    var vids = (S.youtube && S.youtube.videos) || [];
    if (vids.length) {
      vids.slice(0, n).forEach(function (v) { el.insertAdjacentHTML("beforeend", '<div><div class="video" data-yt="' + esc(v.id) + '"></div><p style="margin-top:8px;font-weight:600">' + esc(v.title || "") + '</p></div>'); });
      $$(".video[data-yt]", el).forEach(function (v) {
        var id = v.getAttribute("data-yt");
        v.innerHTML = '<img loading="lazy" alt="" src="https://i.ytimg.com/vi/' + id + '/hqdefault.jpg"><div class="play"><span>▶</span></div>';
        v.onclick = function () { v.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen title="YouTube video"></iframe>'; };
      });
    } else {
      TOPICS.slice(0, n).forEach(function (t) {
        el.insertAdjacentHTML("beforeend", '<a class="card yt-card" target="_blank" rel="noopener" href="https://www.youtube.com/results?search_query=' + encodeURIComponent(t[0]) + '"><div class="ico">' + t[1] + '</div><h3>' + esc(t[0].replace(/^./, function (c) { return c.toUpperCase(); })) + '</h3><span class="small" style="color:var(--red);font-weight:700">▶ Watch on YouTube</span></a>');
      });
    }
  }
  if ($("#homeVideos")) ytCards($("#homeVideos"), 3);
  if ($("#ytGrid")) {
    ytCards($("#ytGrid"), 9);
    var tg = $("#ytTopics");
    TOPICS.forEach(function (t) { tg.insertAdjacentHTML("beforeend", '<a class="chip" style="display:block;text-align:center;padding:12px" target="_blank" rel="noopener" href="https://www.youtube.com/results?search_query=' + encodeURIComponent(t[0]) + '">' + t[1] + " " + esc(t[0]) + '</a>'); });
    if (S.youtube && S.youtube.channelUrl) $("#ytSub").innerHTML = '<a class="btn" target="_blank" rel="noopener" href="' + S.youtube.channelUrl + '?sub_confirmation=1">▶ Subscribe on YouTube</a>';
  }

  /* ---------- tools ---------- */
  function resultEl(form) { return form.parentElement.querySelector(".result"); }
  $$("form[data-tool]").forEach(function (f) {
    var tool = f.getAttribute("data-tool"), out = resultEl(f);
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      if (tool === "decode") N.render(out, $("input", f).value, { base: BASE });
      if (tool === "phone") phone(out, $("input", f).value);
      if (tool === "plate") { var v = $("#pl").value; if (!N.clean(v)) { out.innerHTML = '<p class="muted">Enter a plate that contains digits.</p>'; out.classList.add("show"); return; } N.render(out, v, { base: BASE }); out.insertAdjacentHTML("afterbegin", '<p class="small muted">Scored digits only: <b>' + N.clean(v) + '</b> · Region: ' + esc($("#plr").value) + '</p>'); }
      if (tool === "price") price(out, $("#pr").value);
      if (tool === "date") dateScore(out, $("#dt").value, $("#dtp").value);
      if (tool === "zodiac") zodiac(out, +$("#zy").value);
      if (tool === "compare") compare(out, $("#ca").value, $("#cb").value);
    });
    $$(".chip[data-n]", f.parentElement).forEach(function (c) { c.href = "#"; c.onclick = function (e) { e.preventDefault(); $("input", f).value = c.getAttribute("data-n"); N.render(out, c.getAttribute("data-n"), { base: BASE }); }; });
    if (tool === "decode" && qs.get("n")) N.render(out, qs.get("n"), { base: BASE });
  });

  function phone(out, v) {
    var d = N.clean(v); if (d.length < 4) { out.innerHTML = '<p class="muted">Enter at least 4 digits.</p>'; out.classList.add("show"); return; }
    var last4 = d.slice(-4), whole = N.analyze(d), tail = N.analyze(last4);
    var final = Math.round(tail.score * 0.6 + whole.score * 0.4);
    N.render(out, d, { base: BASE });
    var fours = (d.match(/4/g) || []).length, eights = (d.match(/8/g) || []).length;
    var tips = [];
    if (/4$/.test(d)) tips.push("Ends in 4, the ending people avoid most. Consider changing it.");
    if (fours > 1) tips.push(fours + " fours in total. Fewer is better.");
    if (eights >= 2) tips.push(eights + " eights — prosperity-heavy. Great for business.");
    if (/(\d)\1\1\1$/.test(d)) tips.push("AAAA ending: a premium, collectible pattern.");
    if (!tips.length) tips.push("A clean number. Upgrade by aiming for a 68, 88, 168 or 518 ending.");
    out.insertAdjacentHTML("afterbegin", '<div class="reading"><b>Phone verdict: ' + final + '/100</b> — last 4 digits <b>' + last4 + '</b> scored ' + tail.score + '; full number scored ' + whole.score + '.<ul style="margin:.5em 0 0;padding-left:1.2em">' + tips.map(function (t) { return "<li>" + t + "</li>"; }).join("") + '</ul></div>');
  }

  function price(out, v) {
    var p = parseFloat(String(v).replace(/[^0-9.]/g, "")); if (!(p > 0)) { out.innerHTML = '<p class="muted">Enter a price.</p>'; out.classList.add("show"); return; }
    var whole = Math.floor(p), cands = [];
    for (var x = Math.max(1, Math.floor(whole * 0.85)); x <= Math.ceil(whole * 1.15) + 1; x++) {
      var s = String(x); if (/4/.test(s) || /250/.test(s)) continue;
      var a = N.analyze(s), bonus = /88$|68$|8$/.test(s) ? 10 : /99$|66$|9$|6$/.test(s) ? 6 : 0;
      cands.push({ x: x, sc: a.score + bonus - Math.abs(x - whole) / Math.max(1, whole) * 40 });
    }
    cands.sort(function (a, b) { return b.sc - a.sc; });
    var below = cands.filter(function (c) { return c.x <= whole; }).slice(0, 3), above = cands.filter(function (c) { return c.x > whole; }).slice(0, 3);
    var cur = N.analyze(String(whole));
    var warn = /4/.test(String(whole)) ? '<span class="tag bad">Contains 4</span>' : /250/.test(String(whole)) ? '<span class="tag bad">Contains 250</span>' : '<span class="tag ok">No red flags</span>';
    function list(a) { return a.map(function (c) { return '<span class="dchip good" style="display:inline-block;margin:4px"><b>' + c.x + (p % 1 ? (p % 1).toFixed(2).slice(1) : "") + '</b><small>score ' + N.analyze(String(c.x)).score + '</small></span>'; }).join(""); }
    out.innerHTML = '<div class="reading"><b>Your price ' + p + '</b> scores ' + cur.score + '/100 ' + warn + '</div><p><b>Better prices at or below:</b></p>' + list(below) + '<p style="margin-top:10px"><b>Better prices above:</b></p>' + list(above) + '<p class="small muted" style="margin-top:10px">Tip: prices ending in 8 or 88 suit gifts and prosperity products; 99 suits long-lasting goods; 66 suits services.</p>';
    out.classList.add("show");
  }

  function dayScore(dt) {
    var m = dt.getMonth() + 1, d = dt.getDate(), s = String(m) + String(d);
    var a = N.analyze(s), sc = a.score;
    if (d === 4 || d === 14 || d === 24) sc -= 15;
    if (m === d) sc += 8;
    if ((m === 5 && (d === 20 || d === 21))) sc += 12;
    if (d === 8 || d === 18 || d === 28) sc += 6;
    if (d === 6 || d === 16 || d === 26 || d === 9 || d === 19 || d === 29) sc += 3;
    return Math.max(3, Math.min(99, sc));
  }
  function dateScore(out, v, occ) {
    if (!v) { out.innerHTML = '<p class="muted">Pick a date.</p>'; out.classList.add("show"); return; }
    var dt = new Date(v + "T12:00:00"), sc = dayScore(dt), notes = [];
    var m = dt.getMonth() + 1, d = dt.getDate();
    if ([4, 14, 24].indexOf(d) > -1) notes.push("Day " + d + " contains a 4. Many families avoid it for " + occ.toLowerCase() + "s.");
    if (m === d) notes.push("Double date (" + m + "/" + d + "), memorable and balanced.");
    if (m === 5 && (d === 20 || d === 21)) notes.push("5/20–5/21 reads as “I love you” — very popular for weddings.");
    if (/8/.test(String(d))) notes.push("An 8 in the day suggests prosperity, good for openings.");
    if (m === 8 || m === 9) notes.push("Check the lunar calendar: the Ghost Month (7th lunar month) often falls in Aug–Sep, and many avoid weddings and moves then.");
    var yr = dt.getFullYear(), z = N.zodiacForYear(yr);
    out.innerHTML = '<div class="result-head"><div class="gauge" style="--v:' + sc + ';--gc:' + (sc >= 70 ? "var(--good)" : sc >= 50 ? "var(--warn)" : "var(--bad)") + '"><span>' + sc + '<small>/ 100</small></span></div><div><div class="muted small">' + esc(occ) + '</div><div style="font-size:1.4rem;font-weight:800">' + dt.toDateString() + '</div><div class="small muted">Year of the ' + z[0] + ' <span class="zh">' + z[1] + '</span> (approx.)</div></div></div><ul>' + notes.map(function (n) { return "<li>" + n + "</li>"; }).join("") + '</ul><a class="btn sm gold" href="' + BASE + 'report.html">Get a personal date report</a>';
    out.classList.add("show");
  }
  var bd = $("#bestDates");
  if (bd) bd.onclick = function () {
    var out = resultEl(bd.form), base = $("#dt").value ? new Date($("#dt").value + "T12:00:00") : new Date();
    var y = base.getFullYear(), m = base.getMonth(), days = new Date(y, m + 1, 0).getDate(), arr = [];
    for (var d = 1; d <= days; d++) { var dt = new Date(y, m, d, 12); arr.push([dt, dayScore(dt)]); }
    arr.sort(function (a, b) { return b[1] - a[1]; });
    out.innerHTML = '<h3>Top dates in ' + base.toLocaleString("en", { month: "long", year: "numeric" }) + '</h3><div class="table-wrap"><table><tr><th>Date</th><th>Day</th><th>Score</th></tr>' + arr.slice(0, 7).map(function (a) { return '<tr><td>' + a[0].toDateString().slice(4) + '</td><td>' + a[0].toLocaleString("en", { weekday: "long" }) + '</td><td class="n">' + a[1] + '</td></tr>'; }).join("") + '</table></div>';
    out.classList.add("show");
  };

  function zodiac(out, y) {
    if (!(y > 1900 && y < 2101)) { out.innerHTML = '<p class="muted">Enter a birth year between 1901 and 2100.</p>'; out.classList.add("show"); return; }
    var z = N.zodiacForYear(y);
    out.innerHTML = '<div class="reading"><div class="zh" style="font-size:2rem">' + z[1] + '</div><b>Year of the ' + z[0] + '</b> (born ' + y + ')</div><p><b>Lucky numbers:</b> ' + z[2].map(function (n) { return '<span class="dchip good" style="display:inline-block;margin:3px"><b>' + n + '</b></span>'; }).join("") + '</p><p><b>Less lucky:</b> ' + z[3].map(function (n) { return '<span class="dchip bad" style="display:inline-block;margin:3px"><b>' + n + '</b></span>'; }).join("") + '</p><p class="small muted">Born in January or early February? You may belong to the previous animal year.</p>';
    out.classList.add("show");
  }
  var zt = $("#zodiacTable");
  if (zt) N.ZODIAC.forEach(function (z) { zt.insertAdjacentHTML("beforeend", '<tr><td><span class="zh">' + z[1] + '</span> ' + z[0] + '</td><td class="n">' + z[2].join(", ") + '</td><td>' + z[3].join(", ") + '</td></tr>'); });

  function compare(out, a, b) {
    var A = N.analyze(a), B = N.analyze(b);
    if (!A || !B) { out.innerHTML = '<p class="muted">Enter two numbers.</p>'; out.classList.add("show"); return; }
    var win = A.score === B.score ? null : (A.score > B.score ? A : B);
    function col(r) { return '<div class="card center' + (win === r ? '" style="border:2px solid var(--good)' : '') + '"><div style="font-size:1.6rem;font-weight:800">' + r.number + '</div><div class="gauge" style="margin:10px auto;--v:' + r.score + ';--gc:' + (r.verdict[1] === "ok" ? "var(--good)" : r.verdict[1] === "warn" ? "var(--warn)" : "var(--bad)") + '"><span>' + r.score + '</span></div><div class="zh">' + (r.exact ? r.exact.zh : r.segments.map(function (s) { return s.zh; }).join("·")) + '</div>' + (win === r ? '<span class="tag ok">Winner</span>' : '') + '</div>'; }
    out.innerHTML = '<div class="grid g2">' + col(A) + col(B) + '</div><p class="center" style="margin-top:12px"><b>' + (win ? win.number + " wins by " + Math.abs(A.score - B.score) + " points." : "It's a tie. Pick by meaning.") + '</b></p>';
    out.classList.add("show");
  }

  /* ---------- number page ---------- */
  if ($("#nResult")) {
    var n = N.clean(qs.get("n") || document.documentElement.getAttribute("data-n") || "11176") || "11176";
    var r = N.analyze(n);
    var title = "What does " + n + " mean in Chinese? " + (r.exact ? r.exact.zh + " — " : "") + "Meaning, slang & luck score";
    document.title = title + " | 11176";
    var canon = document.querySelector("link[rel=canonical]"); if (canon) canon.href = "https://11176.com/numbers/" + n + "/";
    var md = document.querySelector('meta[name=description]');
    var ans = r.exact ? n + " means “" + r.exact.en.replace(/[“”"]/g, "").split(". ")[0].replace(/\.$/, "") + "” (" + r.exact.zh + ", " + r.exact.py + ")." : n + " reads as " + r.segments.map(function (s) { return s.zh; }).join(" · ") + " (" + r.segments.map(function (s) { return s.py; }).join(" · ") + ") — " + r.segments.map(function (s) { return s.en.split(" (")[0]; }).join(" + ") + ".";
    if (md) md.setAttribute("content", ans + " Luck score " + r.score + "/100. Digit-by-digit breakdown, usage tips and better alternatives.");
    $("#nH1").textContent = "What does " + n + " mean in Chinese?";
    $("#nAnswer").innerHTML = esc(ans) + ' <span class="tag ' + r.verdict[1] + '">' + r.verdict[0] + " · " + r.score + '/100</span>';
    $("#crumbN").textContent = n; $("#nSide").textContent = n; $("#nInput").value = n;
    $("#nReport").href = BASE + "report.html?n=" + n;
    N.render($("#nResult"), n, { base: BASE, noLinks: false });
    $("#nForm").onsubmit = function (e) { e.preventDefault(); var v = N.clean($("#nInput").value); if (v) location.href = BASE + "number.html?n=" + v; };
    var seen = {}, rows = "";
    r.digits.forEach(function (x) { if (seen[x.c]) return; seen[x.c] = 1; rows += '<tr><td class="n">' + x.c + '</td><td class="zh">' + x.info.zh + ' <span class="muted small">' + x.info.py + '</span></td><td>' + x.info.sound.map(function (s) { return '<span class="zh">' + s[0] + '</span> ' + s[1] + ' — ' + s[2]; }).join("<br>") + '</td><td>' + x.info.good + '</td><td>' + x.info.bad + '</td></tr>'; });
    $("#nTable").innerHTML = rows;
    var uses = [["📱 As a phone number", r.counts["4"] ? "Contains 4, so less ideal for a business line." : r.score >= 70 ? "A strong choice for personal or business lines." : "Fine for personal use. Upgrade the ending for business."], ["🚗 As a license plate", r.score >= 75 ? "Plates like this are in demand in Chinese-speaking regions." : "Acceptable. Plates with repeated 8s, 6s or 9s rank higher."], ["🏷️ As a price", /4|250/.test(n) ? "Avoid as a price. It sends a negative signal." : /8$|88$|68$|99$/.test(n) ? "An excellent price ending." : "Neutral. Consider ending in 8 or 88."], ["💍 As a date / gift amount", r.exact && r.exact.cat === "love" ? "Perfect for romance, gifts and anniversaries." : r.counts["4"] ? "Not recommended for weddings or gifts." : "OK. Love codes like 520 or 1314 carry a stronger message."]];
    $("#nUse").innerHTML = uses.map(function (u) { return '<div class="card"><h3>' + u[0] + '</h3><p>' + u[1] + '</p></div>'; }).join("");
    var rel = [], ni = parseInt(n.slice(-6), 10);
    Object.keys(N.CODES).forEach(function (k) { if (k !== n && (k.indexOf(n) > -1 || n.indexOf(k) > -1) && k.length > 1) rel.push(k); });
    if (!isNaN(ni) && n.length < 7) { if (ni > 0) rel.push(String(ni - 1)); rel.push(String(ni + 1)); }
    ["520", "1314", "888", "666", "168"].forEach(function (k) { if (rel.length < 10 && rel.indexOf(k) < 0 && k !== n) rel.push(k); });
    $("#nRelated").innerHTML = rel.slice(0, 12).map(function (k) { return '<a class="chip" href="' + BASE + 'number.html?n=' + k + '">' + k + '</a>'; }).join("");
    var faq = [["What does " + n + " mean in Chinese?", ans], ["Is " + n + " a lucky number?", "Its luck score is " + r.score + "/100 (" + r.verdict[0].toLowerCase() + "). " + (r.counts["4"] ? "It contains the digit 4, which sounds like “death” (死)." : "It avoids the unlucky digit 4.") + (r.counts["8"] ? " It includes 8, the prosperity digit (发)." : "")], ["How do you pronounce " + n + " in Mandarin?", r.digits.map(function (x) { return x.info.py.split(" / ")[0]; }).join(" ") + (/1/.test(n) ? " (in phone numbers, 1 is often read “yāo”)." : ".")], ["Can I use " + n + " for a business?", uses[0][1] + " " + uses[2][1]]];
    $("#nFaq").innerHTML = faq.map(function (f) { return "<details><summary>" + esc(f[0]) + "</summary><p>" + esc(f[1]) + "</p></details>"; }).join("");
    var ld = document.createElement("script"); ld.type = "application/ld+json";
    ld.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map(function (f) { return { "@type": "Question", name: f[0], acceptedAnswer: { "@type": "Answer", text: f[1] } }; }) });
    document.head.appendChild(ld);
  }

  /* ---------- dictionary ---------- */
  var db = $("#dictBody");
  if (db) {
    var keys = Object.keys(N.CODES).sort(function (a, b) { return a.length - b.length || +a - +b; }), cat = "all";
    function draw() {
      var q = $("#dictQ").value.trim().toLowerCase(), n = 0, h = "";
      keys.forEach(function (k) {
        var c = N.CODES[k]; if (cat !== "all" && c[3] !== cat) return;
        if (q && (k + " " + c.join(" ")).toLowerCase().indexOf(q) < 0) return;
        var s = N.safeLabel(c[4]); n++;
        h += '<tr><td><a class="n" href="' + BASE + 'number.html?n=' + k + '">' + k + '</a></td><td class="zh">' + c[0] + '</td><td class="small">' + c[1] + '</td><td>' + esc(c[2]) + '</td><td><span class="tag">' + N.catLabel(c[3]) + '</span></td><td><span class="tag ' + s[1] + '">' + s[0] + '</span></td></tr>';
      });
      db.innerHTML = h || '<tr><td colspan="6">No match. <a href="' + BASE + 'number.html?n=' + N.clean(q) + '">Decode “' + esc(q) + '” with the engine →</a></td></tr>';
      $("#dictCount").textContent = n + " codes";
    }
    $("#dictQ").oninput = draw;
    $$("#dictF button").forEach(function (b) { b.onclick = function () { $$("#dictF button").forEach(function (x) { x.classList.remove("on"); }); b.classList.add("on"); cat = b.getAttribute("data-c"); draw(); }; });
    if (qs.get("q")) $("#dictQ").value = qs.get("q");
    draw();
  }

  /* ---------- digits page ---------- */
  var dc = $("#digitCards");
  if (dc) Object.keys(N.DIGITS).forEach(function (k) {
    var d = N.DIGITS[k];
    dc.insertAdjacentHTML("beforeend", '<div class="card reveal in" id="digit-' + k + '"><div style="display:flex;gap:16px;align-items:center"><div class="logo-badge" style="width:64px;height:64px;font-size:2rem;background:' + (d.w >= 5 ? "var(--good)" : d.w < 0 ? "var(--bad)" : "var(--red)") + '">' + k + '</div><div><div class="zh" style="font-size:1.4rem">' + d.zh + '</div><div class="muted">' + d.py + '</div></div></div><p style="margin-top:12px"><b>Sounds like:</b> ' + d.sound.map(function (s) { return '<span class="zh">' + s[0] + '</span> (' + s[1] + ') ' + esc(s[2]); }).join("; ") + '</p><p><b>👍</b> ' + esc(d.good) + '<br><b>👎</b> ' + esc(d.bad) + '</p><a href="' + BASE + 'number.html?n=' + k + k + k + '">See ' + k + k + k + ' →</a></div>');
  });

  /* ---------- quiz ---------- */
  if ($("#quiz")) {
    var pool = [["520", "I love you"], ["1314", "Forever (a lifetime)"], ["666", "Awesome!"], ["88", "Bye-bye"], ["250", "Idiot"], ["7456", "I'm so angry"], ["918", "Go for it!"], ["9420", "It's you I love"], ["748", "Go to hell"], ["168", "Prosperity all the way"], ["233", "LOL"], ["555", "Crying"], ["996", "Overtime work culture"], ["530", "I miss you"], ["886", "Bye now"], ["995", "Help me!"]];
    pool.sort(function () { return Math.random() - .5; });
    var Q = pool.slice(0, 10), i = 0, score = 0;
    $("#qProg").innerHTML = Q.map(function () { return "<span></span>"; }).join("");
    function show() {
      var q = Q[i]; $("#qQ").innerHTML = 'What does <span style="color:var(--red)">' + q[0] + '</span> mean?';
      var opts = [q[1]]; while (opts.length < 4) { var o = pool[Math.floor(Math.random() * pool.length)][1]; if (opts.indexOf(o) < 0) opts.push(o); }
      opts.sort(function () { return Math.random() - .5; });
      $("#qOpts").innerHTML = opts.map(function (o) { return '<button class="quiz-opt">' + o + '</button>'; }).join("");
      $("#qFb").textContent = ""; $("#qNext").style.display = "none";
      $$(".steps span", $("#quiz")).forEach(function (s, j) { s.classList.toggle("on", j <= i); });
      $$(".quiz-opt").forEach(function (b) { b.onclick = function () {
        $$(".quiz-opt").forEach(function (x) { x.disabled = true; if (x.textContent === q[1]) x.classList.add("right"); });
        if (b.textContent === q[1]) { score++; $("#qFb").innerHTML = "✅ Correct! " + N.CODES[q[0]][0] + " (" + N.CODES[q[0]][1] + ")"; } else { b.classList.add("wrong"); $("#qFb").innerHTML = "❌ It's “" + q[1] + "” — " + N.CODES[q[0]][0]; }
        $("#qNext").style.display = "inline-flex";
      }; });
    }
    $("#qNext").onclick = function () { i++; if (i < Q.length) show(); else { $("#quiz").style.display = "none"; $("#qDone").style.display = "block"; $("#qScore").textContent = score; $("#qMsg").textContent = score >= 9 ? "Number master! 数字大师 🏆" : score >= 6 ? "Impressive. You're nearly fluent in number slang." : "Good start. Browse the dictionary and try again!"; } };
    $("#qShare").onclick = function () { var t = "I scored " + score + "/10 on the Chinese number slang quiz at 11176!"; if (navigator.share) navigator.share({ text: t, url: location.href }).catch(function () {}); else if (navigator.clipboard) navigator.clipboard.writeText(t + " " + location.href).then(function () { window.toast("Copied!"); }); };
    show();
  }

  /* ---------- contest countdown ---------- */
  var cd = $("#countdown");
  if (cd) {
    var tick = function () {
      var now = new Date(), end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59), s = Math.max(0, (end - now) / 1000), b = $$("b", cd);
      b[0].textContent = Math.floor(s / 86400); b[1].textContent = Math.floor(s % 86400 / 3600); b[2].textContent = Math.floor(s % 3600 / 60); b[3].textContent = Math.floor(s % 60);
    }; tick(); setInterval(tick, 1000);
  }

  /* ---------- donate buttons ---------- */
  var dbn = $("#donateBtns");
  if (dbn) {
    var D = S.donate || {}, labels = { paypal: "PayPal", buymeacoffee: "☕ Buy Me a Coffee", kofi: "Ko-fi", githubSponsors: "GitHub Sponsors", patreon: "Patreon" };
    var any = false;
    Object.keys(labels).forEach(function (k) { if (D[k]) { any = true; dbn.insertAdjacentHTML("beforeend", '<a class="btn ' + (k === "paypal" ? "" : "ghost") + '" target="_blank" rel="noopener" href="' + D[k] + '">' + labels[k] + '</a>'); } });
    if (!any) dbn.innerHTML = '<a class="btn gold" href="#d-n">💛 Pledge support below</a>';
  }
})();
