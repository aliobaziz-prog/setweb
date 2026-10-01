CONTENT.fr = (() => {
  const CONDITIONS = {
    chol: {
      label: "Cholestérol",
      emoji: "🩸",
      tips: [
        "Réduisez les graisses saturées : viande rouge grasse, beurre, crème, fromages gras, peau de volaille.",
        "Évitez les acides gras trans (huiles hydrogénées des biscuits, viennoiseries industrielles et fritures).",
        "Mangez plus de fibres solubles : avoine, orge, légumineuses, lentilles, pommes.",
        "Cuisinez à l'huile d'olive ou de colza et mangez du poisson gras (saumon, sardines, maquereau) deux fois par semaine.",
      ],
    },
    trig: {
      label: "Triglycérides",
      emoji: "🧪",
      tips: [
        "Réduisez le sucre, les sucreries, les sodas et les jus de fruits : ils font monter les triglycérides rapidement.",
        "Limitez les glucides raffinés : pain blanc, riz blanc, pâtes classiques, viennoiseries.",
        "Limitez l'alcool — idéalement, évitez-le tant que vos triglycérides sont élevés.",
        "Mangez du poisson gras deux fois par semaine pour les oméga-3.",
      ],
    },
    bp: {
      label: "Tension & sel",
      emoji: "❤️",
      tips: [
        "Moins de 2 000 mg de sodium par jour (environ 5 g de sel) — idéalement 1 500 mg en cas d'hypertension.",
        "Le sel se cache surtout dans le pain, la charcuterie, le fromage, les soupes industrielles, la pizza et les plats au restaurant. Lisez les étiquettes.",
        "Assaisonnez avec ail, citron, herbes et épices plutôt qu'avec du sel.",
        "Mangez des aliments riches en potassium : banane, tomate, épinards, légumineuses, pommes de terre (régime DASH).",
      ],
    },
    diabetes: {
      label: "Glycémie",
      emoji: "🍬",
      tips: [
        "Prenez 3 repas réguliers — évitez les longues périodes sans manger suivies d'un gros repas.",
        "Choisissez des glucides complexes (céréales complètes, légumineuses) en portions mesurées.",
        "Remplissez la moitié de l'assiette de légumes, un quart de protéines et un quart de féculents.",
        "Évitez le sucre ajouté et les jus ; dattes et fruits secs en très petite quantité.",
        "Marchez 10 minutes après les repas : cela fait baisser la glycémie.",
      ],
    },
    thyroid: {
      label: "Thyroïde",
      emoji: "🦋",
      tips: [
        "Si vous prenez un traitement pour la thyroïde, demandez à votre pharmacien comment l'espacer des repas et des compléments.",
        "Le soja et les crucifères (chou, chou-fleur, brocoli) sont sans problème cuits et en quantité normale.",
        "La thyroïde influence le poids et l'énergie : faites un suivi régulier avec votre médecin.",
      ],
    },
  };

  const FOODS = [
    { name: "Flocons d'avoine", emoji: "🥣", good: ["chol", "trig", "diabetes", "bp"], note: "Fibres solubles qui baissent le cholestérol. Sans sucre ajouté." },
    { name: "Lentilles & haricots secs", emoji: "🫘", good: ["chol", "trig", "diabetes", "bp", "thyroid"], note: "Protéines et fibres, index glycémique bas." },
    { name: "Pois chiches & houmous", emoji: "🧆", good: ["chol", "trig", "diabetes", "bp"], note: "Rassasiants, stabilisent la glycémie." },
    { name: "Légumes verts (épinards, chou kale, salade)", emoji: "🥬", good: ["chol", "trig", "diabetes", "bp", "thyroid"], note: "Peu caloriques et riches en minéraux." },
    { name: "Brocoli, carottes, courgettes", emoji: "🥦", good: ["chol", "trig", "diabetes", "bp"], note: "Fibres et antioxydants. Cuits si vous avez un problème de thyroïde." },
    { name: "Tomates", emoji: "🍅", good: ["chol", "bp", "diabetes"], note: "Potassium et lycopène, bons pour le cœur." },
    { name: "Ail & oignons", emoji: "🧄", good: ["chol", "bp", "diabetes"], note: "Du goût sans sel." },
    { name: "Poissons gras (saumon, sardines, maquereau)", emoji: "🐟", good: ["chol", "trig", "bp", "diabetes", "thyroid"], note: "Les oméga-3 baissent les triglycérides. Grillés ou au four." },
    { name: "Poulet ou dinde sans peau", emoji: "🍗", good: ["chol", "trig", "bp", "diabetes"], note: "Protéine maigre — évitez la friture." },
    { name: "Huile d'olive vierge extra", emoji: "🫒", good: ["chol", "trig", "bp", "diabetes"], note: "Bonne graisse pour le cœur ; 1 à 2 cuillères à soupe par jour." },
    { name: "Fruits à coque non salés (amandes, noix)", emoji: "🥜", good: ["chol", "trig", "diabetes", "bp"], note: "Environ une poignée (30 g) par jour." },
    { name: "Pommes, fruits rouges, poires", emoji: "🍎", good: ["chol", "trig", "diabetes", "bp"], note: "Riches en fibres — mangez la peau." },
    { name: "Avocat", emoji: "🥑", good: ["chol", "bp", "diabetes"], note: "Bonnes graisses et potassium ; un demi-avocat par portion." },
    { name: "Banane", emoji: "🍌", good: ["bp"], limit: ["diabetes"], note: "Potassium pour la tension ; en cas de diabète, une petite banane." },
    { name: "Yaourt nature (y compris grec sans sucre)", emoji: "🥛", good: ["bp", "diabetes", "chol", "trig"], note: "Protéines et calcium." },
    { name: "Pain complet", emoji: "🍞", good: ["chol", "trig", "diabetes", "bp"], note: "Une petite portion avec le repas." },
    { name: "Riz complet, orge, quinoa", emoji: "🌾", good: ["chol", "trig", "diabetes", "bp"], note: "Mieux que le riz blanc ou les pâtes blanches." },
    { name: "Thé et café sans sucre", emoji: "🍵", good: ["chol", "trig", "diabetes", "bp"], note: "L'eau reste la meilleure boisson." },
    { name: "Eau", emoji: "💧", good: ["chol", "trig", "diabetes", "bp", "thyroid"], note: "Environ 8 verres par jour." },

    { name: "Dattes & fruits secs", emoji: "🌴", limit: ["diabetes", "trig"], note: "Sucre concentré ; 1 à 2 pièces, idéalement avec des noix ou un yaourt." },
    { name: "Pain blanc, baguette", emoji: "🥖", limit: ["diabetes", "trig"], note: "Font monter la glycémie vite et sont souvent salés." },
    { name: "Pâtes & riz blancs", emoji: "🍝", limit: ["diabetes", "trig"], note: "Un quart de l'assiette, avec beaucoup de légumes." },
    { name: "Pommes de terre", emoji: "🥔", limit: ["diabetes", "trig"], note: "À l'eau ou au four, en petite portion — pas frites." },
    { name: "Viande rouge (bœuf, agneau, porc)", emoji: "🥩", limit: ["chol"], note: "Une à deux fois par semaine, morceaux maigres." },
    { name: "Œufs", emoji: "🥚", limit: ["chol"], note: "Jusqu'à 3–4 par semaine si votre cholestérol est élevé." },
    { name: "Fromage", emoji: "🧀", limit: ["bp", "chol"], note: "Sel et graisses saturées." },
    { name: "Miel, confiture, sirop d'érable", emoji: "🍯", limit: ["trig"], avoid: ["diabetes"], note: "Sucres simples." },
    { name: "Produits à base de soja", emoji: "🌱", limit: ["thyroid"], note: "Peuvent gêner l'absorption du traitement thyroïdien — espacez les prises." },
    { name: "Cornichons, olives, sauce soja", emoji: "🥒", avoid: ["bp"], note: "Très riches en sel." },
    { name: "Soupes industrielles & nouilles instantanées", emoji: "🍜", avoid: ["bp"], note: "Sel caché — souvent plus de 800 mg de sodium par portion." },

    { name: "Sodas & boissons énergisantes", emoji: "🥤", avoid: ["diabetes", "trig", "chol", "bp"], note: "Sucre liquide qui fait monter glycémie et triglycérides." },
    { name: "Jus de fruits & boissons sucrées", emoji: "🧃", avoid: ["diabetes", "trig"], limit: ["chol", "bp"], note: "Du sucre sans fibres — le fruit entier est meilleur." },
    { name: "Gâteaux, biscuits, viennoiseries", emoji: "🍰", avoid: ["diabetes", "trig", "chol"], limit: ["bp"], note: "Sucre plus graisses saturées et trans." },
    { name: "Fritures (frites, poulet frit, chips)", emoji: "🍟", avoid: ["chol", "trig"], limit: ["diabetes", "bp"], note: "Huiles réchauffées et mauvaises graisses." },
    { name: "Charcuterie (saucisson, jambon, saucisses, lardons)", emoji: "🌭", avoid: ["chol", "bp"], limit: ["trig", "diabetes"], note: "Sel, graisses saturées et conservateurs." },
    { name: "Beurre, crème, saindoux", emoji: "🧈", avoid: ["chol", "trig"], limit: ["bp", "diabetes"], note: "Les graisses saturées augmentent le LDL (mauvais cholestérol)." },
    { name: "Alcool", emoji: "🍷", avoid: ["trig", "bp", "diabetes"], limit: ["chol", "thyroid"], note: "Augmente les triglycérides et la tension." },
  ];

  const MENU = {
    "Petit-déjeuner": [
      "Flocons d'avoine aux fruits rouges, cannelle et quelques noix (sans sucre)",
      "Yaourt grec nature, fruits rouges et une poignée d'amandes",
      "Pain complet avec avocat, un œuf dur et une tomate",
    ],
    "Déjeuner": [
      "Salade de poulet grillé aux pois chiches, huile d'olive et citron + un petit pain complet",
      "Soupe de lentilles peu salée + grande salade verte à l'huile d'olive",
      "Saumon au four + brocoli vapeur + ½ tasse de quinoa ou riz complet",
    ],
    "Dîner": [
      "Salade de thon et haricots aux légumes + une tranche de pain complet",
      "Poêlée de légumes au tofu ou poulet (sauce pauvre en sel) + un peu de riz complet",
      "Soupe de légumes maison + yaourt nature",
    ],
    "Collations": [
      "Une pomme ou une poire",
      "Une petite poignée d'amandes ou de noix non salées",
      "Bâtonnets de carotte et concombre avec houmous",
      "Thé vert ou tisane sans sucre",
    ],
  };

  const EXERCISES = [
    { name: "Marche rapide", emoji: "🚶", duration: "30 minutes, 5 jours par semaine", level: "Débutant", how: "Marchez assez vite pour pouvoir parler mais pas chanter. Commencez par 10 minutes et augmentez progressivement.", benefits: "Baisse la glycémie, la tension et les triglycérides, et augmente le HDL (bon cholestérol)." },
    { name: "Marche après le repas", emoji: "🌙", duration: "10–15 minutes après chaque repas principal", level: "Débutant", how: "Une marche tranquille après le déjeuner et le dîner.", benefits: "Réduit nettement le pic de glycémie après le repas." },
    { name: "Squats sur chaise", emoji: "🪑", duration: "2 séries × 10", level: "Débutant", how: "Asseyez-vous, levez-vous lentement puis rasseyez-vous. Dos droit, sans bloquer la respiration.", benefits: "Renforce les muscles des jambes, grands consommateurs de sucre." },
    { name: "Pompes contre le mur", emoji: "🧱", duration: "2 séries × 10", level: "Débutant", how: "Face au mur, poussez bras tendus puis revenez lentement.", benefits: "Renforce pectoraux et bras sans faire monter la tension." },
    { name: "Pont fessier", emoji: "🌉", duration: "2 séries × 12", level: "Débutant", how: "Allongé sur le dos, genoux pliés, montez le bassin puis redescendez lentement.", benefits: "Renforce le dos et les fessiers, prévient le mal de dos." },
    { name: "Élastique de résistance", emoji: "🎗️", duration: "20 minutes, 2 à 3 fois par semaine", level: "Intermédiaire", how: "Exercices pour bras, dos et jambes avec un élastique, en respirant régulièrement.", benefits: "Augmente la masse musculaire et la sensibilité à l'insuline." },
    { name: "Natation ou vélo", emoji: "🚴", duration: "30 minutes, 2 à 3 fois par semaine", level: "Intermédiaire", how: "À allure modérée — idéal en cas de douleurs aux genoux ou de surpoids.", benefits: "Cardio doux pour les articulations." },
    { name: "Étirements & respiration profonde", emoji: "🧘", duration: "10 minutes par jour", level: "Débutant", how: "Étirez cou, épaules, dos et jambes. Inspirez profondément par le nez, expirez lentement.", benefits: "Réduit le stress, qui fait monter tension et glycémie." },
  ];

  const WEEK_PLAN = [
    ["Lundi", "Marche rapide 30 min"],
    ["Mardi", "Renforcement léger 20 min + étirements"],
    ["Mercredi", "Marche rapide 30 min"],
    ["Jeudi", "Natation ou vélo 30 min"],
    ["Vendredi", "Renforcement léger 20 min + étirements"],
    ["Samedi", "Marche rapide 30–40 min"],
    ["Dimanche", "Repos / marche tranquille + respiration"],
  ];

  const EXERCISE_WARNINGS = {
    bp: "Tension : ne bloquez pas votre respiration pendant l'effort et évitez les charges très lourdes.",
    diabetes: "Diabète : mesurez votre glycémie avant et après l'effort et gardez du sucre rapide sur vous. Si votre glycémie dépasse 2,5 g/L (13,9 mmol/L) ou si vous êtes sous insuline, demandez d'abord l'avis de votre médecin.",
    chol: "Cholestérol : la régularité compte le plus — les résultats apparaissent après 8 à 12 semaines.",
    trig: "Triglycérides : la marche régulière les fait baisser, surtout avec moins de sucre.",
    thyroid: "Thyroïde : commencez progressivement, la fatigue est fréquente en cas de déséquilibre hormonal.",
  };


  const LESSONS = [
    { t: "Pourquoi la glycémie monte-t-elle après le repas ?", b: "Les glucides (pain, riz, pâtes, sucreries) se transforment en sucre dans le sang. Les manger avec des légumes, des protéines et des fibres ralentit la hausse, et 10 minutes de marche après le repas la font baisser." },
    { t: "Le sel caché", b: "La plupart du sel ne vient pas de la salière mais du pain, du fromage, de la charcuterie, des soupes industrielles et des plats préparés. Une cuillère à café de sel (6 g) contient environ 2 300 mg de sodium." },
    { t: "Bon et mauvais cholestérol", b: "Le LDL (mauvais) se dépose dans les artères ; le HDL (bon) l'en évacue. Les fibres (avoine, légumineuses), l'huile d'olive et la marche régulière améliorent les deux." },
    { t: "Triglycérides et sucre", b: "Le sucre, les boissons sucrées et l'alcool font monter les triglycérides rapidement. Supprimer sodas et jus suffit souvent à les faire baisser en quelques semaines." },
    { t: "La règle de l'assiette", b: "La moitié de légumes, un quart de protéines (poisson, poulet, légumineuses), un quart de féculents complets. Cette règle règle la plupart des problèmes de portions." },
    { t: "Sommeil et glycémie", b: "Dormir moins de 6 heures augmente la résistance à l'insuline et l'envie de sucré. Visez 7 heures à heures régulières." },
    { t: "Stress et tension", b: "Le stress chronique fait monter la tension et la glycémie. Cinq minutes de respiration lente (inspirez 4 s, expirez 6 s) apaisent le système nerveux." },
    { t: "Lire les étiquettes", b: "Pour 100 g : moins de 5 g de sucres, 1,5 g de graisses saturées et 0,3 g de sel, c'est peu. Plus de 22,5 g de sucres ou 1,5 g de sel, c'est beaucoup. Le Nutri-Score A ou B est un bon repère." },
    { t: "Les fibres, vos alliées", b: "Il faut 25 à 30 g de fibres par jour : légumineuses, avoine, légumes et fruits avec la peau. Elles baissent cholestérol et glycémie et rassasient." },
    { t: "Vos muscles protègent votre glycémie", b: "Le renforcement musculaire deux fois par semaine améliore la sensibilité à l'insuline et préserve les muscles après 40 ans. Ce n'est pas réservé aux jeunes." },
    { t: "Buvez de l'eau", b: "Remplacez jus et sodas par de l'eau ou du thé sans sucre. Même le jus 100 % pur fait monter la glycémie car il n'a pas de fibres : le fruit entier est meilleur." },
    { t: "Cuisiner sain", b: "Grillé, vapeur et four valent mieux que la friture. Mesurez l'huile à la cuillère au lieu de verser : une cuillère à soupe, c'est environ 120 calories." },
    { t: "Bien mesurer sa tension", b: "Asseyez-vous au calme 5 minutes, bras soutenu à hauteur du cœur, sans café ni tabac 30 minutes avant. Prenez 2 mesures à une minute d'intervalle matin et soir, et notez la moyenne (règle des 3)." },
    { t: "Les bilans réguliers", b: "Après 40 ans : bilan lipidique et glycémie à jeun (ou HbA1c) au moins une fois par an, tension à chaque consultation. Demandez à votre médecin un dosage de la TSH (thyroïde)." },
    { t: "Mangez lentement", b: "La satiété arrive après environ 20 minutes. Posez la fourchette entre les bouchées et évitez de manger devant un écran." },
  ];



  const DAILY_CHECKS = [
    { id: "water", label: "J'ai bu 8 verres d'eau 💧" },
    { id: "walk", label: "J'ai marché 30 minutes 🚶" },
    { id: "veg", label: "5 portions de fruits et légumes 🥗" },
    { id: "nosoda", label: "Pas de soda ni boisson sucrée 🥤" },
    { id: "salt", label: "Pas de sel ajouté 🧂" },
    { id: "sugar", label: "Pas de sucre ni sucreries aujourd'hui 🍰" },
    { id: "meds", label: "J'ai pris mes médicaments à l'heure 💊" },
    { id: "sleep", label: "J'ai dormi au moins 7 heures 😴" },
  ];

  const GENERAL_TIPS = [
    "Mangez plus de légumes, de légumineuses et de poisson, et moins de charcuterie.",
    "Réduisez le sucre, le sel et les fritures.",
    "Bougez 30 minutes par jour.",
    "Choisissez vos problèmes de santé dans Plus → Mon profil pour des conseils et listes personnalisés.",
  ];

  return { CONDITIONS, FOODS, MENU, EXERCISES, WEEK_PLAN, EXERCISE_WARNINGS, LESSONS, DAILY_CHECKS, GENERAL_TIPS };
})();
