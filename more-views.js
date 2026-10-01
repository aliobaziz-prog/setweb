"use strict";

/* ---------- profile ---------- */
const BODY = { weight: [kgOut, kgIn], height: [cmOut, cmIn], waist: [cmOut, cmIn] };

function fillBodyInputs() {
  Object.entries(BODY).forEach(([id, [out]]) => {
    const v = parseFloat(profile[id]);
    $("#p-" + id).value = v > 0 ? Math.round(out(v) * 10) / 10 : "";
  });
}

function setupProfile() {
  $("#p-age").value = profile.age;
  ["sex", "activity", "goal", "units", "system"].forEach((id) => ($("#p-" + id).value = profile[id]));
  fillBodyInputs();
  $("#p-age").addEventListener("input", () => { profile.age = $("#p-age").value; saveProfile(); renderAll(); });
  Object.entries(BODY).forEach(([id, [, inp]]) =>
    $("#p-" + id).addEventListener("input", () => {
      const v = parseFloat($("#p-" + id).value);
      profile[id] = v > 0 ? String(Math.round(inp(v) * 10) / 10) : "";
      saveProfile();
      renderAll();
    })
  );
  ["sex", "activity", "goal", "units", "system"].forEach((id) =>
    $("#p-" + id).addEventListener("change", () => {
      profile[id] = $("#p-" + id).value;
      saveProfile();
      if (id === "system") fillBodyInputs();
      renderAll();
    })
  );
  const box = $("#conditions");
  Object.entries(C.CONDITIONS).forEach(([k, c]) => {
    const b = el("button", { type: "button", textContent: `${c.emoji} ${c.label}` });
    b.dataset.k = k;
    b.addEventListener("click", () => {
      profile.conds = has(k) ? profile.conds.filter((x) => x !== k) : [...profile.conds, k];
      saveProfile();
      renderAll();
    });
    box.append(b);
  });
}

function renderProfile() {
  $("#lbl-weight").textContent = t("p.weight", { u: wUnit() });
  $("#lbl-height").textContent = t("p.height", { u: lUnit() });
  $("#lbl-waist").textContent = t("p.waist", { u: lUnit() });
  $$("#conditions button").forEach((b) => b.classList.toggle("on", has(b.dataset.k)));
  const b = bmiValue();
  $("#bmi").textContent = b ? t("bmi.line", { v: nf(b, 1), c: t(b < 18.5 ? "bmi.under" : b >= 30 ? "bmi.obese" : b >= 25 ? "bmi.over" : "bmi.normal") }) : "";
  const tg = targets();
  $("#targets").replaceChildren(...METERS.map((m) => el("li", {}, el("span", { textContent: t("n." + m.k) }), el("b", { textContent: `${m.dir === "min" ? "≥" : "≤"} ${nf(tg[m.k])} ${nunit(m.k)}` }))));
  $("#ref").replaceChildren(...C.REFERENCE.map(([a, c]) => el("tr", {}, el("td", { textContent: a }), el("td", { textContent: c }))));
}
onRender.push(renderProfile);

/* ---------- diabetes risk (FINDRISC) ---------- */
function setupRisk() {
  Object.entries(C.FIND_OPTS).forEach(([k, opts]) => {
    const s = $("#r-" + k);
    opts.forEach(([x, v]) => s.append(el("option", { value: v, textContent: x })));
  });
}
$("#risk-go").addEventListener("click", () => {
  const out = $("#risk-out");
  const age = +profile.age, b = bmiValue(), waist = +profile.waist;
  if (!(age > 0) || !b || !(waist > 0)) {
    out.className = "risk";
    out.textContent = t("risk.need");
    return;
  }
  let sc = age < 45 ? 0 : age < 55 ? 2 : age < 65 ? 3 : 4;
  sc += b < 25 ? 0 : b < 30 ? 1 : 3;
  sc += profile.sex === "m" ? (waist < 94 ? 0 : waist <= 102 ? 3 : 4) : waist < 80 ? 0 : waist <= 88 ? 3 : 4;
  Object.keys(C.FIND_OPTS).forEach((k) => (sc += +$("#r-" + k).value));
  const lv = sc < 7 ? ["ok", "low", "1/100"] : sc < 12 ? ["ok", "slight", "1/25"] : sc < 15 ? ["warn", "moderate", "1/6"] : sc < 21 ? ["bad", "high", "1/3"] : ["bad", "vhigh", "1/2"];
  out.className = `risk st-${lv[0]}`;
  out.replaceChildren(
    el("b", { className: "bigscore", textContent: `${sc} / 26` }),
    el("span", { className: "pill", textContent: t("risk.lv." + lv[1]) }),
    el("p", { textContent: t("risk.prob", { p: lv[2] }) }),
    el("p", { className: "small", textContent: t(sc >= 12 ? "risk.adv.high" : "risk.adv.low") }),
    el("p", { className: "small", textContent: t("risk.note") })
  );
});

/* ---------- medications ---------- */
const getMeds = () => store.get("meds", []);
const medsTaken = () => (store.get("medlog", {})[todayKey()] || {});
const nowHM = () => { const d = new Date(); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; };
const dueMeds = () => getMeds().filter((m) => !medsTaken()[m.id] && m.time <= nowHM());

$("#mform").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("#m-name").value.trim();
  if (!name) return;
  store.set("meds", [...getMeds(), { id: Date.now(), name: name.slice(0, 60), dose: $("#m-dose").value.trim().slice(0, 40), time: $("#m-time").value || "08:00" }].sort((a, b) => a.time.localeCompare(b.time)));
  $("#m-name").value = $("#m-dose").value = "";
  renderAll();
});

function renderMeds() {
  const ul = $("#medlist");
  ul.replaceChildren();
  const meds = getMeds();
  if (!meds.length) ul.append(el("li", { className: "small", textContent: t("meds.none") }));
  meds.forEach((m) => {
    const cb = el("input", { type: "checkbox", checked: !!medsTaken()[m.id] });
    cb.addEventListener("change", () => {
      const log = store.get("medlog", {});
      log[todayKey()] = { ...(log[todayKey()] || {}), [m.id]: cb.checked };
      store.set("medlog", log);
      renderAll();
    });
    const del = el("button", { type: "button", className: "x", textContent: "✕", title: t("btn.delete"), ariaLabel: t("btn.delete") });
    del.addEventListener("click", () => { store.set("meds", getMeds().filter((x) => x.id !== m.id)); renderAll(); });
    ul.append(el("li", {}, el("label", { className: "grow row" }, cb, el("span", { textContent: `💊 ${m.name}${m.dose ? " — " + m.dose : ""}` })), el("span", { className: "small", textContent: m.time }), del));
  });
  $("#notif-btn").hidden = !("Notification" in window) || Notification.permission !== "default";
}
$("#notif-btn").addEventListener("click", async () => {
  try { await Notification.requestPermission(); } catch { /* unsupported */ }
  renderMeds();
});
onRender.push(renderMeds);

const notified = new Set();
function medTick() {
  dueMeds().forEach((m) => {
    const key = todayKey() + m.id;
    if (notified.has(key)) return;
    notified.add(key);
    if ("Notification" in window && Notification.permission === "granted") {
      try { new Notification(t("meds.notif"), { body: `${m.name}${m.dose ? " — " + m.dose : ""}` }); } catch { /* ignore */ }
    }
    renderAll();
  });
}
setInterval(medTick, 60000);

/* ---------- fasting (Ramadan) ---------- */
function renderFasting() {
  const box = $("#ramadan");
  box.replaceChildren();
  const sec = (title, items, cls = "") => {
    const ul = el("ul");
    items.forEach((x) => ul.append(el("li", { textContent: x })));
    box.append(el("div", { className: `card ${cls}` }, el("h2", { textContent: title }), ul));
  };
  sec(t(has("diabetes") || has("bp") ? "fast.warnyou" : "fast.warn"), C.RAMADAN.warn, "warn");
  sec(t("fast.iftar"), C.RAMADAN.iftar);
  sec(t("fast.suhoor"), C.RAMADAN.suhoor);
  sec(t("fast.tips"), C.RAMADAN.tips);
}
onRender.push(renderFasting);

/* ---------- doctor report ---------- */
function renderReport() {
  const box = $("#report");
  box.replaceChildren();
  const h = (x) => el("h3", { textContent: x });
  const p = (x) => el("p", { textContent: x });
  box.append(el("h2", { textContent: t("rep.title") }), p(fmtLong(new Date())));
  const b = bmiValue();
  const w = +profile.weight, ht = +profile.height, ws = +profile.waist;
  box.append(p([
    `${t("p.age")}${COLON}${profile.age || "—"}`,
    `${t("p.sex")}${COLON}${t(profile.sex === "m" ? "sex.m" : "sex.f")}`,
    `${t("rt.weight")}${COLON}${w ? nf(kgOut(w), 1) + " " + wUnit() : "—"}`,
    `${t("rep.height")}${COLON}${ht ? nf(cmOut(ht), IMP() ? 1 : 0) + " " + lUnit() : "—"}`,
    b ? `BMI${COLON}${nf(b, 1)}` : "",
    ws ? `${t("rep.waist")}${COLON}${nf(cmOut(ws), IMP() ? 1 : 0)} ${lUnit()}` : "",
  ].filter(Boolean).join(" · ")));
  box.append(p(`${t("rep.conds")}${COLON}${profile.conds.length ? profile.conds.map((k) => C.CONDITIONS[k].label).join(LISTSEP) : "—"}`));

  box.append(h(t("rep.meds")));
  box.append(p(getMeds().length ? getMeds().map((m) => `${m.name}${m.dose ? " " + m.dose : ""} (${m.time})`).join(" · ") : "—"));

  box.append(h(t("rep.readings")));
  const tb = el("table");
  tb.append(el("tr", {}, ...["rep.col.type", "rep.col.n", "rep.col.avg", "rep.col.min", "rep.col.max", "rep.col.inrange", "rep.col.last"].map((k) => el("th", { textContent: t(k) }))));
  let any = false;
  Object.keys(RTYPES).forEach((k) => {
    const s = stats(k, 30), l = latest(k);
    if (!s && !l) return;
    any = true;
    const f = (x) => fmtVal(k, x);
    tb.append(el("tr", {}, ...[
      `${rlabel(k)} (${unitOf(k)})`, s ? s.n : "—",
      s ? (k === "bp" ? `${Math.round(s.avg)}/${Math.round(s.avg2)}` : f(s.avg)) : "—",
      s && k !== "bp" ? f(s.min) : "—",
      s ? (k === "bp" ? nf(s.max) : f(s.max)) : "—",
      s && k !== "weight" ? s.pct + "%" : "—",
      l ? `${fmtReading(l)} (${fmtD(l.ts)})` : "—",
    ].map((x) => el("td", { textContent: String(x) }))));
  });
  box.append(any ? el("div", { className: "scroll" }, tb) : p(t("rep.noreadings")));

  const days = [];
  for (let i = 0; i < 7; i++) { const d = new Date(); d.setDate(d.getDate() - i); const e = entriesOf(dkey(d)); if (e.length) days.push(totalsOf(e)); }
  box.append(h(t("rep.food")));
  if (days.length) {
    const a = (k) => nf(Math.round(avg(days.map((d) => d[k]))));
    box.append(p(t("rep.foodline", { d: days.length, kcal: a("kcal"), carb: a("carb"), sug: a("sug"), sat: a("sat"), na: a("na"), fib: a("fib") })));
  } else box.append(p(t("rep.nofood")));
  box.append(el("p", { className: "small", textContent: t("rep.foot") }));
}
onRender.push(renderReport);
$("#print-btn").addEventListener("click", () => window.print());

/* ---------- data & privacy ---------- */
const DATA_KEYS = { profile: "object", diary: "object", customFoods: "array", recent: "array", readings: "array", checks: "object", meds: "array", medlog: "object" };

$("#export-btn").addEventListener("click", () => {
  const data = { app: "vital40", version: 3, exported: new Date().toISOString() };
  Object.keys(DATA_KEYS).forEach((k) => { const v = store.get(k, null); if (v !== null) data[k] = v; });
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
  const a = el("a", { href: url, download: `vital40-backup-${todayKey()}.json` });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

$("#import-file").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  e.target.value = "";
  if (!file) return;
  const msg = $("#data-msg");
  try {
    if (file.size > 5e6) throw new Error("too big");
    const data = JSON.parse(await file.text());
    if (!data || data.app !== "vital40") throw new Error("not ours");
    const ok = Object.entries(DATA_KEYS).filter(([k, ty]) => k in data && (ty === "array" ? Array.isArray(data[k]) : data[k] && typeof data[k] === "object" && !Array.isArray(data[k])));
    if (!ok.length || !confirm(t("data.importconfirm"))) return;
    ok.forEach(([k]) => store.set(k, data[k]));
    location.reload();
  } catch {
    msg.textContent = t("data.importfail");
  }
});

$("#wipe-btn").addEventListener("click", () => {
  if (!confirm(t("data.wipeconfirm"))) return;
  Object.keys(DATA_KEYS).forEach((k) => { try { localStorage.removeItem(k); } catch { /* ignore */ } });
  location.reload();
});

setupProfile();
setupRisk();
