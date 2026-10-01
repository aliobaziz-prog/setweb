"use strict";

/* ---------- chart ---------- */
function lineChart(series, refs, fmt) {
  const W = 320, H = 160, L = 40, R = 8, T = 10, B = 22;
  const pts = series.flatMap((s) => s.pts);
  if (!pts.length) return null;
  const vals = [...pts.map((p) => p.v), ...refs];
  let lo = Math.min(...vals), hi = Math.max(...vals);
  const padv = (hi - lo || hi || 1) * 0.12;
  lo -= padv; hi += padv;
  const t0 = Math.min(...pts.map((p) => p.t)), t1 = Math.max(...pts.map((p) => p.t));
  const x = (tt) => (t1 === t0 ? (L + W - R) / 2 : L + ((tt - t0) / (t1 - t0)) * (W - L - R));
  const y = (v) => T + (1 - (v - lo) / (hi - lo)) * (H - T - B);
  const f = (n) => n.toFixed(1);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  let svg = `<svg viewBox="0 0 ${W} ${H}" role="img" class="chart">`;
  for (let i = 0; i <= 3; i++) {
    const v = lo + ((hi - lo) * i) / 3;
    svg += `<line x1="${L}" x2="${W - R}" y1="${f(y(v))}" y2="${f(y(v))}" class="grid"/><text x="${L - 4}" y="${f(y(v) + 3)}" class="ax" text-anchor="end">${esc(fmt(v))}</text>`;
  }
  refs.forEach((v) => (svg += `<line x1="${L}" x2="${W - R}" y1="${f(y(v))}" y2="${f(y(v))}" class="ref"/>`));
  series.forEach((s) => {
    const d = s.pts.map((p) => `${f(x(p.t))},${f(y(p.v))}`);
    if (d.length > 1) svg += `<polyline points="${d.join(" ")}" class="ln" style="stroke:${s.color}"/>`;
    s.pts.forEach((p) => (svg += `<circle cx="${f(x(p.t))}" cy="${f(y(p.v))}" r="3.2" style="fill:${s.color}"/>`));
  });
  svg += `<text x="${L}" y="${H - 5}" class="ax">${esc(fmtD(t0))}</text><text x="${W - R}" y="${H - 5}" class="ax" text-anchor="end">${esc(fmtD(t1))}</text></svg>`;
  const wrap = el("div", { className: "chartbox" });
  wrap.innerHTML = svg;
  return wrap;
}

/* ---------- readings ---------- */
let viewType = "glucose";

function setupReadingForm() {
  const sel = $("#rtype");
  Object.entries(RTYPES).forEach(([k, v]) => sel.append(el("option", { value: k, textContent: `${v.emoji} ${rlabel(k)}` })));
  $("#rdate").value = todayKey();
  $("#rdate").max = todayKey();
  sel.addEventListener("change", () => { viewType = sel.value; renderTrack(); });
}
function syncForm() {
  const ty = $("#rtype").value;
  $("#l-ctx").hidden = ty !== "glucose";
  $("#l-v2").hidden = $("#l-pulse").hidden = ty !== "bp";
  $("#lv-t").textContent = ty === "bp" ? t("rform.sys") : t("rform.value", { u: unitOf(ty) });
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
  if (!r) { msg.textContent = t("rform.invalid"); return; }
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
  msg.textContent = t("rform.saved", { v: fmtReading(r) + (st.label ? " — " + st.label : "") });
  renderAll();
});

function stats(type, days) {
  const since = Date.now() - days * 864e5;
  const rs = getReadings().filter((r) => r.type === type && r.ts >= since);
  if (!rs.length) return null;
  return {
    n: rs.length,
    avg: avg(rs.map((r) => r.v)), avg2: avg(rs.map((r) => r.v2 || 0)),
    min: Math.min(...rs.map((r) => r.v)), max: Math.max(...rs.map((r) => r.v)),
    pct: Math.round((rs.filter((r) => statusOf(r).cls === "ok").length / rs.length) * 100),
  };
}

const REFS = {
  glucose: () => [70, has("diabetes") ? 180 : 140],
  bp: () => [130, 80],
  a1c: () => [has("diabetes") ? 7 : 5.7],
  ldl: () => [100], hdl: () => [profile.sex === "m" ? 40 : 50], tc: () => [200], tg: () => [150], weight: () => [],
};

function renderTrack() {
  $("#rtype").value = viewType;
  syncForm();
  const all = getReadings();
  const chips = $("#rchips");
  chips.replaceChildren();
  Object.entries(RTYPES).forEach(([k, v]) => {
    const n = all.filter((r) => r.type === k).length;
    const b = el("button", { type: "button", textContent: `${v.emoji} ${rlabel(k)}${n ? ` (${n})` : ""}` });
    b.classList.toggle("on", k === viewType);
    b.addEventListener("click", () => { viewType = k; renderTrack(); });
    chips.append(b);
  });

  const view = $("#rview");
  view.replaceChildren();
  const rs = all.filter((r) => r.type === viewType);
  const card = el("div", { className: "card" }, el("h2", { textContent: `${RTYPES[viewType].emoji} ${rlabel(viewType)}` }));
  if (!rs.length) {
    card.append(el("p", { className: "small", textContent: t("track.none") }));
    view.append(card);
    return;
  }
  const last = rs[rs.length - 1];
  const st = statusOf(last);
  card.append(el("div", { className: `bigval st-${st.cls}` },
    el("b", { textContent: fmtReading(last) }), st.label ? el("span", { className: "pill", textContent: st.label }) : ""));
  if (viewType === "bp" && (last.v >= 180 || last.v2 >= 120)) card.append(el("p", { className: "alert", textContent: t("alert.bpcrisis") }));
  if (viewType === "glucose" && last.v < 70) card.append(el("p", { className: "alert", textContent: t("alert.hypo") }));

  const recent = rs.slice(-30);
  const fmt = (v) => fmtVal(viewType, v);
  const series = viewType === "bp"
    ? [{ pts: recent.map((r) => ({ t: r.ts, v: r.v })), color: "var(--avoid)" }, { pts: recent.map((r) => ({ t: r.ts, v: r.v2 })), color: "var(--brand)" }]
    : [{ pts: recent.map((r) => ({ t: r.ts, v: r.v })), color: "var(--brand)" }];
  const ch = lineChart(series, REFS[viewType](), viewType === "bp" ? (v) => nf(v) : fmt);
  if (ch) card.append(ch);
  card.append(el("p", { className: "small", textContent: viewType === "bp" ? t("chart.bp") : t("chart.ref") }));

  const s = stats(viewType, 30);
  if (s) {
    const cell = (a, b) => el("div", {}, el("b", { textContent: a }), el("small", { textContent: b }));
    const g = el("div", { className: "stats" });
    if (viewType === "bp") g.append(cell(`${Math.round(s.avg)}/${Math.round(s.avg2)}`, t("stat.avg30")), cell(nf(s.max), t("stat.maxsys")));
    else g.append(cell(fmt(s.avg), t("stat.avg30")), cell(fmt(s.min), t("stat.min")), cell(fmt(s.max), t("stat.max")));
    if (viewType !== "weight") g.append(cell(s.pct + "%", t("stat.inrange")));
    g.append(cell(String(s.n), t("stat.count")));
    card.append(g);
    if (viewType === "glucose" && s.n >= 10) card.append(el("p", { className: "small", textContent: t("a1c.est", { v: nf((s.avg + 46.7) / 28.7, 1) }) }));
  }
  if (viewType === "weight" && +profile.height > 0) {
    card.append(el("p", { className: "small", textContent: t("track.bmi", { v: nf(last.v / Math.pow(profile.height / 100, 2), 1) }) }));
  }

  const ul = el("ul", { className: "mlist" });
  rs.slice(-20).reverse().forEach((r) => {
    const x = el("button", { type: "button", className: "x", textContent: "✕", title: t("btn.delete"), ariaLabel: t("btn.delete") });
    x.addEventListener("click", () => { store.set("readings", store.get("readings", []).filter((q) => q.id !== r.id)); renderAll(); });
    const s2 = statusOf(r);
    ul.append(el("li", {},
      el("span", { className: "grow", textContent: `${fmtD(r.ts)} — ${fmtReading(r)}${r.ctx ? ` (${t("ctx." + r.ctx)})` : ""}` }),
      s2.label ? el("span", { className: `pill st-${s2.cls}`, textContent: s2.label }) : "", x));
  });
  card.append(ul);
  view.append(card);
}
setupReadingForm();
onRender.push(renderTrack);

/* ---------- daily goals ---------- */
function renderChecks() {
  const today = checksToday();
  const ul = $("#checks");
  ul.replaceChildren();
  C.DAILY_CHECKS.forEach((c) => {
    const cb = el("input", { type: "checkbox", checked: !!today[c.id] });
    cb.addEventListener("change", () => {
      const a = store.get("checks", {});
      a[todayKey()] = { ...(a[todayKey()] || {}), [c.id]: cb.checked };
      store.set("checks", a);
      renderAll();
    });
    ul.append(el("li", {}, el("label", {}, cb, c.label)));
  });
  $("#bar").style.width = (checksDone() / C.DAILY_CHECKS.length) * 100 + "%";
  $("#streak").textContent = t("goals.streak", { d: checksDone(), n: C.DAILY_CHECKS.length, s: streak() });
}
onRender.push(renderChecks);

/* ---------- exercise ---------- */
function renderSport() {
  const week = $("#week");
  week.replaceChildren(...C.WEEK_PLAN.map(([d, x]) => el("tr", {}, el("td", { textContent: d }), el("td", { textContent: x }))));

  const warn = $("#sport-warn");
  warn.replaceChildren(el("h2", { textContent: t("sport.before") }));
  const ul = el("ul");
  ul.append(el("li", { textContent: t("sport.general") }));
  (profile.conds.length ? profile.conds : Object.keys(C.EXERCISE_WARNINGS)).forEach((k) => {
    if (C.EXERCISE_WARNINGS[k]) ul.append(el("li", { textContent: C.EXERCISE_WARNINGS[k] }));
  });
  warn.append(ul);

  $("#sport-list").replaceChildren(...C.EXERCISES.map((e) =>
    el("div", { className: "ex" },
      el("h3", { textContent: `${e.emoji} ${e.name}` }),
      el("div", { className: "meta", textContent: `${e.duration} · ${e.level}` }),
      el("p", { textContent: e.how }),
      el("p", { textContent: t("sport.benefit", { b: e.benefits }) }))));
}
onRender.push(renderSport);
