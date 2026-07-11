/** Extra topping prices by pizza size (flyer-aligned; groß costs more per topping). */

export const SIZE_EXTRA_RATES = {
  klein: { standard: 1, premium: 1.5 },
  gross: { standard: 1.5, premium: 2 }
} as const;

const GEMUESE_SIZE_RATES = {
  klein: 0.5,
  gross: 1
} as const;

const PREMIUM_EXTRA_NAMES = new Set([
  "Krabben",
  "Meeresfrüchte",
  "Hähnchenbruststreifen"
]);

const FREE_EXTRA_NAMES = new Set(["Knoblauch"]);

/** Vegetable toppings — lower price tier on pizzas. */
const GEMUESE_EXTRA_NAMES = new Set([
  "Ananas",
  "Artischocken",
  "Broccoli",
  "Champignons",
  "Cherry Tomaten",
  "Mais",
  "Oliven",
  "Paprika",
  "Peperoni",
  "Rucola",
  "Spargel",
  "Spinat",
  "Tomaten",
  "Zwiebeln",
  "scharfe Peperoni"
]);

/** Extras with fixed klein/gross prices (not tier-based). */
const FLAT_SIZE_EXTRAS: Record<string, { klein: number; gross: number }> = {
  Lachs: { klein: 1.5, gross: 1.5 }
};

export function normalizeSizeKey(sizeName: string): "klein" | "gross" | null {
  const n = sizeName.toLowerCase();
  if (n.includes("klein") || n.includes("small") || n.includes("24")) return "klein";
  if (n.includes("groß") || n.includes("gross") || n.includes("large") || n.includes("30")) {
    return "gross";
  }
  return null;
}

export function detectItemTypeForPricing(name: string) {
  const n = name.trim().toLowerCase();
  if (n.includes("partyblech") || n.includes("familien")) return "pizza-large";
  if (n.startsWith("calzone")) return "calzone";
  if (n.startsWith("pizza ")) return "pizza";
  if (n.includes("pizzabrötchen") || n.includes("gefüllte")) return "pizza-rolls";
  if (
    n.includes("dönertasche") ||
    n.includes("donertasche") ||
    n.includes("döner-teller") ||
    n.includes("doner-teller")
  ) {
    return "doner";
  }
  return "other";
}

export function isPremiumExtra(name: string, basePrice: number) {
  if (FREE_EXTRA_NAMES.has(name) || FLAT_SIZE_EXTRAS[name] || GEMUESE_EXTRA_NAMES.has(name)) {
    return false;
  }
  return PREMIUM_EXTRA_NAMES.has(name) || basePrice >= 1.5;
}

function isGemueseExtra(name: string) {
  return GEMUESE_EXTRA_NAMES.has(name);
}

function resolveTierPrice(
  optionName: string,
  basePrice: number,
  sizeKey: "klein" | "gross"
): number {
  if (FREE_EXTRA_NAMES.has(optionName)) return 0;
  const flat = FLAT_SIZE_EXTRAS[optionName];
  if (flat) return flat[sizeKey];
  if (isGemueseExtra(optionName)) return GEMUESE_SIZE_RATES[sizeKey];

  const tier = isPremiumExtra(optionName, basePrice) ? "premium" : "standard";
  return SIZE_EXTRA_RATES[sizeKey][tier];
}

export function resolveExtraPrice(
  optionName: string,
  basePrice: number,
  sizeName: string | null,
  itemName: string
): number {
  const itemType = detectItemTypeForPricing(itemName);

  if (itemType === "pizza-large" || itemType === "calzone") {
    return basePrice;
  }

  if (itemType === "pizza-rolls" || itemType === "doner") {
    return resolveTierPrice(optionName, basePrice, "klein");
  }

  if (itemType !== "pizza" || !sizeName) {
    return basePrice;
  }

  const sizeKey = normalizeSizeKey(sizeName);
  if (!sizeKey) return basePrice;

  return resolveTierPrice(optionName, basePrice, sizeKey);
}

export function buildPricesBySize(
  optionName: string,
  basePrice: number,
  itemName: string
): Record<string, number> | null {
  const itemType = detectItemTypeForPricing(itemName);

  if (itemType === "pizza-rolls" || itemType === "doner") {
    const kleinPrice = resolveTierPrice(optionName, basePrice, "klein");
    return { klein: kleinPrice, gross: kleinPrice };
  }

  if (itemType !== "pizza") return null;

  return {
    klein: resolveTierPrice(optionName, basePrice, "klein"),
    gross: resolveTierPrice(optionName, basePrice, "gross")
  };
}

export function defaultExtraDisplayPrice(
  optionName: string,
  basePrice: number,
  itemName: string
): number {
  const bySize = buildPricesBySize(optionName, basePrice, itemName);
  if (bySize) return bySize.klein;
  return basePrice;
}

export function itemUsesSizeBasedExtras(itemName: string) {
  const type = detectItemTypeForPricing(itemName);
  return type === "pizza" || type === "pizza-rolls" || type === "doner";
}
