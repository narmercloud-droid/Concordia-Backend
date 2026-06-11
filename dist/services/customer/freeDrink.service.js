import { getBranchMenuForCustomer } from "./branchMenu.service.js";
function isEligibleFreeDrink(name) {
    const normalized = name.toLowerCase();
    if (normalized.includes("durstlöscher") || normalized.includes("durstloescher")) {
        return true;
    }
    if (normalized.includes("1,0l") || normalized.includes("1.0l")) {
        return false;
    }
    if (normalized.includes("0,33l") || normalized.includes("0.33l")) {
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
export async function getFreeDrinkOptions(branchId, lang) {
    const menu = await getBranchMenuForCustomer(branchId, lang);
    const categories = Array.isArray(menu) ? menu : menu.categories ?? [];
    const options = [];
    for (const category of categories) {
        const isDrinks = category.name.toLowerCase().includes("alkoholfrei") ||
            category.name.toLowerCase().includes("getränke");
        if (!isDrinks)
            continue;
        for (const item of category.items ?? []) {
            if (!isEligibleFreeDrink(item.name))
                continue;
            options.push({
                id: item.id,
                name: item.name,
                label: simplifyLabel(item.name)
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
