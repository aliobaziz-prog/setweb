"use strict";

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
