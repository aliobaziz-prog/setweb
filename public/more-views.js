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
  ["sex", "activity", "goal", "system"].forEach((id) => ($("#p-" + id).value = profile[id]));
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
  ["sex", "activity", "goal", "system"].forEach((id) =>
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
}
onRender.push(renderProfile);

/* ---------- data & privacy ---------- */
const DATA_KEYS = { profile: "object", diary: "object", customFoods: "array", recent: "array", checks: "object" };

$("#export-btn").addEventListener("click", () => {
  const data = { app: "vital40", version: 4, exported: new Date().toISOString() };
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
