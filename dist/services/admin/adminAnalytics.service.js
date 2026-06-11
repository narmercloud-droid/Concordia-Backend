import { prisma } from "../../prisma/client.js";
function lastNDays(n) {
    const days = [];
    for (let i = n - 1; i >= 0; i--) {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() - i);
        days.push(d);
    }
    return days;
}
function dayKey(date) {
    return date.toISOString().slice(0, 10);
}
function formatDayLabel(date) {
    return date.toLocaleDateString("de-DE", { weekday: "short", day: "2-digit", month: "2-digit" });
}
const activeOrderFilter = {
    status: { notIn: ["cancelled"] }
};
export async function getSalesSeries(days = 7) {
    const range = lastNDays(days);
    const start = range[0];
    const orders = await prisma.order.findMany({
        where: {
            createdAt: { gte: start },
            ...activeOrderFilter
        },
        include: { items: true }
    });
    const totals = new Map();
    for (const day of range)
        totals.set(dayKey(day), 0);
    for (const order of orders) {
        const key = dayKey(order.createdAt);
        if (!totals.has(key))
            continue;
        const revenue = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        totals.set(key, (totals.get(key) ?? 0) + revenue);
    }
    return {
        labels: range.map(formatDayLabel),
        values: range.map((day) => Math.round((totals.get(dayKey(day)) ?? 0) * 100) / 100)
    };
}
export async function getOrderVolumeSeries(days = 7) {
    const range = lastNDays(days);
    const start = range[0];
    const orders = await prisma.order.findMany({
        where: {
            createdAt: { gte: start },
            ...activeOrderFilter
        },
        select: { createdAt: true }
    });
    const counts = new Map();
    for (const day of range)
        counts.set(dayKey(day), 0);
    for (const order of orders) {
        const key = dayKey(order.createdAt);
        if (!counts.has(key))
            continue;
        counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return {
        labels: range.map(formatDayLabel),
        values: range.map((day) => counts.get(dayKey(day)) ?? 0)
    };
}
export async function getCategoryPerformanceSeries() {
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const grouped = await prisma.orderItem.groupBy({
        by: ["itemId"],
        _sum: { quantity: true },
        where: {
            order: {
                createdAt: { gte: since },
                ...activeOrderFilter
            }
        }
    });
    const itemIds = grouped.map((row) => row.itemId);
    const branchItems = await prisma.branchMenuItem.findMany({
        where: { menuItemId: { in: itemIds } },
        include: { category: true }
    });
    const categoryByItem = new Map();
    for (const entry of branchItems) {
        categoryByItem.set(entry.menuItemId, entry.category?.name ?? "Other");
    }
    const totals = new Map();
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
export async function getBranchPerformanceSeries() {
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const orders = await prisma.order.findMany({
        where: {
            createdAt: { gte: since },
            ...activeOrderFilter
        },
        include: {
            items: true,
            branch: { select: { name: true } }
        }
    });
    const totals = new Map();
    for (const order of orders) {
        const name = order.branch?.name ?? "Unknown";
        const revenue = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        totals.set(name, (totals.get(name) ?? 0) + revenue);
    }
    const sorted = [...totals.entries()].sort((a, b) => b[1] - a[1]);
    return {
        labels: sorted.map(([name]) => name.replace(/^Concordia\s+/i, "")),
        values: sorted.map(([, revenue]) => Math.round(revenue * 100) / 100)
    };
}
export async function getPeakHoursSeries(branchId) {
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    if (branchId) {
        const rows = (await prisma.$queryRaw `
      SELECT
        CAST(EXTRACT(HOUR FROM "createdAt") AS INT) AS hour,
        COUNT(*)::INT AS count
      FROM "Order"
      WHERE "createdAt" >= ${since}
        AND "branchId" = ${branchId}
        AND "status" <> 'cancelled'
      GROUP BY hour
      ORDER BY hour
    `);
        const byHour = new Map(rows.map((r) => [Number(r.hour), Number(r.count)]));
        return {
            labels: Array.from({ length: 24 }, (_, h) => `${String(h).padStart(2, "0")}:00`),
            values: Array.from({ length: 24 }, (_, h) => byHour.get(h) ?? 0)
        };
    }
    const rows = (await prisma.$queryRaw `
    SELECT
      CAST(EXTRACT(HOUR FROM "createdAt") AS INT) AS hour,
      COUNT(*)::INT AS count
    FROM "Order"
    WHERE "createdAt" >= ${since}
      AND "status" <> 'cancelled'
    GROUP BY hour
    ORDER BY hour
  `);
    const byHour = new Map(rows.map((r) => [Number(r.hour), Number(r.count)]));
    return {
        labels: Array.from({ length: 24 }, (_, h) => `${String(h).padStart(2, "0")}:00`),
        values: Array.from({ length: 24 }, (_, h) => byHour.get(h) ?? 0)
    };
}
export async function getTopItemsSeries(branchId, limit = 10) {
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const grouped = await prisma.orderItem.groupBy({
        by: ["itemId"],
        _sum: { quantity: true },
        where: {
            order: {
                createdAt: { gte: since },
                ...(branchId ? { branchId } : {}),
                ...activeOrderFilter
            }
        },
        orderBy: { _sum: { quantity: "desc" } },
        take: limit
    });
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
