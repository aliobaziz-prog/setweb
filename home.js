"use strict";

function alertsFor() {
  const out = [];
  const g = latest("glucose");
  if (g && Date.now() - g.ts < 864e5 && g.v < 70) out.push("🩸 آخر قراءة سكر منخفضة: تناول 15 غ سكر سريع (3 تمرات أو نصف كوب عصير) وأعد القياس بعد 15 دقيقة.");
  if (g && Date.now() - g.ts < 864e5 && g.v >= 300) out.push("🩸 آخر قراءة سكر مرتفعة جدًا: اشرب ماء وتواصل مع طبيبك، وإن ظهرت أعراض (قيء، عطش شديد، دوخة) فاطلب المساعدة الطبية.");
  const bp = latest("bp");
  if (bp && Date.now() - bp.ts < 864e5 && (bp.v >= 180 || bp.v2 >= 120)) out.push("❤️ آخر قراءة ضغط مرتفعة جدًا: أعد القياس بعد راحة، وإن بقيت مرتفعة أو ظهرت أعراض فاطلب الطوارئ.");
  dueMeds().forEach((m) => out.push(`💊 حان وقت دوائك: ${m.name}${m.dose ? " — " + m.dose : ""}`));
  return out;
}

function renderHome() {
  const box = $("#home");
  box.replaceChildren();

  const al = alertsFor();
  if (al.length) {
    const c = el("div", { className: "card warn" });
    al.forEach((t) => c.append(el("p", { className: "alert", textContent: t })));
    box.append(c);
  }

  if (!profile.age || !profile.weight || !profile.height || !profile.conds.length) {
    const b = el("button", { type: "button", className: "btn", textContent: "أكمل ملفي ←" });
    b.addEventListener("click", () => go("more", "profile"));
    box.append(el("div", { className: "card" }, el("h2", { textContent: "👋 أهلًا بك" }),
      el("p", { textContent: "أدخل عمرك ووزنك وحالتك الصحية لتحصل على أهداف غذائية مخصصة لك." }), b));
  }

  const meters = el("div", { className: "meters" });
  const add = el("button", { type: "button", className: "btn", textContent: "＋ أضف وجبة" });
  add.addEventListener("click", () => go("food", "diary"));
  const t = targets();
  box.append(el("div", { className: "card" }, el("h2", { textContent: "📓 اليوم" }), meters,
    el("p", { className: "small", textContent: `هدفك التقريبي: ${t.kcal} سعرة يوميًا` }), add));
  renderMeters(meters, totalsOf(entriesOf(todayKey())), ["kcal", "na", "sug", "sat"]);

  const chips = el("div", { className: "latest" });
  ["glucose", "bp", "weight", "ldl", "tg", "a1c"].forEach((k) => {
    const l = latest(k);
    if (!l) return;
    const st = statusOf(l);
    const b = el("button", { type: "button", className: `lchip st-${st.cls}` },
      el("small", { textContent: RTYPES[k].label }), el("b", { textContent: fmtReading(l) }), el("small", { textContent: st.label }));
    b.addEventListener("click", () => { viewType = k; renderAll(); go("track", "readings"); });
    chips.append(b);
  });
  const addm = el("button", { type: "button", className: "btn alt", textContent: "＋ سجّل قياسًا" });
  addm.addEventListener("click", () => go("track", "readings"));
  box.append(el("div", { className: "card" }, el("h2", { textContent: "📈 آخر قياساتي" }),
    chips.children.length ? chips : el("p", { className: "small", textContent: "لم تسجل قياسات بعد." }), addm));

  const bar = el("div"); bar.style.width = (checksDone() / DAILY_CHECKS.length) * 100 + "%";
  const gb = el("button", { type: "button", className: "btn alt", textContent: "أهداف اليوم" });
  gb.addEventListener("click", () => go("track", "goals"));
  box.append(el("div", { className: "card" }, el("h2", { textContent: "✅ أهدافي" }),
    el("div", { className: "progress" }, bar),
    el("p", { className: "small", textContent: `${checksDone()}/${DAILY_CHECKS.length} اليوم · أيام متتالية: ${streak()} 🔥` }), gb));

  const day = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 864e5);
  const L = LESSONS[day % LESSONS.length];
  box.append(el("div", { className: "card lesson" }, el("h2", { textContent: "💡 معلومة اليوم" }), el("h3", { textContent: L.t }), el("p", { textContent: L.b })));
}
onRender.push(renderHome);

renderAll();
setTimeout(medTick, 1500);

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
