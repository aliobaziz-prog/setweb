"use strict";

/* ---------- profile ---------- */
function setupProfile() {
  ["age", "weight", "height", "waist"].forEach((id) => ($("#p-" + id).value = profile[id]));
  ["sex", "activity", "goal", "units"].forEach((id) => ($("#p-" + id).value = profile[id]));
  ["age", "weight", "height", "waist", "sex", "activity", "goal", "units"].forEach((id) =>
    $("#p-" + id).addEventListener("input", () => {
      profile[id] = $("#p-" + id).value;
      saveProfile();
      renderAll();
    })
  );
  const box = $("#conditions");
  Object.entries(CONDITIONS).forEach(([k, c]) => {
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
  $$("#conditions button").forEach((b) => b.classList.toggle("on", has(b.dataset.k)));
  const b = bmiValue();
  let txt = "";
  if (b) {
    const c = b < 18.5 ? "نحافة، استشر طبيبك" : b >= 30 ? "سمنة ⚠️ خسارة 5–10% من الوزن تحسّن السكر والضغط والدهون كثيرًا" : b >= 25 ? "وزن زائد ⚠️ خسارة 5% من الوزن تحدث فرقًا كبيرًا" : "وزن طبيعي ✅";
    txt = `مؤشر كتلة الجسم: ${b.toFixed(1)} — ${c}`;
  }
  $("#bmi").textContent = txt;
  const t = targets();
  const ul = $("#targets");
  ul.replaceChildren(...METERS.map((m) => el("li", {}, el("span", { textContent: m.label }), el("b", { textContent: `${m.dir === "min" ? "≥" : "≤"} ${t[m.k]} ${m.unit}` }))));
  const ref = $("#ref");
  ref.replaceChildren(...REFERENCE.map(([a, c]) => el("tr", {}, el("td", { textContent: a }), el("td", { textContent: c }))));
}
onRender.push(renderProfile);

/* ---------- diabetes risk (FINDRISC) ---------- */
function setupRisk() {
  Object.entries(FIND_OPTS).forEach(([k, opts]) => {
    const s = $("#r-" + k);
    opts.forEach(([t, v]) => s.append(el("option", { value: v, textContent: t })));
  });
}
$("#risk-go").addEventListener("click", () => {
  const out = $("#risk-out");
  const age = +profile.age, b = bmiValue(), waist = +profile.waist;
  if (!(age > 0) || !b || !(waist > 0)) {
    out.textContent = "أكمل في «ملفي» العمر والوزن والطول ومحيط الخصر أولًا.";
    return;
  }
  let sc = age < 45 ? 0 : age < 55 ? 2 : age < 65 ? 3 : 4;
  sc += b < 25 ? 0 : b < 30 ? 1 : 3;
  const m = profile.sex === "m";
  sc += m ? (waist < 94 ? 0 : waist <= 102 ? 3 : 4) : waist < 80 ? 0 : waist <= 88 ? 3 : 4;
  Object.keys(FIND_OPTS).forEach((k) => (sc += +$("#r-" + k).value));
  const lv = sc < 7 ? ["ok", "منخفض", "نحو 1 من 100 يصاب خلال 10 سنوات"]
    : sc < 12 ? ["ok", "مرتفع قليلًا", "نحو 1 من 25"]
    : sc < 15 ? ["warn", "متوسط", "نحو 1 من 6"]
    : sc < 21 ? ["bad", "مرتفع", "نحو 1 من 3"]
    : ["bad", "مرتفع جدًا", "نحو 1 من 2"];
  out.className = `risk st-${lv[0]}`;
  out.replaceChildren(
    el("b", { className: "bigscore", textContent: `${sc} / 26` }),
    el("span", { className: "pill", textContent: `خطر ${lv[1]}` }),
    el("p", { textContent: `احتمال الإصابة بالسكري من النوع 2 خلال 10 سنوات: ${lv[2]} (تقدير إحصائي).` }),
    el("p", { className: "small", textContent: sc >= 12 ? "يُنصح بتحليل سكر صائم أو HbA1c عند الطبيب، مع تحسين الأكل والحركة وخسارة الوزن إن لزم." : "حافظ على نمط حياتك، وكرّر التحليل سنويًا بعد الأربعين." }),
    el("p", { className: "small", textContent: "هذا اختبار فنلندي (FINDRISC) للتوعية وليس تشخيصًا." })
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
  if (!meds.length) ul.append(el("li", { className: "small", textContent: "لم تضف أدوية بعد." }));
  meds.forEach((m) => {
    const cb = el("input", { type: "checkbox", checked: !!medsTaken()[m.id] });
    cb.addEventListener("change", () => {
      const log = store.get("medlog", {});
      log[todayKey()] = { ...(log[todayKey()] || {}), [m.id]: cb.checked };
      store.set("medlog", log);
      renderAll();
    });
    const del = el("button", { type: "button", className: "x", textContent: "✕", title: "حذف" });
    del.addEventListener("click", () => { store.set("meds", getMeds().filter((x) => x.id !== m.id)); renderAll(); });
    ul.append(el("li", {}, el("label", { className: "grow row" }, cb, el("span", { textContent: `💊 ${m.name}${m.dose ? " — " + m.dose : ""}` })), el("span", { className: "small", textContent: m.time }), del));
  });
  const nb = $("#notif-btn");
  nb.hidden = !("Notification" in window) || Notification.permission !== "default";
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
      try { new Notification("💊 وقت الدواء", { body: `${m.name}${m.dose ? " — " + m.dose : ""}` }); } catch { /* ignore */ }
    }
    renderAll();
  });
}
setInterval(medTick, 60000);

/* ---------- ramadan ---------- */
function renderRamadan() {
  const box = $("#ramadan");
  box.replaceChildren();
  const sec = (title, items, cls = "") => {
    const ul = el("ul");
    items.forEach((t) => ul.append(el("li", { textContent: t })));
    box.append(el("div", { className: `card ${cls}` }, el("h2", { textContent: title }), ul));
  };
  sec(has("diabetes") || has("bp") ? "⚠️ مهم جدًا لحالتك" : "⚠️ قبل الصيام", RAMADAN.warn, "warn");
  sec("🌙 الإفطار", RAMADAN.iftar);
  sec("🌅 السحور", RAMADAN.suhoor);
  sec("💡 نصائح", RAMADAN.tips);
}
onRender.push(renderRamadan);

/* ---------- doctor report ---------- */
function renderReport() {
  const box = $("#report");
  box.replaceChildren();
  const h = (t) => el("h3", { textContent: t });
  const p = (t) => el("p", { textContent: t });
  box.append(el("h2", { textContent: "تقرير صحي للطبيب" }), p(`التاريخ: ${todayKey()}`));
  const b = bmiValue();
  box.append(p(`العمر: ${profile.age || "—"} · الجنس: ${profile.sex === "m" ? "ذكر" : "أنثى"} · الوزن: ${profile.weight || "—"} كغ · الطول: ${profile.height || "—"} سم${b ? ` · BMI: ${b.toFixed(1)}` : ""}${profile.waist ? ` · الخصر: ${profile.waist} سم` : ""}`));
  box.append(p("الحالات: " + (profile.conds.length ? profile.conds.map((k) => CONDITIONS[k].label).join("، ") : "غير محددة")));

  box.append(h("الأدوية"));
  box.append(p(getMeds().length ? getMeds().map((m) => `${m.name}${m.dose ? " " + m.dose : ""} (${m.time})`).join(" · ") : "—"));

  box.append(h("القياسات (آخر 30 يومًا)"));
  const tb = el("table");
  tb.append(el("tr", {}, ...["القياس", "عدد", "المتوسط", "الأدنى", "الأعلى", "ضمن الهدف", "آخر قراءة"].map((x) => el("th", { textContent: x }))));
  let any = false;
  Object.entries(RTYPES).forEach(([k, v]) => {
    const s = stats(k, 30), l = latest(k);
    if (!s && !l) return;
    any = true;
    const f = (x) => fmtVal(k, x);
    tb.append(el("tr", {}, ...[
      `${v.label} (${unitOf(k)})`, s ? s.n : "—",
      s ? (k === "bp" ? `${Math.round(s.avg)}/${Math.round(s.avg2)}` : f(s.avg)) : "—",
      s && k !== "bp" ? f(s.min) : "—", s && k !== "bp" ? f(s.max) : s ? Math.round(s.max) : "—",
      s && k !== "weight" ? s.pct + "%" : "—", l ? `${fmtReading(l)} (${fmtD(l.ts)})` : "—",
    ].map((x) => el("td", { textContent: String(x) }))));
  });
  box.append(any ? el("div", { className: "scroll" }, tb) : p("لا قياسات مسجلة."));

  const days = [];
  for (let i = 0; i < 7; i++) { const d = new Date(); d.setDate(d.getDate() - i); const e = entriesOf(dkey(d)); if (e.length) days.push(totalsOf(e)); }
  box.append(h("متوسط الأكل (أيام مسجلة من آخر 7)"));
  if (days.length) {
    const a = (k) => Math.round(avg(days.map((d) => d[k])));
    box.append(p(`${days.length} أيام: ${a("kcal")} kcal · كربوهيدرات ${a("carb")} غ · سكر مضاف ${a("sug")} غ · دهون مشبعة ${a("sat")} غ · صوديوم ${a("na")} مغ · ألياف ${a("fib")} غ`));
  } else box.append(p("لا وجبات مسجلة."));
  box.append(el("p", { className: "small", textContent: "تقرير مولّد من بيانات أدخلها المستخدم ولا يُعد تشخيصًا." }));
}
onRender.push(renderReport);
$("#print-btn").addEventListener("click", () => window.print());

setupProfile();
setupRisk();
