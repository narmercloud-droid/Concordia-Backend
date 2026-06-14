/** Extra topping prices by pizza size (flyer-aligned; groß costs more per topping). */

export const SIZE_EXTRA_RATES = {
  klein: { standard: 1, premium: 1.5 },
  gross: { standard: 1.5, premium: 2 }
} as const;

const PREMIUM_EXTRA_NAMES = new Set([
  "Krabben",
  "Meeresfrüchte",
  "Hähnchenbruststreifen"
]);

const FREE_EXTRA_NAMES = new Set(["Knoblauch"]);

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
  return "other";
}

export function isPremiumExtra(name: string, basePrice: number) {
  if (FREE_EXTRA_NAMES.has(name) || FLAT_SIZE_EXTRAS[name]) return false;
  return PREMIUM_EXTRA_NAMES.has(name) || basePrice >= 1.5;
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

  if (itemType !== "pizza" || !sizeName) {
    return basePrice;
  }

  const sizeKey = normalizeSizeKey(sizeName);
  if (!sizeKey) return basePrice;

  if (FREE_EXTRA_NAMES.has(optionName)) return 0;
  const flat = FLAT_SIZE_EXTRAS[optionName];
  if (flat) return flat[sizeKey];

  const tier = isPremiumExtra(optionName, basePrice) ? "premium" : "standard";
  return SIZE_EXTRA_RATES[sizeKey][tier];
}

export function buildPricesBySize(
  optionName: string,
  basePrice: number,
  itemName: string
): Record<string, number> | null {
  const itemType = detectItemTypeForPricing(itemName);
  if (itemType !== "pizza") return null;

  if (FREE_EXTRA_NAMES.has(optionName)) {
    return { klein: 0, gross: 0 };
  }
  const flat = FLAT_SIZE_EXTRAS[optionName];
  if (flat) return { ...flat };

  const tier = isPremiumExtra(optionName, basePrice) ? "premium" : "standard";
  return {
    klein: SIZE_EXTRA_RATES.klein[tier],
    gross: SIZE_EXTRA_RATES.gross[tier]
  };
}

export function itemUsesSizeBasedExtras(itemName: string) {
  const type = detectItemTypeForPricing(itemName);
  return type === "pizza";
}
