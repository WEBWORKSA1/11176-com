/* 11176.com — shared layout, forms, ads, consent, UX */
(function () {
  "use strict";
  var S = window.SITE || {};
  var BASE = document.documentElement.getAttribute("data-base") || "";
  var PATH = (location.pathname.split("/").pop() || "index.html");

  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function route() { try { return atob((S._k || []).join("").split("").reverse().join("")); } catch (e) { return ""; } }
  window.SITE_ROUTE = route; // used only at submit time; never rendered

  /* ---------- theme ---------- */
  var saved = store("theme"); if (saved) document.documentElement.setAttribute("data-theme", saved);
  function toggleTheme() {
    var cur = document.documentElement.getAttribute("data-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    var next = cur === "dark" ? "light" : "dark"; document.documentElement.setAttribute("data-theme", next); store("theme", next);
  }

  /* ---------- header / footer ---------- */
  var NAV = [["index.html", "Home"], ["tools.html", "Number Tools"], ["meanings.html", "Meanings"], ["digits.html", "Digits 0–9"], ["business.html", "For Business"], ["guides.html", "Guides"], ["videos.html", "Videos"], ["contests.html", "Contests"], ["support.html", "Support"]];
  var header = $("#site-header");
  if (header) {
    header.className = "site-header";
    header.innerHTML = '<div class="wrap nav"><a class="logo" href="' + BASE + 'index.html" aria-label="11176 home"><span class="logo-badge">吉</span><span>11176<small>Lucky Number Lab</small></span></a>' +
      '<ul class="menu" id="menu">' + NAV.map(function (n) { return '<li><a href="' + BASE + n[0] + '"' + (PATH === n[0] ? ' class="active" aria-current="page"' : '') + '>' + n[1] + '</a></li>'; }).join("") + '</ul>' +
      '<div class="nav-actions"><a class="btn sm gold" href="' + BASE + 'report.html">Free Report</a><button class="icon-btn" id="themeBtn" aria-label="Toggle dark mode">◐</button><button class="icon-btn burger" id="burger" aria-label="Open menu" aria-expanded="false">☰</button></div></div>';
    $("#themeBtn").onclick = toggleTheme;
    $("#burger").onclick = function () { var m = $("#menu"); m.classList.toggle("open"); this.setAttribute("aria-expanded", m.classList.contains("open")); };
  }
  var footer = $("#site-footer");
  if (footer) {
    footer.className = "site-footer";
    var soc = Object.keys(S.social || {}).filter(function (k) { return S.social[k]; }).map(function (k) { return '<a href="' + S.social[k] + '" target="_blank" rel="noopener">' + k + '</a>'; }).join(" · ");
    footer.innerHTML = '<div class="wrap"><div class="foot-grid"><div><a class="logo" href="' + BASE + 'index.html" style="color:#fff"><span class="logo-badge">吉</span><span>11176<small style="color:#B9A999">Lucky Number Lab</small></span></a>' +
      '<p style="margin-top:12px;color:#CDBEAE">Decode any number the Chinese way — meanings, slang, luck scores and smart picks for phones, plates, prices and dates.</p>' +
      '<form class="news" data-form="newsletter" novalidate><label class="sr-only" for="fnews">Email</label><input id="fnews" type="email" name="email" placeholder="Lucky number of the week" required><input type="text" name="_honey" class="hp" tabindex="-1" autocomplete="off"><button class="btn sm gold">Join</button></form><div class="form-status small" role="status"></div>' + (soc ? '<p class="small" style="margin-top:10px">' + soc + '</p>' : '') + '</div>' +
      '<div><h4>Explore</h4><ul><li><a href="' + BASE + 'tools.html">Number decoder</a></li><li><a href="' + BASE + 'tools.html#phone">Lucky phone checker</a></li><li><a href="' + BASE + 'tools.html#date">Lucky date finder</a></li><li><a href="' + BASE + 'meanings.html">Number dictionary</a></li><li><a href="' + BASE + 'digits.html">Digits 0–9</a></li><li><a href="' + BASE + 'quiz.html">Number quiz</a></li><li><a href="' + BASE + 'number.html?n=11176">What is 11176?</a></li></ul></div>' +
      '<div><h4>Community</h4><ul><li><a href="' + BASE + 'report.html">Free lucky number report</a></li><li><a href="' + BASE + 'business.html">Business number audit</a></li><li><a href="' + BASE + 'videos.html">Videos</a></li><li><a href="' + BASE + 'contests.html">Contests &amp; prizes</a></li><li><a href="' + BASE + 'careers.html">Careers</a></li><li><a href="' + BASE + 'support.html">Support / donate</a></li><li><a href="' + BASE + 'advertise.html">Advertise &amp; partner</a></li></ul></div>' +
      '<div><h4>Company</h4><ul><li><a href="' + BASE + 'about.html">About</a></li><li><a href="' + BASE + 'contact.html">Contact</a></li><li><a href="' + S.partnerUrl + '" target="_blank" rel="noopener">Buy / sponsor this site</a></li><li><a href="' + BASE + 'privacy.html">Privacy</a></li><li><a href="' + BASE + 'terms.html">Terms</a></li><li><a href="' + BASE + 'disclaimer.html">Disclaimer &amp; trademark</a></li><li><a href="' + BASE + 'sitemap.xml">Sitemap</a></li></ul></div></div>' +
      '<div class="foot-bottom">© <span id="yr"></span> 11176.com · Independent educational &amp; entertainment site. Number readings reflect popular Chinese folk culture and internet usage — not financial, legal or medical advice. “11176” is used here as a descriptive domain name; no trademark rights are claimed in the number itself. See <a href="' + BASE + 'disclaimer.html">Disclaimer &amp; Trademark notice</a>.</div></div>';
    $("#yr").textContent = new Date().getFullYear();
  }

  /* ---------- floating UI ---------- */
  document.body.insertAdjacentHTML("beforeend",
    '<a class="btn fab" href="' + BASE + 'tools.html">🔢 Check a number</a><button class="icon-btn to-top" aria-label="Back to top">↑</button><div class="toast" role="status" aria-live="polite"></div>' +
    '<div class="consent" role="dialog" aria-label="Cookie consent"><b>Cookies &amp; ads</b><p class="small muted" style="margin:.4em 0 .8em">We use cookies for analytics and to show ads (Google AdSense) that keep this site free. You can accept or keep essential-only. <a href="' + BASE + 'privacy.html">Privacy policy</a></p><div style="display:flex;gap:8px"><button class="btn sm" data-consent="all">Accept all</button><button class="btn sm ghost" data-consent="essential">Essential only</button></div></div>');
  var tt = $(".to-top"); tt.onclick = function () { scrollTo({ top: 0 }); };
  addEventListener("scroll", function () { tt.classList.toggle("show", scrollY > 700); }, { passive: true });
  if (PATH === "tools.html") $(".fab").style.display = "none";
  function toast(msg) { var t = $(".toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(t._t); t._t = setTimeout(function () { t.classList.remove("show"); }, 2600); }
  window.toast = toast;

  /* ---------- consent + ads + analytics ---------- */
  var consent = store("consent");
  var cbox = $(".consent");
  if (!consent) cbox.classList.add("show");
  $$("[data-consent]").forEach(function (b) { b.onclick = function () { consent = b.getAttribute("data-consent"); store("consent", consent); cbox.classList.remove("show"); boot(); }; });

  function loadScript(src, attrs) { var s = document.createElement("script"); s.async = true; s.src = src; Object.keys(attrs || {}).forEach(function (k) { s.setAttribute(k, attrs[k]); }); document.head.appendChild(s); }
  var booted = false;
  function boot() {
    if (booted) return;
    var adsOn = S.adsenseClient && consent === "all";
    $$(".ad-slot").forEach(function (slot) {
      var kind = slot.getAttribute("data-slot") || "inContent";
      if (adsOn) {
        slot.innerHTML = '<div class="ad-label">Advertisement</div><ins class="adsbygoogle" style="display:block" data-ad-client="' + S.adsenseClient + '"' + (S.adSlots && S.adSlots[kind] ? ' data-ad-slot="' + S.adSlots[kind] + '"' : '') + ' data-ad-format="auto" data-full-width-responsive="true"></ins>';
        try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
      } else {
        slot.innerHTML = '<div class="ad-label">Sponsored</div><a class="ad-inner" href="' + BASE + 'advertise.html" style="text-decoration:none">Your brand here — reach number-curious shoppers, couples &amp; businesses. Advertise with 11176 →</a>';
      }
    });
    if (adsOn) { booted = true; loadScript("https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + S.adsenseClient, { crossorigin: "anonymous" }); }
    if (S.ga4 && consent === "all") {
      loadScript("https://www.googletagmanager.com/gtag/js?id=" + S.ga4);
      window.dataLayer = window.dataLayer || []; window.gtag = function () { dataLayer.push(arguments); }; gtag("js", new Date()); gtag("config", S.ga4);
    }
  }
  boot();
  function track(name, params) { try { if (window.gtag) gtag("event", name, params || {}); } catch (e) {} }

  /* ---------- forms (all submissions routed privately) ---------- */
  function payload(form) {
    var fd = new FormData(form), o = {};
    fd.forEach(function (v, k) { if (k === "_honey") return; o[k] = o[k] ? o[k] + ", " + v : v; });
    o._subject = "[11176.com] " + (form.getAttribute("data-subject") || form.getAttribute("data-form") || "Form") + (o.name ? " — " + o.name : "");
    o._template = "table"; o._captcha = "false"; o.page = location.href;
    return o;
  }
  function mailFallback(o) {
    var body = Object.keys(o).filter(function (k) { return k[0] !== "_"; }).map(function (k) { return k + ": " + o[k]; }).join("\n");
    location.href = "mailto:" + route() + "?subject=" + encodeURIComponent(o._subject) + "&body=" + encodeURIComponent(body);
  }
  $$("form[data-form]").forEach(function (form) {
    form.setAttribute("novalidate", "");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.nextElementSibling && form.nextElementSibling.classList.contains("form-status") ? form.nextElementSibling : $(".form-status", form);
      if (form.querySelector("[name=_honey]") && form.querySelector("[name=_honey]").value) return;
      var bad = $$("[required]", form).filter(function (i) { return !i.checkValidity(); });
      if (bad.length) { bad[0].focus(); if (status) { status.className = "form-status err"; status.textContent = "Please complete: " + (bad[0].getAttribute("aria-label") || bad[0].name); } return; }
      var btn = form.querySelector("button[type=submit],button:not([type])"); if (btn) { btn.disabled = true; btn._t = btn.textContent; btn.textContent = "Sending…"; }
      var o = payload(form);
      fetch("https://formsubmit.co/ajax/" + route(), { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(o) })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok || j.success === "false" || j.success === false) throw new Error(j.message || "fail"); }); })
        .then(function () {
          if (status) { status.className = "form-status ok"; status.textContent = form.getAttribute("data-ok") || "Thank you! We received your message and will reply soon."; }
          form.reset(); toast("Sent ✓"); track("generate_lead", { form: form.getAttribute("data-form") });
          if (form.hasAttribute("data-steps")) goStep(form, 0);
        })
        .catch(function () {
          if (status) { status.className = "form-status err"; status.innerHTML = 'Could not send right now. <a href="#" class="mailfb">Send it by email instead →</a>'; var a = $(".mailfb", status); if (a) a.onclick = function (ev) { ev.preventDefault(); mailFallback(o); }; }
        })
        .then(function () { if (btn) { btn.disabled = false; btn.textContent = btn._t; } });
    });
  });
  // "contact" links that should open email without exposing the address
  $$("[data-mail]").forEach(function (a) { a.addEventListener("click", function (e) { e.preventDefault(); location.href = "mailto:" + route() + "?subject=" + encodeURIComponent(a.getAttribute("data-mail") || "11176.com inquiry"); }); });

  /* ---------- multi-step forms ---------- */
  function goStep(form, n) {
    var steps = $$(".step", form); steps.forEach(function (s, i) { s.classList.toggle("on", i === n); });
    $$(".steps span", form).forEach(function (s, i) { s.classList.toggle("on", i <= n); }); form._step = n;
  }
  $$("form[data-steps]").forEach(function (form) {
    goStep(form, 0);
    $$("[data-next]", form).forEach(function (b) { b.onclick = function () {
      var cur = $$(".step", form)[form._step]; var bad = $$("[required]", cur).filter(function (i) { return !i.checkValidity(); });
      if (bad.length) { bad[0].reportValidity(); return; } goStep(form, form._step + 1); }; });
    $$("[data-prev]", form).forEach(function (b) { b.onclick = function () { goStep(form, Math.max(0, form._step - 1)); }; });
  });

  /* ---------- prefill from ?n= ---------- */
  var qn = new URLSearchParams(location.search).get("n");
  if (qn) $$("[data-prefill=n]").forEach(function (i) { i.value = qn.replace(/[^0-9 +\-]/g, ""); });

  /* ---------- share ---------- */
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-share]"); if (!b) return;
    var n = b.getAttribute("data-share"); var url = location.origin + location.pathname.replace(/[^/]*$/, "") + "number.html?n=" + n;
    var data = { title: "What does " + n + " mean in Chinese?", text: "I decoded " + n + " on 11176 — check your lucky number:", url: url };
    if (navigator.share) navigator.share(data).catch(function () {});
    else if (navigator.clipboard) navigator.clipboard.writeText(data.text + " " + url).then(function () { toast("Link copied!"); });
    track("share", { number: n });
  });

  /* ---------- YouTube facade ---------- */
  $$(".video[data-yt]").forEach(function (v) {
    var id = v.getAttribute("data-yt");
    v.innerHTML = '<img loading="lazy" alt="" src="https://i.ytimg.com/vi/' + id + '/hqdefault.jpg"><div class="play"><span>▶</span></div>';
    v.onclick = function () { v.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen title="YouTube video"></iframe>'; };
  });

  /* ---------- reveal + counters ---------- */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); var c = en.target.getAttribute("data-count"); if (c) count(en.target, +c); } }); }, { threshold: .15 });
    $$(".reveal,[data-count]").forEach(function (el) { io.observe(el); });
  } else $$(".reveal").forEach(function (el) { el.classList.add("in"); });
  function count(el, to) { var t0 = performance.now(), sfx = el.getAttribute("data-suffix") || ""; (function f(t) { var p = Math.min(1, (t - t0) / 1200); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))).toLocaleString() + sfx; if (p < 1) requestAnimationFrame(f); })(t0); }

  /* ---------- tabs ---------- */
  $$("[data-tabs]").forEach(function (wrap) {
    var btns = $$(".tabs button", wrap), panels = $$(".panel", wrap);
    function show(id) { btns.forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-t") === id); }); panels.forEach(function (p) { p.classList.toggle("on", p.id === id); }); }
    btns.forEach(function (b) { b.onclick = function () { show(b.getAttribute("data-t")); history.replaceState(null, "", "#" + b.getAttribute("data-t")); }; });
    var h = location.hash.slice(1); show(panels.some(function (p) { return p.id === h; }) ? h : btns[0].getAttribute("data-t"));
  });

  /* ---------- lead slide-in after a decode (once per visitor per week) ---------- */
  window.addEventListener("numberDecoded", function (e) {
    var last = +(store("slidein") || 0); if (Date.now() - last < 6048e5 || $(".slidein")) return;
    setTimeout(function () {
      document.body.insertAdjacentHTML("beforeend", '<div class="slidein" role="dialog" aria-label="Free report offer"><button class="x" aria-label="Close">×</button><b>Want the full reading for ' + e.detail.number + '?</b><p class="small muted" style="margin:.4em 0 .8em">Get a free, human-checked lucky number report + 3 better alternatives, by email.</p><a class="btn sm block" href="' + BASE + 'report.html?n=' + e.detail.number + '">Get my free report</a></div>');
      var s = $(".slidein"); requestAnimationFrame(function () { s.classList.add("show"); });
      $(".x", s).onclick = function () { s.classList.remove("show"); }; store("slidein", String(Date.now()));
    }, 4000);
  });
})();
