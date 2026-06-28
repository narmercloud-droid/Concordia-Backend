import { prisma } from "../../prisma/client.js";
import { clearCache, deleteCache, getCache, setCache } from "../../lib/redis.js";
import { deleteSimpleCache, getSimpleCache, setSimpleCache } from "../../lib/simpleCache.js";
import { applyItemTranslations, applyMenuTranslations, resolveMenuLanguage } from "./menuTranslation.service.js";
import { buildPricesBySize, itemUsesSizeBasedExtras, normalizeSizeKey, resolveExtraPrice } from "./extraPricing.service.js";
import { isFreeDrinkPromoActive } from "../../config/websitePromo.js";
import { getPlatformConfig } from "../platform/platformSettings.service.js";
import { getBerlinDayOfWeek, getBerlinTimeString, isWithinBranchHours } from "../../utils/berlinTime.js";
const BRANCHES_CACHE_KEY = "customer:branches:v1";
const BRANCHES_TTL_SEC = 1800;
const MENU_TTL_SEC = 1800;
const MENU_LANGS = ["de", "en", "nl", "pl", "ru", "ro", "hi", "ar", "ku", "tr", "ckb"];
export function invalidateBranchListCache() {
    deleteSimpleCache(BRANCHES_CACHE_KEY);
    void deleteCache(BRANCHES_CACHE_KEY);
}
/** Clears bestsellers, cart suggestions, and related Redis keys for a branch. */
export function invalidateBranchDerivedCaches(branchId) {
    void clearCache(`bestsellers:ids:${branchId}:*`);
    void clearCache(`also-popular:${branchId}:*`);
    void clearCache(`cart-suggestions:${branchId}:*`);
}
export function invalidateBranchMenuCache(branchId) {
    for (const lang of MENU_LANGS) {
        const key = `customer:menu:${branchId}:${lang}:v3`;
        deleteSimpleCache(key);
        void deleteCache(`${key}:json`);
    }
    deleteSimpleCache(`customer:menu:${branchId}:v1`);
    void deleteCache(`customer:menu:${branchId}:v1:json`);
    invalidateBranchDerivedCaches(branchId);
}
export async function peekBranchMenuCache(branchId, lang) {
    const resolvedLang = resolveMenuLanguage(lang);
    const memoryKey = `customer:menu:${branchId}:${resolvedLang}:v3`;
    const cachedMemory = getSimpleCache(memoryKey);
    if (cachedMemory)
        return cachedMemory;
    const redisKey = `${memoryKey}:json`;
    const cachedRedis = await getCache(redisKey);
    if (!cachedRedis)
        return null;
    try {
        const parsed = JSON.parse(cachedRedis);
        setSimpleCache(memoryKey, parsed, MENU_TTL_SEC * 1000);
        return parsed;
    }
    catch {
        return null;
    }
}
function menuItemIdRange(branchId) {
    if (branchId === "concordia-kempen")
        return { gte: 10000, lt: 20000 };
    if (branchId === "concordia-straelen")
        return { gte: 20000, lt: 30000 };
    return null;
}
function itemBelongsToBranch(branchId, itemId) {
    const range = menuItemIdRange(branchId);
    if (!range)
        return true;
    return itemId >= range.gte && itemId < range.lt;
}
export async function getBranchMenuForCustomer(branchId, lang) {
    const resolvedLang = resolveMenuLanguage(lang);
    const memoryKey = `customer:menu:${branchId}:${resolvedLang}:v3`;
    const cachedMemory = getSimpleCache(memoryKey);
    if (cachedMemory)
        return cachedMemory;
    const redisKey = `${memoryKey}:json`;
    const cachedRedis = await getCache(redisKey);
    if (cachedRedis) {
        try {
            const parsed = JSON.parse(cachedRedis);
            setSimpleCache(memoryKey, parsed, MENU_TTL_SEC * 1000);
            return parsed;
        }
        catch {
            // ignore corrupt cache
        }
    }
    const menu = applyMenuTranslations(await buildBranchMenu(branchId), resolvedLang);
    setSimpleCache(memoryKey, menu, MENU_TTL_SEC * 1000);
    await setCache(redisKey, JSON.stringify(menu), MENU_TTL_SEC);
    return menu;
}
async function buildBranchMenu(branchId) {
    const categories = await prisma.branchCategory.findMany({
        where: { branchId },
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        include: {
            items: {
                where: { isAvailable: true },
                include: {
                    menuItem: {
                        select: {
                            id: true,
                            itemNumber: true,
                            sortOrder: true,
                            name: true,
                            description: true,
                            basePrice: true,
                            imageUrl: true,
                            isAvailable: true
                        }
                    }
                }
            }
        }
    });
    if (categories.length > 0) {
        return categories
            .map((cat) => ({
            id: cat.id,
            name: cat.name,
            description: cat.description ?? null,
            sortOrder: cat.sortOrder ?? 0,
            items: cat.items
                .map((entry) => ({
                id: entry.menuItem.id,
                itemNumber: entry.menuItem.itemNumber ?? null,
                sortOrder: entry.menuItem.sortOrder ?? 0,
                name: entry.menuItem.name,
                description: entry.description ?? entry.menuItem.description,
                price: entry.price ?? entry.menuItem.basePrice ?? 0,
                imageUrl: entry.imageUrl ?? entry.menuItem.imageUrl
            }))
                .sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id)
        }))
            .sort((a, b) => a.sortOrder - b.sortOrder || String(a.name).localeCompare(String(b.name)));
    }
    const branchItems = await prisma.branchMenuItem.findMany({
        where: { branchId, isAvailable: true },
        include: { menuItem: true }
    });
    if (branchItems.length === 0) {
        const range = menuItemIdRange(branchId);
        const allItems = await prisma.menuItem.findMany({
            where: {
                isAvailable: true,
                ...(range ? { id: { gte: range.gte, lt: range.lt } } : {})
            },
            orderBy: [{ sortOrder: "asc" }, { id: "asc" }]
        });
        return [
            {
                id: "all",
                name: "Menu",
                items: allItems
                    .map((item) => ({
                    id: item.id,
                    itemNumber: item.itemNumber ?? null,
                    sortOrder: item.sortOrder ?? 0,
                    name: item.name,
                    description: item.description,
                    price: item.basePrice ?? 0,
                    imageUrl: item.imageUrl
                }))
                    .sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id)
            }
        ];
    }
    return [
        {
            id: "all",
            name: "Menu",
            items: branchItems
                .map((entry) => ({
                id: entry.menuItem.id,
                itemNumber: entry.menuItem.itemNumber ?? null,
                sortOrder: entry.menuItem.sortOrder ?? 0,
                name: entry.menuItem.name,
                description: entry.description ?? entry.menuItem.description,
                price: entry.price ?? entry.menuItem.basePrice ?? 0,
                imageUrl: entry.imageUrl ?? entry.menuItem.imageUrl
            }))
                .sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id)
        }
    ];
}
function mapOptionGroups(item) {
    const variantGroups = item.variantGroups.map((g) => {
        const groupIncluded = g.includedChoice === true;
        const options = g.variants.map((v) => ({
            id: v.id,
            name: v.name,
            price: v.price,
            included: groupIncluded && v.price === 0
        }));
        const included = groupIncluded;
        return {
            id: g.id,
            name: g.name,
            required: g.required,
            minSelect: g.minSelect,
            maxSelect: g.maxSelect,
            included,
            options
        };
    });
    const sizeBasedExtras = itemUsesSizeBasedExtras(item.name);
    const addOnGroups = item.addOnGroups.map((g) => ({
        id: g.id,
        name: g.name,
        required: g.required,
        minSelect: g.minSelect,
        maxSelect: g.maxSelect,
        options: g.addOns.map((a) => {
            const pricesBySize = buildPricesBySize(a.name, a.price, item.name);
            return {
                id: a.id,
                name: a.name,
                price: a.price,
                pricesBySize
            };
        })
    }));
    const variantPrices = variantGroups.flatMap((g) => g.options.map((o) => o.price));
    const displayPrice = variantPrices.length > 0
        ? Math.min(...variantPrices)
        : item.basePrice ?? 0;
    return {
        id: item.id,
        itemNumber: item.itemNumber ?? null,
        name: item.name,
        description: item.description,
        price: displayPrice,
        imageUrl: item.imageUrl,
        variantGroups,
        addOnGroups,
        extraPricing: sizeBasedExtras
            ? { sizeBased: true, hint: "Extra prices depend on pizza size (klein / groß)" }
            : { sizeBased: false }
    };
}
export function priceForAddOn(option, sizeVariantName, itemName) {
    if (option.pricesBySize && sizeVariantName) {
        const key = normalizeSizeKey(sizeVariantName);
        if (key && option.pricesBySize[key] != null) {
            return option.pricesBySize[key];
        }
    }
    return resolveExtraPrice(option.name, option.price, sizeVariantName, itemName);
}
export async function getBranchItemForCustomer(branchId, itemId, lang) {
    const resolvedLang = resolveMenuLanguage(lang);
    const optionInclude = {
        variantGroups: {
            orderBy: { id: "asc" },
            include: { variants: { orderBy: { price: "asc" } } }
        },
        addOnGroups: {
            orderBy: { id: "asc" },
            include: { addOns: { orderBy: { name: "asc" } } }
        }
    };
    const branchItem = await prisma.branchMenuItem.findFirst({
        where: { branchId, menuItemId: itemId, isAvailable: true },
        include: {
            menuItem: { include: optionInclude }
        }
    });
    if (branchItem) {
        const mapped = mapOptionGroups(branchItem.menuItem);
        let presetGroups = [];
        try {
            const { getPresetAddOnGroupsForItem } = await import("../manager/extraPreset.service.js");
            presetGroups = await getPresetAddOnGroupsForItem(branchId, branchItem.categoryId);
        }
        catch (err) {
            console.warn("[menu] preset extras unavailable", branchId, itemId, err);
        }
        const presetAddOnGroups = presetGroups.map((g) => ({
            id: g.id,
            name: g.name,
            required: g.required,
            minSelect: g.minSelect,
            maxSelect: g.maxSelect,
            options: g.options.map((o) => ({
                id: o.id,
                name: o.name,
                price: o.price,
                pricesBySize: buildPricesBySize(o.name, o.price, branchItem.menuItem.name)
            }))
        }));
        return applyItemTranslations({
            ...mapped,
            description: branchItem.description ?? mapped.description,
            price: branchItem.price ?? mapped.price,
            imageUrl: branchItem.imageUrl ?? mapped.imageUrl,
            addOnGroups: [...mapped.addOnGroups, ...presetAddOnGroups]
        }, resolvedLang);
    }
    if (!itemBelongsToBranch(branchId, itemId)) {
        return null;
    }
    const item = await prisma.menuItem.findFirst({
        where: { id: itemId, isAvailable: true },
        include: optionInclude
    });
    if (!item)
        return null;
    const mapped = mapOptionGroups(item);
    const branchMenuItem = await prisma.branchMenuItem.findFirst({
        where: { branchId, menuItemId: itemId },
        select: { categoryId: true }
    });
    let presetGroups = [];
    try {
        const { getPresetAddOnGroupsForItem } = await import("../manager/extraPreset.service.js");
        presetGroups = await getPresetAddOnGroupsForItem(branchId, branchMenuItem?.categoryId);
    }
    catch (err) {
        console.warn("[menu] preset extras unavailable", branchId, itemId, err);
    }
    const presetAddOnGroups = presetGroups.map((g) => ({
        id: g.id,
        name: g.name,
        required: g.required,
        minSelect: g.minSelect,
        maxSelect: g.maxSelect,
        options: g.options.map((o) => ({
            id: o.id,
            name: o.name,
            price: o.price,
            pricesBySize: buildPricesBySize(o.name, o.price, item.name)
        }))
    }));
    return applyItemTranslations({
        ...mapped,
        addOnGroups: [...mapped.addOnGroups, ...presetAddOnGroups]
    }, resolvedLang);
}
export async function listBranchesForCustomer() {
    let rows = getSimpleCache(BRANCHES_CACHE_KEY);
    if (!rows) {
        const cachedRedis = await getCache(BRANCHES_CACHE_KEY);
        if (cachedRedis) {
            try {
                rows = JSON.parse(cachedRedis);
                setSimpleCache(BRANCHES_CACHE_KEY, rows, BRANCHES_TTL_SEC * 1000);
            }
            catch {
                // ignore corrupt cache
            }
        }
    }
    if (!rows) {
        rows = await fetchBranchesList();
        setSimpleCache(BRANCHES_CACHE_KEY, rows, BRANCHES_TTL_SEC * 1000);
        await setCache(BRANCHES_CACHE_KEY, JSON.stringify(rows), BRANCHES_TTL_SEC);
    }
    return applyOpenStatus(rows);
}
export async function getPlatformPromoForCustomer() {
    const platform = getPlatformConfig();
    return {
        websiteOrderDiscountPct: platform.websiteOrderDiscountPct,
        freeDrinkCheckoutEnabled: platform.freeDrinkCheckoutEnabled,
        showFreeDrinkCheckout: platform.showFreeDrinkCheckout,
        showLoyaltyCheckout: platform.showLoyaltyCheckout
    };
}
const HIDDEN_BRANCH_IDS = new Set([
    "branch-001",
    "test-branch-1",
    "concordia-geldern",
    "concordia-kamp-lintfort"
]);
export function isCustomerBranchVisible(branchId) {
    return !HIDDEN_BRANCH_IDS.has(branchId);
}
function applyOpenStatus(rows) {
    const now = new Date();
    const day = getBerlinDayOfWeek(now);
    const time = getBerlinTimeString(now);
    return rows.map((branch) => {
        const todayHours = branch.hours.find((h) => h.dayOfWeek === day);
        const isClosedToday = !todayHours || (todayHours.openTime === "00:00" && todayHours.closeTime === "00:00");
        const isOpenNow = branch.status === "live" &&
            !isClosedToday &&
            !!todayHours &&
            isWithinBranchHours(todayHours.openTime, todayHours.closeTime, time);
        const { hours: _hours, ...rest } = branch;
        return { ...rest, isOpen: isOpenNow };
    });
}
async function fetchBranchesList() {
    const platform = getPlatformConfig();
    const branches = await prisma.branch.findMany({
        where: { id: { notIn: [...HIDDEN_BRANCH_IDS] } },
        orderBy: { createdAt: "asc" },
        select: {
            id: true,
            name: true,
            BranchConfig: { select: { configJson: true } },
            branchHours: {
                orderBy: { dayOfWeek: "asc" },
                select: { dayOfWeek: true, openTime: true, closeTime: true }
            }
        }
    });
    return branches.map((branch) => {
        const config = (branch.BranchConfig?.configJson ?? {});
        const status = String(config.status ?? "live");
        const promotions = (config.promotions ?? {});
        const promoActive = isFreeDrinkPromoActive(promotions);
        return {
            id: branch.id,
            name: branch.name,
            address: String(config.address ?? ""),
            city: String(config.city ?? ""),
            postalCode: String(config.postalCode ?? ""),
            lat: Number(config.lat ?? 0),
            lng: Number(config.lng ?? 0),
            phone: "",
            status,
            comingSoon: status === "coming_soon",
            supportsPickup: config.supportsPickup !== false,
            supportsDelivery: config.supportsDelivery !== false,
            promotions: {
                freeDrinkMinOrder: promoActive
                    ? Number(promotions.freeDrinkMinOrder ?? 0) || null
                    : null,
                freeDrinkMessage: promoActive ? String(promotions.freeDrinkMessage ?? "") : "",
                websiteDiscountEnabled: promotions.websiteDiscountEnabled !== false
            },
            platformPromo: {
                websiteOrderDiscountPct: platform.websiteOrderDiscountPct,
                showFreeDrinkCheckout: platform.showFreeDrinkCheckout,
                showLoyaltyCheckout: platform.showLoyaltyCheckout
            },
            hours: branch.branchHours
        };
    });
}
