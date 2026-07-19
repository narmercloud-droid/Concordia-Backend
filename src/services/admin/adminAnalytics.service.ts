import { prisma } from "../../prisma/client.ts";

type ChartSeries = { labels: string[]; values: number[] };

function lastNDays(n: number) {
  const days: Date[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    days.push(d);
  }
  return days;
}

function dayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function formatDayLabel(date: Date) {
  return date.toLocaleDateString("de-DE", { weekday: "short", day: "2-digit", month: "2-digit" });
}

const activeOrderFilter = {
  status: { notIn: ["cancelled", "rejected"] as string[] }
};

function branchFilter(branchId?: string) {
  return branchId ? { branchId } : {};
}

export async function getSalesSeries(days = 7, branchId?: string): Promise<ChartSeries> {
  const range = lastNDays(days);
  const start = range[0];

  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: start },
      ...branchFilter(branchId),
      ...activeOrderFilter
    },
    select: { createdAt: true, orderTotal: true }
  });

  const totals = new Map<string, number>();
  for (const day of range) totals.set(dayKey(day), 0);

  for (const order of orders) {
    const key = dayKey(order.createdAt);
    if (!totals.has(key)) continue;
    totals.set(key, (totals.get(key) ?? 0) + Number(order.orderTotal ?? 0));
  }

  return {
    labels: range.map(formatDayLabel),
    values: range.map((day) => Math.round((totals.get(dayKey(day)) ?? 0) * 100) / 100)
  };
}

export async function getOrderVolumeSeries(days = 7, branchId?: string): Promise<ChartSeries> {
  const range = lastNDays(days);
  const start = range[0];

  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: start },
      ...branchFilter(branchId),
      ...activeOrderFilter
    },
    select: { createdAt: true }
  });

  const counts = new Map<string, number>();
  for (const day of range) counts.set(dayKey(day), 0);

  for (const order of orders) {
    const key = dayKey(order.createdAt);
    if (!counts.has(key)) continue;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return {
    labels: range.map(formatDayLabel),
    values: range.map((day) => counts.get(dayKey(day)) ?? 0)
  };
}

export async function getCategoryPerformanceSeries(branchId?: string): Promise<ChartSeries> {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const grouped = await prisma.orderItem.groupBy({
    by: ["itemId"],
    _sum: { quantity: true },
    where: {
      order: {
        createdAt: { gte: since },
        ...branchFilter(branchId),
        ...activeOrderFilter
      }
    }
  });

  if (!grouped.length) {
    return { labels: [], values: [] };
  }

  const itemIds = grouped.map((row) => row.itemId);
  const branchItems = await prisma.branchMenuItem.findMany({
    where: {
      menuItemId: { in: itemIds },
      ...(branchId ? { branchId } : {})
    },
    include: { category: true }
  });

  const categoryByItem = new Map<number, string>();
  for (const entry of branchItems) {
    categoryByItem.set(entry.menuItemId, entry.category?.name ?? "Other");
  }

  const totals = new Map<string, number>();
  for (const row of grouped) {
    const name = categoryByItem.get(row.itemId) ?? "Other";
    totals.set(name, (totals.get(name) ?? 0) + (row._sum.quantity ?? 0));
  }

  const sorted = [...totals.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  return {
    labels: sorted.map(([name]) => name),
    values: sorted.map(([, qty]) => qty)
  };
}

export async function getBranchPerformanceSeries(branchId?: string): Promise<ChartSeries> {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: since },
      ...branchFilter(branchId),
      ...activeOrderFilter
    },
    select: {
      orderTotal: true,
      branch: { select: { name: true } }
    }
  });

  const totals = new Map<string, number>();
  for (const order of orders) {
    const name = order.branch?.name ?? "Unknown";
    totals.set(name, (totals.get(name) ?? 0) + Number(order.orderTotal ?? 0));
  }

  const sorted = [...totals.entries()].sort((a, b) => b[1] - a[1]);
  return {
    labels: sorted.map(([name]) => name.replace(/^Concordia\s+/i, "")),
    values: sorted.map(([, revenue]) => Math.round(revenue * 100) / 100)
  };
}

export async function getPeakHoursSeries(branchId?: string): Promise<ChartSeries> {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const rows = branchId
    ? ((await prisma.$queryRaw`
        SELECT
          CAST(EXTRACT(HOUR FROM "createdAt") AS INT) AS hour,
          COUNT(*)::INT AS count
        FROM "Order"
        WHERE "createdAt" >= ${since}
          AND "branchId" = ${branchId}
          AND "status" NOT IN ('cancelled', 'rejected')
        GROUP BY hour
        ORDER BY hour
      `) as Array<{ hour: number; count: number }>)
    : ((await prisma.$queryRaw`
        SELECT
          CAST(EXTRACT(HOUR FROM "createdAt") AS INT) AS hour,
          COUNT(*)::INT AS count
        FROM "Order"
        WHERE "createdAt" >= ${since}
          AND "status" NOT IN ('cancelled', 'rejected')
        GROUP BY hour
        ORDER BY hour
      `) as Array<{ hour: number; count: number }>);

  const byHour = new Map(rows.map((r) => [Number(r.hour), Number(r.count)]));
  return {
    labels: Array.from({ length: 24 }, (_, h) => `${String(h).padStart(2, "0")}:00`),
    values: Array.from({ length: 24 }, (_, h) => byHour.get(h) ?? 0)
  };
}

export async function getTopItemsSeries(branchId?: string, limit = 10): Promise<ChartSeries> {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const grouped = await prisma.orderItem.groupBy({
    by: ["itemId"],
    _sum: { quantity: true },
    where: {
      order: {
        createdAt: { gte: since },
        ...branchFilter(branchId),
        ...activeOrderFilter
      }
    },
    orderBy: { _sum: { quantity: "desc" } },
    take: limit
  });

  if (!grouped.length) {
    return { labels: [], values: [] };
  }

  const itemIds = grouped.map((row) => row.itemId);
  const items = await prisma.menuItem.findMany({
    where: { id: { in: itemIds } },
    select: { id: true, name: true }
  });
  const names = new Map(items.map((item) => [item.id, item.name]));

  return {
    labels: grouped.map((row) => names.get(row.itemId) ?? `Item ${row.itemId}`),
    values: grouped.map((row) => row._sum.quantity ?? 0)
  };
}

export type OrderLocationPoint = {
  lat: number;
  lng: number;
  count: number;
  revenue: number;
  postalCode: string | null;
};

export type OrderPostalArea = {
  postalCode: string;
  count: number;
  revenue: number;
  lat: number | null;
  lng: number | null;
};

export type OrderLocationBranch = {
  id: string;
  name: string;
  lat: number | null;
  lng: number | null;
};

export type OrderLocationAnalytics = {
  points: OrderLocationPoint[];
  postalAreas: OrderPostalArea[];
  branches: OrderLocationBranch[];
  meta: {
    days: number;
    deliveryOrders: number;
    withCoords: number;
    postalOnly: number;
    totalRevenue: number;
  };
};

function roundCoord(value: number, decimals = 3) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export async function getOrderLocationAnalytics(
  days = 90,
  branchId?: string
): Promise<OrderLocationAnalytics> {
  const since = new Date(Date.now() - Math.max(1, days) * 24 * 60 * 60 * 1000);

  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: since },
      ...branchFilter(branchId),
      ...activeOrderFilter,
      fulfillmentType: "delivery"
    },
    select: {
      deliveryLat: true,
      deliveryLng: true,
      postalCode: true,
      orderTotal: true,
      branchId: true
    }
  });

  const pointMap = new Map<string, OrderLocationPoint>();
  const postalMap = new Map<
    string,
    { count: number; revenue: number; latSum: number; lngSum: number; coordCount: number }
  >();

  let withCoords = 0;
  let postalOnly = 0;
  let totalRevenue = 0;

  for (const order of orders) {
    const revenue = Number(order.orderTotal ?? 0);
    totalRevenue += revenue;
    const postal = order.postalCode?.trim() || null;
    const lat = Number(order.deliveryLat);
    const lng = Number(order.deliveryLng);
    const hasCoords = Number.isFinite(lat) && Number.isFinite(lng);

    if (hasCoords) {
      withCoords += 1;
      const rLat = roundCoord(lat);
      const rLng = roundCoord(lng);
      const key = `${rLat},${rLng}`;
      const existing = pointMap.get(key);
      if (existing) {
        existing.count += 1;
        existing.revenue = Math.round((existing.revenue + revenue) * 100) / 100;
        if (!existing.postalCode && postal) existing.postalCode = postal;
      } else {
        pointMap.set(key, {
          lat: rLat,
          lng: rLng,
          count: 1,
          revenue: Math.round(revenue * 100) / 100,
          postalCode: postal
        });
      }
    } else if (postal) {
      postalOnly += 1;
    }

    if (postal) {
      const bucket = postalMap.get(postal) ?? {
        count: 0,
        revenue: 0,
        latSum: 0,
        lngSum: 0,
        coordCount: 0
      };
      bucket.count += 1;
      bucket.revenue += revenue;
      if (hasCoords) {
        bucket.latSum += lat;
        bucket.lngSum += lng;
        bucket.coordCount += 1;
      }
      postalMap.set(postal, bucket);
    }
  }

  const branchRows = await prisma.branch.findMany({
    where: branchId ? { id: branchId } : undefined,
    select: {
      id: true,
      name: true,
      BranchConfig: { select: { configJson: true } }
    },
    orderBy: { name: "asc" }
  });

  const branches: OrderLocationBranch[] = branchRows.map((branch) => {
    const config = (branch.BranchConfig?.configJson ?? {}) as Record<string, unknown>;
    const lat = Number(config.lat);
    const lng = Number(config.lng);
    return {
      id: branch.id,
      name: branch.name,
      lat: Number.isFinite(lat) ? lat : null,
      lng: Number.isFinite(lng) ? lng : null
    };
  });

  const postalAreas: OrderPostalArea[] = [...postalMap.entries()]
    .map(([postalCode, bucket]) => ({
      postalCode,
      count: bucket.count,
      revenue: Math.round(bucket.revenue * 100) / 100,
      lat: bucket.coordCount > 0 ? roundCoord(bucket.latSum / bucket.coordCount, 4) : null,
      lng: bucket.coordCount > 0 ? roundCoord(bucket.lngSum / bucket.coordCount, 4) : null
    }))
    .sort((a, b) => b.count - a.count);

  return {
    points: [...pointMap.values()].sort((a, b) => b.count - a.count),
    postalAreas,
    branches,
    meta: {
      days,
      deliveryOrders: orders.length,
      withCoords,
      postalOnly,
      totalRevenue: Math.round(totalRevenue * 100) / 100
    }
  };
}
