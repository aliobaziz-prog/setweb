"use strict";

/* ---------- guide: ماذا آكل؟ ---------- */
let foodFilter = "all";

function foodLevel(f) {
  const conds = profile.conds.length ? profile.conds : Object.keys(CONDITIONS);
  if ((f.avoid || []).some((c) => conds.includes(c))) return "avoid";
  if ((f.limit || []).some((c) => conds.includes(c))) return "limit";
  if ((f.good || []).some((c) => conds.includes(c))) return "good";
  return null;
}

function renderGuide() {
  const tips = $("#guide-tips");
  tips.replaceChildren();
  if (!profile.conds.length) {
    tips.append(el("h2", { textContent: "نصائح عامة" }));
    const ul = el("ul");
    ["كل الخضر والبقوليات والسمك أكثر من اللحوم المصنعة.", "قلّل السكر والملح والمقليات.", "تحرك 30 دقيقة يوميًا.",
     "اختر حالتك في «المزيد ← ملفي» لتظهر نصائح وقوائم مخصصة."].forEach((t) => ul.append(el("li", { textContent: t })));
    tips.append(ul);
  } else {
    profile.conds.forEach((k) => {
      tips.append(el("h2", { textContent: `${CONDITIONS[k].emoji} ${CONDITIONS[k].label}` }));
      const ul = el("ul");
      CONDITIONS[k].tips.forEach((t) => ul.append(el("li", { textContent: t })));
      tips.append(ul);
    });
  }

  const order = { avoid: 0, limit: 1, good: 2 };
  const labels = { good: "كُل", limit: "بحذر", avoid: "تجنّب" };
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
$$("#food-filters button").forEach((b) =>
  b.addEventListener("click", () => {
    foodFilter = b.dataset.f;
    $$("#food-filters button").forEach((x) => x.classList.toggle("on", x === b));
    renderGuide();
  })
);
onRender.push(renderGuide);

/* ---------- menu ---------- */
let menuSeed = 0;
function renderMenu() {
  const box = $("#menu");
  box.replaceChildren();
  Object.entries(MENU).forEach(([meal, options]) => {
    box.append(el("div", { className: "meal" }, el("h3", { textContent: meal }), el("p", { textContent: options[(menuSeed + meal.length) % options.length] })));
  });
  box.append(el("p", { className: "small", textContent: "اشرب الماء، والملح والزيت بكميات قليلة. عدّل الكميات مع طبيبك أو أخصائي التغذية." }));
}
$("#shuffle").addEventListener("click", () => { menuSeed++; renderMenu(); });
onRender.push(renderMenu);

/* ---------- diary ---------- */
let diaryDate = todayKey();
const MEALS = [["bf", "🌅 الفطور"], ["lunch", "☀️ الغداء"], ["dinner", "🌙 العشاء"], ["snack", "🍎 سناك"]];
const getDiary = () => store.get("diary", {});
const entriesOf = (d) => getDiary()[d] || [];
function totalsOf(entries) {
  const t = Object.fromEntries(NK.map((k) => [k, 0]));
  entries.forEach((e) => NK.forEach((k) => (t[k] += e.n[k] || 0)));
  return t;
}
const allFoods = () => [...store.get("customFoods", []), ...FOOD_DB];

function foodFlags(n) {
  const f = [];
  if (n.na >= 480) f.push(["ملح عالٍ", "bad"]);
  if (n.sug >= 10) f.push(["سكر مضاف", "bad"]);
  if (n.sat >= 5) f.push(["دهون مشبعة", "warn"]);
  if (n.fib >= 5) f.push(["ألياف ✓", "ok"]);
  return f;
}

function addEntry(date, meal, food, qty) {
  const d = getDiary();
  const n = {};
  NK.forEach((k) => (n[k] = Math.round((food.n[k] || 0) * qty * 10) / 10));
  (d[date] = d[date] || []).push({ id: Date.now() + Math.random(), meal, name: food.name, emoji: food.emoji, unit: food.unit, qty, n });
  store.set("diary", d);
  const rec = [food.id, ...store.get("recent", []).filter((x) => x !== food.id)].slice(0, 8);
  store.set("recent", rec);
  renderAll();
}

function openFoodPicker(meal) {
  const search = el("input", { type: "search", placeholder: "ابحث: خبز، عدس، تمر، سردين…" });
  const list = el("ul", { className: "picker" });
  const draw = () => {
    const q = norm(search.value.trim());
    let foods = allFoods();
    if (q) foods = foods.filter((f) => norm(f.name).includes(q));
    else {
      const rec = store.get("recent", []);
      foods = [...rec.map((id) => foods.find((f) => f.id === id)).filter(Boolean), ...foods.filter((f) => !rec.includes(f.id))];
    }
    list.replaceChildren();
    foods.slice(0, 60).forEach((f) => {
      const b = el("button", { type: "button" },
        el("span", { className: "em", textContent: f.emoji }),
        el("span", { className: "grow" }, el("b", { textContent: f.name }), el("small", { textContent: `${f.unit} · ${Math.round(f.n.kcal)} kcal` })));
      foodFlags(f.n).slice(0, 2).forEach(([t, c]) => b.append(el("span", { className: `tag ${c}`, textContent: t })));
      b.addEventListener("click", () => openQty(meal, f));
      list.append(el("li", {}, b));
    });
    if (!foods.length) list.append(el("li", { className: "small", textContent: "لا نتائج. أضف طعامك بالأسفل." }));
  };
  search.addEventListener("input", draw);
  const custom = el("button", { type: "button", className: "btn alt", textContent: "＋ طعام غير موجود؟ أضفه" });
  custom.addEventListener("click", () => openCustomFood(meal));
  const close = el("button", { type: "button", className: "link", textContent: "إغلاق" });
  close.addEventListener("click", closeDialog);
  openDialog(el("h2", { textContent: "إضافة إلى " + MEALS.find((m) => m[0] === meal)[1] }), search, list, custom, close);
  draw();
}

function openQty(meal, food) {
  const qty = el("input", { type: "number", min: "0.25", max: "10", step: "0.25", value: "1", inputMode: "decimal" });
  const prev = el("div", { className: "qprev" });
  const upd = () => {
    const q = parseFloat(qty.value) || 0;
    prev.replaceChildren(...NK.map((k) => el("div", {}, el("b", { textContent: Math.round(food.n[k] * q * 10) / 10 }), el("small", { textContent: `${NLABEL[k]} (${NUNIT[k]})` }))));
  };
  qty.addEventListener("input", upd);
  const ok = el("button", { type: "button", className: "btn", textContent: "إضافة" });
  ok.addEventListener("click", () => {
    const q = parseFloat(qty.value);
    if (!(q > 0 && q <= 10)) return;
    addEntry(diaryDate, meal, food, q);
    closeDialog();
  });
  const back = el("button", { type: "button", className: "link", textContent: "← رجوع" });
  back.addEventListener("click", () => openFoodPicker(meal));
  openDialog(
    el("h2", { textContent: `${food.emoji} ${food.name}` }),
    el("label", {}, el("span", { textContent: `الكمية (عدد الحصص — الحصة: ${food.unit})` }), qty),
    prev, ok, back
  );
  upd();
}

function openCustomFood(meal) {
  const name = el("input", { type: "text", placeholder: "اسم الطعام", required: true });
  const unit = el("input", { type: "text", placeholder: "الحصة (مثال: طبق، قطعة)", value: "حصة" });
  const fields = {};
  const grid = el("div", { className: "grid" });
  NK.forEach((k) => {
    fields[k] = el("input", { type: "number", min: "0", step: "any", inputMode: "decimal", value: "0" });
    grid.append(el("label", {}, el("span", { textContent: `${NLABEL[k]} (${NUNIT[k]})` }), fields[k]));
  });
  const ok = el("button", { type: "button", className: "btn", textContent: "حفظ ومتابعة" });
  ok.addEventListener("click", () => {
    if (!name.value.trim()) { name.focus(); return; }
    const n = {};
    NK.forEach((k) => (n[k] = Math.max(0, parseFloat(fields[k].value) || 0)));
    const food = { id: "c" + Date.now(), name: name.value.trim().slice(0, 60), emoji: "🍽️", unit: unit.value.trim().slice(0, 40) || "حصة", n };
    store.set("customFoods", [food, ...store.get("customFoods", [])]);
    openQty(meal, food);
  });
  const back = el("button", { type: "button", className: "link", textContent: "← رجوع" });
  back.addEventListener("click", () => openFoodPicker(meal));
  openDialog(el("h2", { textContent: "طعام جديد (القيم لكل حصة)" }), name, unit, grid, ok, back);
}

function diaryNotes(entries, totals) {
  const t = targets();
  const notes = [];
  if (!entries.length) return ["سجّل وجباتك لتعرف أين تقف من أهدافك اليومية."];
  const top = (k) => [...entries].sort((a, b) => b.n[k] - a.n[k]).filter((e) => e.n[k] > 0).slice(0, 2).map((e) => e.name).join("، ");
  if (totals.na > t.na) notes.push(`الصوديوم (${Math.round(totals.na)} مغ) تجاوز هدفك. أكبر المصادر: ${top("na")}.`);
  if (totals.sug > t.sug) notes.push(`السكر المضاف (${Math.round(totals.sug)} غ) فوق الهدف. المصدر: ${top("sug")}.`);
  if (totals.sat > t.sat) notes.push(`الدهون المشبعة (${Math.round(totals.sat)} غ) فوق الهدف. المصدر: ${top("sat")}.`);
  if (totals.chol > t.chol) notes.push(`الكوليسترول الغذائي (${Math.round(totals.chol)} مغ) فوق الهدف. المصدر: ${top("chol")}.`);
  if (has("diabetes")) {
    MEALS.slice(0, 3).forEach(([k, label]) => {
      const c = totalsOf(entries.filter((e) => e.meal === k)).carb;
      if (c > 60) notes.push(`${label}: ${Math.round(c)} غ كربوهيدرات. الهدف الشائع لمريض السكري 45–60 غ للوجبة، فخفّف النشويات وزد الخضر.`);
    });
  }
  if (entries.length >= 4 && totals.fib < t.fib * 0.5) notes.push("الألياف قليلة: أضف بقوليات أو شوفان أو خضر وفاكهة بقشرها.");
  if (!notes.length) notes.push("ممتاز! أنت ضمن أهدافك حتى الآن 👏");
  return notes;
}

function renderDiary() {
  const isToday = diaryDate === todayKey();
  $("#dd-label").textContent = isToday ? "اليوم" : diaryDate.split("-").reverse().join("/");
  $("#dd-next").disabled = isToday;
  const entries = entriesOf(diaryDate);
  const totals = totalsOf(entries);
  renderMeters($("#diary-meters"), totals);

  const box = $("#diary-meals");
  box.replaceChildren();
  MEALS.forEach(([k, label]) => {
    const es = entries.filter((e) => e.meal === k);
    const card = el("div", { className: "card" });
    card.append(el("div", { className: "mealhead" }, el("h2", { textContent: label }), el("span", { className: "small", textContent: `${Math.round(sum(es.map((e) => e.n.kcal)))} kcal` })));
    const ul = el("ul", { className: "entries" });
    es.forEach((e) => {
      const del = el("button", { type: "button", className: "x", textContent: "✕", title: "حذف" });
      del.addEventListener("click", () => {
        const d = getDiary();
        d[diaryDate] = d[diaryDate].filter((x) => x.id !== e.id);
        store.set("diary", d);
        renderAll();
      });
      ul.append(el("li", {},
        el("span", { className: "grow", textContent: `${e.emoji} ${e.name} × ${e.qty}` }),
        el("span", { className: "small", textContent: `${Math.round(e.n.kcal)} kcal` }), del));
    });
    card.append(ul);
    const add = el("button", { type: "button", className: "btn alt", textContent: "＋ إضافة طعام" });
    add.addEventListener("click", () => openFoodPicker(k));
    card.append(add);
    box.append(card);
  });

  const notes = $("#diary-notes");
  notes.replaceChildren(el("h2", { textContent: "ملاحظات اليوم" }));
  const ul = el("ul");
  diaryNotes(entries, totals).forEach((n) => ul.append(el("li", { textContent: n })));
  notes.append(ul, el("p", { className: "small", textContent: "القيم الغذائية تقريبية وتتغير حسب الوصفة والكمية." }));
}
$("#dd-prev").addEventListener("click", () => { const d = new Date(diaryDate + "T12:00:00"); d.setDate(d.getDate() - 1); diaryDate = dkey(d); renderDiary(); });
$("#dd-next").addEventListener("click", () => { const d = new Date(diaryDate + "T12:00:00"); d.setDate(d.getDate() + 1); if (dkey(d) <= todayKey()) { diaryDate = dkey(d); renderDiary(); } });
onRender.push(renderDiary);
