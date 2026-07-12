import { prisma } from "../../prisma/client.js";
import { clearCache, deleteCache, getCache, setCache } from "../../lib/redis.js";
import { deleteSimpleCache, deleteSimpleCacheByPrefix, getSimpleCache, setSimpleCache } from "../../lib/simpleCache.js";
import { applyItemTranslations, applyMenuTranslations, resolveMenuLanguage } from "./menuTranslation.service.js";
import { buildPricesBySize, defaultExtraDisplayPrice, detectItemTypeForPricing, itemUsesSizeBasedExtras, normalizeSizeKey, resolveExtraPrice } from "./extraPricing.service.js";
import { isFreeDrinkPromoActive } from "../../config/websitePromo.js";
import { getPlatformConfig } from "../platform/platformSettings.service.js";
import { getBerlinDayOfWeek, getBerlinTimeString, isWithinBranchHours } from "../../utils/berlinTime.js";
import { getPresetAddOnGroupsForItem, getPresetAddOnGroupsForCategories } from "../manager/extraPreset.service.js";
const BRANCHES_CACHE_KEY = "customer:branches:v2";
const BRANCHES_TTL_SEC = 1800;
const MENU_CACHE_VERSION = "v6";
const MENU_TTL_SEC = 1800;
const ITEM_TTL_SEC = 1800;
const MENU_LANGS = ["de", "en", "nl", "pl", "ru", "ro", "hi", "ar", "ku", "tr", "ckb"];
function menuMemoryKey(branchId, lang) {
    return `customer:menu:${branchId}:${lang}:${MENU_CACHE_VERSION}`;
}
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
function itemCacheKey(branchId, itemId, lang) {
    return `customer:item:${branchId}:${itemId}:${lang}:v1`;
}
export function invalidateBranchItemCache(branchId) {
    deleteSimpleCacheByPrefix(`customer:item:${branchId}:`);
    void clearCache(`customer:item:${branchId}:*`);
}
export function invalidateBranchMenuCache(branchId) {
    for (const lang of MENU_LANGS) {
        const key = menuMemoryKey(branchId, lang);
        deleteSimpleCache(key);
        void deleteCache(`${key}:json`);
        // legacy keys
        deleteSimpleCache(`customer:menu:${branchId}:${lang}:v3`);
        void deleteCache(`customer:menu:${branchId}:${lang}:v3:json`);
    }
    deleteSimpleCache(`customer:menu:${branchId}:v1`);
    void deleteCache(`customer:menu:${branchId}:v1:json`);
    invalidateBranchDerivedCaches(branchId);
    invalidateBranchItemCache(branchId);
}
export async function peekBranchMenuCache(branchId, lang) {
    const resolvedLang = resolveMenuLanguage(lang);
    const memoryKey = menuMemoryKey(branchId, resolvedLang);
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
    const memoryKey = menuMemoryKey(branchId, resolvedLang);
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
    const basic = await buildBranchMenuBasic(branchId);
    return enrichCategoriesWithItemOptions(branchId, basic);
}
const MENU_OPTION_INCLUDE = {
    variantGroups: {
        orderBy: { id: "asc" },
        include: { variants: { orderBy: { price: "asc" } } }
    },
    addOnGroups: {
        orderBy: { id: "asc" },
        include: { addOns: { orderBy: { name: "asc" } } }
    }
};
async function enrichCategoriesWithItemOptions(branchId, categories) {
    const itemIds = [...new Set(categories.flatMap((cat) => cat.items.map((item) => item.id)))];
    if (!itemIds.length)
        return categories;
    const itemCategoryId = new Map();
    for (const cat of categories) {
        const catId = Number(cat.id);
        if (Number.isFinite(catId) && catId > 0) {
            for (const item of cat.items) {
                itemCategoryId.set(item.id, catId);
            }
        }
    }
    const branchMenuItems = await prisma.branchMenuItem.findMany({
        where: { branchId, menuItemId: { in: itemIds }, isAvailable: true },
        include: { menuItem: { include: MENU_OPTION_INCLUDE } }
    });
    const branchItemByMenuId = new Map(branchMenuItems.map((row) => [row.menuItemId, row]));
    for (const row of branchMenuItems) {
        if (row.categoryId != null)
            itemCategoryId.set(row.menuItemId, row.categoryId);
    }
    const loadedIds = new Set(branchMenuItems.map((row) => row.menuItemId));
    const missingIds = itemIds.filter((id) => !loadedIds.has(id) && itemBelongsToBranch(branchId, id));
    const standaloneItems = missingIds.length > 0
        ? await prisma.menuItem.findMany({
            where: { id: { in: missingIds }, isAvailable: true },
            include: MENU_OPTION_INCLUDE
        })
        : [];
    const standaloneById = new Map(standaloneItems.map((item) => [item.id, item]));
    const presetsByCategory = await getPresetAddOnGroupsForCategories(branchId, [...itemCategoryId.values()]);
    function presetAddOnGroupsForItem(menuItemName, categoryId) {
        if (!categoryId)
            return [];
        const presets = presetsByCategory.get(categoryId) ?? [];
        return presets.map((group) => ({
            id: group.id,
            name: group.name,
            required: group.required,
            minSelect: group.minSelect,
            maxSelect: group.maxSelect,
            options: group.options.map((option) => ({
                id: option.id,
                name: option.name,
                price: defaultExtraDisplayPrice(option.name, option.price, menuItemName),
                pricesBySize: buildPricesBySize(option.name, option.price, menuItemName)
            }))
        }));
    }
    return categories.map((cat) => ({
        ...cat,
        items: cat.items.map((basic) => {
            const branchItem = branchItemByMenuId.get(basic.id);
            const menuItem = branchItem?.menuItem ?? standaloneById.get(basic.id);
            if (!menuItem)
                return basic;
            const mapped = mapOptionGroups(menuItem);
            const categoryId = branchItem?.categoryId ?? itemCategoryId.get(basic.id);
            const presetAddOnGroups = presetAddOnGroupsForItem(menuItem.name, categoryId);
            return {
                ...mapped,
                sortOrder: basic.sortOrder ?? 0,
                description: branchItem?.description ?? basic.description ?? mapped.description,
                price: branchItem?.price ?? basic.price ?? mapped.price,
                imageUrl: branchItem?.imageUrl ?? basic.imageUrl ?? mapped.imageUrl,
                addOnGroups: [...mapped.addOnGroups, ...presetAddOnGroups]
            };
        })
    }));
}
async function buildBranchMenuBasic(branchId) {
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
                price: defaultExtraDisplayPrice(a.name, a.price, item.name),
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
            ? {
                sizeBased: true,
                hint: detectItemTypeForPricing(item.name) === "pizza"
                    ? "Extra prices depend on pizza size (klein / groß)"
                    : "Extras use kleine Pizza prices"
            }
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
async function readCachedBranchItem(branchId, itemId, lang) {
    const memoryKey = itemCacheKey(branchId, itemId, lang);
    const cachedMemory = getSimpleCache(memoryKey);
    if (cachedMemory)
        return cachedMemory;
    const redisKey = `${memoryKey}:json`;
    const cachedRedis = await getCache(redisKey);
    if (!cachedRedis)
        return null;
    try {
        const parsed = JSON.parse(cachedRedis);
        setSimpleCache(memoryKey, parsed, ITEM_TTL_SEC * 1000);
        return parsed;
    }
    catch {
        return null;
    }
}
async function writeCachedBranchItem(branchId, itemId, lang, item) {
    const memoryKey = itemCacheKey(branchId, itemId, lang);
    setSimpleCache(memoryKey, item, ITEM_TTL_SEC * 1000);
    await setCache(`${memoryKey}:json`, JSON.stringify(item), ITEM_TTL_SEC);
}
async function buildBranchItemForCustomer(branchId, itemId, resolvedLang) {
    const optionInclude = MENU_OPTION_INCLUDE;
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
                price: defaultExtraDisplayPrice(o.name, o.price, branchItem.menuItem.name),
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
            price: defaultExtraDisplayPrice(o.name, o.price, item.name),
            pricesBySize: buildPricesBySize(o.name, o.price, item.name)
        }))
    }));
    return applyItemTranslations({
        ...mapped,
        addOnGroups: [...mapped.addOnGroups, ...presetAddOnGroups]
    }, resolvedLang);
}
export async function getBranchItemForCustomer(branchId, itemId, lang) {
    const resolvedLang = resolveMenuLanguage(lang);
    const cached = await readCachedBranchItem(branchId, itemId, resolvedLang);
    if (cached)
        return cached;
    const item = await buildBranchItemForCustomer(branchId, itemId, resolvedLang);
    if (item) {
        await writeCachedBranchItem(branchId, itemId, resolvedLang, item);
    }
    return item;
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
