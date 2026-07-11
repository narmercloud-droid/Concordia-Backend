/**
 * Categorized extra toppings for Kempen menu.
 * Each item type gets a relevant subset — not every item has every extra.
 */

export const EXTRA_CATEGORIES = {
  gemuese: {
    id: "gemuese",
    name: "Gemüse",
    options: [
      { name: "Ananas", price: 0.5 },
      { name: "Artischocken", price: 0.5 },
      { name: "Broccoli", price: 0.5 },
      { name: "Champignons", price: 0.5 },
      { name: "Cherry Tomaten", price: 0.5 },
      { name: "Knoblauch", price: 0 },
      { name: "Mais", price: 0.5 },
      { name: "Oliven", price: 0.5 },
      { name: "Paprika", price: 0.5 },
      { name: "Peperoni", price: 0.5 },
      { name: "Rucola", price: 0.5 },
      { name: "Spargel", price: 0.5 },
      { name: "Spinat", price: 0.5 },
      { name: "Tomaten", price: 0.5 },
      { name: "Zwiebeln", price: 0.5 },
      { name: "scharfe Peperoni", price: 0.5 }
    ]
  },
  fleisch: {
    id: "fleisch",
    name: "Fleisch & Wurst",
    options: [
      { name: "Dönerfleisch", price: 1 },
      { name: "Hackfleischsauce", price: 1 },
      { name: "Hinterschinken", price: 1 },
      { name: "Hähnchenbruststreifen", price: 1.5 },
      { name: "Parmaschinken", price: 1 },
      { name: "Salami", price: 1 },
      { name: "Sucuk", price: 1 }
    ]
  },
  meeresfruechte: {
    id: "meeresfruechte",
    name: "Meeresfrüchte",
    options: [
      { name: "Krabben", price: 1.5 },
      { name: "Lachs", price: 1.5 },
      { name: "Meeresfrüchte", price: 1.5 },
      { name: "Thunfisch", price: 1 }
    ]
  },
  saucen: {
    id: "saucen",
    name: "Saucen & Käse",
    options: [
      { name: "Fetakäse", price: 1 },
      { name: "Gorgonzola", price: 1 },
      { name: "Gouda Käse", price: 1 },
      { name: "Mozzarella", price: 1 },
      { name: "Parmesankäse", price: 1 },
      { name: "Sauce Hollandaise", price: 1 }
    ]
  },
  beilagen: {
    id: "beilagen",
    name: "Beilagen & Saucen",
    options: [
      { name: "Mayonnaise", price: 1 },
      { name: "Ketchup", price: 1 },
      { name: "Currysauce", price: 1 },
      { name: "Kräuterbutter", price: 1.5 }
    ]
  }
};

export const KRAEUTERBUTTER_PORTION_EXTRA = {
  categoryId: "kraeuterbutter",
  name: "Extras",
  options: [{ name: "Kräuterbutter Portion", price: 1.5 }]
};

export const PIZZA_STYLE_EXTRA_PROFILE = ["gemuese", "fleisch", "meeresfruechte", "saucen"];

const PREMIUM_EXTRA_NAMES = new Set([
  "Krabben",
  "Meeresfrüchte",
  "Hähnchenbruststreifen"
]);

/** Calzones are one size (~30 cm) — extras use groß-tier prices. */
export function priceCalzoneExtra(option) {
  if (option.name === "Knoblauch") return 0;
  if (option.name === "Lachs") return 1.5;
  if (PREMIUM_EXTRA_NAMES.has(option.name) || option.price >= 1.5) return 2;
  return 1.5;
}

/** Which extra categories apply per item type */
export const EXTRA_PROFILES = {
  calzone: ["gemuese", "fleisch", "meeresfruechte", "saucen"],
  pizza: ["gemuese", "fleisch", "meeresfruechte", "saucen"],
  "pizza-large": ["gemuese", "fleisch", "meeresfruechte", "saucen"],
  "pizza-rolls": ["gemuese", "fleisch", "meeresfruechte", "saucen"],
  pasta: ["gemuese", "fleisch", "meeresfruechte", "saucen"],
  salad: ["gemuese", "fleisch", "meeresfruechte"],
  baguette: ["gemuese", "fleisch", "saucen"],
  burger: [],
  schnitzel: [],
  snacks: ["beilagen"],
  general: ["gemuese", "saucen"]
};

/** Large-format pizzas use higher topping prices (flyer) */
export const LARGE_FORMAT_PRICE_SCALE = {
  partyblech: 5,
  familien: 3
};

export function detectItemType(name) {
  const n = name.trim().toLowerCase();

  if (
    n.includes("coca-cola") ||
    n.includes("cola zero") ||
    n.includes("fanta") ||
    n.includes("sprite") ||
    n.includes("mezzo") ||
    n.includes("mineralwasser") ||
    n.includes("durstlöscher") ||
    n.includes("apfelschorle") ||
    n.includes("uludag") ||
    n.includes("krombacher") ||
    n.includes("radler") ||
    n.includes("weizenbier") ||
    n.includes("lift ")
  ) {
    return "drinks";
  }

  if (n.includes("partyblech") || n.includes("familien")) return "pizza-large";
  if (n.startsWith("calzone")) return "calzone";
  if (n.startsWith("pizza ")) return "pizza";
  if (n.includes("pizzabrötchen") || n.includes("gefüllte")) return "pizza-rolls";
  if (n.startsWith("pasta ") || n.includes("auflauf")) return "pasta";
  if (n.startsWith("salat ")) return "salad";
  if (n.includes("schnitzel")) return "schnitzel";
  if (n.includes("burger")) return "burger";
  if (n.startsWith("baguette")) return "baguette";
  if (
    n.includes("pommes") ||
    n.includes("brat") ||
    n.includes("currywurst") ||
    n.includes("nugget") ||
    n.includes("wings") ||
    n.includes("kroket") ||
    n.includes("mayonnaise") ||
    n.includes("ketchup") ||
    n.includes("mozzarella stick")
  ) {
    return "snacks";
  }

  return "general";
}

export function getLargeFormatBasePrice(name) {
  const n = name.toLowerCase();
  if (n.includes("partyblech")) return LARGE_FORMAT_PRICE_SCALE.partyblech;
  if (n.includes("familien")) return LARGE_FORMAT_PRICE_SCALE.familien;
  return null;
}

export function buildCategorizedExtras(itemName) {
  const type = detectItemType(itemName);
  if (type === "drinks") return [];

  const profile = EXTRA_PROFILES[type] ?? EXTRA_PROFILES.general;
  const largeBase = getLargeFormatBasePrice(itemName);

  return profile.map((categoryId) => {
    const category = EXTRA_CATEGORIES[categoryId];
    const options = category.options.map((opt) => {
      let price = largeBase != null ? largeBase : opt.price;
      if (type === "calzone") price = priceCalzoneExtra(opt);
      return { ...opt, price };
    });
    return {
      categoryId,
      name: category.name,
      options
    };
  });
}

export function buildPizzabroetchenExtras(itemName, itemNumber) {
  const num = String(itemNumber ?? "")
    .trim()
    .toLowerCase();

  // Standalone butter product — no add-ons
  if (num === "45a") return [];

  // Plain 10 Stück — extra butter portion only
  if (num === "45") {
    return [{ ...KRAEUTERBUTTER_PORTION_EXTRA, options: [...KRAEUTERBUTTER_PORTION_EXTRA.options] }];
  }

  const pizzaStyleGroups = PIZZA_STYLE_EXTRA_PROFILE.map((categoryId) => {
    const category = EXTRA_CATEGORIES[categoryId];
    return {
      categoryId,
      name: category.name,
      options: category.options.map((opt) => ({ ...opt }))
    };
  });

  return [
    { ...KRAEUTERBUTTER_PORTION_EXTRA, options: [...KRAEUTERBUTTER_PORTION_EXTRA.options] },
    ...pizzaStyleGroups
  ];
}

export function isPizzabroetchenItem(itemName, itemNumber) {
  const num = String(itemNumber ?? "")
    .trim()
    .toLowerCase();
  if (num === "45" || num === "45a" || (num >= "46" && num <= "54")) return true;
  const type = detectItemType(itemName);
  return type === "pizza-rolls";
}

/** Paid add-ons for burger dishes. */
export function buildBurgerExtras() {
  return [
    {
      categoryId: "burger-extras",
      name: "Extras",
      options: [
        { name: "Extra Burgerfleisch", price: 3 },
        { name: "Extra Tomaten", price: 0.5 },
        { name: "Extra Salat", price: 0.5 },
        { name: "Extra Käse", price: 1 },
        { name: "Extra Zwiebeln", price: 0.5 },
        { name: "Extra Gewürzgurken", price: 0.5 }
      ]
    }
  ];
}

/** Paid add-ons for schnitzel dishes (Mayo/Ketchup). Salad sauce is a free variant group. */
export function buildSchnitzelExtras() {
  return [
    {
      categoryId: "paid-sauces",
      name: "Extras",
      options: [
        { name: "Mayonnaise", price: 1 },
        { name: "Ketchup", price: 1 }
      ]
    }
  ];
}
