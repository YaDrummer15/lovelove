/* ===== script.js — общий скрипт: рисует шапку, страницу и подвал из CONFIG ===== */
(() => {
const C = CONFIG, k = C.colors, page = document.body.dataset.page;
const $ = (s, r = document) => r.querySelector(s);
// Страницы сайта: [файл, название в меню]
const PAGES = [["index","Главная"],["story","История"],["gallery","Фоторепортаж"],["timeline","Хроника"],["quotes","Цитаты"],["reasons","25 причин"],["constellation","Созвездие"]];
const idx = PAGES.findIndex(p => p[0] === page);

// Цвета из CONFIG → CSS-переменные
const S = document.documentElement.style;
[["--bg",k.background],["--surface",k.surface],["--card",k.card],["--accent",k.accent],["--light",k.accentLight],["--text",k.text]].forEach(([n,v]) => v && S.setProperty(n,v));

// Фото; если файла нет — красивая заглушка
const img = (s, c = "") => `<img src="${s}" alt="${c}" loading="lazy" onerror="this.outerHTML='<div class=ph>♡</div>'">`;
const head = (t, s) => `<h1 class="ttl">${t}</h1><p class="sub c">${s}</p>`;

// ---------- Содержимое страниц ----------
const R = {
  index: () => `<section class="cover"><div><p class="sub">${C.hero.subtitle}</p><h1 id="typed">&nbsp;</h1><p class="rv">${C.hero.intro}</p>${C.together ? `<div class="cnt rv"><p class="sub">${C.together.label}</p><div id="cnt"></div></div>` : ""}<a class="btn" href="story.html">Читать выпуск</a></div><div class="pic">${img(C.hero.coverImage)}</div></section>`,

  story: () => {
    const s = C.story;
    return `<article class="art"><p class="sub">Главная история</p><h1>${s.title}</h1><hr>` +
      s.paragraphs.map((p, i) => {
        const j = (i - 1) / 2, q = s.pullQuotes[j], m = s.images[j]; // для чётных i индекс дробный → пусто
        return `<p class="rv${i ? "" : " drop"}">${p}</p>` +
          (q ? `<blockquote class="pq rv">«${q.text}»<small>${q.author}</small></blockquote>` : "") +
          (m ? `<figure class="fig rv">${img(m.src, m.caption)}<figcaption>${m.caption}</figcaption></figure>` : "");
      }).join("") + `<p class="sig">— ${C.yourName}</p></article>`;
  },

  gallery: () => {
    const cats = ["Все", ...new Set(C.gallery.map(g => g.category))];
    return head("Фоторепортаж", "Кадры, которые мы прожили") +
      `<div class="filters">${cats.map((c, i) => `<button class="${i ? "" : "on"}">${c}</button>`).join("")}</div><div class="mas" id="mas"></div>` +
      `<div id="lb"><button class="x">✕</button><button class="pv">‹</button><figure><img alt=""><figcaption></figcaption></figure><button class="nx">›</button></div>`;
  },

  timeline: () => head("Хроника", "Наша история в датах") +
    `<div class="tl">${C.timeline.map(e => `<div class="ev rv"><time>${e.date}</time><h3>${e.title}</h3><p>${e.description}</p>${e.image ? `<div class="evi">${img(e.image, e.title)}</div>` : ""}</div>`).join("")}</div>`,

  quotes: () => head("Лучшие цитаты выпуска", "Твои фразы и наши шутки") +
    C.quotes.map(q => `<blockquote class="pq big rv">«${q.text}»<small>${q.author || C.herName} — ${q.context}</small></blockquote>`).join(""),

  reasons: () => {
    let n = 0;
    return head("25 причин", "Почему я тебя люблю") +
      `<div class="rand rv"><p id="rr">Нажми на кнопку — и я назову одну из причин</p><button class="btn" id="rb">Показать случайную причину</button></div>` +
      Object.keys(C.reasons).map(key => `<section class="cat rv"><h2>${C.reasonLabels[key] || key}</h2><ol class="rs">${C.reasons[key].map(t => `<li><b>${String(++n).padStart(2, "0")}</b><span>${t}</span></li>`).join("")}</ol></section>`).join("");
  },

  constellation: () => head("Созвездие", "Каждая звезда — наш момент. Прикоснись к ней") +
    `<div class="sky rv"><canvas id="sky"></canvas></div><div id="star"><h3>Выбери звезду</h3><p>Светящиеся точки сложились в сердце. За каждой — одно из наших воспоминаний.</p></div>`
};

// ---------- Каркас страницы ----------
const pr = PAGES[idx - 1], nx = PAGES[idx + 1];
document.title = `${C.siteName} — ${PAGES[idx][1]}`;
document.body.innerHTML = `<div id="bar"></div><canvas id="bg"></canvas><div id="dot"></div><div id="wipe"></div>
<header class="wrap hd"><div class="top"><span>${C.date}</span><span>${C.issueNumber}</span><span>Стр. ${idx + 1} / ${PAGES.length}</span></div>
<div class="logo">${C.siteName}</div><button class="burger" aria-label="Меню">☰</button>
<nav>${PAGES.map(([f, t]) => `<a href="${f}.html" class="${f === page ? "on" : ""}">${t}</a>`).join("")}</nav></header>
<main class="wrap">${R[page]()}<div class="pager">${pr ? `<a href="${pr[0]}.html">← ${pr[1]}</a>` : "<span></span>"}${nx ? `<a href="${nx[0]}.html">${nx[1]} →</a>` : "<span></span>"}</div></main>
<footer>© ${new Date().getFullYear()} ${C.siteName} · С любовью, ${C.yourName} <span class="hb">♥</span> для ${C.herName}</footer><button id="top" aria-label="Наверх">↑</button>`;

// ---------- Эффекты ----------
// Лесенка: порядковые номера для задержек, пункты списков появляются по очереди
const stag = s => document.querySelectorAll(s).forEach((e, i) => e.style.setProperty("--i", i));
stag(".filters button"); stag(".cover>div:first-child>*");
document.querySelectorAll(".rs li").forEach((li, i) => { li.classList.add("rv"); li.style.transitionDelay = (i % 6) * .08 + "s"; });
addEventListener("pageshow", e => e.persisted && $("#wipe").classList.remove("go"));

// Появление блоков при скролле
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); setTimeout(() => e.target.style.transitionDelay = "", 1500); } }), { threshold: .12 });
document.querySelectorAll(".rv").forEach(e => io.observe(e));

// Индикатор чтения и кнопка «наверх»
const bar = $("#bar"), top = $("#top");
addEventListener("scroll", () => {
  const h = document.documentElement;
  bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight || 1)) * 100 + "%";
  top.classList.toggle("on", h.scrollTop > 500);
});
top.onclick = () => scrollTo({ top: 0, behavior: "smooth" });

// Гамбургер и плавный переход между страницами
$(".burger").onclick = () => $("nav").classList.toggle("open");
document.querySelectorAll('a[href$=".html"]').forEach(a => a.onclick = e => {
  e.preventDefault(); $("#wipe").classList.add("go"); setTimeout(() => location.href = a.href, 450);
});

// Курсор-точка
const dot = $("#dot");
addEventListener("mousemove", e => { dot.style.left = e.clientX + "px"; dot.style.top = e.clientY + "px"; });
// точка растёт над кнопками, ссылками и фото
addEventListener("mouseover", e => dot.classList.toggle("big", !!e.target.closest("a,button,.mas figure")));
// искры по клику / касанию
addEventListener("click", e => {
  for (let i = 0; i < 8; i++) {
    const s = document.createElement("i"); s.className = "sp"; s.textContent = "✦";
    s.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;--x:${(Math.random() - .5) * 130}px;--y:${(Math.random() - .5) * 130}px;--d:0s;font-size:${8 + Math.random() * 10}px`;
    document.body.appendChild(s); setTimeout(() => s.remove(), 1000);
  }
});

// Фиолетовые частицы (canvas)
const cv = $("#bg"), cx = cv.getContext("2d"); let W, H;
const fit = () => { W = cv.width = innerWidth; H = cv.height = innerHeight; }; fit(); addEventListener("resize", fit);
const P = Array.from({ length: 60 }, () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 2 + .5, v: Math.random() * .3 + .1, a: Math.random() * 6.28 }));
(function draw() {
  cx.clearRect(0, 0, W, H); cx.fillStyle = k.accentLight;
  P.forEach(p => {
    p.y -= p.v; p.a += .02; if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
    cx.globalAlpha = .25 + .25 * Math.sin(p.a); cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, 6.28); cx.fill();
  });
  requestAnimationFrame(draw);
})();

// ---------- Логика отдельных страниц ----------
// Печатающийся заголовок обложки
if (page === "index") { const el = $("#typed"), t = C.hero.title; let i = 0; (function f() { el.textContent = t.slice(0, ++i); if (i < t.length) setTimeout(f, 70); })(); }

// Созвездие: звёзды-воспоминания складываются в сердце, падают звёзды
if (page === "constellation") {
  const cv2 = $("#sky"), g = cv2.getContext("2d"), M = C.constellation, box = $("#star"), t0 = performance.now();
  let w, h, pts = [], bg = [], sel = -1, shoot = null;
  const layout = () => {
    w = cv2.width = cv2.parentNode.clientWidth; h = cv2.height = Math.min(w * .95, 640);
    const sc = Math.min(w / 36, h / 32);
    // формула сердца: i-я звезда лежит на кривой
    pts = M.map((_, i) => { const a = i / M.length * 6.2832; return { x: w / 2 + 16 * Math.sin(a) ** 3 * sc, y: h / 2 + 2.5 * sc - (13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) * sc }; });
    bg = Array.from({ length: 140 }, () => ({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.2 + .3, p: Math.random() * 6.28 }));
  };
  layout(); addEventListener("resize", layout);
  const frame = now => {
    const T = (now - t0) / 1000, prog = T * 1.3; // сколько линий уже проведено
    g.clearRect(0, 0, w, h); g.shadowBlur = 0; g.fillStyle = "#fff";
    bg.forEach(s => { g.globalAlpha = .25 + .55 * Math.abs(Math.sin(T * .8 + s.p)); g.beginPath(); g.arc(s.x, s.y, s.r, 0, 6.2832); g.fill(); });
    // линии созвездия прорисовываются одна за другой
    g.globalAlpha = .75; g.strokeStyle = k.accent; g.lineWidth = 1.3; g.shadowColor = k.accent; g.shadowBlur = 10; g.beginPath();
    pts.forEach((a, i) => { const b = pts[(i + 1) % pts.length], f = Math.max(0, Math.min(1, prog - i)); g.moveTo(a.x, a.y); g.lineTo(a.x + (b.x - a.x) * f, a.y + (b.y - a.y) * f); });
    g.stroke();
    pts.forEach((p, i) => {
      if (i > prog) return;
      const on = i === sel, r = (on ? 8 : 5) + Math.sin(T * 2 + i);
      g.globalAlpha = 1; g.shadowColor = k.accentLight; g.shadowBlur = on ? 34 : 16; g.fillStyle = on ? "#fff" : k.accentLight;
      g.beginPath(); g.arc(p.x, p.y, r, 0, 6.2832); g.fill();
      g.shadowBlur = 0; g.globalAlpha = .6; g.strokeStyle = "#fff"; g.lineWidth = 1; g.beginPath();
      g.moveTo(p.x - r * 3, p.y); g.lineTo(p.x + r * 3, p.y); g.moveTo(p.x, p.y - r * 3); g.lineTo(p.x, p.y + r * 3); g.stroke();
    });
    // редкая падающая звезда
    if (!shoot && Math.random() < .004) shoot = { x: w * (.1 + Math.random() * .5), y: h * Math.random() * .3, l: 0 };
    if (shoot) {
      const x = shoot.x + ++shoot.l * 9, y = shoot.y + shoot.l * 5, gr = g.createLinearGradient(x - 90, y - 50, x, y);
      gr.addColorStop(0, "rgba(255,255,255,0)"); gr.addColorStop(1, "#fff");
      g.globalAlpha = 1; g.strokeStyle = gr; g.lineWidth = 2; g.beginPath(); g.moveTo(x - 90, y - 50); g.lineTo(x, y); g.stroke();
      if (shoot.l > 60) shoot = null;
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
  // клик/касание по звезде показывает воспоминание
  const hit = e => { const r = cv2.getBoundingClientRect(); return pts.findIndex(p => Math.hypot(p.x - (e.clientX - r.left), p.y - (e.clientY - r.top)) < 26); };
  cv2.onmousemove = e => cv2.style.cursor = hit(e) > -1 ? "pointer" : "default";
  cv2.onclick = e => {
    const i = hit(e); if (i < 0) return; sel = i;
    box.classList.remove("show"); void box.offsetWidth;
    $("h3", box).textContent = M[i].title; $("p", box).textContent = M[i].text; box.classList.add("show");
  };
}

// Живой счётчик «мы вместе»: дни, часы, минуты, секунды
if (page === "index" && C.together) {
  const el = $("#cnt"), t0 = new Date(C.together.since), U = [["дн.", 86400], ["ч.", 3600], ["мин.", 60], ["сек.", 1]];
  const tick = () => { let s = Math.max(0, (Date.now() - t0) / 1000 | 0); el.innerHTML = U.map(([n, d]) => { const v = Math.floor(s / d); s %= d; return `<span><b>${v}</b>${n}</span>`; }).join(""); };
  tick(); setInterval(tick, 1000);
}

// Случайная причина
if (page === "reasons") { const all = Object.values(C.reasons).flat(), rr = $("#rr"); $("#rb").onclick = () => { rr.textContent = "«" + all[Math.random() * all.length | 0] + "»"; rr.style.animation = "none"; void rr.offsetWidth; rr.style.animation = "rise .7s"; }; }

// Галерея: фильтр + лайтбокс
if (page === "gallery") {
  let list = [], cur = 0;
  const mas = $("#mas"), lb = $("#lb"), li = $("#lb img"), lc = $("#lb figcaption"), fb = document.querySelectorAll(".filters button");
  const draw = c => {
    list = C.gallery.filter(g => c === "Все" || g.category === c);
    mas.innerHTML = list.map((g, i) => `<figure class="rv" data-i="${i}" style="transition-delay:${i % 6 * .08}s">${img(g.src, g.caption)}<figcaption>${g.caption}<em>${g.category}</em></figcaption></figure>`).join("");
    mas.querySelectorAll(".rv").forEach(e => io.observe(e));
  };
  const show = i => { cur = (i + list.length) % list.length; li.src = list[cur].src; lc.textContent = list[cur].caption; lb.classList.add("on"); };
  const close = () => lb.classList.remove("on");
  fb.forEach(b => b.onclick = () => { fb.forEach(x => x.classList.remove("on")); b.classList.add("on"); draw(b.textContent); });
  mas.onclick = e => { const f = e.target.closest("figure"); if (f) show(+f.dataset.i); };
  $("#lb .nx").onclick = () => show(cur + 1); $("#lb .pv").onclick = () => show(cur - 1); $("#lb .x").onclick = close;
  lb.onclick = e => { if (e.target === lb) close(); };
  addEventListener("keydown", e => { if (!lb.classList.contains("on")) return; if (e.key === "Escape") close(); if (e.key === "ArrowRight") show(cur + 1); if (e.key === "ArrowLeft") show(cur - 1); });
  draw("Все");
}
})();
