CONTENT.en = (() => {
  const CONDITIONS = {
    chol: {
      label: "Cholesterol",
      emoji: "🩸",
      tips: [
        "Cut saturated fat: fatty red meat, butter, cream, full-fat cheese, poultry skin.",
        "Avoid trans fats (hydrogenated oils in packaged snacks, pastries and fried fast food).",
        "Eat more soluble fiber: oats, barley, beans, lentils, apples.",
        "Cook with olive or canola oil, and eat oily fish (salmon, sardines, mackerel) twice a week.",
      ],
    },
    trig: {
      label: "Triglycerides",
      emoji: "🧪",
      tips: [
        "Cut sugar, sweets, soda and fruit juice — they raise triglycerides quickly.",
        "Limit refined carbs: white bread, white rice, regular pasta, pastries.",
        "Limit alcohol — ideally avoid it while your triglycerides are high.",
        "Eat oily fish (salmon, sardines, mackerel) twice a week for omega-3s.",
      ],
    },
    bp: {
      label: "Blood pressure & salt",
      emoji: "❤️",
      tips: [
        "Keep sodium under 2,000 mg a day (about 5 g of salt) — ideally 1,500 mg if your blood pressure is high.",
        "Most sodium hides in bread, deli meats, cheese, canned soup, pizza and restaurant food. Read labels.",
        "Season with garlic, lemon, herbs and spices instead of salt.",
        "Eat potassium-rich foods: bananas, tomatoes, spinach, beans, potatoes (the DASH diet).",
      ],
    },
    diabetes: {
      label: "Blood sugar",
      emoji: "🍬",
      tips: [
        "Eat 3 regular meals — avoid long gaps followed by a big meal.",
        "Choose complex carbs (whole grains, beans) in measured portions.",
        "Fill half your plate with vegetables, a quarter with protein and a quarter with starch.",
        "Skip added sugar and juice; keep dried fruit and dates to very small amounts.",
        "Walk for 10 minutes after meals — it lowers blood sugar.",
      ],
    },
    thyroid: {
      label: "Thyroid",
      emoji: "🦋",
      tips: [
        "If you take thyroid medication, ask your pharmacist how to time it around meals and supplements.",
        "Soy and cruciferous vegetables (cabbage, cauliflower, broccoli) are fine cooked and in normal amounts.",
        "Thyroid problems affect weight and energy — follow up regularly with your doctor.",
      ],
    },
  };

  const FOODS = [
    { name: "Oats / oatmeal", emoji: "🥣", good: ["chol", "trig", "diabetes", "bp"], note: "Soluble fiber lowers cholesterol. Choose it without added sugar." },
    { name: "Lentils & beans", emoji: "🫘", good: ["chol", "trig", "diabetes", "bp", "thyroid"], note: "Protein and fiber with a low glycemic index." },
    { name: "Chickpeas & hummus", emoji: "🧆", good: ["chol", "trig", "diabetes", "bp"], note: "Filling and keeps blood sugar steady." },
    { name: "Leafy greens (spinach, kale, lettuce)", emoji: "🥬", good: ["chol", "trig", "diabetes", "bp", "thyroid"], note: "Low in calories and rich in minerals." },
    { name: "Broccoli, carrots, zucchini", emoji: "🥦", good: ["chol", "trig", "diabetes", "bp"], note: "Fiber and antioxidants. Cook them if you have a thyroid condition." },
    { name: "Tomatoes", emoji: "🍅", good: ["chol", "bp", "diabetes"], note: "Potassium and lycopene, good for the heart." },
    { name: "Garlic & onions", emoji: "🧄", good: ["chol", "bp", "diabetes"], note: "Flavor instead of salt." },
    { name: "Oily fish (salmon, sardines, mackerel)", emoji: "🐟", good: ["chol", "trig", "bp", "diabetes", "thyroid"], note: "Omega-3s lower triglycerides. Grill or bake." },
    { name: "Skinless chicken or turkey", emoji: "🍗", good: ["chol", "trig", "bp", "diabetes"], note: "Lean protein — avoid frying." },
    { name: "Extra-virgin olive oil", emoji: "🫒", good: ["chol", "trig", "bp", "diabetes"], note: "Heart-healthy fat; 1–2 tablespoons a day." },
    { name: "Unsalted nuts (almonds, walnuts)", emoji: "🥜", good: ["chol", "trig", "diabetes", "bp"], note: "About a handful (30 g / 1 oz) a day." },
    { name: "Apples, berries, pears", emoji: "🍎", good: ["chol", "trig", "diabetes", "bp"], note: "High in fiber — eat the skin." },
    { name: "Avocado", emoji: "🥑", good: ["chol", "bp", "diabetes"], note: "Healthy fats and potassium; half an avocado is a portion." },
    { name: "Banana", emoji: "🍌", good: ["bp"], limit: ["diabetes"], note: "Potassium for blood pressure; with diabetes, one small banana." },
    { name: "Plain yogurt (incl. unsweetened Greek)", emoji: "🥛", good: ["bp", "diabetes", "chol", "trig"], note: "Protein and calcium." },
    { name: "Whole-grain bread", emoji: "🍞", good: ["chol", "trig", "diabetes", "bp"], note: "A small portion with a meal." },
    { name: "Brown rice, barley, quinoa", emoji: "🌾", good: ["chol", "trig", "diabetes", "bp"], note: "Better than white rice or white pasta." },
    { name: "Unsweetened tea & coffee", emoji: "🍵", good: ["chol", "trig", "diabetes", "bp"], note: "Water is always the best drink." },
    { name: "Water", emoji: "💧", good: ["chol", "trig", "diabetes", "bp", "thyroid"], note: "About 8 glasses a day." },

    { name: "Dates & dried fruit", emoji: "🌴", limit: ["diabetes", "trig"], note: "Concentrated sugar; 1–2 pieces, ideally with nuts or yogurt." },
    { name: "White bread, bagels, baguette", emoji: "🥖", limit: ["diabetes", "trig"], note: "Raise blood sugar fast and are often salty." },
    { name: "White pasta & white rice", emoji: "🍝", limit: ["diabetes", "trig"], note: "Keep to a quarter of the plate, with plenty of vegetables." },
    { name: "Potatoes", emoji: "🥔", limit: ["diabetes", "trig"], note: "Boiled or baked in small portions — not fried." },
    { name: "Red meat (beef, lamb, pork)", emoji: "🥩", limit: ["chol"], note: "Once or twice a week; choose lean cuts." },
    { name: "Eggs", emoji: "🥚", limit: ["chol"], note: "Up to 3–4 a week if your cholesterol is high." },
    { name: "Cheese", emoji: "🧀", limit: ["bp", "chol"], note: "Salt and saturated fat." },
    { name: "Honey, jam, maple syrup", emoji: "🍯", limit: ["trig"], avoid: ["diabetes"], note: "Simple sugars." },
    { name: "Soy foods (tofu, soy milk)", emoji: "🌱", limit: ["thyroid"], note: "May interfere with thyroid medication absorption — keep them apart." },
    { name: "Pickles, olives, soy sauce", emoji: "🥒", avoid: ["bp"], note: "Very high in salt." },
    { name: "Canned soup & instant noodles", emoji: "🍜", avoid: ["bp"], note: "Hidden salt — often over 800 mg sodium per serving." },

    { name: "Soda & energy drinks", emoji: "🥤", avoid: ["diabetes", "trig", "chol", "bp"], note: "Liquid sugar that raises blood sugar and triglycerides." },
    { name: "Fruit juice & sweetened drinks", emoji: "🧃", avoid: ["diabetes", "trig"], limit: ["chol", "bp"], note: "Sugar without fiber — whole fruit is better." },
    { name: "Cakes, cookies, donuts, pastries", emoji: "🍰", avoid: ["diabetes", "trig", "chol"], limit: ["bp"], note: "Sugar plus saturated and trans fats." },
    { name: "Fried foods (fries, fried chicken, chips)", emoji: "🍟", avoid: ["chol", "trig"], limit: ["diabetes", "bp"], note: "Reheated oils and unhealthy fats." },
    { name: "Processed meats (bacon, hot dogs, deli meats, sausages)", emoji: "🌭", avoid: ["chol", "bp"], limit: ["trig", "diabetes"], note: "Salt, saturated fat and preservatives." },
    { name: "Butter, cream, lard", emoji: "🧈", avoid: ["chol", "trig"], limit: ["bp", "diabetes"], note: "Saturated fat raises LDL (bad) cholesterol." },
    { name: "Alcohol", emoji: "🍺", avoid: ["trig", "bp", "diabetes"], limit: ["chol", "thyroid"], note: "Raises triglycerides and blood pressure." },
  ];

  const MENU = {
    Breakfast: [
      "Oatmeal with berries, cinnamon and a few walnuts (no sugar)",
      "Plain Greek yogurt with berries and a handful of almonds",
      "Whole-grain toast with avocado, a boiled egg and tomato",
    ],
    Lunch: [
      "Grilled chicken salad with chickpeas, olive oil and lemon + a small whole-grain roll",
      "Low-salt lentil soup + a big green salad with olive oil",
      "Baked salmon + steamed broccoli + ½ cup quinoa or brown rice",
    ],
    Dinner: [
      "Tuna and bean salad with vegetables + a slice of whole-grain bread",
      "Vegetable stir-fry with tofu or chicken (low-sodium sauce) + a small portion of brown rice",
      "Homemade vegetable soup + plain yogurt",
    ],
    Snacks: [
      "An apple or a pear",
      "A small handful of unsalted almonds or walnuts",
      "Carrot and cucumber sticks with hummus",
      "Green or herbal tea, no sugar",
    ],
  };

  const EXERCISES = [
    { name: "Brisk walking", emoji: "🚶", duration: "30 minutes, 5 days a week", level: "Beginner", how: "Walk fast enough that you can talk but not sing. Start with 10 minutes and build up gradually.", benefits: "Lowers blood sugar, blood pressure and triglycerides, and raises HDL (good) cholesterol." },
    { name: "After-meal walk", emoji: "🌙", duration: "10–15 minutes after each main meal", level: "Beginner", how: "An easy walk after lunch and dinner.", benefits: "Noticeably reduces the blood-sugar spike after eating." },
    { name: "Chair squats", emoji: "🪑", duration: "2 sets × 10", level: "Beginner", how: "Sit on a chair, stand up slowly, then sit back down. Keep your back straight and don't hold your breath.", benefits: "Strengthens the leg muscles that burn blood sugar." },
    { name: "Wall push-ups", emoji: "🧱", duration: "2 sets × 10", level: "Beginner", how: "Stand facing a wall, push away with straight arms, then lower slowly.", benefits: "Strengthens chest and arms without straining blood pressure." },
    { name: "Glute bridge", emoji: "🌉", duration: "2 sets × 12", level: "Beginner", how: "Lie on your back with knees bent, lift your hips, then lower slowly.", benefits: "Strengthens the back and glutes and helps prevent back pain." },
    { name: "Resistance-band training", emoji: "🎗️", duration: "20 minutes, 2–3 days a week", level: "Intermediate", how: "Arm, back and leg exercises with an elastic band, breathing steadily.", benefits: "Builds muscle and improves insulin sensitivity." },
    { name: "Swimming or cycling", emoji: "🚴", duration: "30 minutes, 2–3 times a week", level: "Intermediate", how: "At a moderate pace — good if you have knee pain or extra weight.", benefits: "Gentle cardio that's easy on the joints." },
    { name: "Stretching & deep breathing", emoji: "🧘", duration: "10 minutes a day", level: "Beginner", how: "Stretch neck, shoulders, back and legs. Inhale deeply through the nose, exhale slowly.", benefits: "Reduces stress, which raises blood pressure and blood sugar." },
  ];

  const WEEK_PLAN = [
    ["Monday", "Brisk walk, 30 min"],
    ["Tuesday", "Light strength training 20 min + stretching"],
    ["Wednesday", "Brisk walk, 30 min"],
    ["Thursday", "Swimming or cycling, 30 min"],
    ["Friday", "Light strength training 20 min + stretching"],
    ["Saturday", "Brisk walk, 30–40 min"],
    ["Sunday", "Rest / easy walk + deep breathing"],
  ];

  const EXERCISE_WARNINGS = {
    bp: "Blood pressure: don't hold your breath while exercising, and avoid very heavy weights.",
    diabetes: "Diabetes: check your blood sugar before and after exercise and carry fast sugar in case of a low. If your sugar is above 250 mg/dL (13.9 mmol/L) or you use insulin, ask your doctor first.",
    chol: "Cholesterol: consistency matters most — results show after 8–12 weeks.",
    trig: "Triglycerides: regular walking lowers them, especially combined with less sugar.",
    thyroid: "Thyroid: start gradually — fatigue is common when hormones are off balance.",
  };


  const LESSONS = [
    { t: "Why does blood sugar rise after eating?", b: "Carbohydrates (bread, rice, pasta, sweets) turn into blood sugar. Eating them with vegetables, protein and fiber slows the rise — and a 10-minute walk after the meal lowers it further." },
    { t: "Hidden salt", b: "Most salt doesn't come from the shaker but from bread, cheese, deli meats, canned soup and restaurant food. One teaspoon of salt (6 g) contains about 2,300 mg of sodium." },
    { t: "Good and bad cholesterol", b: "LDL (bad) builds up in the arteries; HDL (good) carries cholesterol away. Fiber (oats, beans), olive oil and regular walking improve both." },
    { t: "Triglycerides and sugar", b: "Sugar, sweet drinks and alcohol raise triglycerides fast. Dropping soda and juice alone can lower them noticeably within weeks." },
    { t: "The plate method", b: "Half the plate vegetables, a quarter protein (fish, chicken, beans), a quarter whole-grain starch. This one rule solves most portion problems." },
    { t: "Sleep and blood sugar", b: "Sleeping under 6 hours raises insulin resistance and cravings for sweets. Aim for 7 hours at regular times." },
    { t: "Stress and blood pressure", b: "Chronic stress raises blood pressure and blood sugar. Five minutes of slow breathing (inhale 4 s, exhale 6 s) calms the nervous system." },
    { t: "Reading food labels", b: "Per 100 g: under 5 g sugars, 1.5 g saturated fat and 0.3 g salt is low. Over 22.5 g sugars or 1.5 g salt is high. In the US, 5% Daily Value or less is low, 20% or more is high." },
    { t: "Fiber is your friend", b: "You need 25–30 g of fiber a day: beans, oats, vegetables and fruit with the skin. It lowers cholesterol and blood sugar and keeps you full." },
    { t: "Muscles protect your blood sugar", b: "Strength training twice a week improves insulin sensitivity and preserves muscle after 40. It's not just for young people." },
    { t: "Drink water", b: "Swap juice and soda for water or unsweetened tea. Even 100% juice raises blood sugar because it has no fiber — whole fruit is better." },
    { t: "Healthy cooking", b: "Grilling, steaming and baking beat frying. Measure oil with a spoon instead of pouring — one tablespoon is about 120 calories." },
    { t: "Measuring blood pressure correctly", b: "Sit quietly for 5 minutes, arm supported at heart level, no coffee or smoking for 30 minutes before. Take 2 readings a minute apart, morning and evening, and log the average." },
    { t: "Regular check-ups", b: "After 40: a lipid panel and fasting glucose (or HbA1c) at least once a year, and blood pressure at every visit. Ask your doctor about a thyroid test (TSH)." },
    { t: "Eat slowly", b: "Feeling full takes about 20 minutes. Put your fork down between bites and avoid eating in front of a screen." },
  ];



  const DAILY_CHECKS = [
    { id: "water", label: "Drank 8 glasses of water 💧" },
    { id: "walk", label: "Walked 30 minutes 🚶" },
    { id: "veg", label: "Ate 5 servings of vegetables & fruit 🥗" },
    { id: "nosoda", label: "No soda or sweetened drinks 🥤" },
    { id: "salt", label: "No added salt 🧂" },
    { id: "sugar", label: "No sugar or sweets today 🍰" },
    { id: "meds", label: "Took my medication on time 💊" },
    { id: "sleep", label: "Slept at least 7 hours 😴" },
  ];

  const GENERAL_TIPS = [
    "Eat more vegetables, beans and fish, and less processed meat.",
    "Cut down on sugar, salt and fried food.",
    "Move for 30 minutes a day.",
    "Choose your conditions in More → My profile to get personalized advice and food lists.",
  ];

  return { CONDITIONS, FOODS, MENU, EXERCISES, WEEK_PLAN, EXERCISE_WARNINGS, LESSONS, DAILY_CHECKS, GENERAL_TIPS };
})();
