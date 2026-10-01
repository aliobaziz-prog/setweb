"use strict";

const LANGS = { en: "English", fr: "Français", ar: "العربية" };
const CONTENT = {};
const LANG = (() => {
  try { const s = JSON.parse(localStorage.getItem("lang")); if (LANGS[s]) return s; } catch { /* ignore */ }
  const n = (navigator.language || "en").slice(0, 2).toLowerCase();
  return LANGS[n] ? n : "en";
})();
const DIR = LANG === "ar" ? "rtl" : "ltr";
const COLON = LANG === "fr" ? " : " : ": ";
const LISTSEP = LANG === "ar" ? "، " : ", ";
const LOCALE = LANG === "ar" ? "ar-u-nu-latn" : (navigator.language || "").toLowerCase().startsWith(LANG) ? navigator.language : LANG;

const STR = {
  en: {
    "app.name": "Vital 40+",
    "app.tagline": "Food, blood sugar, blood pressure and cholesterol — in one private app",
    "nav.home": "Home", "nav.food": "Food", "nav.track": "Health", "nav.sport": "Exercise", "nav.more": "More",
    "sub.diary": "📓 Food diary", "sub.guide": "🍎 What to eat", "sub.menu": "🍽️ Meal ideas",
    "sub.readings": "📈 Readings & labs", "sub.goals": "✅ Daily goals",
    "sub.profile": "👤 My profile", "sub.risk": "🎯 Diabetes risk", "sub.meds": "💊 Medications", "sub.report": "📄 Doctor report", "sub.fasting": "🌙 Fasting", "sub.data": "🔒 Data & privacy",

    "diary.prev": "Previous day", "diary.next": "Next day", "diary.today": "Today",
    "diary.addfood": "＋ Add food", "diary.notes": "Today's insights", "diary.approx": "Nutrition values are approximate and vary with recipe and portion.",
    "meal.bf": "Breakfast", "meal.lunch": "Lunch", "meal.dinner": "Dinner", "meal.snack": "Snacks",
    "n.kcal": "Calories", "n.carb": "Carbs", "n.fib": "Fiber", "n.sug": "Added sugar", "n.pro": "Protein", "n.sat": "Saturated fat", "n.chol": "Dietary cholesterol", "n.na": "Sodium (salt)",
    "u.g": "g", "u.mg": "mg", "u.kg": "kg", "u.lb": "lb", "u.cm": "cm", "u.in": "in", "u.mgdl": "mg/dL", "u.mmol": "mmol/L", "u.gl": "g/L",
    "flag.salt": "High salt", "flag.sugar": "Added sugar", "flag.sat": "Sat. fat", "flag.fiber": "Fiber ✓",
    "pick.title": "Add to {meal}", "pick.search": "Search: oatmeal, salmon, pizza…", "pick.none": "No results. Add your own food below.", "pick.custom": "＋ Not listed? Add it",
    "qty.label": "Servings (1 serving = {unit})",
    "custom.title": "New food (values per serving)", "custom.name": "Food name", "custom.unit": "Serving (e.g. bowl, piece)", "custom.unitdef": "serving",
    "btn.add": "Add", "btn.back": "← Back", "btn.close": "Close", "btn.save": "Save", "btn.saveNext": "Save & continue", "btn.delete": "Delete",
    "note.empty": "Log your meals to see where you stand against today's targets.",
    "note.na": "Sodium ({v} mg) is over your target. Biggest sources: {src}.",
    "note.sug": "Added sugar ({v} g) is over your target. Source: {src}.",
    "note.sat": "Saturated fat ({v} g) is over your target. Source: {src}.",
    "note.chol": "Dietary cholesterol ({v} mg) is over your target. Source: {src}.",
    "note.carbmeal": "{meal}: {v} g of carbs. A common target with diabetes is 45–60 g per meal — cut back on starch and add vegetables.",
    "note.fib": "Fiber is low: add beans, oats, vegetables or fruit with the skin.",
    "note.good": "Great job — you're within your targets so far 👏",

    "guide.general": "General advice", "guide.title": "What should I eat?",
    "filter.all": "All", "filter.good": "✅ Eat", "filter.limit": "⚠️ Limit", "filter.avoid": "⛔ Avoid",
    "lv.good": "Eat", "lv.limit": "Limit", "lv.avoid": "Avoid",
    "plate.title": "The healthy plate 🍽️", "plate.p1": "½ vegetables & salad", "plate.p2": "¼ protein (fish, chicken, beans)", "plate.p3": "¼ whole grains",
    "menu.title": "Meal ideas for today", "menu.shuffle": "🔀 Another idea", "menu.note": "Drink water and keep salt and oil low. Adjust portions with your doctor or dietitian.",

    "rform.title": "Log a reading or lab result", "rform.type": "Type", "rform.ctx": "When", "rform.value": "Value ({u})", "rform.sys": "Systolic (top)", "rform.dia": "Diastolic (bottom)", "rform.pulse": "Pulse (optional)", "rform.date": "Date",
    "rform.invalid": "That value doesn't look right — check the number and the unit.", "rform.saved": "Saved: {v}",
    "ctx.fasting": "Fasting", "ctx.before": "Before a meal", "ctx.after": "2 h after a meal", "ctx.bed": "Bedtime", "ctx.random": "Random",
    "rt.glucose": "Blood sugar", "rt.bp": "Blood pressure", "rt.weight": "Weight", "rt.a1c": "HbA1c", "rt.ldl": "LDL (bad)", "rt.hdl": "HDL (good)", "rt.tc": "Total cholesterol", "rt.tg": "Triglycerides",
    "st.low": "Low", "st.target": "In target", "st.slhigh": "Slightly high", "st.high": "High", "st.vhigh": "Very high", "st.normal": "Normal", "st.elevated": "Elevated", "st.optimal": "Optimal", "st.prediab": "Prediabetes", "st.diabrange": "Diabetes range", "st.acceptable": "Acceptable", "st.borderline": "Borderline", "st.desirable": "Desirable", "st.good": "Good", "st.vgood": "Very good",
    "track.none": "No readings yet. Log your first one with the form above.",
    "track.bmi": "Current BMI (based on your height): {v}",
    "chart.bp": "Red: systolic · Green: diastolic · Dashed: target", "chart.ref": "Dashed lines: reference range",
    "stat.avg30": "30-day average", "stat.min": "Lowest", "stat.max": "Highest", "stat.maxsys": "Highest systolic", "stat.inrange": "In range", "stat.count": "Readings",
    "a1c.est": "Estimated HbA1c from your average: {v}% — an estimate only; your lab test is the reference.",
    "alert.hypo": "Low blood sugar: take 15 g of fast sugar (4 glucose tablets or ½ cup of juice), recheck after 15 minutes and repeat if still low.",
    "alert.hyper": "Very high blood sugar: drink water and contact your doctor. If you have symptoms (vomiting, intense thirst, confusion), seek medical help.",
    "alert.bpcrisis": "Very high blood pressure. Rest 5 minutes and measure again; if it stays high or you have chest pain, shortness of breath, severe headache or weakness, call emergency services (911 / 112).",
    "alert.med": "💊 Time for your medication: {m}",
    "goals.title": "Today's goals", "goals.streak": "{d}/{n} today · Days in a row with 5+ goals: {s}",
    "sport.week": "Weekly plan", "sport.before": "⚠️ Before you start", "sport.benefit": "Benefit: {b}",
    "sport.general": "Check with your doctor before starting, especially over 40 or if you have chest pain or shortness of breath. Stop immediately if you feel dizzy or have pain.",

    "profile.title": "My health profile", "p.age": "Age", "p.sex": "Sex", "sex.m": "Male", "sex.f": "Female",
    "p.weight": "Weight ({u})", "p.height": "Height ({u})", "p.waist": "Waist ({u})",
    "p.activity": "Activity", "act.low": "Low", "act.mid": "Moderate", "act.high": "High",
    "p.goal": "Goal", "goal.keep": "Maintain weight", "goal.lose": "Lose weight",
    "p.units": "Lab units", "p.system": "Body units", "sys.metric": "Metric (kg, cm)", "sys.imperial": "US (lb, in)",
    "cond.title": "I have or want to prevent (select all that apply)",
    "bmi.line": "Body mass index: {v} — {c}", "bmi.under": "underweight, talk to your doctor", "bmi.normal": "healthy weight ✅", "bmi.over": "overweight ⚠️ losing 5% of your weight makes a real difference", "bmi.obese": "obesity ⚠️ losing 5–10% of your weight greatly improves blood sugar, blood pressure and cholesterol",
    "targets.title": "Your daily targets", "targets.note": "Calculated from your age, weight, activity and conditions. For guidance only.",
    "ref.title": "Lab reference values", "ref.note": "General values — your doctor sets your personal targets.",

    "risk.title": "Type 2 diabetes risk test", "risk.intro": "Uses your age, BMI and waist from My profile plus the questions below (FINDRISC).",
    "r.act": "30 minutes of physical activity daily?", "r.veg": "Vegetables & fruit", "r.meds": "Ever taken blood pressure medication?", "r.hg": "Ever had high blood sugar?", "r.fam": "Family members with diabetes",
    "risk.go": "Calculate my risk", "risk.need": "First enter your age, weight, height and waist in My profile.",
    "risk.lv.low": "Low risk", "risk.lv.slight": "Slightly elevated risk", "risk.lv.moderate": "Moderate risk", "risk.lv.high": "High risk", "risk.lv.vhigh": "Very high risk",
    "risk.prob": "Estimated chance of developing type 2 diabetes within 10 years: about {p}.",
    "risk.adv.high": "Ask your doctor for a fasting glucose or HbA1c test, and focus on food, activity and weight loss if needed.",
    "risk.adv.low": "Keep up your habits and re-test yearly after 40.",
    "risk.note": "FINDRISC is a screening tool for awareness, not a diagnosis.",

    "meds.title": "My medications", "m.name": "Medication name", "m.dose": "Dose (optional)", "m.time": "Time",
    "meds.notifbtn": "🔔 Enable notifications", "meds.note": "Reminders work while the app is open and also appear on the Home screen.",
    "meds.today": "Today", "meds.none": "No medications added yet.", "meds.notif": "💊 Medication time",

    "rep.title": "Health report for my doctor", "rep.print": "🖨️ Print / save as PDF", "rep.height": "Height", "rep.waist": "Waist", "rep.conds": "Conditions", "rep.meds": "Medications",
    "rep.readings": "Readings (last 30 days)", "rep.col.type": "Measure", "rep.col.n": "N", "rep.col.avg": "Average", "rep.col.min": "Lowest", "rep.col.max": "Highest", "rep.col.inrange": "In range", "rep.col.last": "Last reading",
    "rep.noreadings": "No readings logged.", "rep.food": "Average intake (logged days, last 7)", "rep.nofood": "No meals logged.",
    "rep.foodline": "{d} days: {kcal} kcal · carbs {carb} g · added sugar {sug} g · saturated fat {sat} g · sodium {na} mg · fiber {fib} g",
    "rep.foot": "Generated from data entered by the user. Not a diagnosis.",

    "fast.intro": "For people who fast during Ramadan or other religious fasts.",
    "fast.warn": "⚠️ Before fasting", "fast.warnyou": "⚠️ Important for your condition", "fast.iftar": "🌙 Breaking the fast (iftar)", "fast.suhoor": "🌅 Pre-dawn meal (suhoor)", "fast.tips": "💡 Tips",

    "data.title": "Your data stays on your device",
    "data.p1": "Everything you enter is stored only in this browser on this device. There are no accounts, no servers, no ads and no tracking.",
    "data.p2": "Export a backup file to keep your data safe or move it to a new phone — then import it there.",
    "data.p3": "You can permanently delete all your data at any time.",
    "data.export": "⬇️ Export backup", "data.import": "⬆️ Import backup", "data.wipe": "🗑️ Delete all my data",
    "data.importconfirm": "Replace the data on this device with the backup?", "data.importfail": "This file isn't a valid Vital 40+ backup.",
    "data.wipeconfirm": "Permanently delete all your data from this device? This cannot be undone.",
    "src.title": "Medical sources", "src.intro": "Targets and advice in this app follow these public guidelines:",

    "home.welcome": "👋 Welcome", "home.welcometext": "Enter your age, weight and health conditions to get daily targets made for you.", "home.setup": "Set up my profile →",
    "home.today": "📓 Today", "home.kcal": "Your approximate target: {k} calories a day", "home.addmeal": "＋ Log a meal",
    "home.latest": "📈 My latest readings", "home.noreadings": "No readings logged yet.", "home.log": "＋ Log a reading",
    "home.goals": "✅ My goals", "home.goalsbtn": "Today's goals", "home.lesson": "💡 Tip of the day",

    "disclaimer": "⚠️ Vital 40+ provides general health information and is not a medical device. It does not replace advice from your doctor or dietitian. Never stop or change medication without your doctor. In an emergency, call 911 (US) or 112 (EU).",
  },

  fr: {
    "app.name": "Vital 40+",
    "app.tagline": "Alimentation, glycémie, tension et cholestérol — dans une seule app privée",
    "nav.home": "Accueil", "nav.food": "Repas", "nav.track": "Santé", "nav.sport": "Activité", "nav.more": "Plus",
    "sub.diary": "📓 Journal", "sub.guide": "🍎 Que manger ?", "sub.menu": "🍽️ Idées repas",
    "sub.readings": "📈 Mesures & analyses", "sub.goals": "✅ Objectifs du jour",
    "sub.profile": "👤 Mon profil", "sub.risk": "🎯 Risque de diabète", "sub.meds": "💊 Médicaments", "sub.report": "📄 Bilan médecin", "sub.fasting": "🌙 Jeûne", "sub.data": "🔒 Données & vie privée",

    "diary.prev": "Jour précédent", "diary.next": "Jour suivant", "diary.today": "Aujourd'hui",
    "diary.addfood": "＋ Ajouter un aliment", "diary.notes": "Analyse du jour", "diary.approx": "Les valeurs nutritionnelles sont approximatives et varient selon la recette et la portion.",
    "meal.bf": "Petit-déjeuner", "meal.lunch": "Déjeuner", "meal.dinner": "Dîner", "meal.snack": "Collations",
    "n.kcal": "Calories", "n.carb": "Glucides", "n.fib": "Fibres", "n.sug": "Sucres ajoutés", "n.pro": "Protéines", "n.sat": "Graisses saturées", "n.chol": "Cholestérol alimentaire", "n.na": "Sodium (sel)",
    "u.g": "g", "u.mg": "mg", "u.kg": "kg", "u.lb": "lb", "u.cm": "cm", "u.in": "po", "u.mgdl": "mg/dL", "u.mmol": "mmol/L", "u.gl": "g/L",
    "flag.salt": "Très salé", "flag.sugar": "Sucre ajouté", "flag.sat": "Gras saturés", "flag.fiber": "Fibres ✓",
    "pick.title": "Ajouter au {meal}", "pick.search": "Rechercher : avoine, saumon, pizza…", "pick.none": "Aucun résultat. Ajoutez votre aliment ci-dessous.", "pick.custom": "＋ Absent de la liste ? Ajoutez-le",
    "qty.label": "Portions (1 portion = {unit})",
    "custom.title": "Nouvel aliment (valeurs par portion)", "custom.name": "Nom de l'aliment", "custom.unit": "Portion (ex. bol, pièce)", "custom.unitdef": "portion",
    "btn.add": "Ajouter", "btn.back": "← Retour", "btn.close": "Fermer", "btn.save": "Enregistrer", "btn.saveNext": "Enregistrer et continuer", "btn.delete": "Supprimer",
    "note.empty": "Notez vos repas pour voir où vous en êtes par rapport à vos objectifs.",
    "note.na": "Le sodium ({v} mg) dépasse votre objectif. Principales sources : {src}.",
    "note.sug": "Les sucres ajoutés ({v} g) dépassent votre objectif. Source : {src}.",
    "note.sat": "Les graisses saturées ({v} g) dépassent votre objectif. Source : {src}.",
    "note.chol": "Le cholestérol alimentaire ({v} mg) dépasse votre objectif. Source : {src}.",
    "note.carbmeal": "{meal} : {v} g de glucides. Un objectif courant en cas de diabète est de 45–60 g par repas — réduisez les féculents et ajoutez des légumes.",
    "note.fib": "Peu de fibres : ajoutez légumineuses, avoine, légumes ou fruits avec la peau.",
    "note.good": "Bravo — vous respectez vos objectifs pour l'instant 👏",

    "guide.general": "Conseils généraux", "guide.title": "Que manger ?",
    "filter.all": "Tout", "filter.good": "✅ À privilégier", "filter.limit": "⚠️ À limiter", "filter.avoid": "⛔ À éviter",
    "lv.good": "Oui", "lv.limit": "Limiter", "lv.avoid": "Éviter",
    "plate.title": "L'assiette santé 🍽️", "plate.p1": "½ légumes & salade", "plate.p2": "¼ protéines (poisson, poulet, légumineuses)", "plate.p3": "¼ féculents complets",
    "menu.title": "Idées de repas du jour", "menu.shuffle": "🔀 Autre idée", "menu.note": "Buvez de l'eau, peu de sel et d'huile. Adaptez les portions avec votre médecin ou diététicien.",

    "rform.title": "Noter une mesure ou une analyse", "rform.type": "Type", "rform.ctx": "Moment", "rform.value": "Valeur ({u})", "rform.sys": "Systolique (haute)", "rform.dia": "Diastolique (basse)", "rform.pulse": "Pouls (facultatif)", "rform.date": "Date",
    "rform.invalid": "Valeur improbable — vérifiez le nombre et l'unité.", "rform.saved": "Enregistré : {v}",
    "ctx.fasting": "À jeun", "ctx.before": "Avant un repas", "ctx.after": "2 h après un repas", "ctx.bed": "Au coucher", "ctx.random": "Autre moment",
    "rt.glucose": "Glycémie", "rt.bp": "Tension artérielle", "rt.weight": "Poids", "rt.a1c": "HbA1c", "rt.ldl": "LDL (mauvais)", "rt.hdl": "HDL (bon)", "rt.tc": "Cholestérol total", "rt.tg": "Triglycérides",
    "st.low": "Bas", "st.target": "Dans l'objectif", "st.slhigh": "Un peu élevé", "st.high": "Élevé", "st.vhigh": "Très élevé", "st.normal": "Normal", "st.elevated": "Élevée", "st.optimal": "Optimal", "st.prediab": "Prédiabète", "st.diabrange": "Zone diabète", "st.acceptable": "Acceptable", "st.borderline": "Limite", "st.desirable": "Souhaitable", "st.good": "Bon", "st.vgood": "Très bon",
    "track.none": "Aucune mesure pour l'instant. Notez la première avec le formulaire ci-dessus.",
    "track.bmi": "IMC actuel (selon votre taille) : {v}",
    "chart.bp": "Rouge : systolique · Vert : diastolique · Pointillés : objectif", "chart.ref": "Pointillés : valeurs de référence",
    "stat.avg30": "Moyenne 30 jours", "stat.min": "Plus basse", "stat.max": "Plus haute", "stat.maxsys": "Systolique max", "stat.inrange": "Dans la cible", "stat.count": "Mesures",
    "a1c.est": "HbA1c estimée d'après votre moyenne : {v} % — simple estimation, l'analyse de laboratoire fait foi.",
    "alert.hypo": "Hypoglycémie : prenez 15 g de sucre rapide (3 morceaux de sucre ou un demi-verre de jus), recontrôlez après 15 minutes et recommencez si besoin.",
    "alert.hyper": "Glycémie très élevée : buvez de l'eau et contactez votre médecin. En cas de symptômes (vomissements, soif intense, confusion), consultez en urgence.",
    "alert.bpcrisis": "Tension très élevée. Reposez-vous 5 minutes et remesurez ; si elle reste élevée ou en cas de douleur thoracique, essoufflement, mal de tête intense ou faiblesse, appelez le 15 ou le 112.",
    "alert.med": "💊 C'est l'heure de votre médicament : {m}",
    "goals.title": "Objectifs du jour", "goals.streak": "{d}/{n} aujourd'hui · Jours d'affilée avec 5 objectifs ou plus : {s}",
    "sport.week": "Programme de la semaine", "sport.before": "⚠️ Avant de commencer", "sport.benefit": "Bénéfice : {b}",
    "sport.general": "Demandez l'avis de votre médecin avant de commencer, surtout après 40 ans ou en cas de douleur thoracique ou d'essoufflement. Arrêtez immédiatement en cas de vertige ou de douleur.",

    "profile.title": "Mon profil santé", "p.age": "Âge", "p.sex": "Sexe", "sex.m": "Homme", "sex.f": "Femme",
    "p.weight": "Poids ({u})", "p.height": "Taille ({u})", "p.waist": "Tour de taille ({u})",
    "p.activity": "Activité", "act.low": "Faible", "act.mid": "Modérée", "act.high": "Élevée",
    "p.goal": "Objectif", "goal.keep": "Maintenir mon poids", "goal.lose": "Perdre du poids",
    "p.units": "Unités d'analyses", "p.system": "Unités corporelles", "sys.metric": "Métrique (kg, cm)", "sys.imperial": "US (lb, po)",
    "cond.title": "J'ai ou je veux prévenir (cochez tout ce qui s'applique)",
    "bmi.line": "Indice de masse corporelle : {v} — {c}", "bmi.under": "maigreur, parlez-en à votre médecin", "bmi.normal": "poids normal ✅", "bmi.over": "surpoids ⚠️ perdre 5 % de son poids change déjà beaucoup", "bmi.obese": "obésité ⚠️ perdre 5 à 10 % de son poids améliore nettement glycémie, tension et cholestérol",
    "targets.title": "Vos objectifs quotidiens", "targets.note": "Calculés selon votre âge, poids, activité et pathologies. À titre indicatif.",
    "ref.title": "Valeurs de référence", "ref.note": "Valeurs générales — votre médecin fixe vos objectifs personnels.",

    "risk.title": "Test de risque de diabète de type 2", "risk.intro": "Utilise votre âge, IMC et tour de taille de Mon profil, plus les questions ci-dessous (FINDRISC).",
    "r.act": "30 minutes d'activité physique par jour ?", "r.veg": "Fruits et légumes", "r.meds": "Avez-vous déjà pris un traitement contre l'hypertension ?", "r.hg": "Avez-vous déjà eu une glycémie élevée ?", "r.fam": "Diabète dans la famille",
    "risk.go": "Calculer mon risque", "risk.need": "Renseignez d'abord votre âge, poids, taille et tour de taille dans Mon profil.",
    "risk.lv.low": "Risque faible", "risk.lv.slight": "Risque légèrement élevé", "risk.lv.moderate": "Risque modéré", "risk.lv.high": "Risque élevé", "risk.lv.vhigh": "Risque très élevé",
    "risk.prob": "Probabilité estimée de développer un diabète de type 2 dans les 10 ans : environ {p}.",
    "risk.adv.high": "Demandez à votre médecin une glycémie à jeun ou une HbA1c, et agissez sur l'alimentation, l'activité et le poids si besoin.",
    "risk.adv.low": "Gardez vos bonnes habitudes et refaites le test chaque année après 40 ans.",
    "risk.note": "Le FINDRISC est un outil de dépistage, pas un diagnostic.",

    "meds.title": "Mes médicaments", "m.name": "Nom du médicament", "m.dose": "Dose (facultatif)", "m.time": "Heure",
    "meds.notifbtn": "🔔 Activer les notifications", "meds.note": "Les rappels fonctionnent quand l'app est ouverte et s'affichent aussi sur l'Accueil.",
    "meds.today": "Aujourd'hui", "meds.none": "Aucun médicament ajouté.", "meds.notif": "💊 Heure du médicament",

    "rep.title": "Bilan de santé pour mon médecin", "rep.print": "🖨️ Imprimer / enregistrer en PDF", "rep.height": "Taille", "rep.waist": "Tour de taille", "rep.conds": "Pathologies", "rep.meds": "Médicaments",
    "rep.readings": "Mesures (30 derniers jours)", "rep.col.type": "Mesure", "rep.col.n": "Nb", "rep.col.avg": "Moyenne", "rep.col.min": "Min", "rep.col.max": "Max", "rep.col.inrange": "Dans la cible", "rep.col.last": "Dernière mesure",
    "rep.noreadings": "Aucune mesure enregistrée.", "rep.food": "Apports moyens (jours renseignés, 7 derniers)", "rep.nofood": "Aucun repas enregistré.",
    "rep.foodline": "{d} jours : {kcal} kcal · glucides {carb} g · sucres ajoutés {sug} g · graisses saturées {sat} g · sodium {na} mg · fibres {fib} g",
    "rep.foot": "Généré à partir des données saisies par l'utilisateur. Ne constitue pas un diagnostic.",

    "fast.intro": "Pour les personnes qui jeûnent pendant le Ramadan ou d'autres jeûnes religieux.",
    "fast.warn": "⚠️ Avant de jeûner", "fast.warnyou": "⚠️ Important pour votre santé", "fast.iftar": "🌙 Rupture du jeûne (iftar)", "fast.suhoor": "🌅 Repas avant l'aube (suhoor)", "fast.tips": "💡 Conseils",

    "data.title": "Vos données restent sur votre appareil",
    "data.p1": "Tout ce que vous saisissez est stocké uniquement dans ce navigateur, sur cet appareil. Pas de compte, pas de serveur, pas de publicité, aucun pistage.",
    "data.p2": "Exportez une sauvegarde pour protéger vos données ou les transférer sur un nouveau téléphone, puis importez-la là-bas.",
    "data.p3": "Vous pouvez supprimer définitivement toutes vos données à tout moment (RGPD).",
    "data.export": "⬇️ Exporter une sauvegarde", "data.import": "⬆️ Importer une sauvegarde", "data.wipe": "🗑️ Supprimer toutes mes données",
    "data.importconfirm": "Remplacer les données de cet appareil par la sauvegarde ?", "data.importfail": "Ce fichier n'est pas une sauvegarde Vital 40+ valide.",
    "data.wipeconfirm": "Supprimer définitivement toutes vos données de cet appareil ? Action irréversible.",
    "src.title": "Sources médicales", "src.intro": "Les objectifs et conseils de cette app suivent ces recommandations publiques :",

    "home.welcome": "👋 Bienvenue", "home.welcometext": "Indiquez votre âge, votre poids et vos problèmes de santé pour obtenir des objectifs quotidiens personnalisés.", "home.setup": "Créer mon profil →",
    "home.today": "📓 Aujourd'hui", "home.kcal": "Votre objectif approximatif : {k} calories par jour", "home.addmeal": "＋ Noter un repas",
    "home.latest": "📈 Mes dernières mesures", "home.noreadings": "Aucune mesure enregistrée.", "home.log": "＋ Noter une mesure",
    "home.goals": "✅ Mes objectifs", "home.goalsbtn": "Objectifs du jour", "home.lesson": "💡 Conseil du jour",

    "disclaimer": "⚠️ Vital 40+ fournit des informations de santé générales et n'est pas un dispositif médical. Il ne remplace pas l'avis de votre médecin ou diététicien. N'arrêtez ni ne modifiez jamais un traitement sans votre médecin. En cas d'urgence, appelez le 15 ou le 112.",
  },

  ar: {
    "app.name": "Vital 40+ صحتي",
    "app.tagline": "أكلك، سكرك، ضغطك وكوليسترولك — في تطبيق واحد يحفظ خصوصيتك",
    "nav.home": "الرئيسية", "nav.food": "الأكل", "nav.track": "القياسات", "nav.sport": "الرياضة", "nav.more": "المزيد",
    "sub.diary": "📓 يومياتي", "sub.guide": "🍎 ماذا آكل؟", "sub.menu": "🍽️ وجبات",
    "sub.readings": "📈 القياسات والتحاليل", "sub.goals": "✅ أهداف اليوم",
    "sub.profile": "👤 ملفي", "sub.risk": "🎯 اختبار الخطر", "sub.meds": "💊 أدويتي", "sub.report": "📄 تقرير الطبيب", "sub.fasting": "🌙 رمضان", "sub.data": "🔒 بياناتي وخصوصيتي",

    "diary.prev": "اليوم السابق", "diary.next": "اليوم التالي", "diary.today": "اليوم",
    "diary.addfood": "＋ إضافة طعام", "diary.notes": "ملاحظات اليوم", "diary.approx": "القيم الغذائية تقريبية وتتغير حسب الوصفة والكمية.",
    "meal.bf": "الفطور", "meal.lunch": "الغداء", "meal.dinner": "العشاء", "meal.snack": "سناك",
    "n.kcal": "السعرات", "n.carb": "الكربوهيدرات", "n.fib": "ألياف", "n.sug": "سكر مضاف", "n.pro": "بروتين", "n.sat": "دهون مشبعة", "n.chol": "كوليسترول غذائي", "n.na": "صوديوم (الملح)",
    "u.g": "غ", "u.mg": "مغ", "u.kg": "كغ", "u.lb": "رطل", "u.cm": "سم", "u.in": "إنش", "u.mgdl": "مغ/دل", "u.mmol": "مليمول/ل", "u.gl": "غ/ل",
    "flag.salt": "ملح عالٍ", "flag.sugar": "سكر مضاف", "flag.sat": "دهون مشبعة", "flag.fiber": "ألياف ✓",
    "pick.title": "إضافة إلى {meal}", "pick.search": "ابحث: خبز، عدس، تمر، سردين…", "pick.none": "لا نتائج. أضف طعامك بالأسفل.", "pick.custom": "＋ طعام غير موجود؟ أضفه",
    "qty.label": "الكمية (عدد الحصص — الحصة: {unit})",
    "custom.title": "طعام جديد (القيم لكل حصة)", "custom.name": "اسم الطعام", "custom.unit": "الحصة (مثال: طبق، قطعة)", "custom.unitdef": "حصة",
    "btn.add": "إضافة", "btn.back": "→ رجوع", "btn.close": "إغلاق", "btn.save": "حفظ", "btn.saveNext": "حفظ ومتابعة", "btn.delete": "حذف",
    "note.empty": "سجّل وجباتك لتعرف أين تقف من أهدافك اليومية.",
    "note.na": "الصوديوم ({v} مغ) تجاوز هدفك. أكبر المصادر: {src}.",
    "note.sug": "السكر المضاف ({v} غ) فوق الهدف. المصدر: {src}.",
    "note.sat": "الدهون المشبعة ({v} غ) فوق الهدف. المصدر: {src}.",
    "note.chol": "الكوليسترول الغذائي ({v} مغ) فوق الهدف. المصدر: {src}.",
    "note.carbmeal": "{meal}: {v} غ كربوهيدرات. الهدف الشائع لمريض السكري 45–60 غ للوجبة، فخفّف النشويات وزد الخضر.",
    "note.fib": "الألياف قليلة: أضف بقوليات أو شوفان أو خضر وفاكهة بقشرها.",
    "note.good": "ممتاز! أنت ضمن أهدافك حتى الآن 👏",

    "guide.general": "نصائح عامة", "guide.title": "ماذا آكل؟",
    "filter.all": "الكل", "filter.good": "✅ كُل", "filter.limit": "⚠️ بحذر", "filter.avoid": "⛔ تجنّب",
    "lv.good": "كُل", "lv.limit": "بحذر", "lv.avoid": "تجنّب",
    "plate.title": "طبق الصحة 🍽️", "plate.p1": "½ خضر وسلطة", "plate.p2": "¼ بروتين (سمك، دجاج، بقوليات)", "plate.p3": "¼ نشويات كاملة",
    "menu.title": "مقترحات وجبات اليوم", "menu.shuffle": "🔀 اقتراح آخر", "menu.note": "اشرب الماء، والملح والزيت بكميات قليلة. عدّل الكميات مع طبيبك أو أخصائي التغذية.",

    "rform.title": "تسجيل قياس أو تحليل", "rform.type": "النوع", "rform.ctx": "الحالة", "rform.value": "القيمة ({u})", "rform.sys": "الانقباضي (الكبير)", "rform.dia": "الانبساطي (الصغير)", "rform.pulse": "النبض (اختياري)", "rform.date": "التاريخ",
    "rform.invalid": "القيمة غير معقولة، تأكد من الرقم والوحدة.", "rform.saved": "تم الحفظ: {v}",
    "ctx.fasting": "صائم", "ctx.before": "قبل الأكل", "ctx.after": "بعد الأكل بساعتين", "ctx.bed": "قبل النوم", "ctx.random": "عشوائي",
    "rt.glucose": "سكر الدم", "rt.bp": "ضغط الدم", "rt.weight": "الوزن", "rt.a1c": "HbA1c", "rt.ldl": "LDL (الضار)", "rt.hdl": "HDL (الجيد)", "rt.tc": "الكوليسترول الكلي", "rt.tg": "التريغليسريد",
    "st.low": "منخفض", "st.target": "ضمن الهدف", "st.slhigh": "مرتفع قليلًا", "st.high": "مرتفع", "st.vhigh": "مرتفع جدًا", "st.normal": "طبيعي", "st.elevated": "مرتفع طفيف", "st.optimal": "مثالي", "st.prediab": "مقدمات سكري", "st.diabrange": "في مدى السكري", "st.acceptable": "مقبول", "st.borderline": "حدّي", "st.desirable": "مرغوب", "st.good": "جيد", "st.vgood": "جيد جدًا",
    "track.none": "لا توجد قراءات بعد. سجّل أول قراءة من النموذج أعلاه.",
    "track.bmi": "مؤشر كتلة الجسم الحالي (حسب طولك): {v}",
    "chart.bp": "الأحمر: الانقباضي · الأخضر: الانبساطي · الخط المتقطع: الحدّ المستهدف", "chart.ref": "الخطوط المتقطعة: الحدود المرجعية",
    "stat.avg30": "المتوسط (30 يومًا)", "stat.min": "الأدنى", "stat.max": "الأعلى", "stat.maxsys": "أعلى انقباضي", "stat.inrange": "ضمن الهدف", "stat.count": "عدد القراءات",
    "a1c.est": "تقدير HbA1c من متوسط قراءاتك: {v}% — تقدير فقط، تحليل المخبر هو المرجع.",
    "alert.hypo": "سكر منخفض: تناول 15 غ سكر سريع (3 تمرات أو نصف كوب عصير)، وأعد القياس بعد 15 دقيقة، وكرّر إن بقي منخفضًا.",
    "alert.hyper": "سكر مرتفع جدًا: اشرب ماء وتواصل مع طبيبك، وإن ظهرت أعراض (قيء، عطش شديد، دوخة) فاطلب المساعدة الطبية.",
    "alert.bpcrisis": "ضغط مرتفع جدًا. أعد القياس بعد راحة 5 دقائق؛ وإن بقي مرتفعًا أو ظهر صداع شديد أو ألم صدر أو ضيق تنفس فاطلب الإسعاف فورًا.",
    "alert.med": "💊 حان وقت دوائك: {m}",
    "goals.title": "أهداف اليوم", "goals.streak": "{d}/{n} اليوم · أيام متتالية بـ 5 أهداف أو أكثر: {s}",
    "sport.week": "برنامج الأسبوع", "sport.before": "⚠️ قبل أن تبدأ", "sport.benefit": "الفائدة: {b}",
    "sport.general": "استشر طبيبك قبل البدء خصوصًا فوق 40 سنة أو عند وجود ألم في الصدر أو ضيق تنفس. توقف فورًا عند الدوخة أو الألم.",

    "profile.title": "ملفي الصحي", "p.age": "العمر", "p.sex": "الجنس", "sex.m": "رجل", "sex.f": "امرأة",
    "p.weight": "الوزن ({u})", "p.height": "الطول ({u})", "p.waist": "محيط الخصر ({u})",
    "p.activity": "النشاط", "act.low": "قليل", "act.mid": "متوسط", "act.high": "عالٍ",
    "p.goal": "الهدف", "goal.keep": "ثبات الوزن", "goal.lose": "خسارة الوزن",
    "p.units": "وحدة التحاليل", "p.system": "وحدة الجسم", "sys.metric": "متري (كغ، سم)", "sys.imperial": "أمريكي (رطل، إنش)",
    "cond.title": "أشكو من (اختر ما ينطبق عليك)",
    "bmi.line": "مؤشر كتلة الجسم: {v} — {c}", "bmi.under": "نحافة، استشر طبيبك", "bmi.normal": "وزن طبيعي ✅", "bmi.over": "وزن زائد ⚠️ خسارة 5% من الوزن تحدث فرقًا كبيرًا", "bmi.obese": "سمنة ⚠️ خسارة 5–10% من الوزن تحسّن السكر والضغط والدهون كثيرًا",
    "targets.title": "أهدافك اليومية المحسوبة", "targets.note": "تُحسب من عمرك ووزنك ونشاطك وحالتك. للتوعية فقط.",
    "ref.title": "أرقام مرجعية للتحاليل", "ref.note": "أرقام عامة، وطبيبك يحدد هدفك الشخصي.",

    "risk.title": "اختبار خطر السكري من النوع 2", "risk.intro": "يستعمل عمرك ووزنك وخصرك من «ملفي» + الأسئلة التالية (اختبار FINDRISC).",
    "r.act": "نشاط بدني 30 دقيقة يوميًا؟", "r.veg": "خضر وفواكه", "r.meds": "تتناول دواء لضغط الدم؟", "r.hg": "سكر مرتفع سابقًا؟", "r.fam": "إصابات سكري في العائلة",
    "risk.go": "احسب خطري", "risk.need": "أكمل في «ملفي» العمر والوزن والطول ومحيط الخصر أولًا.",
    "risk.lv.low": "خطر منخفض", "risk.lv.slight": "خطر مرتفع قليلًا", "risk.lv.moderate": "خطر متوسط", "risk.lv.high": "خطر مرتفع", "risk.lv.vhigh": "خطر مرتفع جدًا",
    "risk.prob": "احتمال الإصابة بالسكري من النوع 2 خلال 10 سنوات: نحو {p} (تقدير إحصائي).",
    "risk.adv.high": "يُنصح بتحليل سكر صائم أو HbA1c عند الطبيب، مع تحسين الأكل والحركة وخسارة الوزن إن لزم.",
    "risk.adv.low": "حافظ على نمط حياتك، وكرّر التحليل سنويًا بعد الأربعين.",
    "risk.note": "هذا اختبار فنلندي (FINDRISC) للتوعية وليس تشخيصًا.",

    "meds.title": "أدويتي", "m.name": "اسم الدواء", "m.dose": "الجرعة (اختياري)", "m.time": "الوقت",
    "meds.notifbtn": "🔔 تفعيل الإشعارات", "meds.note": "التذكير يعمل والتطبيق مفتوح؛ ويظهر في «الرئيسية» عند حلول الموعد.",
    "meds.today": "اليوم", "meds.none": "لم تضف أدوية بعد.", "meds.notif": "💊 وقت الدواء",

    "rep.title": "تقرير صحي للطبيب", "rep.print": "🖨️ طباعة / حفظ PDF", "rep.height": "الطول", "rep.waist": "الخصر", "rep.conds": "الحالات", "rep.meds": "الأدوية",
    "rep.readings": "القياسات (آخر 30 يومًا)", "rep.col.type": "القياس", "rep.col.n": "عدد", "rep.col.avg": "المتوسط", "rep.col.min": "الأدنى", "rep.col.max": "الأعلى", "rep.col.inrange": "ضمن الهدف", "rep.col.last": "آخر قراءة",
    "rep.noreadings": "لا قياسات مسجلة.", "rep.food": "متوسط الأكل (أيام مسجلة من آخر 7)", "rep.nofood": "لا وجبات مسجلة.",
    "rep.foodline": "{d} أيام: {kcal} kcal · كربوهيدرات {carb} غ · سكر مضاف {sug} غ · دهون مشبعة {sat} غ · صوديوم {na} مغ · ألياف {fib} غ",
    "rep.foot": "تقرير مولّد من بيانات أدخلها المستخدم ولا يُعد تشخيصًا.",

    "fast.intro": "لمن يصوم رمضان أو صيامًا دينيًا آخر.",
    "fast.warn": "⚠️ قبل الصيام", "fast.warnyou": "⚠️ مهم جدًا لحالتك", "fast.iftar": "🌙 الإفطار", "fast.suhoor": "🌅 السحور", "fast.tips": "💡 نصائح",

    "data.title": "بياناتك تبقى على جهازك",
    "data.p1": "كل ما تدخله محفوظ فقط في هذا المتصفح على هذا الجهاز. لا حساب، لا خوادم، لا إعلانات، ولا تتبّع.",
    "data.p2": "صدّر نسخة احتياطية لتحفظ بياناتك أو تنقلها إلى هاتف جديد، ثم استوردها هناك.",
    "data.p3": "يمكنك حذف كل بياناتك نهائيًا في أي وقت.",
    "data.export": "⬇️ تصدير نسخة احتياطية", "data.import": "⬆️ استيراد نسخة احتياطية", "data.wipe": "🗑️ حذف كل بياناتي",
    "data.importconfirm": "استبدال البيانات الموجودة على هذا الجهاز بالنسخة الاحتياطية؟", "data.importfail": "هذا الملف ليس نسخة احتياطية صالحة من Vital 40+.",
    "data.wipeconfirm": "حذف كل بياناتك من هذا الجهاز نهائيًا؟ لا يمكن التراجع.",
    "src.title": "المراجع الطبية", "src.intro": "الأهداف والنصائح في هذا التطبيق مبنية على هذه التوصيات العالمية:",

    "home.welcome": "👋 أهلًا بك", "home.welcometext": "أدخل عمرك ووزنك وحالتك الصحية لتحصل على أهداف غذائية مخصصة لك.", "home.setup": "أكمل ملفي ←",
    "home.today": "📓 اليوم", "home.kcal": "هدفك التقريبي: {k} سعرة يوميًا", "home.addmeal": "＋ أضف وجبة",
    "home.latest": "📈 آخر قياساتي", "home.noreadings": "لم تسجل قياسات بعد.", "home.log": "＋ سجّل قياسًا",
    "home.goals": "✅ أهدافي", "home.goalsbtn": "أهداف اليوم", "home.lesson": "💡 معلومة اليوم",

    "disclaimer": "⚠️ هذا التطبيق للتوعية والإرشاد العام وليس جهازًا طبيًا، ولا يغني عن استشارة الطبيب أو أخصائي التغذية. لا توقف دواءك ولا تغيّر جرعته بدون طبيبك. في حالات الطوارئ اتصل بالإسعاف.",
  },
};

function t(k, v = {}) {
  const s = (STR[LANG] && STR[LANG][k]) ?? STR.en[k] ?? k;
  return s.replace(/\{(\w+)\}/g, (_, x) => (x in v ? v[x] : ""));
}

function applyI18n() {
  document.documentElement.lang = LANG;
  document.documentElement.dir = DIR;
  document.title = t("app.name");
  document.querySelectorAll("[data-i18n]").forEach((n) => (n.textContent = t(n.dataset.i18n)));
  document.querySelectorAll("[data-i18n-aria]").forEach((n) => n.setAttribute("aria-label", t(n.dataset.i18nAria)));
}
