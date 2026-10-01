"use strict";

// Comfortable amount of each nutrient in one food portion, per focus area. "net" = carbs minus fiber.
const CAPS = {
  diabetes: { net: 30, sug: 5 },
  trig: { sug: 5, net: 45 },
  bp: { na: 500 },
  chol: { sat: 4, chol: 150 },
  thyroid: {},
  general: { kcal: 600, na: 800, sug: 10, sat: 6 },
};
const CAP_UNIT = { net: "g", sug: "g", sat: "g", kcal: "kcal", na: "mg", chol: "mg" };

const itemN = (it) => Object.fromEntries(NK.map((k) => [k, (it.per[k] || 0) * it.amount]));
const netCarb = (n) => Math.max(0, n.carb - n.fib);
const focusList = () => (profile.conds.length ? profile.conds : ["general"]);
const focusLabel = (c) => (c === "general" ? t("adv.general") : `${C.CONDITIONS[c].emoji} ${C.CONDITIONS[c].label}`);

function fmtAmount(it, amount) {
  if (it.grams) return amount < 10 ? t("adv.tiny") : fmtGrams(Math.round(amount / 5) * 5);
  const q = Math.max(0.25, Math.floor(amount * 4) / 4);
  return `${nf(q, q % 1 ? 2 : 0)} × ${it.unit}`;
}

function adviseFocus(it, c) {
  const n = itemN(it);
  const vals = { ...n, net: netCarb(n) };
  let worst = null, r = 0;
  Object.entries(CAPS[c]).forEach(([k, cap]) => {
    const ratio = vals[k] / cap;
    if (ratio > r) { r = ratio; worst = k; }
  });
  const level = r <= 1.1 ? "good" : r <= 2 ? "limit" : "occasional";
  const out = { c, level, lines: [] };
  if (level === "good") out.lines.push(t("adv.ok"));
  else {
    const u = CAP_UNIT[worst] === "kcal" ? "kcal" : t(CAP_UNIT[worst] === "mg" ? "u.mg" : "u.g");
    out.lines.push(t("adv.high", { what: t("n." + worst), v: nf(Math.round(vals[worst])), cap: nf(CAPS[c][worst]), u }));
    out.lines.push(t("adv.portion", { p: fmtAmount(it, it.amount / r) }));
  }
  out.lines.push(t("tip." + c));
  return out;
}

const LEVEL_ICON = { good: "👍", limit: "⚖️", occasional: "⏸️" };
const LEVEL_RANK = { good: 0, limit: 1, occasional: 2 };

/* ---------- analysis card ---------- */
let analysis = null;

function showAnalysis(items, opts = {}) {
  analysis = { items, confidence: opts.confidence || null, photo: opts.photo || null };
  renderAnalysis();
  $("#scan-result").scrollIntoView({ behavior: "smooth", block: "start" });
}

function defaultMeal() {
  const h = new Date().getHours();
  return h < 11 ? "bf" : h < 15 ? "lunch" : h < 18 ? "snack" : "dinner";
}

function renderAnalysis() {
  const box = $("#scan-result");
  if (speakingBtn && box.contains(speakingBtn)) stopSpeaking();
  box.replaceChildren();
  if (!analysis) return;
  const card = el("div", { className: "card analysis" });
  const head = el("div", { className: "mealhead" }, el("h2", { textContent: t("scan.yourmeal") }));
  if (analysis.confidence) head.append(el("span", { className: `pill conf-${analysis.confidence}`, textContent: t("conf." + analysis.confidence) }));
  card.append(head);
  if (analysis.photo) card.append(el("img", { className: "thumb", src: analysis.photo, alt: "" }));

  let mealWorst = "good";
  const speech = [];
  analysis.items.forEach((it, idx) => {
    speech.push(`${it.name}.`);
    const n = itemN(it);
    const amt = el("input", { type: "number", min: it.grams ? "1" : "0.25", step: it.grams ? "5" : "0.25", value: String(Math.round(it.amount * 100) / 100), inputMode: "decimal", ariaLabel: t("scan.amount") });
    amt.addEventListener("change", () => {
      const v = parseFloat(amt.value);
      if (v > 0 && v <= (it.grams ? 3000 : 20)) it.amount = v;
      renderAnalysis();
    });
    const del = el("button", { type: "button", className: "x", textContent: "✕", title: t("btn.delete"), ariaLabel: t("btn.delete") });
    del.addEventListener("click", () => {
      analysis.items.splice(idx, 1);
      if (!analysis.items.length) analysis = null;
      renderAnalysis();
    });
    const row = el("div", { className: "itemhead" },
      el("b", { className: "grow", textContent: `${it.emoji || "🍽️"} ${it.name}` }),
      amt, el("span", { className: "small", textContent: it.grams ? t("u.g") : `× ${it.unit}` }), del);
    const facts = el("p", { className: "facts", textContent: [
      `${nf(Math.round(n.kcal))} kcal`,
      `${t("n.net")} ${nf(Math.round(netCarb(n)))} g`,
      `${t("n.sug")} ${nf(Math.round(n.sug))} g`,
      `${t("n.sat")} ${nf(n.sat, 1)} g`,
      `${t("n.na")} ${nf(Math.round(n.na))} mg`,
    ].join(" · ") });
    const adv = el("div", { className: "advice" });
    focusList().forEach((c) => {
      const a = adviseFocus(it, c);
      if (LEVEL_RANK[a.level] > LEVEL_RANK[mealWorst]) mealWorst = a.level;
      speech.push(`${focusLabel(c)}: ${t("lvl." + a.level)}.`, ...a.lines);
      adv.append(el("div", { className: `adv lv-${a.level}` },
        el("div", { className: "advhead" }, el("span", { textContent: focusLabel(c) }), el("span", { className: "pill", textContent: `${LEVEL_ICON[a.level]} ${t("lvl." + a.level)}` })),
        ...a.lines.map((x) => el("p", { textContent: x }))));
    });
    card.append(el("div", { className: "fooditem" }, row, facts, adv));
  });

  const tot = totalsOf(analysis.items.map((it) => ({ n: itemN(it) })));
  const vmsg = el("p", { className: "small", ariaLive: "polite" });
  card.append(listenButton(() => [`${t("scan.verdict." + mealWorst)}.`, ...speech].join("\n"), vmsg), vmsg);
  card.append(el("div", { className: `mealsum lv-${mealWorst}` },
    el("b", { textContent: `${LEVEL_ICON[mealWorst]} ${t("scan.verdict." + mealWorst)}` }),
    el("p", { className: "small", textContent: t("scan.total", { kcal: nf(Math.round(tot.kcal)), net: nf(Math.round(netCarb(tot))), sug: nf(Math.round(tot.sug)), sat: nf(tot.sat, 1), na: nf(Math.round(tot.na)), fib: nf(Math.round(tot.fib)) }) })));

  const mealSel = el("select", { ariaLabel: t("scan.meal") });
  MEALS.forEach(([k]) => mealSel.append(el("option", { value: k, textContent: mealLabel(k) })));
  mealSel.value = defaultMeal();
  const add = el("button", { type: "button", className: "btn", textContent: t("scan.add") });
  add.addEventListener("click", () => {
    const d = getDiary();
    const day = (d[todayKey()] = d[todayKey()] || []);
    analysis.items.forEach((it) => {
      const n = {};
      Object.entries(itemN(it)).forEach(([k, v]) => (n[k] = Math.round(v * 10) / 10));
      day.push({ id: Date.now() + Math.random(), fid: it.fid, meal: mealSel.value, name: it.name, emoji: it.emoji || "🍽️", qty: it.grams ? 1 : it.amount, amt: it.grams ? Math.round(it.amount) : null, n });
    });
    store.set("diary", d);
    analysis = null;
    renderAll();
    $("#scan-msg").textContent = t("scan.added");
  });
  const discard = el("button", { type: "button", className: "link", textContent: t("scan.discard") });
  discard.addEventListener("click", () => { analysis = null; renderAnalysis(); });
  card.append(el("div", { className: "btnrow" }, mealSel, add), discard,
    el("p", { className: "small", textContent: t(analysis.photo ? "scan.photonote" : "scan.dbnote") }));
  box.append(card);
}
