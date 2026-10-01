"use strict";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const el = (tag, props = {}, ...kids) => {
  const n = document.createElement(tag);
  Object.assign(n, props);
  kids.forEach((k) => n.append(k));
  return n;
};
const store = {
  get(k, d) {
    try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; }
  },
  set(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ }
  },
};

const pad = (n) => String(n).padStart(2, "0");
const dkey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const todayKey = () => dkey();
const fmtD = (ts) => { const d = new Date(ts); return `${d.getDate()}/${d.getMonth() + 1}`; };
const sum = (a) => a.reduce((x, y) => x + y, 0);
const avg = (a) => (a.length ? sum(a) / a.length : 0);
const norm = (s) => s.replace(/[ً-ٰٟ]/g, "").replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي").toLowerCase();

/* ---------- profile & targets ---------- */
const DEFAULT_PROFILE = { age: "", sex: "m", weight: "", height: "", waist: "", activity: "low", goal: "keep", conds: [], units: "gl" };
let profile = { ...DEFAULT_PROFILE, ...store.get("profile", {}) };
const saveProfile = () => store.set("profile", profile);
const has = (c) => profile.conds.includes(c);

function bmiValue() {
  const w = parseFloat(profile.weight), h = parseFloat(profile.height) / 100;
  return w > 0 && h > 0 ? w / (h * h) : null;
}

function targets() {
  const w = +profile.weight, h = +profile.height, a = +profile.age;
  let kcal = 2000;
  if (w > 0 && h > 0 && a > 0) {
    const bmr = 10 * w + 6.25 * h - 5 * a + (profile.sex === "m" ? 5 : -161);
    kcal = bmr * ({ low: 1.2, mid: 1.375, high: 1.55 }[profile.activity] || 1.2);
    if (profile.goal === "lose") kcal -= 400;
    kcal = Math.max(profile.sex === "m" ? 1500 : 1200, Math.round(kcal / 50) * 50);
  }
  const strict = has("chol") || has("trig") || has("diabetes");
  return {
    kcal,
    carb: Math.round((kcal * (has("diabetes") ? 0.45 : 0.5)) / 4),
    fib: Math.round((14 * kcal) / 1000),
    sug: Math.round((kcal * (has("diabetes") || has("trig") ? 0.05 : 0.1)) / 4),
    sat: Math.round((kcal * (strict ? 0.07 : 0.1)) / 9),
    chol: has("chol") ? 200 : 300,
    na: has("bp") ? 1500 : 2000,
  };
}

/* ---------- rendering registry & navigation ---------- */
const onRender = [];
const renderAll = () => onRender.forEach((f) => f());

function showSub(tab, sub) {
  $$(`#tab-${tab} .subnav button`).forEach((b) => b.classList.toggle("on", b.dataset.s === sub));
  $$(`#tab-${tab} .sub`).forEach((p) => p.classList.toggle("active", p.id === `sub-${tab}-${sub}`));
}
function showTab(id) {
  $$(".tab").forEach((t) => t.classList.toggle("active", t.id === "tab-" + id));
  $$(".tabs button").forEach((b) => b.classList.toggle("on", b.dataset.t === id));
  window.scrollTo(0, 0);
}
function go(tab, sub) {
  showTab(tab);
  if (sub) showSub(tab, sub);
}
$$(".tabs button").forEach((b) => b.addEventListener("click", () => showTab(b.dataset.t)));
$$(".subnav button").forEach((b) =>
  b.addEventListener("click", () => {
    showSub(b.closest(".subnav").dataset.tab, b.dataset.s);
    window.scrollTo(0, 0);
  })
);

/* ---------- dialog ---------- */
const dlg = $("#dlg");
function openDialog(...nodes) {
  $("#dlg-body").replaceChildren(...nodes);
  if (!dlg.open) dlg.showModal();
}
const closeDialog = () => dlg.open && dlg.close();
dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });

/* ---------- nutrient meters ---------- */
const METERS = [
  { k: "kcal", label: "السعرات", unit: "kcal", dir: "max" },
  { k: "carb", label: "الكربوهيدرات", unit: "غ", dir: "max" },
  { k: "sug", label: "سكر مضاف", unit: "غ", dir: "max" },
  { k: "sat", label: "دهون مشبعة", unit: "غ", dir: "max" },
  { k: "na", label: "صوديوم (الملح)", unit: "مغ", dir: "max" },
  { k: "chol", label: "كوليسترول غذائي", unit: "مغ", dir: "max" },
  { k: "fib", label: "ألياف", unit: "غ", dir: "min" },
];

function meterState(m, val, target) {
  const r = val / target;
  if (m.dir === "min") return r >= 1 ? "ok" : "neutral";
  return r > 1 ? "bad" : r > 0.85 ? "warn" : "ok";
}

function renderMeters(box, totals, keys) {
  const t = targets();
  box.replaceChildren();
  METERS.filter((m) => !keys || keys.includes(m.k)).forEach((m) => {
    const val = totals[m.k] || 0;
    const fill = el("div");
    fill.style.width = Math.min(val / t[m.k], 1) * 100 + "%";
    box.append(
      el("div", { className: `meter st-${meterState(m, val, t[m.k])}` },
        el("div", { className: "mhead" },
          el("span", { textContent: m.label }),
          el("span", { className: "mval", textContent: `${Math.round(val)} / ${t[m.k]} ${m.unit}` })),
        el("div", { className: "mbar" }, fill))
    );
  });
}

/* ---------- readings: units & status ---------- */
const RTYPES = {
  glucose: { label: "سكر الدم", emoji: "🩸", mg: true },
  bp: { label: "ضغط الدم", emoji: "❤️", two: true },
  weight: { label: "الوزن", emoji: "⚖️" },
  a1c: { label: "HbA1c", emoji: "🧪" },
  ldl: { label: "LDL (الضار)", emoji: "🧈", mg: true },
  hdl: { label: "HDL (الجيد)", emoji: "💚", mg: true },
  tc: { label: "الكوليسترول الكلي", emoji: "🧪", mg: true },
  tg: { label: "التريغليسريد", emoji: "🧪", mg: true },
};
const GL = () => profile.units === "gl";
const toDisplay = (type, v) => (RTYPES[type].mg && GL() ? v / 100 : v);
const fromInput = (type, v) => (RTYPES[type].mg && GL() ? v * 100 : v);
function fmtVal(type, v) {
  const d = toDisplay(type, v);
  if (RTYPES[type].mg) return GL() ? d.toFixed(2) : String(Math.round(d));
  if (type === "weight" || type === "a1c") return d.toFixed(1);
  return String(Math.round(d));
}
function unitOf(type) {
  if (RTYPES[type].mg) return GL() ? "غ/ل" : "مغ/دل";
  return { bp: "mmHg", weight: "كغ", a1c: "%" }[type];
}
function fmtReading(r) {
  return r.type === "bp" ? `${Math.round(r.v)}/${Math.round(r.v2)} ${unitOf("bp")}` : `${fmtVal(r.type, r.v)} ${unitOf(r.type)}`;
}

const S = (cls, label) => ({ cls, label });
function statusOf(r) {
  const v = r.v;
  const diab = has("diabetes");
  switch (r.type) {
    case "glucose": {
      if (v < 70) return S("low", "منخفض");
      const fastingLike = r.ctx === "fasting" || r.ctx === "before";
      if (diab) {
        const hi = fastingLike ? 130 : 180;
        return v <= hi ? S("ok", "ضمن الهدف") : v <= hi + 50 ? S("warn", "مرتفع قليلًا") : S("bad", "مرتفع");
      }
      if (fastingLike) return v < 100 ? S("ok", "طبيعي") : v < 126 ? S("warn", "مرتفع قليلًا") : S("bad", "مرتفع");
      return v < 140 ? S("ok", "طبيعي") : v < 200 ? S("warn", "مرتفع قليلًا") : S("bad", "مرتفع");
    }
    case "bp": {
      const d = r.v2;
      if (v >= 180 || d >= 120) return S("bad", "مرتفع جدًا");
      if (v >= 140 || d >= 90) return S("bad", "مرتفع");
      if (v >= 130 || d >= 80) return S("warn", "مرتفع قليلًا");
      if (v < 90 || d < 60) return S("low", "منخفض");
      return v >= 120 ? S("warn", "مرتفع طفيف") : S("ok", "مثالي");
    }
    case "a1c":
      if (diab) return v < 7 ? S("ok", "ضمن الهدف") : v < 8 ? S("warn", "مرتفع قليلًا") : S("bad", "مرتفع");
      return v < 5.7 ? S("ok", "طبيعي") : v < 6.5 ? S("warn", "مقدمات سكري") : S("bad", "في مدى السكري");
    case "ldl": return v < 130 ? S("ok", v < 100 ? "مثالي" : "مقبول") : v < 160 ? S("warn", "حدّي") : S("bad", "مرتفع");
    case "hdl": {
      const low = profile.sex === "m" ? 40 : 50;
      return v < low ? S("warn", "منخفض") : S("ok", v >= 60 ? "جيد جدًا" : "جيد");
    }
    case "tc": return v < 200 ? S("ok", "مرغوب") : v < 240 ? S("warn", "حدّي") : S("bad", "مرتفع");
    case "tg": return v < 150 ? S("ok", "طبيعي") : v < 200 ? S("warn", "حدّي") : S("bad", "مرتفع");
    default: return S("neutral", "");
  }
}

const getReadings = () => store.get("readings", []).sort((a, b) => a.ts - b.ts);
const latest = (type) => getReadings().filter((r) => r.type === type).pop();

/* ---------- daily goals ---------- */
const DAILY_CHECKS = [
  { id: "water", label: "شربت 8 أكواب ماء 💧" },
  { id: "walk", label: "مشيت 30 دقيقة 🚶" },
  { id: "veg", label: "أكلت 5 حصص خضر وفواكه 🥗" },
  { id: "nosoda", label: "بدون مشروبات غازية أو عصائر محلاة 🥤" },
  { id: "salt", label: "لم أضف ملحًا زائدًا 🧂" },
  { id: "sugar", label: "بدون سكر أو حلويات اليوم 🍰" },
  { id: "meds", label: "أخذت أدويتي في وقتها 💊" },
  { id: "sleep", label: "نمت 7 ساعات على الأقل 😴" },
];
const checksToday = () => (store.get("checks", {})[todayKey()] || {});
const checksDone = () => DAILY_CHECKS.filter((c) => checksToday()[c.id]).length;
function streak() {
  const all = store.get("checks", {});
  let n = 0;
  const d = new Date();
  for (let i = 0; i < 3650; i++) {
    const day = all[dkey(d)];
    const cnt = day ? Object.values(day).filter(Boolean).length : 0;
    if (cnt >= 5) n++;
    else if (i > 0) break;
    d.setDate(d.getDate() - 1);
  }
  return n;
}
