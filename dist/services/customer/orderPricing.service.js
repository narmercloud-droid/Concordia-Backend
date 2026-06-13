import { getBranchItemForCustomer, priceForAddOn } from "./branchMenu.service.js";
import { normalizeSizeKey } from "./extraPricing.service.js";
function roundMoney(value) {
    return Math.round(value * 100) / 100;
}
function resolveItemId(line) {
    const raw = line.itemId ?? line.product_id ?? line.item_id ?? line.item?.id ?? line.id;
    const itemId = Number(raw);
    if (!Number.isFinite(itemId) || itemId <= 0) {
        throw new Error("Each order item must include a valid itemId");
    }
    return itemId;
}
function resolveQuantity(line) {
    const qty = Number(line.quantity ?? line.qty ?? 1);
    if (!Number.isInteger(qty) || qty < 1 || qty > 99) {
        throw new Error("Item quantity must be between 1 and 99");
    }
    return qty;
}
function collectVariantIds(line) {
    const ids = new Set();
    const primary = line.variantId ?? line.variant_id;
    if (primary)
        ids.add(String(primary));
    for (const variant of line.variants ?? line.variantSelections ?? []) {
        if (variant?.id)
            ids.add(String(variant.id));
    }
    return [...ids];
}
function collectAddOnIds(line) {
    const ids = new Set();
    for (const id of line.addOnIds ?? line.add_on_ids ?? []) {
        if (id)
            ids.add(String(id));
    }
    for (const addOn of line.addOns ?? line.extras ?? []) {
        if (addOn?.id)
            ids.add(String(addOn.id));
    }
    return [...ids];
}
function findVariantOption(groups, optionId) {
    for (const group of groups) {
        const option = group.options.find((o) => o.id === optionId);
        if (option)
            return { group, option };
    }
    return null;
}
function findAddOnOption(groups, optionId) {
    for (const group of groups) {
        const option = group.options.find((o) => o.id === optionId);
        if (option)
            return { group, option };
    }
    return null;
}
function selectedSizeName(variants) {
    for (const variant of variants) {
        if (normalizeSizeKey(variant.name))
            return variant.name;
    }
    return null;
}
export function calculateUnitPrice(menuItem, selectedVariants, selectedAddOns) {
    const paidVariantTotal = selectedVariants
        .filter((v) => v.price > 0)
        .reduce((sum, v) => sum + v.price, 0);
    const base = paidVariantTotal > 0 ? paidVariantTotal : menuItem.price;
    const extrasTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
    return roundMoney(base + extrasTotal);
}
export function priceOrderLineFromMenu(menuItem, line) {
    const itemId = menuItem.id;
    const quantity = resolveQuantity(line);
    const variantIds = collectVariantIds(line);
    const addOnIds = collectAddOnIds(line);
    const selectedByGroup = new Map();
    for (const optionId of variantIds) {
        const match = findVariantOption(menuItem.variantGroups, optionId);
        if (!match) {
            throw new Error(`Invalid option for ${menuItem.name}`);
        }
        const existing = selectedByGroup.get(match.group.id) ?? [];
        if (existing.some((o) => o.id === match.option.id))
            continue;
        if (existing.length >= match.group.maxSelect) {
            throw new Error(`Too many selections for ${match.group.name}`);
        }
        existing.push(match.option);
        selectedByGroup.set(match.group.id, existing);
    }
    for (const group of menuItem.variantGroups) {
        const selected = selectedByGroup.get(group.id) ?? [];
        if (group.required && selected.length < Math.max(1, group.minSelect)) {
            throw new Error(`Please choose ${group.name} for ${menuItem.name}`);
        }
    }
    const variants = menuItem.variantGroups.flatMap((group) => {
        const selected = selectedByGroup.get(group.id) ?? [];
        return selected.map((option) => ({
            name: option.name,
            price: group.included || option.included ? 0 : option.price
        }));
    });
    const sizeName = selectedSizeName(variants);
    const selectedAddOns = [];
    const addOnsByGroup = new Map();
    for (const addOnId of addOnIds) {
        const match = findAddOnOption(menuItem.addOnGroups, addOnId);
        if (!match) {
            throw new Error(`Invalid extra for ${menuItem.name}`);
        }
        const groupSelections = addOnsByGroup.get(match.group.id) ?? [];
        if (groupSelections.includes(addOnId))
            continue;
        if (groupSelections.length >= match.group.maxSelect) {
            throw new Error(`Too many extras selected for ${match.group.name}`);
        }
        groupSelections.push(addOnId);
        addOnsByGroup.set(match.group.id, groupSelections);
        selectedAddOns.push({
            id: match.option.id,
            name: match.option.name,
            price: roundMoney(priceForAddOn({
                name: match.option.name,
                price: match.option.price,
                pricesBySize: match.option.pricesBySize
            }, sizeName, menuItem.name))
        });
    }
    for (const group of menuItem.addOnGroups) {
        const selected = addOnsByGroup.get(group.id) ?? [];
        if (group.required && selected.length < Math.max(1, group.minSelect)) {
            throw new Error(`Please choose ${group.name} for ${menuItem.name}`);
        }
    }
    const unitPrice = calculateUnitPrice(menuItem, variants, selectedAddOns);
    const primaryVariantId = line.variantId ??
        line.variant_id ??
        variantIds[0] ??
        String(itemId);
    return {
        itemId,
        quantity,
        unitPrice,
        lineTotal: roundMoney(unitPrice * quantity),
        notes: line.notes ?? line.note ?? null,
        variantId: String(primaryVariantId),
        addOnIds: selectedAddOns.map((a) => a.id),
        variants,
        addOns: selectedAddOns
    };
}
export async function validateAndPriceOrderLines(branchId, lines) {
    if (!lines.length) {
        throw new Error("Order must include at least one item");
    }
    const pricedLines = [];
    for (const line of lines) {
        const itemId = resolveItemId(line);
        const menuItem = await getBranchItemForCustomer(branchId, itemId, "de");
        if (!menuItem) {
            throw new Error(`Menu item ${itemId} is not available at this branch`);
        }
        pricedLines.push(priceOrderLineFromMenu(menuItem, line));
    }
    const subtotal = roundMoney(pricedLines.reduce((sum, line) => sum + line.lineTotal, 0));
    return { pricedLines, subtotal };
}
