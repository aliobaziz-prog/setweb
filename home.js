"use strict";

function alertsFor() {
  const out = [];
  const recent = (r) => r && Date.now() - r.ts < 864e5;
  const g = latest("glucose");
  if (recent(g) && g.v < 70) out.push("🩸 " + t("alert.hypo"));
  if (recent(g) && g.v >= 300) out.push("🩸 " + t("alert.hyper"));
  const bp = latest("bp");
  if (recent(bp) && (bp.v >= 180 || bp.v2 >= 120)) out.push("❤️ " + t("alert.bpcrisis"));
  dueMeds().forEach((m) => out.push(t("alert.med", { m: `${m.name}${m.dose ? " — " + m.dose : ""}` })));
  return out;
}

function renderHome() {
  const box = $("#home");
  box.replaceChildren();
  const btn = (label, cls, fn) => { const b = el("button", { type: "button", className: cls, textContent: label }); b.addEventListener("click", fn); return b; };

  const al = alertsFor();
  if (al.length) box.append(el("div", { className: "card warn" }, ...al.map((x) => el("p", { className: "alert", textContent: x }))));

  if (!profile.age || !profile.weight || !profile.height || !profile.conds.length) {
    box.append(el("div", { className: "card" }, el("h2", { textContent: t("home.welcome") }),
      el("p", { textContent: t("home.welcometext") }), btn(t("home.setup"), "btn", () => go("more", "profile"))));
  }

  const meters = el("div", { className: "meters" });
  box.append(el("div", { className: "card" }, el("h2", { textContent: t("home.today") }), meters,
    el("p", { className: "small", textContent: t("home.kcal", { k: nf(targets().kcal) }) }),
    btn(t("home.addmeal"), "btn", () => go("food", "diary"))));
  renderMeters(meters, totalsOf(entriesOf(todayKey())), ["kcal", "na", "sug", "sat"]);

  const chips = el("div", { className: "latest" });
  ["glucose", "bp", "weight", "ldl", "tg", "a1c"].forEach((k) => {
    const l = latest(k);
    if (!l) return;
    const st = statusOf(l);
    chips.append(btn("", `lchip st-${st.cls}`, () => { viewType = k; renderAll(); go("track", "readings"); }));
    chips.lastChild.append(el("small", { textContent: rlabel(k) }), el("b", { textContent: fmtReading(l) }), el("small", { textContent: st.label }));
  });
  box.append(el("div", { className: "card" }, el("h2", { textContent: t("home.latest") }),
    chips.children.length ? chips : el("p", { className: "small", textContent: t("home.noreadings") }),
    btn(t("home.log"), "btn alt", () => go("track", "readings"))));

  const bar = el("div");
  bar.style.width = (checksDone() / C.DAILY_CHECKS.length) * 100 + "%";
  box.append(el("div", { className: "card" }, el("h2", { textContent: t("home.goals") }),
    el("div", { className: "progress" }, bar),
    el("p", { className: "small", textContent: t("goals.streak", { d: checksDone(), n: C.DAILY_CHECKS.length, s: streak() }) + " 🔥" }),
    btn(t("home.goalsbtn"), "btn alt", () => go("track", "goals"))));

  const day = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 864e5);
  const L = C.LESSONS[day % C.LESSONS.length];
  box.append(el("div", { className: "card lesson" }, el("h2", { textContent: t("home.lesson") }), el("h3", { textContent: L.t }), el("p", { textContent: L.b })));
}
onRender.push(renderHome);

renderAll();
setTimeout(medTick, 1500);

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
