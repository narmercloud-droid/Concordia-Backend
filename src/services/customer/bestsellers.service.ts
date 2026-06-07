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
};

function flattenMenuItems(
  categories: Awaited<ReturnType<typeof getBranchMenuForCustomer>>
): MenuItemRow[] {
  const items: MenuItemRow[] = [];
  for (const cat of categories) {
    for (const item of cat.items) {
      items.push(item);
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

export async function getBranchBestsellers(branchId: string, limit = 6, lang?: string | null) {
  const [categories, salesIds] = await Promise.all([
    getBranchMenuForCustomer(branchId, lang),
    topSellingItemIds(branchId, limit)
  ]);

  const availableIds = new Set(flattenMenuItems(categories).map((item) => item.id));
  const rankedIds = salesIds.filter((id) => availableIds.has(id)).slice(0, limit);
  const items = mapMenuItems(categories, rankedIds);

  return {
    periodDays: PERIOD_DAYS,
    hasSalesData: items.length >= 3,
    itemIds: rankedIds,
    items
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
