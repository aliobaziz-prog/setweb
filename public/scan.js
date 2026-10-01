"use strict";

const API_URL = window.VITAL_API_URL || "api/analyze";

async function shrinkImage(file, max = 1024) {
  const img = await createImageBitmap(file);
  const s = Math.min(1, max / Math.max(img.width, img.height));
  const canvas = el("canvas", { width: Math.round(img.width * s), height: Math.round(img.height * s) });
  canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
  img.close();
  return canvas.toDataURL("image/jpeg", 0.85);
}

const ERRORS = { 404: "scan.unavailable", 405: "scan.unavailable", 429: "scan.ratelimit", 503: "scan.overload" };

async function analyzePhoto(file) {
  const msg = $("#scan-msg");
  if (!file) return;
  if (!/^image\//.test(file.type)) { msg.textContent = t("scan.notimage"); return; }
  analysis = null;
  renderAnalysis();
  $("#scan-busy").hidden = false;
  msg.textContent = "";
  try {
    const photo = await shrinkImage(file);
    const res = await fetch(API_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ image: photo, lang: LANG }) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      msg.textContent = t(data.error === "not_food" ? "scan.notfood" : data.error === "not_configured" ? "scan.unavailable" : ERRORS[res.status] || "scan.error");
      return;
    }
    const items = data.items.filter((i) => i.grams > 0).map((i) => ({
      name: String(i.name).slice(0, 80),
      grams: true,
      amount: i.grams,
      per: Object.fromEntries(NK.map((k) => [k, Math.max(0, Number(i[k]) || 0) / i.grams])),
    }));
    if (!items.length) { msg.textContent = t("scan.notfood"); return; }
    showAnalysis(items, { confidence: data.confidence, photo });
  } catch {
    msg.textContent = t("scan.unavailable");
  } finally {
    $("#scan-busy").hidden = true;
  }
}

["#cam-input", "#gal-input"].forEach((id) =>
  $(id).addEventListener("change", (e) => {
    const f = e.target.files[0];
    e.target.value = "";
    analyzePhoto(f);
  })
);

$("#search-btn").addEventListener("click", () =>
  openFoodPicker(null, (f) => {
    closeDialog();
    showAnalysis([{ name: fname(f), emoji: f.emoji, fid: f.id, grams: false, unit: funit(f), amount: 1, per: f.n }]);
  })
);

function renderHome() {
  const box = $("#home-extra");
  box.replaceChildren();
  const btn = (label, cls, fn) => { const b = el("button", { type: "button", className: cls, textContent: label }); b.addEventListener("click", fn); return b; };

  if (!profile.conds.length) {
    box.append(el("div", { className: "card" }, el("h2", { textContent: t("home.welcome") }),
      el("p", { textContent: t("home.welcometext") }), btn(t("home.setup"), "btn alt", () => go("more", "profile"))));
  }

  const meters = el("div", { className: "meters" });
  box.append(el("div", { className: "card" }, el("h2", { textContent: t("home.today") }), meters,
    el("p", { className: "small", textContent: t("home.kcal", { k: nf(targets().kcal) }) }),
    btn(t("home.diary"), "btn alt", () => go("food", "diary"))));
  renderMeters(meters, totalsOf(entriesOf(todayKey())), ["kcal", "sug", "sat", "na"]);

  const day = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 864e5);
  const L = C.LESSONS[day % C.LESSONS.length];
  box.append(el("div", { className: "card lesson" }, el("h2", { textContent: t("home.lesson") }), el("h3", { textContent: L.t }), el("p", { textContent: L.b })));
}
onRender.push(renderHome, renderAnalysis);

renderAll();

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
