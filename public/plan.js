"use strict";

let planCond = profile.conds[0] || "diabetes";

function planLists(c) {
  const lv = { eat: [], limit: [], avoid: [] };
  C.FOODS.forEach((f) => {
    if ((f.avoid || []).includes(c)) lv.avoid.push(f);
    else if ((f.limit || []).includes(c)) lv.limit.push(f);
    else if ((f.good || []).includes(c)) lv.eat.push(f);
  });
  return lv;
}

function planSpeech(c) {
  const cd = C.CONDITIONS[c], co = C.COACH[c], lv = planLists(c);
  const names = (fs) => fs.map((f) => f.name).join(LISTSEP);
  return [
    t("plan.heading", { c: cd.label }) + ".",
    co.intro,
    `${t("plan.eat")}: ${names(lv.eat)}.`,
    lv.limit.length ? `${t("plan.limit")}: ${names(lv.limit)}.` : "",
    lv.avoid.length ? `${t("plan.avoid")}: ${names(lv.avoid)}.` : "",
    `${t("plan.day")}.`,
    ...co.day.map(([m, x]) => `${m}: ${x}.`),
    `${t("plan.moves")}.`,
    ...co.moves.map(([w, x]) => `${w}: ${x}.`),
    C.EXERCISE_WARNINGS[c] || "",
  ].filter(Boolean).join("\n");
}

function renderPlan() {
  const chips = $("#plan-chips");
  chips.replaceChildren(...Object.entries(C.CONDITIONS).map(([k, c]) => {
    const b = el("button", { type: "button", textContent: `${c.emoji} ${c.label}` });
    b.classList.toggle("on", k === planCond);
    b.addEventListener("click", () => { stopSpeaking(); planCond = k; renderPlan(); });
    return b;
  }));

  const c = planCond, cd = C.CONDITIONS[c], co = C.COACH[c], lv = planLists(c);
  const box = $("#plan-body");
  const msg = el("p", { className: "small", ariaLive: "polite" });
  const foodList = (fs) => el("ul", { className: "planfoods" }, ...fs.map((f) => el("li", {}, el("span", { textContent: f.emoji }), el("span", { textContent: f.name }))));
  const sec = (title, cls, ...kids) => el("div", { className: `card ${cls}` }, el("h2", { textContent: title }), ...kids);
  const rows = (pairs) => el("table", {}, el("tbody", {}, ...pairs.map(([a, b]) => el("tr", {}, el("td", { textContent: a }), el("td", { textContent: b })))));

  box.replaceChildren(
    el("div", { className: "card planhead" },
      el("h2", { textContent: `${cd.emoji} ${t("plan.heading", { c: cd.label })}` }),
      el("p", { textContent: co.intro }),
      listenButton(() => planSpeech(c), msg), msg),
    sec(t("plan.eat"), "lv-good plansec", foodList(lv.eat)),
    lv.limit.length ? sec(t("plan.limit"), "lv-limit plansec", foodList(lv.limit)) : "",
    lv.avoid.length ? sec(t("plan.avoid"), "lv-occasional plansec", foodList(lv.avoid)) : "",
    sec(t("plan.day"), "", rows(co.day)),
    sec(t("plan.moves"), "", rows(co.moves), el("p", { className: "small", textContent: C.EXERCISE_WARNINGS[c] || "" })),
  );
}
renderPlan();
