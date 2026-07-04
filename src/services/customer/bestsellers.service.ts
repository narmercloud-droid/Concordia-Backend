import { prisma } from "../../prisma/client.ts";
import { getCache, setCache } from "../../lib/redis.ts";
import { getBranchMenuForCustomer } from "./branchMenu.service.ts";
import { resolveMenuLanguage } from "./menuTranslation.service.ts";

const PERIOD_DAYS = 30;
const CACHE_TTL_SEC = 3600;

type MenuItemRow = {
  id: number;
  itemNumber?: string | null;
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  categoryName?: string;
};

function isDrinkCategory(categoryName: string): boolean {
  return /getränk|drink/i.test(categoryName);
}

function isSaladCategory(categoryName: string): boolean {
  return /salat|salad/i.test(categoryName);
}

function isSideItem(categoryName: string, itemName: string): boolean {
  const cat = categoryName.toLowerCase();
  const name = itemName.toLowerCase();
  if (isSaladCategory(categoryName)) return true;
  if (/imbiss|beilage|snack|side/i.test(cat) && /pommes|frites|kroketten|salat|beilage|dip|sauce/i.test(name)) {
    return true;
  }
  return /pommes|frites|kroketten/.test(name) && !/pizza|burger|calzone/.test(name);
}

function collectCartSuggestions(
  categories: Awaited<ReturnType<typeof getBranchMenuForCustomer>>,
  excludeItemIds: number[],
  drinkLimit: number,
  sideLimit: number
) {
  const exclude = new Set(excludeItemIds);
  const drinks: MenuItemRow[] = [];
  const sides: MenuItemRow[] = [];

  for (const cat of categories) {
    for (const item of cat.items) {
      if (exclude.has(item.id)) continue;
      const row: MenuItemRow = {
        id: item.id,
        itemNumber: (item as MenuItemRow).itemNumber ?? null,
        name: item.name,
        description: item.description ?? null,
        price: Number((item as MenuItemRow).price ?? 0),
        imageUrl: (item as MenuItemRow).imageUrl ?? null,
        categoryName: cat.name
      };
      if (isDrinkCategory(cat.name)) {
        if (drinks.length < drinkLimit) drinks.push(row);
        continue;
      }
      if (isSideItem(cat.name, item.name) && sides.length < sideLimit) {
        sides.push(row);
      }
    }
  }

  return { drinks, sides, items: [...drinks, ...sides] };
}

function flattenMenuItems(
  categories: Awaited<ReturnType<typeof getBranchMenuForCustomer>>
): MenuItemRow[] {
  const items: MenuItemRow[] = [];
  for (const cat of categories) {
    for (const item of cat.items) {
      items.push({
        id: item.id,
        itemNumber: (item as MenuItemRow).itemNumber ?? null,
        name: item.name,
        description: item.description ?? null,
        price: Number((item as MenuItemRow).price ?? 0),
        imageUrl: (item as MenuItemRow).imageUrl ?? null
      });
    }
  }
  return items;
}

function mapMenuItems(
  categories: Awaited<ReturnType<typeof getBranchMenuForCustomer>>,
  itemIds: number[]
): MenuItemRow[] {
  const byId = new Map(flattenMenuItems(categories).map((item) => [item.id, item]));
  return itemIds
    .map((id) => byId.get(id))
    .filter((item): item is MenuItemRow => item != null);
}

async function topSellingItemIds(branchId: string, limit: number): Promise<number[]> {
  const cacheKey = `bestsellers:ids:${branchId}:${limit}`;
  const cached = await getCache(cacheKey);
  if (cached) {
    try {
      return JSON.parse(cached) as number[];
    } catch {
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

export async function getBranchBestsellers(branchId: string, limit = 6, _lang?: string | null) {
  const salesIds = await topSellingItemIds(branchId, limit);
  const rankedIds = salesIds.slice(0, limit);

  return {
    periodDays: PERIOD_DAYS,
    hasSalesData: rankedIds.length >= 3,
    itemIds: rankedIds,
    items: []
  };
}

export async function getAlsoPopularItems(
  branchId: string,
  itemId: number,
  limit = 4,
  lang?: string | null
) {
  const cacheKey = `also-popular:${branchId}:${itemId}:${limit}:${resolveMenuLanguage(lang)}`;
  const cached = await getCache(cacheKey);
  if (cached) {
    try {
      return JSON.parse(cached) as { items: MenuItemRow[] };
    } catch {
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
    return { items: [] as MenuItemRow[] };
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

export async function getCartSuggestions(
  branchId: string,
  excludeItemIds: number[] = [],
  lang?: string | null
) {
  const cacheKey = `cart-suggestions:${branchId}:${resolveMenuLanguage(lang)}:${excludeItemIds.sort((a, b) => a - b).join(",")}`;
  const cached = await getCache(cacheKey);
  if (cached) {
    try {
      return JSON.parse(cached) as {
        drinks: MenuItemRow[];
        sides: MenuItemRow[];
        items: MenuItemRow[];
      };
    } catch {
      // ignore bad cache
    }
  }

  const categories = await getBranchMenuForCustomer(branchId, lang);
  const payload = collectCartSuggestions(categories, excludeItemIds, 6, 6);
  await setCache(cacheKey, JSON.stringify(payload), 300);
  return payload;
}
