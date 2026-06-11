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
        if (fs.existsSync(dir))
            return dir;
    }
    return candidates[0];
}
export const MENU_LANGUAGES = ["de", "en", "nl", "pl", "ru", "ro", "hi", "ar", "ku", "tr", "ckb"];
const localeCache = new Map();
export function resolveMenuLanguage(lang) {
    const short = String(lang ?? "de")
        .split("-")[0]
        .toLowerCase();
    return (MENU_LANGUAGES.includes(short) ? short : "de");
}
function loadMenuLocale(lang) {
    if (lang === "de")
        return null;
    if (localeCache.has(lang))
        return localeCache.get(lang);
    const filePath = path.join(resolveMenuLocalesDir(), `${lang}.json`);
    if (!fs.existsSync(filePath))
        return null;
    const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
    localeCache.set(lang, parsed);
    return parsed;
}
function tName(locale, bucket, german) {
    if (!locale)
        return german;
    return locale.lexicon[bucket][german] ?? german;
}
function tItem(locale, id, german, description) {
    if (!locale)
        return { name: german, description: description ?? null };
    const entry = locale.items[String(id)];
    return {
        name: entry?.name ?? german,
        description: entry?.description !== undefined ? entry.description : description ?? null
    };
}
function tCategory(locale, id, german, description) {
    if (!locale)
        return { name: german, description: description ?? null };
    const entry = locale.categories[String(id)];
    return {
        name: entry?.name ?? german,
        description: entry?.description !== undefined ? entry.description : description ?? null
    };
}
export function applyMenuTranslations(categories, lang) {
    const locale = loadMenuLocale(lang);
    if (!locale)
        return categories;
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
const SIZE_HINTS = {
    de: "Extra prices depend on pizza size (klein / groß)",
    en: "Extra prices depend on pizza size (small / large)",
    nl: "Extraprijzen hangen af van de pizzamaat (klein / groot)",
    pl: "Ceny dodatków zależą od rozmiaru pizzy (mała / duża)",
    ru: "Цены дополнений зависят от размера пиццы (маленькая / большая)",
    ro: "Prețurile extra depind de mărimea pizza (mică / mare)",
    hi: "अतिरिक्त कीमतें पिज़्ज़ा के आकार पर निर्भर करती हैं (छोटी / बड़ी)",
    ar: "أسعار الإضافات تعتمد على حجم البيتزا (صغيرة / كبيرة)",
    ku: "نرخی زیادە بەپێی قەبارەی پیتزا دەگۆڕێت (بچووک / گەورە)",
    tr: "Ekstra fiyatlar pizza boyutuna bağlıdır (küçük / büyük)",
    ckb: "نرخی زیادەکان بەپێی قەبارەی پیتزا دەگۆڕێت (بچووک / گەورە)"
};
export function applyItemTranslations(item, lang) {
    const locale = loadMenuLocale(lang);
    if (!locale)
        return item;
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
