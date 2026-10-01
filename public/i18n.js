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

    "nav.food": "Food", "nav.more": "More",
    "sub.diary": "📓 Food diary", "sub.guide": "🍎 What to eat", "sub.menu": "🍽️ Meal ideas",
    "sub.goals": "✅ Daily goals",
    "sub.profile": "👤 My profile", "sub.data": "🔒 Data & privacy",

    "diary.prev": "Previous day", "diary.next": "Next day", "diary.today": "Today",
    "diary.addfood": "＋ Add food", "diary.notes": "Today's insights", "diary.approx": "Nutrition values are approximate and vary with recipe and portion.",
    "meal.bf": "Breakfast", "meal.lunch": "Lunch", "meal.dinner": "Dinner", "meal.snack": "Snacks",
    "n.kcal": "Calories", "n.carb": "Carbs", "n.fib": "Fiber", "n.sug": "Added sugar", "n.pro": "Protein", "n.sat": "Saturated fat", "n.chol": "Dietary cholesterol", "n.na": "Sodium (salt)",
    "u.g": "g", "u.mg": "mg", "u.kg": "kg", "u.lb": "lb", "u.cm": "cm", "u.in": "in", 
    "flag.salt": "High salt", "flag.sugar": "Added sugar", "flag.sat": "Sat. fat", "flag.fiber": "Fiber ✓",
    "pick.title": "Add to {meal}", "pick.search": "Search: oatmeal, salmon, pizza…", "pick.none": "No results. Add your own food below.", "pick.custom": "＋ Not listed? Add it",
    "qty.label": "Servings (1 serving = {unit})",
    "custom.title": "New food (values per serving)", "custom.name": "Food name", "custom.unit": "Serving (e.g. bowl, piece)", "custom.unitdef": "serving",
    "btn.add": "Add", "btn.back": "← Back", "btn.close": "Close", "btn.saveNext": "Save & continue", "btn.delete": "Delete",
    "note.empty": "Log your meals to see where you stand against today's targets.",
    "note.na": "Sodium ({v} mg) is over your target. Biggest sources: {src}.",
    "note.sug": "Added sugar ({v} g) is over your target. Source: {src}.",
    "note.sat": "Saturated fat ({v} g) is over your target. Source: {src}.",
    "note.chol": "Dietary cholesterol ({v} mg) is over your target. Source: {src}.",

    "note.fib": "Fiber is low: add beans, oats, vegetables or fruit with the skin.",
    "note.good": "Great job — you're within your targets so far 👏",

    "guide.general": "General advice", "guide.title": "What should I eat?",
    "filter.all": "All", "filter.good": "✅ Eat", "filter.limit": "⚠️ Limit", "filter.avoid": "⛔ Avoid",
    "lv.good": "Eat", "lv.limit": "Limit", "lv.avoid": "Avoid",
    "plate.title": "The healthy plate 🍽️", "plate.p1": "½ vegetables & salad", "plate.p2": "¼ protein (fish, chicken, beans)", "plate.p3": "¼ whole grains",
    "menu.title": "Meal ideas for today", "menu.shuffle": "🔀 Another idea", "menu.note": "Drink water and keep salt and oil low. Adjust portions with your doctor or dietitian.",


    

    

    

    

    

    

    
    "goals.title": "Today's goals", "goals.streak": "{d}/{n} today · Days in a row with 5+ goals: {s}",
    "sport.week": "Weekly plan", "sport.before": "⚠️ Before you start", "sport.benefit": "Benefit: {b}",
    "sport.general": "Check with your doctor before starting, especially over 40 or if you have chest pain or shortness of breath. Stop immediately if you feel dizzy or have pain.",

    "profile.title": "My health profile", "p.age": "Age", "p.sex": "Sex", "sex.m": "Male", "sex.f": "Female",
    "p.weight": "Weight ({u})", "p.height": "Height ({u})", "p.waist": "Waist ({u})",
    "p.activity": "Activity", "act.low": "Low", "act.mid": "Moderate", "act.high": "High",
    "p.goal": "Goal", "goal.keep": "Maintain weight", "goal.lose": "Lose weight",
    "p.system": "Body units", "sys.metric": "Metric (kg, cm)", "sys.imperial": "US (lb, in)",

    "bmi.line": "Body mass index: {v} — {c}", "bmi.under": "underweight, talk to your doctor", "bmi.normal": "healthy weight ✅", "bmi.over": "overweight ⚠️ losing 5% of your weight makes a real difference", "bmi.obese": "obesity ⚠️ losing 5–10% of your weight greatly improves blood sugar, blood pressure and cholesterol",
    "targets.title": "Your daily targets", "targets.note": "Calculated from your age, weight, activity and conditions. For guidance only.",



    

    

    

    


    



    

    



    

    "data.title": "Your data stays on your device",

    "data.p2": "Export a backup file to keep your data safe or move it to a new phone — then import it there.",
    "data.p3": "You can permanently delete all your data at any time.",
    "data.export": "⬇️ Export backup", "data.import": "⬆️ Import backup", "data.wipe": "🗑️ Delete all my data",
    "data.importconfirm": "Replace the data on this device with the backup?", "data.importfail": "This file isn't a valid Vital 40+ backup.",
    "data.wipeconfirm": "Permanently delete all your data from this device? This cannot be undone.",
    "src.title": "Medical sources", 

    "home.welcome": "👋 Welcome", 
    "home.today": "📓 Today", "home.kcal": "Your approximate target: {k} calories a day", 

    "home.lesson": "💡 Tip of the day",

    "app.tagline": "Snap your meal — see what's in it and how much fits your goals",
    "nav.home": "Scan",
    "nav.habits": "Habits",
    "sub.sport": "🏃 Exercise",
    "scan.title": "📷 What's on your plate?",
    "scan.intro": "Take a photo of your meal: we estimate its nutrients and suggest a portion that fits your health focus.",
    "scan.camera": "📷 Take a photo",
    "scan.gallery": "🖼️ Choose a photo",
    "scan.search": "🔍 Search a food",
    "scan.busy": "Analyzing your meal…",
    "scan.yourmeal": "Your meal",
    "scan.amount": "Amount",
    "scan.meal": "Meal",
    "scan.add": "＋ Add to my diary",
    "scan.added": "Added to today's diary ✓",
    "scan.discard": "Discard",
    "scan.total": "Total: {kcal} kcal · net carbs {net} g · added sugar {sug} g · saturated fat {sat} g · sodium {na} mg · fiber {fib} g",
    "scan.verdict.good": "Overall: a good fit for your goals",
    "scan.verdict.limit": "Overall: fine with smaller portions",
    "scan.verdict.occasional": "Overall: best kept as an occasional meal",
    "scan.photonote": "Photo estimates can be off by 20–30%. If you know the weight, correct the grams.",
    "scan.dbnote": "Values are typical averages for this food.",
    "scan.unavailable": "Photo analysis isn't available right now — you can still search a food.",
    "scan.ratelimit": "Too many photos in a short time — please try again later.",
    "scan.overload": "The analysis service is busy — please try again in a minute.",
    "scan.error": "Something went wrong. Please try again.",
    "scan.notfood": "We couldn't find food in this photo. Try a clearer, closer shot.",
    "scan.notimage": "Please choose an image file.",
    "conf.high": "Confident estimate",
    "conf.medium": "Rough estimate",
    "conf.low": "Uncertain estimate",
    "lvl.good": "Good choice",
    "lvl.limit": "Watch the portion",
    "lvl.occasional": "Best kept occasional",
    "pick.titleScan": "Search a food",
    "n.net": "Net carbs",
    "adv.general": "🥗 Balanced eating",
    "adv.ok": "Fits well in this amount.",
    "adv.high": "{what}: {v} {u} in this portion — a comfortable amount is about {cap} {u}.",
    "adv.portion": "Suggested portion: about {p}.",
    "adv.tiny": "just a taste",
    "tip.diabetes": "Eat it with vegetables or protein, and take a short walk afterwards.",
    "tip.trig": "Drink water instead of sweet drinks, and go easy on dessert.",
    "tip.bp": "Don't add salt, and skip salty sauces, cheese or pickles alongside.",
    "tip.chol": "Prefer grilled, baked or steamed versions over fried.",
    "tip.thyroid": "No specific limit — keep your plate balanced and varied.",
    "tip.general": "Fill half your plate with vegetables.",
    "home.welcometext": "Choose your health focus (blood sugar, blood pressure, cholesterol…) so portion tips fit you.",
    "home.setup": "Choose my focus →",
    "home.diary": "📓 Open my diary",
    "cond.title": "My health focus (select what you want to watch)",
    "cond.note": "This tailors food tips and portion suggestions. It is not a diagnosis.",
    "note.carbmeal": "{meal}: {v} g of carbs. If you're watching your blood sugar, 45–60 g per meal is a common guideline — try less starch and more vegetables.",
    "data.p1": "Your profile and food diary are stored only on this device. No account, no ads, no tracking.",
    "data.photo": "When you scan a meal, the photo is sent securely to our AI analysis service (Claude, by Anthropic) only to estimate its nutrients. Vital 40+ does not keep your photos.",
    "src.intro": "Food advice in this app is based on these public healthy-eating guidelines:",
    "src.ai": "Photo nutrient estimates: Claude AI (Anthropic)",
    "disclaimer": "⚠️ Vital 40+ gives general nutrition information to support healthy eating. It is not a medical device and does not diagnose, treat or replace advice from your doctor or dietitian. If you have a medical condition, follow your care team's plan.",

    "nav.plan": "My plan",
    "plan.title": "🗣️ My eating & exercise plan",
    "plan.intro": "Choose a health focus to see — or hear — what to eat, what to limit, and the exercise that goes with your meals.",
    "plan.heading": "Plan for {c}",
    "plan.eat": "✅ Eat more of",
    "plan.limit": "⚖️ Limit",
    "plan.avoid": "⏸️ Keep occasional",
    "plan.day": "🍽️ A day of eating",
    "plan.moves": "🏃 Exercise that matches your meals",
    "voice.listen": "🔊 Listen",
    "voice.stop": "⏹️ Stop",
    "voice.novoice": "Your device has no voice for this language — add one in your phone's text-to-speech settings.",
  },

  fr: {
    "app.name": "Vital 40+",

    "nav.food": "Repas", "nav.more": "Plus",
    "sub.diary": "📓 Journal", "sub.guide": "🍎 Que manger ?", "sub.menu": "🍽️ Idées repas",
    "sub.goals": "✅ Objectifs du jour",
    "sub.profile": "👤 Mon profil", "sub.data": "🔒 Données & vie privée",

    "diary.prev": "Jour précédent", "diary.next": "Jour suivant", "diary.today": "Aujourd'hui",
    "diary.addfood": "＋ Ajouter un aliment", "diary.notes": "Analyse du jour", "diary.approx": "Les valeurs nutritionnelles sont approximatives et varient selon la recette et la portion.",
    "meal.bf": "Petit-déjeuner", "meal.lunch": "Déjeuner", "meal.dinner": "Dîner", "meal.snack": "Collations",
    "n.kcal": "Calories", "n.carb": "Glucides", "n.fib": "Fibres", "n.sug": "Sucres ajoutés", "n.pro": "Protéines", "n.sat": "Graisses saturées", "n.chol": "Cholestérol alimentaire", "n.na": "Sodium (sel)",
    "u.g": "g", "u.mg": "mg", "u.kg": "kg", "u.lb": "lb", "u.cm": "cm", "u.in": "po", 
    "flag.salt": "Très salé", "flag.sugar": "Sucre ajouté", "flag.sat": "Gras saturés", "flag.fiber": "Fibres ✓",
    "pick.title": "Ajouter au {meal}", "pick.search": "Rechercher : avoine, saumon, pizza…", "pick.none": "Aucun résultat. Ajoutez votre aliment ci-dessous.", "pick.custom": "＋ Absent de la liste ? Ajoutez-le",
    "qty.label": "Portions (1 portion = {unit})",
    "custom.title": "Nouvel aliment (valeurs par portion)", "custom.name": "Nom de l'aliment", "custom.unit": "Portion (ex. bol, pièce)", "custom.unitdef": "portion",
    "btn.add": "Ajouter", "btn.back": "← Retour", "btn.close": "Fermer", "btn.saveNext": "Enregistrer et continuer", "btn.delete": "Supprimer",
    "note.empty": "Notez vos repas pour voir où vous en êtes par rapport à vos objectifs.",
    "note.na": "Le sodium ({v} mg) dépasse votre objectif. Principales sources : {src}.",
    "note.sug": "Les sucres ajoutés ({v} g) dépassent votre objectif. Source : {src}.",
    "note.sat": "Les graisses saturées ({v} g) dépassent votre objectif. Source : {src}.",
    "note.chol": "Le cholestérol alimentaire ({v} mg) dépasse votre objectif. Source : {src}.",

    "note.fib": "Peu de fibres : ajoutez légumineuses, avoine, légumes ou fruits avec la peau.",
    "note.good": "Bravo — vous respectez vos objectifs pour l'instant 👏",

    "guide.general": "Conseils généraux", "guide.title": "Que manger ?",
    "filter.all": "Tout", "filter.good": "✅ À privilégier", "filter.limit": "⚠️ À limiter", "filter.avoid": "⛔ À éviter",
    "lv.good": "Oui", "lv.limit": "Limiter", "lv.avoid": "Éviter",
    "plate.title": "L'assiette santé 🍽️", "plate.p1": "½ légumes & salade", "plate.p2": "¼ protéines (poisson, poulet, légumineuses)", "plate.p3": "¼ féculents complets",
    "menu.title": "Idées de repas du jour", "menu.shuffle": "🔀 Autre idée", "menu.note": "Buvez de l'eau, peu de sel et d'huile. Adaptez les portions avec votre médecin ou diététicien.",


    

    

    

    

    

    

    
    "goals.title": "Objectifs du jour", "goals.streak": "{d}/{n} aujourd'hui · Jours d'affilée avec 5 objectifs ou plus : {s}",
    "sport.week": "Programme de la semaine", "sport.before": "⚠️ Avant de commencer", "sport.benefit": "Bénéfice : {b}",
    "sport.general": "Demandez l'avis de votre médecin avant de commencer, surtout après 40 ans ou en cas de douleur thoracique ou d'essoufflement. Arrêtez immédiatement en cas de vertige ou de douleur.",

    "profile.title": "Mon profil santé", "p.age": "Âge", "p.sex": "Sexe", "sex.m": "Homme", "sex.f": "Femme",
    "p.weight": "Poids ({u})", "p.height": "Taille ({u})", "p.waist": "Tour de taille ({u})",
    "p.activity": "Activité", "act.low": "Faible", "act.mid": "Modérée", "act.high": "Élevée",
    "p.goal": "Objectif", "goal.keep": "Maintenir mon poids", "goal.lose": "Perdre du poids",
    "p.system": "Unités corporelles", "sys.metric": "Métrique (kg, cm)", "sys.imperial": "US (lb, po)",

    "bmi.line": "Indice de masse corporelle : {v} — {c}", "bmi.under": "maigreur, parlez-en à votre médecin", "bmi.normal": "poids normal ✅", "bmi.over": "surpoids ⚠️ perdre 5 % de son poids change déjà beaucoup", "bmi.obese": "obésité ⚠️ perdre 5 à 10 % de son poids améliore nettement glycémie, tension et cholestérol",
    "targets.title": "Vos objectifs quotidiens", "targets.note": "Calculés selon votre âge, poids, activité et pathologies. À titre indicatif.",



    

    

    

    


    



    

    



    

    "data.title": "Vos données restent sur votre appareil",

    "data.p2": "Exportez une sauvegarde pour protéger vos données ou les transférer sur un nouveau téléphone, puis importez-la là-bas.",
    "data.p3": "Vous pouvez supprimer définitivement toutes vos données à tout moment (RGPD).",
    "data.export": "⬇️ Exporter une sauvegarde", "data.import": "⬆️ Importer une sauvegarde", "data.wipe": "🗑️ Supprimer toutes mes données",
    "data.importconfirm": "Remplacer les données de cet appareil par la sauvegarde ?", "data.importfail": "Ce fichier n'est pas une sauvegarde Vital 40+ valide.",
    "data.wipeconfirm": "Supprimer définitivement toutes vos données de cet appareil ? Action irréversible.",
    "src.title": "Sources médicales", 

    "home.welcome": "👋 Bienvenue", 
    "home.today": "📓 Aujourd'hui", "home.kcal": "Votre objectif approximatif : {k} calories par jour", 

    "home.lesson": "💡 Conseil du jour",

    "app.tagline": "Photographiez votre repas — découvrez ce qu'il contient et la portion qui vous convient",
    "nav.home": "Scanner",
    "nav.habits": "Habitudes",
    "sub.sport": "🏃 Activité",
    "scan.title": "📷 Qu'y a-t-il dans votre assiette ?",
    "scan.intro": "Prenez votre repas en photo : nous estimons ses nutriments et proposons une portion adaptée à votre objectif santé.",
    "scan.camera": "📷 Prendre une photo",
    "scan.gallery": "🖼️ Choisir une photo",
    "scan.search": "🔍 Chercher un aliment",
    "scan.busy": "Analyse de votre repas…",
    "scan.yourmeal": "Votre repas",
    "scan.amount": "Quantité",
    "scan.meal": "Repas",
    "scan.add": "＋ Ajouter à mon journal",
    "scan.added": "Ajouté au journal du jour ✓",
    "scan.discard": "Annuler",
    "scan.total": "Total : {kcal} kcal · glucides nets {net} g · sucres ajoutés {sug} g · graisses saturées {sat} g · sodium {na} mg · fibres {fib} g",
    "scan.verdict.good": "Bilan : bien adapté à vos objectifs",
    "scan.verdict.limit": "Bilan : convient en portions plus petites",
    "scan.verdict.occasional": "Bilan : plutôt pour une fois de temps en temps",
    "scan.photonote": "L'estimation par photo peut varier de 20 à 30 %. Si vous connaissez le poids, corrigez les grammes.",
    "scan.dbnote": "Valeurs moyennes habituelles pour cet aliment.",
    "scan.unavailable": "L'analyse photo n'est pas disponible pour le moment — vous pouvez chercher un aliment.",
    "scan.ratelimit": "Trop de photos en peu de temps — réessayez plus tard.",
    "scan.overload": "Le service d'analyse est occupé — réessayez dans une minute.",
    "scan.error": "Une erreur est survenue. Réessayez.",
    "scan.notfood": "Aucun aliment trouvé sur cette photo. Essayez une photo plus nette et plus proche.",
    "scan.notimage": "Choisissez un fichier image.",
    "conf.high": "Estimation fiable",
    "conf.medium": "Estimation approximative",
    "conf.low": "Estimation incertaine",
    "lvl.good": "Bon choix",
    "lvl.limit": "Attention à la portion",
    "lvl.occasional": "Plutôt occasionnel",
    "pick.titleScan": "Chercher un aliment",
    "n.net": "Glucides nets",
    "adv.general": "🥗 Alimentation équilibrée",
    "adv.ok": "Convient bien dans cette quantité.",
    "adv.high": "{what} : {v} {u} dans cette portion — une quantité confortable est d'environ {cap} {u}.",
    "adv.portion": "Portion conseillée : environ {p}.",
    "adv.tiny": "juste une bouchée",
    "tip.diabetes": "Accompagnez-le de légumes ou de protéines, et marchez un peu après.",
    "tip.trig": "Buvez de l'eau plutôt que des boissons sucrées, et allez-y doucement sur le dessert.",
    "tip.bp": "N'ajoutez pas de sel et évitez sauces salées, fromage ou cornichons avec.",
    "tip.chol": "Préférez les versions grillées, au four ou vapeur plutôt que frites.",
    "tip.thyroid": "Pas de limite particulière — gardez une assiette équilibrée et variée.",
    "tip.general": "Remplissez la moitié de l'assiette de légumes.",
    "home.welcometext": "Choisissez votre objectif santé (glycémie, tension, cholestérol…) pour des conseils de portion adaptés.",
    "home.setup": "Choisir mon objectif →",
    "home.diary": "📓 Ouvrir mon journal",
    "cond.title": "Mon objectif santé (cochez ce que vous voulez surveiller)",
    "cond.note": "Cela adapte les conseils et les portions proposées. Ce n'est pas un diagnostic.",
    "note.carbmeal": "{meal} : {v} g de glucides. Si vous surveillez votre glycémie, 45–60 g par repas est un repère courant — moins de féculents, plus de légumes.",
    "data.p1": "Votre profil et votre journal sont stockés uniquement sur cet appareil. Pas de compte, pas de publicité, aucun pistage.",
    "data.photo": "Quand vous scannez un repas, la photo est envoyée de façon sécurisée à notre service d'analyse IA (Claude, d'Anthropic) uniquement pour estimer ses nutriments. Vital 40+ ne conserve pas vos photos.",
    "src.intro": "Les conseils alimentaires de cette app s'appuient sur ces recommandations publiques :",
    "src.ai": "Estimation des nutriments par photo : IA Claude (Anthropic)",
    "disclaimer": "⚠️ Vital 40+ fournit des informations nutritionnelles générales pour aider à mieux manger. Ce n'est pas un dispositif médical : il ne diagnostique ni ne traite et ne remplace pas l'avis de votre médecin ou diététicien. Si vous avez une maladie, suivez le plan de votre équipe soignante.",

    "nav.plan": "Programme",
    "plan.title": "🗣️ Mon programme repas & activité",
    "plan.intro": "Choisissez un objectif santé pour voir — ou écouter — quoi manger, quoi limiter, et l'activité qui accompagne vos repas.",
    "plan.heading": "Programme {c}",
    "plan.eat": "✅ À privilégier",
    "plan.limit": "⚖️ À limiter",
    "plan.avoid": "⏸️ Plutôt occasionnel",
    "plan.day": "🍽️ Une journée type",
    "plan.moves": "🏃 L'activité qui accompagne vos repas",
    "voice.listen": "🔊 Écouter",
    "voice.stop": "⏹️ Arrêter",
    "voice.novoice": "Votre appareil n'a pas de voix pour cette langue — ajoutez-en une dans les réglages de synthèse vocale du téléphone.",
  },

  ar: {
    "app.name": "Vital 40+ صحتي",

    "nav.food": "الأكل", "nav.more": "المزيد",
    "sub.diary": "📓 يومياتي", "sub.guide": "🍎 ماذا آكل؟", "sub.menu": "🍽️ وجبات",
    "sub.goals": "✅ أهداف اليوم",
    "sub.profile": "👤 ملفي", "sub.data": "🔒 بياناتي وخصوصيتي",

    "diary.prev": "اليوم السابق", "diary.next": "اليوم التالي", "diary.today": "اليوم",
    "diary.addfood": "＋ إضافة طعام", "diary.notes": "ملاحظات اليوم", "diary.approx": "القيم الغذائية تقريبية وتتغير حسب الوصفة والكمية.",
    "meal.bf": "الفطور", "meal.lunch": "الغداء", "meal.dinner": "العشاء", "meal.snack": "سناك",
    "n.kcal": "السعرات", "n.carb": "الكربوهيدرات", "n.fib": "ألياف", "n.sug": "سكر مضاف", "n.pro": "بروتين", "n.sat": "دهون مشبعة", "n.chol": "كوليسترول غذائي", "n.na": "صوديوم (الملح)",
    "u.g": "غ", "u.mg": "مغ", "u.kg": "كغ", "u.lb": "رطل", "u.cm": "سم", "u.in": "إنش", 
    "flag.salt": "ملح عالٍ", "flag.sugar": "سكر مضاف", "flag.sat": "دهون مشبعة", "flag.fiber": "ألياف ✓",
    "pick.title": "إضافة إلى {meal}", "pick.search": "ابحث: خبز، عدس، تمر، سردين…", "pick.none": "لا نتائج. أضف طعامك بالأسفل.", "pick.custom": "＋ طعام غير موجود؟ أضفه",
    "qty.label": "الكمية (عدد الحصص — الحصة: {unit})",
    "custom.title": "طعام جديد (القيم لكل حصة)", "custom.name": "اسم الطعام", "custom.unit": "الحصة (مثال: طبق، قطعة)", "custom.unitdef": "حصة",
    "btn.add": "إضافة", "btn.back": "→ رجوع", "btn.close": "إغلاق", "btn.saveNext": "حفظ ومتابعة", "btn.delete": "حذف",
    "note.empty": "سجّل وجباتك لتعرف أين تقف من أهدافك اليومية.",
    "note.na": "الصوديوم ({v} مغ) تجاوز هدفك. أكبر المصادر: {src}.",
    "note.sug": "السكر المضاف ({v} غ) فوق الهدف. المصدر: {src}.",
    "note.sat": "الدهون المشبعة ({v} غ) فوق الهدف. المصدر: {src}.",
    "note.chol": "الكوليسترول الغذائي ({v} مغ) فوق الهدف. المصدر: {src}.",

    "note.fib": "الألياف قليلة: أضف بقوليات أو شوفان أو خضر وفاكهة بقشرها.",
    "note.good": "ممتاز! أنت ضمن أهدافك حتى الآن 👏",

    "guide.general": "نصائح عامة", "guide.title": "ماذا آكل؟",
    "filter.all": "الكل", "filter.good": "✅ كُل", "filter.limit": "⚠️ بحذر", "filter.avoid": "⛔ تجنّب",
    "lv.good": "كُل", "lv.limit": "بحذر", "lv.avoid": "تجنّب",
    "plate.title": "طبق الصحة 🍽️", "plate.p1": "½ خضر وسلطة", "plate.p2": "¼ بروتين (سمك، دجاج، بقوليات)", "plate.p3": "¼ نشويات كاملة",
    "menu.title": "مقترحات وجبات اليوم", "menu.shuffle": "🔀 اقتراح آخر", "menu.note": "اشرب الماء، والملح والزيت بكميات قليلة. عدّل الكميات مع طبيبك أو أخصائي التغذية.",


    

    

    

    

    

    

    
    "goals.title": "أهداف اليوم", "goals.streak": "{d}/{n} اليوم · أيام متتالية بـ 5 أهداف أو أكثر: {s}",
    "sport.week": "برنامج الأسبوع", "sport.before": "⚠️ قبل أن تبدأ", "sport.benefit": "الفائدة: {b}",
    "sport.general": "استشر طبيبك قبل البدء خصوصًا فوق 40 سنة أو عند وجود ألم في الصدر أو ضيق تنفس. توقف فورًا عند الدوخة أو الألم.",

    "profile.title": "ملفي الصحي", "p.age": "العمر", "p.sex": "الجنس", "sex.m": "رجل", "sex.f": "امرأة",
    "p.weight": "الوزن ({u})", "p.height": "الطول ({u})", "p.waist": "محيط الخصر ({u})",
    "p.activity": "النشاط", "act.low": "قليل", "act.mid": "متوسط", "act.high": "عالٍ",
    "p.goal": "الهدف", "goal.keep": "ثبات الوزن", "goal.lose": "خسارة الوزن",
    "p.system": "وحدة الجسم", "sys.metric": "متري (كغ، سم)", "sys.imperial": "أمريكي (رطل، إنش)",

    "bmi.line": "مؤشر كتلة الجسم: {v} — {c}", "bmi.under": "نحافة، استشر طبيبك", "bmi.normal": "وزن طبيعي ✅", "bmi.over": "وزن زائد ⚠️ خسارة 5% من الوزن تحدث فرقًا كبيرًا", "bmi.obese": "سمنة ⚠️ خسارة 5–10% من الوزن تحسّن السكر والضغط والدهون كثيرًا",
    "targets.title": "أهدافك اليومية المحسوبة", "targets.note": "تُحسب من عمرك ووزنك ونشاطك وحالتك. للتوعية فقط.",



    

    

    

    


    



    

    



    

    "data.title": "بياناتك تبقى على جهازك",

    "data.p2": "صدّر نسخة احتياطية لتحفظ بياناتك أو تنقلها إلى هاتف جديد، ثم استوردها هناك.",
    "data.p3": "يمكنك حذف كل بياناتك نهائيًا في أي وقت.",
    "data.export": "⬇️ تصدير نسخة احتياطية", "data.import": "⬆️ استيراد نسخة احتياطية", "data.wipe": "🗑️ حذف كل بياناتي",
    "data.importconfirm": "استبدال البيانات الموجودة على هذا الجهاز بالنسخة الاحتياطية؟", "data.importfail": "هذا الملف ليس نسخة احتياطية صالحة من Vital 40+.",
    "data.wipeconfirm": "حذف كل بياناتك من هذا الجهاز نهائيًا؟ لا يمكن التراجع.",
    "src.title": "المراجع الطبية", 

    "home.welcome": "👋 أهلًا بك", 
    "home.today": "📓 اليوم", "home.kcal": "هدفك التقريبي: {k} سعرة يوميًا", 

    "home.lesson": "💡 معلومة اليوم",

    "app.tagline": "صوّر وجبتك — اعرف ما فيها والكمية المناسبة لك",
    "nav.home": "صوّر",
    "nav.habits": "عاداتي",
    "sub.sport": "🏃 الرياضة",
    "scan.title": "📷 ماذا في طبقك؟",
    "scan.intro": "صوّر وجبتك: نقدّر ما فيها من مغذيات ونقترح الكمية المناسبة لهدفك الصحي.",
    "scan.camera": "📷 التقط صورة",
    "scan.gallery": "🖼️ اختر صورة",
    "scan.search": "🔍 ابحث عن طعام",
    "scan.busy": "جارٍ تحليل وجبتك…",
    "scan.yourmeal": "وجبتك",
    "scan.amount": "الكمية",
    "scan.meal": "الوجبة",
    "scan.add": "＋ أضف إلى يومياتي",
    "scan.added": "أُضيفت إلى يوميات اليوم ✓",
    "scan.discard": "إلغاء",
    "scan.total": "المجموع: {kcal} kcal · كربوهيدرات صافية {net} غ · سكر مضاف {sug} غ · دهون مشبعة {sat} غ · صوديوم {na} مغ · ألياف {fib} غ",
    "scan.verdict.good": "الخلاصة: مناسبة لأهدافك",
    "scan.verdict.limit": "الخلاصة: مناسبة بكميات أصغر",
    "scan.verdict.occasional": "الخلاصة: الأفضل أن تكون من حين لآخر فقط",
    "scan.photonote": "التقدير من الصورة قد يختلف بنسبة 20–30%. إن كنت تعرف الوزن فصحّح الغرامات.",
    "scan.dbnote": "قيم متوسطة معتادة لهذا الطعام.",
    "scan.unavailable": "تحليل الصور غير متاح حاليًا — يمكنك البحث عن الطعام.",
    "scan.ratelimit": "صور كثيرة في وقت قصير — حاول لاحقًا.",
    "scan.overload": "خدمة التحليل مشغولة — حاول بعد دقيقة.",
    "scan.error": "حدث خطأ. حاول مرة أخرى.",
    "scan.notfood": "لم نجد طعامًا في هذه الصورة. جرّب صورة أوضح وأقرب.",
    "scan.notimage": "اختر ملف صورة.",
    "conf.high": "تقدير موثوق",
    "conf.medium": "تقدير تقريبي",
    "conf.low": "تقدير غير مؤكد",
    "lvl.good": "خيار جيد",
    "lvl.limit": "انتبه للكمية",
    "lvl.occasional": "الأفضل أحيانًا فقط",
    "pick.titleScan": "ابحث عن طعام",
    "n.net": "كربوهيدرات صافية",
    "adv.general": "🥗 أكل متوازن",
    "adv.ok": "مناسب بهذه الكمية.",
    "adv.high": "{what}: {v} {u} في هذه الكمية — الكمية المريحة حوالي {cap} {u}.",
    "adv.portion": "الكمية المقترحة: حوالي {p}.",
    "adv.tiny": "لقمة صغيرة فقط",
    "tip.diabetes": "كُله مع الخضر أو البروتين، وامشِ قليلًا بعده.",
    "tip.trig": "اشرب الماء بدل المشروبات المحلاة، وقلّل الحلوى.",
    "tip.bp": "لا تضف الملح، وتجنّب معه الصلصات المالحة والجبن والمخللات.",
    "tip.chol": "اختر المشوي أو المطبوخ في الفرن أو على البخار بدل المقلي.",
    "tip.thyroid": "لا حدّ خاص — حافظ على طبق متوازن ومتنوع.",
    "tip.general": "املأ نصف طبقك بالخضر.",
    "home.welcometext": "اختر هدفك الصحي (سكر الدم، الضغط، الكوليسترول…) لتناسبك نصائح الكميات.",
    "home.setup": "اختر هدفي ←",
    "home.diary": "📓 افتح يومياتي",
    "cond.title": "هدفي الصحي (اختر ما تريد مراقبته)",
    "cond.note": "هذا يكيّف نصائح الأكل والكميات المقترحة، وليس تشخيصًا.",
    "note.carbmeal": "{meal}: {v} غ كربوهيدرات. إن كنت تراقب سكر الدم فـ 45–60 غ للوجبة مرجع شائع — قلّل النشويات وزد الخضر.",
    "data.p1": "ملفك ويومياتك محفوظة فقط على هذا الجهاز. لا حساب، لا إعلانات، ولا تتبّع.",
    "data.photo": "عند تصوير وجبة تُرسل الصورة بأمان إلى خدمة التحليل بالذكاء الاصطناعي (Claude من Anthropic) فقط لتقدير مغذياتها، ولا يحتفظ Vital 40+ بصورك.",
    "src.intro": "نصائح الأكل في هذا التطبيق مبنية على هذه التوصيات العامة:",
    "src.ai": "تقدير المغذيات من الصور: الذكاء الاصطناعي Claude (Anthropic)",
    "disclaimer": "⚠️ يقدّم Vital 40+ معلومات غذائية عامة تساعد على الأكل الصحي. ليس جهازًا طبيًا، ولا يشخّص ولا يعالج ولا يغني عن طبيبك أو أخصائي التغذية. إن كان عندك مرض فاتّبع خطة فريقك الطبي.",

    "nav.plan": "برنامجي",
    "plan.title": "🗣️ برنامج أكلي ورياضتي",
    "plan.intro": "اختر هدفك الصحي لتقرأ أو تسمع: ماذا تأكل، ماذا تقلّل، والرياضة المناسبة مع وجباتك.",
    "plan.heading": "برنامج {c}",
    "plan.eat": "✅ كُل أكثر من",
    "plan.limit": "⚖️ قلّل من",
    "plan.avoid": "⏸️ أحيانًا فقط",
    "plan.day": "🍽️ يوم أكل نموذجي",
    "plan.moves": "🏃 الرياضة المناسبة مع وجباتك",
    "voice.listen": "🔊 استمع",
    "voice.stop": "⏹️ أوقف",
    "voice.novoice": "لا يوجد صوت لهذه اللغة في جهازك — أضفه من إعدادات تحويل النص إلى كلام في الهاتف.",
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
