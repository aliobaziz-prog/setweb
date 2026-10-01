"use strict";

/* ---------- guide ---------- */
let foodFilter = "all";

function foodLevel(f) {
  const conds = profile.conds.length ? profile.conds : Object.keys(C.CONDITIONS);
  if ((f.avoid || []).some((c) => conds.includes(c))) return "avoid";
  if ((f.limit || []).some((c) => conds.includes(c))) return "limit";
  if ((f.good || []).some((c) => conds.includes(c))) return "good";
  return null;
}

function renderGuide() {
  const tips = $("#guide-tips");
  tips.replaceChildren();
  const list = (items) => { const ul = el("ul"); items.forEach((x) => ul.append(el("li", { textContent: x }))); return ul; };
  if (!profile.conds.length) {
    tips.append(el("h2", { textContent: t("guide.general") }), list(C.GENERAL_TIPS));
  } else {
    profile.conds.forEach((k) => tips.append(el("h2", { textContent: `${C.CONDITIONS[k].emoji} ${C.CONDITIONS[k].label}` }), list(C.CONDITIONS[k].tips)));
  }

  const order = { avoid: 0, limit: 1, good: 2 };
  const ul = $("#food-list");
  ul.replaceChildren();
  C.FOODS.map((f) => ({ f, lv: foodLevel(f) }))
    .filter((x) => x.lv && (foodFilter === "all" || x.lv === foodFilter))
    .sort((a, b) => order[a.lv] - order[b.lv])
    .forEach(({ f, lv }) => {
      const info = el("div", {}, el("div", { className: "nm", textContent: f.name }), el("div", { className: "nt", textContent: f.note }));
      ul.append(el("li", {}, el("span", { className: "em", textContent: f.emoji }), info, el("span", { className: `badge ${lv}`, textContent: t("lv." + lv) })));
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

/* ---------- menu ideas ---------- */
let menuSeed = 0;
function renderMenu() {
  const box = $("#menu");
  box.replaceChildren();
  Object.entries(C.MENU).forEach(([meal, options], i) => {
    box.append(el("div", { className: "meal" }, el("h3", { textContent: meal }), el("p", { textContent: options[(menuSeed + i) % options.length] })));
  });
  box.append(el("p", { className: "small", textContent: t("menu.note") }));
}
$("#shuffle").addEventListener("click", () => { menuSeed++; renderMenu(); });
onRender.push(renderMenu);

/* ---------- food diary ---------- */
let diaryDate = todayKey();
const MEALS = [["bf", "🌅"], ["lunch", "☀️"], ["dinner", "🌙"], ["snack", "🍎"]];
const mealLabel = (k) => `${MEALS.find((m) => m[0] === k)[1]} ${t("meal." + k)}`;
const getDiary = () => store.get("diary", {});
const entriesOf = (d) => getDiary()[d] || [];
function totalsOf(entries) {
  const tot = Object.fromEntries(NK.map((k) => [k, 0]));
  entries.forEach((e) => NK.forEach((k) => (tot[k] += e.n[k] || 0)));
  return tot;
}
const allFoods = () => [...store.get("customFoods", []), ...FOOD_DB];
const entryName = (e) => { const f = e.fid && FOOD_DB.find((x) => x.id === e.fid); return f ? fname(f) : e.name; };

function foodFlags(n) {
  const f = [];
  if (n.na >= 480) f.push(["flag.salt", "bad"]);
  if (n.sug >= 10) f.push(["flag.sugar", "bad"]);
  if (n.sat >= 5) f.push(["flag.sat", "warn"]);
  if (n.fib >= 5) f.push(["flag.fiber", "ok"]);
  return f;
}

function addEntry(date, meal, food, qty) {
  const d = getDiary();
  const n = {};
  NK.forEach((k) => (n[k] = Math.round((food.n[k] || 0) * qty * 10) / 10));
  (d[date] = d[date] || []).push({ id: Date.now() + Math.random(), fid: food.id, meal, name: fname(food), emoji: food.emoji, qty, n });
  store.set("diary", d);
  store.set("recent", [food.id, ...store.get("recent", []).filter((x) => x !== food.id)].slice(0, 8));
  renderAll();
}

function openFoodPicker(meal, onPick) {
  const search = el("input", { type: "search", placeholder: t("pick.search") });
  const list = el("ul", { className: "picker" });
  const draw = () => {
    const q = norm(search.value.trim());
    let foods = allFoods();
    if (q) foods = foods.filter((f) => norm(Array.isArray(f.name) ? f.name.join(" ") : f.name).includes(q));
    else {
      const rec = store.get("recent", []);
      foods = [...rec.map((id) => foods.find((f) => f.id === id)).filter(Boolean), ...foods.filter((f) => !rec.includes(f.id))];
    }
    list.replaceChildren();
    foods.slice(0, 80).forEach((f) => {
      const b = el("button", { type: "button" },
        el("span", { className: "em", textContent: f.emoji }),
        el("span", { className: "grow" }, el("b", { textContent: fname(f) }), el("small", { textContent: `${funit(f)} · ${Math.round(f.n.kcal)} kcal` })));
      foodFlags(f.n).slice(0, 2).forEach(([k, c]) => b.append(el("span", { className: `tag ${c}`, textContent: t(k) })));
      b.addEventListener("click", () => (onPick ? onPick(f) : openQty(meal, f)));
      list.append(el("li", {}, b));
    });
    if (!foods.length) list.append(el("li", { className: "small", textContent: t("pick.none") }));
  };
  search.addEventListener("input", draw);
  const custom = el("button", { type: "button", className: "btn alt", textContent: t("pick.custom") });
  custom.addEventListener("click", () => openCustomFood(meal, onPick));
  const close = el("button", { type: "button", className: "link", textContent: t("btn.close") });
  close.addEventListener("click", closeDialog);
  openDialog(el("h2", { textContent: meal ? t("pick.title", { meal: mealLabel(meal) }) : t("pick.titleScan") }), search, list, custom, close);
  draw();
}

function openQty(meal, food) {
  const qty = el("input", { type: "number", min: "0.25", max: "10", step: "0.25", value: "1", inputMode: "decimal" });
  const prev = el("div", { className: "qprev" });
  const upd = () => {
    const q = parseFloat(qty.value) || 0;
    prev.replaceChildren(...NK.map((k) => el("div", {}, el("b", { textContent: nf(Math.round(food.n[k] * q * 10) / 10, k === "kcal" || k === "na" || k === "chol" ? 0 : 1) }), el("small", { textContent: `${t("n." + k)} (${nunit(k)})` }))));
  };
  qty.addEventListener("input", upd);
  const ok = el("button", { type: "button", className: "btn", textContent: t("btn.add") });
  ok.addEventListener("click", () => {
    const q = parseFloat(qty.value);
    if (!(q > 0 && q <= 10)) return;
    addEntry(diaryDate, meal, food, q);
    closeDialog();
  });
  const back = el("button", { type: "button", className: "link", textContent: t("btn.back") });
  back.addEventListener("click", () => openFoodPicker(meal));
  openDialog(
    el("h2", { textContent: `${food.emoji} ${fname(food)}` }),
    el("label", {}, el("span", { textContent: t("qty.label", { unit: funit(food) }) }), qty),
    prev, ok, back
  );
  upd();
}

function openCustomFood(meal, onPick) {
  const name = el("input", { type: "text", placeholder: t("custom.name"), required: true, maxLength: 60 });
  const unit = el("input", { type: "text", placeholder: t("custom.unit"), value: t("custom.unitdef"), maxLength: 40 });
  const fields = {};
  const grid = el("div", { className: "grid" });
  NK.forEach((k) => {
    fields[k] = el("input", { type: "number", min: "0", step: "any", inputMode: "decimal", value: "0" });
    grid.append(el("label", {}, el("span", { textContent: `${t("n." + k)} (${nunit(k)})` }), fields[k]));
  });
  const ok = el("button", { type: "button", className: "btn", textContent: t("btn.saveNext") });
  ok.addEventListener("click", () => {
    if (!name.value.trim()) { name.focus(); return; }
    const n = {};
    NK.forEach((k) => (n[k] = Math.max(0, parseFloat(fields[k].value) || 0)));
    const food = { id: "c" + Date.now(), name: name.value.trim().slice(0, 60), emoji: "🍽️", unit: unit.value.trim().slice(0, 40) || t("custom.unitdef"), n };
    store.set("customFoods", [food, ...store.get("customFoods", [])]);
    if (onPick) onPick(food);
    else openQty(meal, food);
  });
  const back = el("button", { type: "button", className: "link", textContent: t("btn.back") });
  back.addEventListener("click", () => openFoodPicker(meal, onPick));
  openDialog(el("h2", { textContent: t("custom.title") }), name, unit, grid, ok, back);
}

function diaryNotes(entries, tot) {
  const tg = targets();
  const notes = [];
  if (!entries.length) return [t("note.empty")];
  const top = (k) => [...entries].sort((a, b) => b.n[k] - a.n[k]).filter((e) => e.n[k] > 0).slice(0, 2).map(entryName).join(LISTSEP);
  if (tot.na > tg.na) notes.push(t("note.na", { v: nf(Math.round(tot.na)), src: top("na") }));
  if (tot.sug > tg.sug) notes.push(t("note.sug", { v: nf(Math.round(tot.sug)), src: top("sug") }));
  if (tot.sat > tg.sat) notes.push(t("note.sat", { v: nf(Math.round(tot.sat)), src: top("sat") }));
  if (tot.chol > tg.chol) notes.push(t("note.chol", { v: nf(Math.round(tot.chol)), src: top("chol") }));
  if (has("diabetes")) {
    MEALS.slice(0, 3).forEach(([k]) => {
      const c = totalsOf(entries.filter((e) => e.meal === k)).carb;
      if (c > 60) notes.push(t("note.carbmeal", { meal: t("meal." + k), v: Math.round(c) }));
    });
  }
  if (entries.length >= 4 && tot.fib < tg.fib * 0.5) notes.push(t("note.fib"));
  if (!notes.length) notes.push(t("note.good"));
  return notes;
}

function renderDiary() {
  const isToday = diaryDate === todayKey();
  $("#dd-label").textContent = isToday ? t("diary.today") : fmtDay(diaryDate);
  $("#dd-next").disabled = isToday;
  const entries = entriesOf(diaryDate);
  const tot = totalsOf(entries);
  renderMeters($("#diary-meters"), tot);

  const box = $("#diary-meals");
  box.replaceChildren();
  MEALS.forEach(([k]) => {
    const es = entries.filter((e) => e.meal === k);
    const card = el("div", { className: "card" });
    card.append(el("div", { className: "mealhead" }, el("h2", { textContent: mealLabel(k) }), el("span", { className: "small", textContent: `${nf(Math.round(sum(es.map((e) => e.n.kcal))))} kcal` })));
    const ul = el("ul", { className: "entries" });
    es.forEach((e) => {
      const del = el("button", { type: "button", className: "x", textContent: "✕", title: t("btn.delete"), ariaLabel: t("btn.delete") });
      del.addEventListener("click", () => {
        const d = getDiary();
        d[diaryDate] = d[diaryDate].filter((x) => x.id !== e.id);
        store.set("diary", d);
        renderAll();
      });
      ul.append(el("li", {},
        el("span", { className: "grow", textContent: `${e.emoji} ${entryName(e)} ${e.amt ? "· " + fmtGrams(e.amt) : "× " + nf(e.qty, e.qty % 1 ? 2 : 0)}` }),
        el("span", { className: "small", textContent: `${nf(Math.round(e.n.kcal))} kcal` }), del));
    });
    card.append(ul);
    const add = el("button", { type: "button", className: "btn alt", textContent: t("diary.addfood") });
    add.addEventListener("click", () => openFoodPicker(k));
    card.append(add);
    box.append(card);
  });

  const notes = $("#diary-notes");
  notes.replaceChildren(el("h2", { textContent: t("diary.notes") }));
  const ul = el("ul");
  diaryNotes(entries, tot).forEach((n) => ul.append(el("li", { textContent: n })));
  notes.append(ul, el("p", { className: "small", textContent: t("diary.approx") }));
}
const shiftDay = (n) => { const d = new Date(diaryDate + "T12:00:00"); d.setDate(d.getDate() + n); if (dkey(d) <= todayKey()) { diaryDate = dkey(d); renderDiary(); } };
$("#dd-prev").addEventListener("click", () => shiftDay(-1));
$("#dd-next").addEventListener("click", () => shiftDay(1));
$("#dd-prev").textContent = DIR === "rtl" ? "›" : "‹";
$("#dd-next").textContent = DIR === "rtl" ? "‹" : "›";
onRender.push(renderDiary);
