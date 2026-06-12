import { prisma } from "../../prisma/client.js";
import { getCache, setCache } from "../../lib/redis.js";
import { getBranchMenuForCustomer } from "./branchMenu.service.js";
import { resolveMenuLanguage } from "./menuTranslation.service.js";
const PERIOD_DAYS = 30;
const CACHE_TTL_SEC = 3600;
function isDrinkCategory(categoryName) {
    return /getränk|drink/i.test(categoryName);
}
function isSaladCategory(categoryName) {
    return /salat|salad/i.test(categoryName);
}
function isSideItem(categoryName, itemName) {
    const cat = categoryName.toLowerCase();
    const name = itemName.toLowerCase();
    if (isSaladCategory(categoryName))
        return true;
    if (/imbiss|beilage|snack|side/i.test(cat) && /pommes|frites|kroketten|salat|beilage|dip|sauce/i.test(name)) {
        return true;
    }
    return /pommes|frites|kroketten/.test(name) && !/pizza|burger|calzone/.test(name);
}
function collectCartSuggestions(categories, excludeItemIds, drinkLimit, sideLimit) {
    const exclude = new Set(excludeItemIds);
    const drinks = [];
    const sides = [];
    for (const cat of categories) {
        for (const item of cat.items) {
            if (exclude.has(item.id))
                continue;
            const row = { ...item, categoryName: cat.name };
            if (isDrinkCategory(cat.name)) {
                if (drinks.length < drinkLimit)
                    drinks.push(row);
                continue;
            }
            if (isSideItem(cat.name, item.name) && sides.length < sideLimit) {
                sides.push(row);
            }
        }
    }
    return { drinks, sides, items: [...drinks, ...sides] };
}
function flattenMenuItems(categories) {
    const items = [];
    for (const cat of categories) {
        for (const item of cat.items) {
            items.push(item);
        }
    }
    return items;
}
function mapMenuItems(categories, itemIds) {
    const byId = new Map(flattenMenuItems(categories).map((item) => [item.id, item]));
    return itemIds
        .map((id) => byId.get(id))
        .filter((item) => item != null);
}
async function topSellingItemIds(branchId, limit) {
    const cacheKey = `bestsellers:ids:${branchId}:${limit}`;
    const cached = await getCache(cacheKey);
    if (cached) {
        try {
            return JSON.parse(cached);
        }
        catch {
            // ignore bad cache
        }
    }
    const since = new Date(Date.now() - PERIOD_DAYS * 24 * 60 * 60 * 1000);
    const grouped = await prisma.orderItem.groupBy({
        by: ["itemId"],
        _sum: { quantity: true },
        where: {
            order: {
                branchId,
                createdAt: { gte: since },
                status: { notIn: ["cancelled"] }
            }
        },
        orderBy: { _sum: { quantity: "desc" } },
        take: Math.max(limit * 3, limit)
    });
    const ids = grouped.map((row) => row.itemId);
    await setCache(cacheKey, JSON.stringify(ids), CACHE_TTL_SEC);
    return ids;
}
export async function getBranchBestsellers(branchId, limit = 6, _lang) {
    const salesIds = await topSellingItemIds(branchId, limit);
    const rankedIds = salesIds.slice(0, limit);
    return {
        periodDays: PERIOD_DAYS,
        hasSalesData: rankedIds.length >= 3,
        itemIds: rankedIds,
        items: []
    };
}
export async function getAlsoPopularItems(branchId, itemId, limit = 4, lang) {
    const cacheKey = `also-popular:${branchId}:${itemId}:${limit}:${resolveMenuLanguage(lang)}`;
    const cached = await getCache(cacheKey);
    if (cached) {
        try {
            return JSON.parse(cached);
        }
        catch {
            // ignore bad cache
        }
    }
    const since = new Date(Date.now() - PERIOD_DAYS * 24 * 60 * 60 * 1000);
    const ordersWithItem = await prisma.orderItem.findMany({
        where: {
            itemId,
            order: {
                branchId,
                createdAt: { gte: since },
                status: { notIn: ["cancelled"] }
            }
        },
        select: { orderId: true }
    });
    const orderIds = [...new Set(ordersWithItem.map((row) => row.orderId))];
    if (orderIds.length === 0) {
        return { items: [] };
    }
    const coOrdered = await prisma.orderItem.groupBy({
        by: ["itemId"],
        _count: { itemId: true },
        where: {
            orderId: { in: orderIds },
            itemId: { not: itemId }
        },
        orderBy: { _count: { itemId: "desc" } },
        take: limit * 2
    });
    const categories = await getBranchMenuForCustomer(branchId, lang);
    const availableIds = new Set(flattenMenuItems(categories).map((item) => item.id));
    const rankedIds = coOrdered
        .map((row) => row.itemId)
        .filter((id) => availableIds.has(id))
        .slice(0, limit);
    const items = mapMenuItems(categories, rankedIds);
    const payload = { items };
    await setCache(cacheKey, JSON.stringify(payload), CACHE_TTL_SEC);
    return payload;
}
export async function getCartSuggestions(branchId, excludeItemIds = [], lang) {
    const cacheKey = `cart-suggestions:${branchId}:${resolveMenuLanguage(lang)}:${excludeItemIds.sort((a, b) => a - b).join(",")}`;
    const cached = await getCache(cacheKey);
    if (cached) {
        try {
            return JSON.parse(cached);
        }
        catch {
            // ignore bad cache
        }
    }
    const categories = await getBranchMenuForCustomer(branchId, lang);
    const payload = collectCartSuggestions(categories, excludeItemIds, 6, 6);
    await setCache(cacheKey, JSON.stringify(payload), 300);
    return payload;
}
