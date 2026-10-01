# Vital 40+

A private, multilingual (English · Français · العربية) health app for adults over 40 who want to prevent or manage
**high cholesterol, high triglycerides, high blood pressure, type 2 diabetes and thyroid problems** through food, exercise and tracking.

It combines what the leading apps do separately — Cronometer / DASH (nutrient diary), mySugr / Qardio (readings & charts),
Glooko (doctor report), Noom / Omada (daily lessons) — in one app that handles several conditions at once.

## Features
- **Food diary** — 97 foods (American, European, Mediterranean, North African) with calories, carbs, added sugar, saturated fat,
  sodium, cholesterol and fiber, compared against daily targets personalized to your age, weight, activity and conditions. Custom foods supported.
- **Readings & labs** — blood sugar, blood pressure, weight, HbA1c, LDL, HDL, total cholesterol, triglycerides. Color-coded ranges
  (ADA / ACC-AHA / ESC), trend charts, 30-day stats, estimated HbA1c, safety alerts for dangerous readings.
- **Units** — mg/dL, mmol/L or g/L for labs; kg/cm or lb/in for the body. Defaults follow the user's region (US, UK/EU, France).
- **What to eat** — eat / limit / avoid lists adapted to the selected conditions; healthy plate; meal ideas.
- **Exercise** — 8 beginner-friendly exercises, a weekly plan and condition-specific safety notes.
- **Medications** — schedule, daily check-off and reminders.
- **Diabetes risk test** — FINDRISC.
- **Doctor report** — 30-day summary, printable / save as PDF.
- **Fasting mode** — Ramadan guidance for people with diabetes or high blood pressure.
- **Privacy by design** — no account, no server, no tracking. Data stays on the device; export / import backup and "delete all my data" (GDPR).
- Works offline (PWA), installable on phone home screens, light & dark mode.

## Run locally
Static site, no build step:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Project layout
| File | Purpose |
|---|---|
| `i18n.js` | Language detection and all interface strings (en/fr/ar) |
| `content-en.js`, `content-fr.js`, `content-ar.js` | Health content per language (advice, food guide, menus, exercises, lessons) |
| `foods.js` | Nutrient database (names in 3 languages) |
| `core.js` | Profile, targets, units, status ranges, navigation |
| `food-views.js`, `track-views.js`, `more-views.js`, `home.js` | Screens |

## Disclaimer
Vital 40+ provides general health information and is not a medical device. Nutrient values are approximate.
It does not replace advice from a doctor or dietitian.
