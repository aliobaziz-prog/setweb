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

const C = CONTENT[LANG];
const LIDX = { en: 0, fr: 1, ar: 2 }[LANG];

const pad = (n) => String(n).padStart(2, "0");
const dkey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const todayKey = () => dkey();
const nf = (x, d = 0) => (LANG === "ar" ? x.toFixed(d) : new Intl.NumberFormat(LOCALE, { minimumFractionDigits: d, maximumFractionDigits: d }).format(x));
const fmtD = (ts) => new Intl.DateTimeFormat(LOCALE, { day: "numeric", month: "short" }).format(new Date(ts));
const fmtDay = (key) => new Intl.DateTimeFormat(LOCALE, { weekday: "short", day: "numeric", month: "short" }).format(new Date(key + "T12:00:00"));
const fmtLong = (d) => new Intl.DateTimeFormat(LOCALE, { dateStyle: "long" }).format(d);
const sum = (a) => a.reduce((x, y) => x + y, 0);
const avg = (a) => (a.length ? sum(a) / a.length : 0);
const norm = (s) => s.normalize("NFD").replace(/[̀-ًͯ-ٰٟ]/g, "").replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي").toLowerCase();
const fname = (f) => (Array.isArray(f.name) ? f.name[LIDX] : f.name);
const funit = (f) => (f.u ? SERVINGS[f.u][LIDX] : f.unit);

/* ---------- profile & units ---------- */
function defaultUnits() {
  const l = navigator.language || "en-US";
  if (/^en(-US)?$/i.test(l)) return { units: "mgdl", system: "imperial" };
  if (/^fr/i.test(l) && !/-CA$/i.test(l)) return { units: "gl", system: "metric" };
  if (LANG === "ar") return { units: "gl", system: "metric" };
  return { units: "mmol", system: "metric" };
}
const DEFAULT_PROFILE = { age: "", sex: "m", weight: "", height: "", waist: "", activity: "low", goal: "keep", conds: [], ...defaultUnits() };
let profile = { ...DEFAULT_PROFILE, ...store.get("profile", {}) };
const saveProfile = () => store.set("profile", profile);
const has = (c) => profile.conds.includes(c);

const IMP = () => profile.system === "imperial";
const LB = 0.45359237, IN = 2.54;
const kgOut = (kg) => (IMP() ? kg / LB : kg);
const kgIn = (v) => (IMP() ? v * LB : v);
const cmOut = (cm) => (IMP() ? cm / IN : cm);
const cmIn = (v) => (IMP() ? v * IN : v);
const wUnit = () => t(IMP() ? "u.lb" : "u.kg");
const lUnit = () => t(IMP() ? "u.in" : "u.cm");

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
  $$(".tab").forEach((x) => x.classList.toggle("active", x.id === "tab-" + id));
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

const langSel = $("#lang-sel");
Object.entries(LANGS).forEach(([k, v]) => langSel.append(el("option", { value: k, textContent: v })));
langSel.value = LANG;
langSel.addEventListener("change", () => {
  store.set("lang", langSel.value);
  location.reload();
});

/* ---------- dialog ---------- */
const dlg = $("#dlg");
function openDialog(...nodes) {
  $("#dlg-body").replaceChildren(...nodes);
  if (!dlg.open) dlg.showModal();
}
const closeDialog = () => dlg.open && dlg.close();
dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });

/* ---------- nutrient meters ---------- */
const nunit = (k) => (k === "kcal" ? "kcal" : t(k === "chol" || k === "na" ? "u.mg" : "u.g"));
const METERS = [
  { k: "kcal", dir: "max" }, { k: "carb", dir: "max" }, { k: "sug", dir: "max" }, { k: "sat", dir: "max" },
  { k: "na", dir: "max" }, { k: "chol", dir: "max" }, { k: "fib", dir: "min" },
];

function meterState(m, val, target) {
  const r = val / target;
  if (m.dir === "min") return r >= 1 ? "ok" : "neutral";
  return r > 1 ? "bad" : r > 0.85 ? "warn" : "ok";
}

function renderMeters(box, totals, keys) {
  const tg = targets();
  box.replaceChildren();
  METERS.filter((m) => !keys || keys.includes(m.k)).forEach((m) => {
    const val = totals[m.k] || 0;
    const fill = el("div");
    fill.style.width = Math.min(val / tg[m.k], 1) * 100 + "%";
    box.append(
      el("div", { className: `meter st-${meterState(m, val, tg[m.k])}` },
        el("div", { className: "mhead" },
          el("span", { textContent: t("n." + m.k) }),
          el("span", { className: "mval", textContent: `${nf(Math.round(val))} / ${nf(tg[m.k])} ${nunit(m.k)}` })),
        el("div", { className: "mbar" }, fill))
    );
  });
}

/* ---------- readings: units & status ---------- */
const RTYPES = {
  glucose: { emoji: "🩸", mg: true },
  bp: { emoji: "❤️" },
  weight: { emoji: "⚖️" },
  a1c: { emoji: "🧪" },
  ldl: { emoji: "🧈", mg: true },
  hdl: { emoji: "💚", mg: true },
  tc: { emoji: "🧪", mg: true },
  tg: { emoji: "🧪", mg: true },
};
const rlabel = (k) => t("rt." + k);
const MMOL = { glucose: 18.016, ldl: 38.67, hdl: 38.67, tc: 38.67, tg: 88.57 };
function mgFactor(type) {
  if (profile.units === "gl") return 100;
  if (profile.units === "mmol") return MMOL[type];
  return 1;
}
function toDisplay(type, v) {
  if (RTYPES[type].mg) return v / mgFactor(type);
  if (type === "weight") return kgOut(v);
  return v;
}
function fromInput(type, v) {
  if (RTYPES[type].mg) return v * mgFactor(type);
  if (type === "weight") return kgIn(v);
  return v;
}
function fmtVal(type, v) {
  const d = toDisplay(type, v);
  if (RTYPES[type].mg) return nf(d, { gl: 2, mmol: 1, mgdl: 0 }[profile.units]);
  if (type === "weight" || type === "a1c") return nf(d, 1);
  return nf(d);
}
function unitOf(type) {
  if (RTYPES[type].mg) return t("u." + profile.units);
  if (type === "weight") return wUnit();
  return { bp: "mmHg", a1c: "%" }[type];
}
function fmtReading(r) {
  return r.type === "bp" ? `${Math.round(r.v)}/${Math.round(r.v2)} mmHg` : `${fmtVal(r.type, r.v)} ${unitOf(r.type)}`;
}

const S = (cls, key) => ({ cls, label: key ? t("st." + key) : "" });
function statusOf(r) {
  const v = r.v;
  const diab = has("diabetes");
  switch (r.type) {
    case "glucose": {
      if (v < 70) return S("low", "low");
      const fastingLike = r.ctx === "fasting" || r.ctx === "before";
      if (diab) {
        const hi = fastingLike ? 130 : 180;
        return v <= hi ? S("ok", "target") : v <= hi + 50 ? S("warn", "slhigh") : S("bad", "high");
      }
      if (fastingLike) return v < 100 ? S("ok", "normal") : v < 126 ? S("warn", "slhigh") : S("bad", "high");
      return v < 140 ? S("ok", "normal") : v < 200 ? S("warn", "slhigh") : S("bad", "high");
    }
    case "bp": {
      const d = r.v2;
      if (v >= 180 || d >= 120) return S("bad", "vhigh");
      if (v >= 140 || d >= 90) return S("bad", "high");
      if (v >= 130 || d >= 80) return S("warn", "slhigh");
      if (v < 90 || d < 60) return S("low", "low");
      return v >= 120 ? S("warn", "elevated") : S("ok", "optimal");
    }
    case "a1c":
      if (diab) return v < 7 ? S("ok", "target") : v < 8 ? S("warn", "slhigh") : S("bad", "high");
      return v < 5.7 ? S("ok", "normal") : v < 6.5 ? S("warn", "prediab") : S("bad", "diabrange");
    case "ldl": return v < 130 ? S("ok", v < 100 ? "optimal" : "acceptable") : v < 160 ? S("warn", "borderline") : S("bad", "high");
    case "hdl": {
      const low = profile.sex === "m" ? 40 : 50;
      return v < low ? S("warn", "low") : S("ok", v >= 60 ? "vgood" : "good");
    }
    case "tc": return v < 200 ? S("ok", "desirable") : v < 240 ? S("warn", "borderline") : S("bad", "high");
    case "tg": return v < 150 ? S("ok", "normal") : v < 200 ? S("warn", "borderline") : S("bad", "high");
    default: return S("neutral");
  }
}

const getReadings = () => store.get("readings", []).sort((a, b) => a.ts - b.ts);
const latest = (type) => getReadings().filter((r) => r.type === type).pop();

/* ---------- daily goals ---------- */
const checksToday = () => (store.get("checks", {})[todayKey()] || {});
const checksDone = () => C.DAILY_CHECKS.filter((c) => checksToday()[c.id]).length;
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

applyI18n();
