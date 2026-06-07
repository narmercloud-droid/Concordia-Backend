import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

function resolveMenuLocalesDir() {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const candidates = [
    path.join(here, "../../i18n/menu/locales"),
    path.join(process.cwd(), "dist/i18n/menu/locales"),
    path.join(process.cwd(), "src/i18n/menu/locales")
  ];
  for (const dir of candidates) {
    if (fs.existsSync(dir)) return dir;
  }
  return candidates[0];
}

export const MENU_LANGUAGES = ["de", "en", "nl", "pl", "ru", "ro", "hi", "ar", "ku"] as const;
export type MenuLanguage = (typeof MENU_LANGUAGES)[number];

type TextEntry = { name: string; description?: string | null };
type MenuLocale = {
  categories: Record<string, TextEntry>;
  items: Record<string, TextEntry>;
  lexicon: {
    variantGroups: Record<string, string>;
    variants: Record<string, string>;
    addOnGroups: Record<string, string>;
    addOns: Record<string, string>;
  };
};

const localeCache = new Map<string, MenuLocale>();

export function resolveMenuLanguage(lang?: string | null): MenuLanguage {
  const short = String(lang ?? "de")
    .split("-")[0]
    .toLowerCase();
  return (MENU_LANGUAGES.includes(short as MenuLanguage) ? short : "de") as MenuLanguage;
}

function loadMenuLocale(lang: MenuLanguage): MenuLocale | null {
  if (lang === "de") return null;
  if (localeCache.has(lang)) return localeCache.get(lang)!;

  const filePath = path.join(resolveMenuLocalesDir(), `${lang}.json`);
  if (!fs.existsSync(filePath)) return null;

  const parsed = JSON.parse(fs.readFileSync(filePath, "utf8")) as MenuLocale;
  localeCache.set(lang, parsed);
  return parsed;
}

function tName(locale: MenuLocale | null, bucket: keyof MenuLocale["lexicon"], german: string) {
  if (!locale) return german;
  return locale.lexicon[bucket][german] ?? german;
}

function tItem(
  locale: MenuLocale | null,
  id: number | string,
  german: string,
  description?: string | null
) {
  if (!locale) return { name: german, description: description ?? null };
  const entry = locale.items[String(id)];
  return {
    name: entry?.name ?? german,
    description: entry?.description !== undefined ? entry.description : description ?? null
  };
}

function tCategory(
  locale: MenuLocale | null,
  id: number | string,
  german: string,
  description?: string | null
) {
  if (!locale) return { name: german, description: description ?? null };
  const entry = locale.categories[String(id)];
  return {
    name: entry?.name ?? german,
    description: entry?.description !== undefined ? entry.description : description ?? null
  };
}

type MenuCategory = {
  id: number | string;
  name: string;
  description?: string | null;
  items: Array<{
    id: number;
    name: string;
    description?: string | null;
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
};

export function applyMenuTranslations(categories: MenuCategory[], lang: MenuLanguage) {
  const locale = loadMenuLocale(lang);
  if (!locale) return categories;

  return categories.map((cat) => {
    const catText = tCategory(locale, cat.id, cat.name, cat.description ?? null);
    return {
      ...cat,
      name: catText.name,
      description: catText.description,
      items: cat.items.map((item) => {
        const itemText = tItem(locale, item.id, item.name, item.description ?? null);
        return { ...item, name: itemText.name, description: itemText.description };
      })
    };
  });
}

type ItemDetail = {
  id: number;
  name: string;
  description?: string | null;
  variantGroups?: Array<{
    id: string;
    name: string;
    options: Array<{ id: string; name: string; [key: string]: unknown }>;
    [key: string]: unknown;
  }>;
  addOnGroups?: Array<{
    id: string;
    name: string;
    options: Array<{ id: string; name: string; [key: string]: unknown }>;
    [key: string]: unknown;
  }>;
  extraPricing?: { sizeBased: boolean; hint?: string };
  [key: string]: unknown;
};

const SIZE_HINTS: Record<MenuLanguage, string> = {
  de: "Extra prices depend on pizza size (klein / groß)",
  en: "Extra prices depend on pizza size (small / large)",
  nl: "Extraprijzen hangen af van de pizzamaat (klein / groot)",
  pl: "Ceny dodatków zależą od rozmiaru pizzy (mała / duża)",
  ru: "Цены дополнений зависят от размера пиццы (маленькая / большая)",
  ro: "Prețurile extra depind de mărimea pizza (mică / mare)",
  hi: "अतिरिक्त कीमतें पिज़्ज़ा के आकार पर निर्भर करती हैं (छोटी / बड़ी)",
  ar: "أسعار الإضافات تعتمد على حجم البيتزا (صغيرة / كبيرة)",
  ku: "نرخی زیادە بەپێی قەبارەی پیتزا دەگۆڕێت (بچووک / گەورە)"
};

export function applyItemTranslations(item: ItemDetail, lang: MenuLanguage): ItemDetail {
  const locale = loadMenuLocale(lang);
  if (!locale) return item;

  const itemText = tItem(locale, item.id, item.name, item.description ?? null);

  return {
    ...item,
    name: itemText.name,
    description: itemText.description,
    variantGroups: (item.variantGroups ?? []).map((group) => ({
      ...group,
      name: tName(locale, "variantGroups", group.name),
      options: group.options.map((opt) => ({
        ...opt,
        name: tName(locale, "variants", opt.name)
      }))
    })),
    addOnGroups: (item.addOnGroups ?? []).map((group) => ({
      ...group,
      name: tName(locale, "addOnGroups", group.name),
      options: group.options.map((opt) => ({
        ...opt,
        name: tName(locale, "addOns", opt.name)
      }))
    })),
    extraPricing: item.extraPricing?.sizeBased
      ? { ...item.extraPricing, hint: SIZE_HINTS[lang] ?? SIZE_HINTS.en }
      : item.extraPricing
  };
}
