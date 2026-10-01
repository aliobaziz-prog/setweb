# Vital 40+

Snap a photo of your meal — Vital 40+ estimates what's in it (calories, net carbs, added sugar, saturated fat,
sodium, cholesterol, fiber) and suggests a portion that fits your health focus: blood sugar, blood pressure & salt,
cholesterol, triglycerides or thyroid. Available in English, Français and العربية.

The app is designed as a **general wellness / healthy-eating tool**: it gives nutrition information and portion tips.
It does not record or interpret medical readings, diagnose, or give medication advice.

## Features
- **Meal photo analysis** — Claude (Anthropic) identifies each food, estimates its weight and nutrients.
  Users can correct the grams; advice updates instantly.
- **Portion advice per health focus** — e.g. "Blood sugar: net carbs 62 g in this portion — suggested portion about 170 g".
- **Food search** — 97 common foods (American, European, Mediterranean, North African) when no photo is handy.
- **Food diary** with daily targets, eat / limit / occasional guide, meal ideas, daily habits, exercise plan, daily tips.
- **Privacy** — profile and diary stay on the device; photos are sent only for analysis and not stored by the app.
  Export / import / delete-all (GDPR).

## Run it
Requires Node.js 20+ and an Anthropic API key.

```
npm install
ANTHROPIC_API_KEY=sk-ant-... npm start
```

Then open `http://localhost:8000`. Optional settings: `PORT`, `RATE_LIMIT_PER_HOUR` (photo analyses per IP, default 30).

Without an API key the app still works — photo analysis shows "not available" and users can search foods instead.

## Deploy
Any Node host works (Render, Railway, Fly.io, a VPS). Set `ANTHROPIC_API_KEY` as a secret environment variable — never put it in the code.

## Project layout
| Path | Purpose |
|---|---|
| `server.js` | Serves `public/` and the `/api/analyze` endpoint (photo → Claude → structured nutrients), with per-IP rate limiting |
| `public/scan.js` | Camera / gallery / search, image resizing, API call |
| `public/advice.js` | Portion advice engine (nutrient caps per health focus) and the result card |
| `public/i18n.js`, `public/content-*.js` | Interface strings and health content in en / fr / ar |
| `public/foods.js` | Nutrient database |
| `public/core.js`, `food-views.js`, `habits.js`, `more-views.js` | Profile, diary, guide, habits, privacy screens |

## Disclaimer
Vital 40+ gives general nutrition information to support healthy eating. It is not a medical device and does not
diagnose, treat or replace advice from a doctor or dietitian. Photo estimates are approximate.
