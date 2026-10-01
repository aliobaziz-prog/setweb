"use strict";

/* ---------- chart ---------- */
function lineChart(series, refs) {
  const W = 320, H = 160, L = 38, R = 8, T = 10, B = 22;
  const pts = series.flatMap((s) => s.pts);
  if (!pts.length) return null;
  const vals = [...pts.map((p) => p.v), ...refs.map((r) => r.v)];
  let lo = Math.min(...vals), hi = Math.max(...vals);
  const padv = (hi - lo || hi || 1) * 0.12;
  lo -= padv; hi += padv;
  const t0 = Math.min(...pts.map((p) => p.t)), t1 = Math.max(...pts.map((p) => p.t));
  const x = (t) => (t1 === t0 ? (L + W - R) / 2 : L + ((t - t0) / (t1 - t0)) * (W - L - R));
  const y = (v) => T + (1 - (v - lo) / (hi - lo)) * (H - T - B);
  const f = (n) => n.toFixed(1);
  let svg = `<svg viewBox="0 0 ${W} ${H}" role="img" class="chart">`;
  for (let i = 0; i <= 3; i++) {
    const v = lo + ((hi - lo) * i) / 3;
    svg += `<line x1="${L}" x2="${W - R}" y1="${f(y(v))}" y2="${f(y(v))}" class="grid"/><text x="${L - 4}" y="${f(y(v) + 3)}" class="ax" text-anchor="end">${series[0].fmt(v)}</text>`;
  }
  refs.forEach((r) => (svg += `<line x1="${L}" x2="${W - R}" y1="${f(y(r.v))}" y2="${f(y(r.v))}" class="ref"/>`));
  series.forEach((s) => {
    const d = s.pts.map((p) => `${f(x(p.t))},${f(y(p.v))}`);
    if (d.length > 1) svg += `<polyline points="${d.join(" ")}" class="ln" style="stroke:${s.color}"/>`;
    s.pts.forEach((p) => (svg += `<circle cx="${f(x(p.t))}" cy="${f(y(p.v))}" r="3.2" style="fill:${s.color}"/>`));
  });
  svg += `<text x="${L}" y="${H - 5}" class="ax">${fmtD(t0)}</text><text x="${W - R}" y="${H - 5}" class="ax" text-anchor="end">${fmtD(t1)}</text></svg>`;
  const wrap = el("div", { className: "chartbox" });
  wrap.innerHTML = svg;
  return wrap;
}

/* ---------- readings ---------- */
let viewType = "glucose";
const CTX = { fasting: "صائم", before: "قبل الأكل", after: "بعد الأكل بساعتين", bed: "قبل النوم", random: "عشوائي" };

function setupReadingForm() {
  const sel = $("#rtype");
  Object.entries(RTYPES).forEach(([k, v]) => sel.append(el("option", { value: k, textContent: `${v.emoji} ${v.label}` })));
  $("#rdate").value = todayKey();
  $("#rdate").max = todayKey();
  sel.addEventListener("change", () => { viewType = sel.value; syncForm(); renderTrack(); });
  syncForm();
}
function syncForm() {
  const t = $("#rtype").value;
  $("#l-ctx").hidden = t !== "glucose";
  $("#l-v2").hidden = $("#l-pulse").hidden = t !== "bp";
  $("#lv-t").textContent = t === "bp" ? "الانقباضي (الكبير)" : `القيمة (${unitOf(t)})`;
}

$("#rform").addEventListener("submit", (e) => {
  e.preventDefault();
  const type = $("#rtype").value;
  const msg = $("#rmsg");
  const raw = parseFloat($("#rv").value);
  let r = null;
  if (type === "bp") {
    const s = raw, d = parseFloat($("#rv2").value), p = parseFloat($("#rpulse").value);
    if (s >= 60 && s <= 260 && d >= 30 && d <= 160 && s > d) r = { v: s, v2: d, p: p > 0 ? p : null };
  } else if (Number.isFinite(raw)) {
    const v = fromInput(type, raw);
    const range = { glucose: [20, 700], weight: [25, 300], a1c: [3, 18], ldl: [10, 600], hdl: [5, 200], tc: [30, 800], tg: [10, 2500] }[type];
    if (v >= range[0] && v <= range[1]) r = { v };
  }
  if (!r) { msg.textContent = "القيمة غير معقولة، تأكد من الرقم والوحدة."; return; }
  const dateStr = $("#rdate").value || todayKey();
  r.ts = dateStr === todayKey() ? Date.now() : new Date(dateStr + "T12:00:00").getTime();
  r.id = Date.now() + Math.random();
  r.type = type;
  if (type === "glucose") r.ctx = $("#rctx").value;
  store.set("readings", [...store.get("readings", []), r]);
  viewType = type;
  $("#rv").value = $("#rv2").value = $("#rpulse").value = "";
  $("#rdate").value = todayKey();
  const st = statusOf(r);
  msg.textContent = `تم الحفظ: ${fmtReading(r)} — ${st.label}`;
  renderAll();
});

function stats(type, days) {
  const since = Date.now() - days * 864e5;
  const rs = getReadings().filter((r) => r.type === type && r.ts >= since);
  if (!rs.length) return null;
  const inRange = rs.filter((r) => ["ok"].includes(statusOf(r).cls)).length;
  return {
    n: rs.length,
    avg: avg(rs.map((r) => r.v)), avg2: avg(rs.map((r) => r.v2 || 0)),
    min: Math.min(...rs.map((r) => r.v)), max: Math.max(...rs.map((r) => r.v)),
    pct: Math.round((inRange / rs.length) * 100),
  };
}

const REFS = {
  glucose: () => [{ v: 70 }, { v: has("diabetes") ? 180 : 140 }],
  bp: () => [{ v: 130 }, { v: 80 }],
  a1c: () => [{ v: has("diabetes") ? 7 : 5.7 }],
  ldl: () => [{ v: 100 }], hdl: () => [{ v: profile.sex === "m" ? 40 : 50 }], tc: () => [{ v: 200 }], tg: () => [{ v: 150 }], weight: () => [],
};

function renderTrack() {
  $("#rtype").value = viewType;
  syncForm();
  const all = getReadings();
  const chips = $("#rchips");
  chips.replaceChildren();
  Object.entries(RTYPES).forEach(([k, v]) => {
    const n = all.filter((r) => r.type === k).length;
    const b = el("button", { type: "button", textContent: `${v.emoji} ${v.label}${n ? ` (${n})` : ""}` });
    b.classList.toggle("on", k === viewType);
    b.addEventListener("click", () => { viewType = k; renderTrack(); });
    chips.append(b);
  });

  const view = $("#rview");
  view.replaceChildren();
  const rs = all.filter((r) => r.type === viewType);
  const rt = RTYPES[viewType];
  const card = el("div", { className: "card" }, el("h2", { textContent: `${rt.emoji} ${rt.label}` }));
  if (!rs.length) {
    card.append(el("p", { className: "small", textContent: "لا توجد قراءات بعد. سجّل أول قراءة من النموذج أعلاه." }));
    view.append(card);
    return;
  }
  const last = rs[rs.length - 1];
  const st = statusOf(last);
  card.append(el("div", { className: `bigval st-${st.cls}` },
    el("b", { textContent: fmtReading(last) }), st.label ? el("span", { className: "pill", textContent: st.label }) : ""));
  if (viewType === "bp" && (last.v >= 180 || last.v2 >= 120)) {
    card.append(el("p", { className: "alert", textContent: "قراءة مرتفعة جدًا. أعد القياس بعد راحة 5 دقائق؛ وإن بقيت مرتفعة أو ظهر صداع شديد/ألم صدر/ضيق تنفس فاطلب الطوارئ فورًا." }));
  }
  if (viewType === "glucose" && last.v < 70) {
    card.append(el("p", { className: "alert", textContent: "سكر منخفض: تناول 15 غ سكر سريع (3 تمرات أو نصف كوب عصير)، وأعد القياس بعد 15 دقيقة، وكرّر إن بقي منخفضًا." }));
  }

  const recent = rs.slice(-30);
  const fmt = (v) => fmtVal(viewType, v);
  const series = viewType === "bp"
    ? [{ pts: recent.map((r) => ({ t: r.ts, v: r.v })), color: "var(--avoid)", fmt }, { pts: recent.map((r) => ({ t: r.ts, v: r.v2 })), color: "var(--brand)", fmt }]
    : [{ pts: recent.map((r) => ({ t: r.ts, v: r.v })), color: "var(--brand)", fmt }];
  const ch = lineChart(series, REFS[viewType]());
  if (ch) card.append(ch);
  if (viewType === "bp") card.append(el("p", { className: "small", textContent: "الأحمر: الانقباضي · الأخضر: الانبساطي · الخط المتقطع: الحدّ المستهدف" }));

  const s = stats(viewType, 30);
  if (s) {
    const cell = (a, b) => el("div", {}, el("b", { textContent: a }), el("small", { textContent: b }));
    const g = el("div", { className: "stats" });
    if (viewType === "bp") g.append(cell(`${Math.round(s.avg)}/${Math.round(s.avg2)}`, "المتوسط (30 يومًا)"), cell(`${Math.round(s.max)}`, "أعلى انقباضي"));
    else g.append(cell(fmt(s.avg), "المتوسط (30 يومًا)"), cell(fmt(s.min), "الأدنى"), cell(fmt(s.max), "الأعلى"));
    if (viewType !== "weight") g.append(cell(s.pct + "%", "ضمن الهدف"));
    g.append(cell(String(s.n), "عدد القراءات"));
    card.append(g);
    if (viewType === "glucose" && s.n >= 10) {
      card.append(el("p", { className: "small", textContent: `تقدير HbA1c من متوسط قراءاتك: ${((s.avg + 46.7) / 28.7).toFixed(1)}% — تقدير فقط، تحليل المخبر هو المرجع.` }));
    }
  }
  if (viewType === "weight") {
    const b = bmiValue();
    if (b) card.append(el("p", { className: "small", textContent: `مؤشر كتلة الجسم الحالي (حسب طولك): ${(last.v / Math.pow(profile.height / 100, 2)).toFixed(1)}` }));
  }

  const ul = el("ul", { className: "mlist" });
  rs.slice(-20).reverse().forEach((r) => {
    const x = el("button", { type: "button", className: "x", textContent: "✕", title: "حذف" });
    x.addEventListener("click", () => { store.set("readings", store.get("readings", []).filter((q) => q.id !== r.id)); renderAll(); });
    const s2 = statusOf(r);
    ul.append(el("li", {},
      el("span", { className: "grow", textContent: `${fmtD(r.ts)} — ${fmtReading(r)}${r.ctx ? ` (${CTX[r.ctx]})` : ""}` }),
      s2.label ? el("span", { className: `pill st-${s2.cls}`, textContent: s2.label }) : "", x));
  });
  card.append(ul);
  view.append(card);
}
onRender.push(renderTrack);
setupReadingForm();

/* ---------- daily goals ---------- */
function renderChecks() {
  const today = checksToday();
  const ul = $("#checks");
  ul.replaceChildren();
  DAILY_CHECKS.forEach((c) => {
    const cb = el("input", { type: "checkbox", checked: !!today[c.id] });
    cb.addEventListener("change", () => {
      const a = store.get("checks", {});
      a[todayKey()] = { ...(a[todayKey()] || {}), [c.id]: cb.checked };
      store.set("checks", a);
      renderAll();
    });
    ul.append(el("li", {}, el("label", {}, cb, c.label)));
  });
  $("#bar").style.width = (checksDone() / DAILY_CHECKS.length) * 100 + "%";
  $("#streak").textContent = `${checksDone()}/${DAILY_CHECKS.length} اليوم · أيام متتالية بـ 5 أهداف أو أكثر: ${streak()}`;
}
onRender.push(renderChecks);

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
      el("p", { textContent: "الفائدة: " + e.benefits })))
  );
}
onRender.push(renderSport);
