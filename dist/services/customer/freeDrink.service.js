import { getBranchMenuForCustomer } from "./branchMenu.service.js";
function drinkText(name, description) {
    return `${name} ${description ?? ""}`.toLowerCase();
}
/** Free promo drinks: 1.0 l soft drinks and 0.5 l Durstlöscher only (no 0.33 l). */
export function isEligibleFreeDrink(name, description) {
    const text = drinkText(name, description);
    if (/\b0[,.]33\s*l\b/.test(text)) {
        return false;
    }
    if (text.includes("durstlöscher") || text.includes("durstloescher")) {
        return /\b0[,.]5\s*l\b/.test(text);
    }
    if (/\b1[,.]0\s*l\b/.test(text)) {
        return true;
    }
    return false;
}
function simplifyLabel(name) {
    return name
        .replace(/\(MEHRWEG\)/gi, "")
        .replace(/\s+/g, " ")
        .trim();
}
export function buildFreeDrinkLabel(name, description) {
    const simplified = simplifyLabel(name);
    const combined = `${name} ${description ?? ""}`;
    const volume = combined.match(/\b(\d[,.]\d\s*l)\b/i);
    if (!volume)
        return simplified;
    const compact = volume[1].replace(/\s+/g, "").toLowerCase();
    if (simplified.toLowerCase().replace(/\s+/g, "").includes(compact)) {
        return simplified;
    }
    return `${simplified} (${volume[1].replace(/\s+/g, " ")})`;
}
export async function getFreeDrinkOptions(branchId, lang) {
    const menu = await getBranchMenuForCustomer(branchId, lang);
    const categories = Array.isArray(menu) ? menu : menu.categories ?? [];
    const options = [];
    for (const category of categories) {
        const isDrinks = category.name.toLowerCase().includes("alkoholfrei") ||
            category.name.toLowerCase().includes("getränke");
        if (!isDrinks)
            continue;
        for (const item of (category.items ?? [])) {
            if (!isEligibleFreeDrink(item.name, item.description))
                continue;
            options.push({
                id: item.id,
                name: item.name,
                label: buildFreeDrinkLabel(item.name, item.description)
            });
        }
    }
    options.sort((a, b) => a.label.localeCompare(b.label, "de"));
    return options;
}
export function findFreeDrinkOption(options, choice) {
    if (choice == null || choice === "")
        return null;
    const asNumber = Number(choice);
    if (Number.isFinite(asNumber)) {
        return options.find((o) => o.id === asNumber) ?? null;
    }
    const asText = String(choice).trim().toLowerCase();
    return (options.find((o) => o.name.toLowerCase() === asText ||
        o.label.toLowerCase() === asText ||
        String(o.id) === asText) ?? null);
}
