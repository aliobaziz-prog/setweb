"use strict";

const VOICE_LANG = { en: "en-US", fr: "fr-FR", ar: "ar-SA" };
const canSpeak = "speechSynthesis" in window;
let speakingBtn = null;

function langVoice() {
  return speechSynthesis.getVoices().find((v) => v.lang.replace("_", "-").toLowerCase().startsWith(LANG)) || null;
}

function stopSpeaking() {
  if (canSpeak) speechSynthesis.cancel();
  if (speakingBtn) speakingBtn.textContent = t("voice.listen");
  speakingBtn = null;
}

function speak(text, btn, msgEl) {
  if (speakingBtn === btn) return stopSpeaking();
  stopSpeaking();
  const voices = speechSynthesis.getVoices();
  const voice = langVoice();
  if (msgEl) msgEl.textContent = voices.length && !voice ? t("voice.novoice") : "";
  // Chrome cuts long utterances, so speak sentence by sentence.
  const parts = text.replace(/\p{Extended_Pictographic}|️/gu, "").split(/(?<=[.!?؟:])\s+|\n+/).map((s) => s.trim()).filter(Boolean);
  if (!parts.length) return;
  speakingBtn = btn;
  btn.textContent = t("voice.stop");
  parts.forEach((p, i) => {
    const u = new SpeechSynthesisUtterance(p);
    u.lang = VOICE_LANG[LANG];
    if (voice) u.voice = voice;
    u.rate = 0.95;
    if (i === parts.length - 1) u.onend = u.onerror = () => { if (speakingBtn === btn) stopSpeaking(); };
    speechSynthesis.speak(u);
  });
}

function listenButton(getText, msgEl) {
  const b = el("button", { type: "button", className: "btn listen", textContent: t("voice.listen") });
  b.hidden = !canSpeak;
  b.addEventListener("click", () => speak(getText(), b, msgEl));
  return b;
}

if (canSpeak) {
  speechSynthesis.getVoices();
  window.addEventListener("pagehide", stopSpeaking);
}
