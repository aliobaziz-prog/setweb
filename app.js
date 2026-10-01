const $ = (s) => document.querySelector(s);
const store = {
  get(k, d) {
    try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; }
  },
  set(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ }
  },
};

const todayKey = () => new Date().toISOString().slice(0, 10);
const el = (tag, props = {}, ...kids) => {
  const n = Object.assign(document.createElement(tag), props);
  kids.forEach((k) => n.append(k));
  return n;
};

let profile = store.get("profile", { age: "", sex: "m", weight: "", height: "", conds: [] });
let foodFilter = "all";
let menuSeed = 0;

/* ---------- tabs ---------- */
document.querySelectorAll(".tabs button").forEach((b) =>
  b.addEventListener("click", () => {
    document.querySelectorAll(".tabs button").forEach((x) => x.classList.toggle("on", x === b));
    document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("active", t.id === "tab-" + b.dataset.t));
    window.scrollTo(0, 0);
  })
);

/* ---------- profile ---------- */
function renderConditions() {
  const box = $("#conditions");
  box.replaceChildren();
  Object.entries(CONDITIONS).forEach(([k, c]) => {
    const b = el("button", { type: "button", textContent: `${c.emoji} ${c.label}` });
    b.classList.toggle("on", profile.conds.includes(k));
    b.addEventListener("click", () => {
      profile.conds = profile.conds.includes(k) ? profile.conds.filter((x) => x !== k) : [...profile.conds, k];
      b.classList.toggle("on");
      renderAll();
    });
    box.append(b);
  });
}

function readForm() {
  profile.age = $("#age").value;
  profile.sex = $("#sex").value;
  profile.weight = $("#weight").value;
  profile.height = $("#height").value;
}

function renderBMI() {
  const w = parseFloat(profile.weight), h = parseFloat(profile.height) / 100;
  const box = $("#bmi");
  if (!(w > 0 && h > 0)) { box.textContent = ""; return; }
  const bmi = w / (h * h);
  let txt = "وزن طبيعي ✅";
  if (bmi < 18.5) txt = "نحافة، استشر طبيبك";
  else if (bmi >= 30) txt = "سمنة ⚠️ خسارة 5–10% من الوزن تحسّن السكر والضغط والدهون كثيرًا";
  else if (bmi >= 25) txt = "وزن زائد ⚠️ خسارة 5% من الوزن تحدث فرقًا كبيرًا";
  box.textContent = `مؤشر كتلة الجسم: ${bmi.toFixed(1)} — ${txt}`;
}

function renderTips() {
  const box = $("#tips");
  box.replaceChildren();
  if (!profile.conds.length) {
    box.append(el("h2", { textContent: "نصائح عامة" }));
    const ul = el("ul");
    ["كل الخضر والبقوليات والسمك أكثر من اللحوم المصنعة.",
     "قلّل السكر والملح والمقليات.",
     "تحرك 30 دقيقة يوميًا.",
     "اختر مشكلتك الصحية أعلاه لتظهر لك نصائح مخصصة."].forEach((t) => ul.append(el("li", { textContent: t })));
    box.append(ul);
    return;
  }
  profile.conds.forEach((k) => {
    const c = CONDITIONS[k];
    box.append(el("h2", { textContent: `${c.emoji} ${c.label}` }));
    const ul = el("ul");
    c.tips.forEach((t) => ul.append(el("li", { textContent: t })));
    box.append(ul);
  });
}

/* ---------- foods ---------- */
function foodLevel(f) {
  const conds = profile.conds.length ? profile.conds : Object.keys(CONDITIONS);
  if ((f.avoid || []).some((c) => conds.includes(c))) return "avoid";
  if ((f.limit || []).some((c) => conds.includes(c))) return "limit";
  if ((f.good || []).some((c) => conds.includes(c))) return "good";
  return null;
}

function renderFoods() {
  const order = { avoid: 0, limit: 1, good: 2 };
  const labels = { good: "كُل", limit: "بحذر", avoid: "تجنّب" };
  $("#food-hint").textContent = profile.conds.length
    ? "القائمة مخصصة حسب ما اخترته في «ملفي»."
    : "اختر حالتك في «ملفي» لتخصيص القائمة.";
  const list = $("#food-list");
  list.replaceChildren();
  FOODS.map((f) => ({ f, lv: foodLevel(f) }))
    .filter((x) => x.lv && (foodFilter === "all" || x.lv === foodFilter))
    .sort((a, b) => order[a.lv] - order[b.lv])
    .forEach(({ f, lv }) => {
      const info = el("div", {}, el("div", { className: "nm", textContent: f.name }), el("div", { className: "nt", textContent: f.note }));
      list.append(el("li", {}, el("span", { className: "em", textContent: f.emoji }), info, el("span", { className: `badge ${lv}`, textContent: labels[lv] })));
    });
}

document.querySelectorAll("#food-filters button").forEach((b) =>
  b.addEventListener("click", () => {
    foodFilter = b.dataset.f;
    document.querySelectorAll("#food-filters button").forEach((x) => x.classList.toggle("on", x === b));
    renderFoods();
  })
);

/* ---------- menu ---------- */
function renderMenu() {
  const box = $("#menu");
  box.replaceChildren();
  Object.entries(MENU).forEach(([meal, options]) => {
    const pick = options[(menuSeed + meal.length) % options.length];
    box.append(el("div", { className: "meal" }, el("h3", { textContent: meal }), el("p", { textContent: pick })));
  });
  box.append(el("p", { className: "small", textContent: "اشرب الماء، والملح والزيت بكميات قليلة. عدّل الكميات مع طبيبك أو أخصائي التغذية." }));
}
$("#shuffle").addEventListener("click", () => { menuSeed++; renderMenu(); });

/* ---------- sport ---------- */
function renderSport() {
  const week = $("#week");
  week.replaceChildren();
  WEEK_PLAN.forEach(([d, t]) => week.append(el("tr", {}, el("td", { textContent: d }), el("td", { textContent: t }))));

  const warn = $("#sport-warn");
  warn.replaceChildren(el("h2", { textContent: "⚠️ قبل أن تبدأ" }));
  const ul = el("ul");
  ul.append(el("li", { textContent: "استشر طبيبك قبل البدء خصوصًا فوق 40 سنة أو عند وجود ألم في الصدر أو ضيق تنفس. توقف فورًا عند الدوخة أو الألم." }));
  (profile.conds.length ? profile.conds : Object.keys(EXERCISE_WARNINGS)).forEach((k) => {
    if (EXERCISE_WARNINGS[k]) ul.append(el("li", { textContent: EXERCISE_WARNINGS[k] }));
  });
  warn.append(ul);

  const list = $("#sport-list");
  list.replaceChildren();
  EXERCISES.forEach((e) =>
    list.append(el("div", { className: "ex" },
      el("h3", { textContent: `${e.emoji} ${e.name}` }),
      el("div", { className: "meta", textContent: `${e.duration} · ${e.level}` }),
      el("p", { textContent: e.how }),
      el("p", { textContent: "الفائدة: " + e.benefits }))));
}

/* ---------- tracker ---------- */
function renderChecks() {
  const all = store.get("checks", {});
  const today = all[todayKey()] || {};
  const ul = $("#checks");
  ul.replaceChildren();
  DAILY_CHECKS.forEach((c) => {
    const cb = el("input", { type: "checkbox", checked: !!today[c.id] });
    cb.addEventListener("change", () => {
      const a = store.get("checks", {});
      a[todayKey()] = { ...(a[todayKey()] || {}), [c.id]: cb.checked };
      store.set("checks", a);
      renderChecks();
    });
    ul.append(el("li", {}, el("label", {}, cb, c.label)));
  });
  const done = DAILY_CHECKS.filter((c) => today[c.id]).length;
  $("#bar").style.width = (done / DAILY_CHECKS.length) * 100 + "%";

  let streak = 0;
  const d = new Date();
  for (;;) {
    const day = all[d.toISOString().slice(0, 10)];
    const cnt = day ? Object.values(day).filter(Boolean).length : 0;
    if (cnt >= 5) streak++;
    else if (d.toISOString().slice(0, 10) !== todayKey()) break;
    d.setDate(d.getDate() - 1);
    if (streak > 3650) break;
  }
  $("#streak").textContent = `${done}/${DAILY_CHECKS.length} اليوم · أيام متتالية بـ 5 أهداف أو أكثر: ${streak}`;
}

const MLABEL = { sugar: "سكر (غ/ل)", sys: "ضغط انقباضي", dia: "ضغط انبساطي", weight: "وزن (كغ)", chol: "كوليسترول (غ/ل)", trig: "تريغليسريد (غ/ل)" };

function renderMeasures() {
  const items = store.get("measures", []);
  const ul = $("#mlist");
  ul.replaceChildren();
  if (!items.length) { ul.append(el("li", { textContent: "لا توجد قياسات بعد." })); return; }
  items.slice(-15).reverse().forEach((m) => {
    const del = el("button", { type: "button", textContent: "✕", title: "حذف" });
    del.addEventListener("click", () => {
      store.set("measures", store.get("measures", []).filter((x) => x.id !== m.id));
      renderMeasures();
    });
    ul.append(el("li", {}, el("span", { textContent: `${m.date} — ${MLABEL[m.type]}: ${m.value}` }), del));
  });
}

$("#mform").addEventListener("submit", (e) => {
  e.preventDefault();
  const value = parseFloat($("#mval").value);
  if (!Number.isFinite(value) || value <= 0) return;
  const items = store.get("measures", []);
  items.push({ id: Date.now(), date: todayKey(), type: $("#mtype").value, value });
  store.set("measures", items);
  $("#mval").value = "";
  renderMeasures();
});

/* ---------- init ---------- */
function renderAll() {
  renderBMI();
  renderTips();
  renderFoods();
  renderSport();
  store.set("profile", profile);
}

$("#save").addEventListener("click", () => {
  readForm();
  renderAll();
  document.querySelector('.tabs button[data-t="food"]').click();
});
["age", "sex", "weight", "height"].forEach((id) => $("#" + id).addEventListener("input", () => { readForm(); renderAll(); }));

$("#age").value = profile.age;
$("#sex").value = profile.sex;
$("#weight").value = profile.weight;
$("#height").value = profile.height;

const ref = $("#ref");
REFERENCE.forEach(([a, b]) => ref.append(el("tr", {}, el("td", { textContent: a }), el("td", { textContent: b }))));

renderConditions();
renderMenu();
renderChecks();
renderMeasures();
renderAll();

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
