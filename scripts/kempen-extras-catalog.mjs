/**
 * Categorized extra toppings for Kempen menu.
 * Each item type gets a relevant subset — not every item has every extra.
 */

export const EXTRA_CATEGORIES = {
  gemuese: {
    id: "gemuese",
    name: "Gemüse",
    options: [
      { name: "Paprika", price: 1 },
      { name: "Peperoni", price: 1 },
      { name: "scharfe Peperoni", price: 1 },
      { name: "Zwiebeln", price: 1 },
      { name: "Spinat", price: 1 },
      { name: "Broccoli", price: 1 },
      { name: "Champignons", price: 1 },
      { name: "Oliven", price: 1 },
      { name: "Mais", price: 1 },
      { name: "Tomaten", price: 1 },
      { name: "Cherry Tomaten", price: 1 },
      { name: "Ananas", price: 1 },
      { name: "Spargel", price: 1 },
      { name: "Rucola", price: 1 },
      { name: "Knoblauch", price: 1 },
      { name: "Artischocken", price: 1 }
    ]
  },
  fleisch: {
    id: "fleisch",
    name: "Fleisch & Wurst",
    options: [
      { name: "Hinterschinken", price: 1 },
      { name: "Parmaschinken", price: 1 },
      { name: "Salami", price: 1 },
      { name: "Sucuk", price: 1 },
      { name: "Dönerfleisch", price: 1 },
      { name: "Hähnchenbruststreifen", price: 1.5 },
      { name: "Hackfleischsauce", price: 1 }
    ]
  },
  meeresfruechte: {
    id: "meeresfruechte",
    name: "Meeresfrüchte",
    options: [
      { name: "Thunfisch", price: 1 },
      { name: "Krabben", price: 1.5 },
      { name: "Meeresfrüchte", price: 1.5 },
      { name: "Lachs", price: 1 }
    ]
  },
  saucen: {
    id: "saucen",
    name: "Saucen & Käse",
    options: [
      { name: "Tomatensauce", price: 1 },
      { name: "Sauce Hollandaise", price: 1 },
      { name: "Käse", price: 1 },
      { name: "Mozzarella", price: 1 },
      { name: "Fetakäse", price: 1 },
      { name: "Gorgonzola", price: 1 },
      { name: "Parmesankäse", price: 1 },
      { name: "Gouda Käse", price: 1 },
      { name: "Mit Käse überbacken", price: 1.5 }
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

/** Which extra categories apply per item type */
export const EXTRA_PROFILES = {
  pizza: ["gemuese", "fleisch", "meeresfruechte", "saucen"],
  "pizza-large": ["gemuese", "fleisch", "meeresfruechte", "saucen"],
  "pizza-rolls": ["gemuese", "fleisch", "saucen"],
  pasta: ["gemuese", "fleisch", "meeresfruechte", "saucen"],
  salad: ["gemuese", "fleisch", "meeresfruechte"],
  baguette: ["gemuese", "fleisch", "saucen"],
  burger: ["gemuese", "fleisch", "saucen"],
  schnitzel: ["gemuese", "saucen"],
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
  if (n.startsWith("pizza ") || n.startsWith("calzone")) return "pizza";
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
    const options = category.options.map((opt) => ({
      ...opt,
      price: largeBase != null ? largeBase : opt.price
    }));
    return {
      categoryId,
      name: category.name,
      options
    };
  });
}
