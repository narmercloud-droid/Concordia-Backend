import { randomUUID } from "crypto";
import { prisma } from "../../prisma/client.js";
export async function getManagerBranch(branchId) {
    const branch = await prisma.branch.findUnique({
        where: { id: branchId },
        include: {
            BranchConfig: true,
            branchHours: { orderBy: { dayOfWeek: "asc" } }
        }
    });
    if (!branch)
        throw new Error("Branch not found");
    const config = (branch.BranchConfig?.configJson ?? {});
    return {
        id: branch.id,
        name: branch.name,
        status: config.status ?? "live",
        city: config.city ?? null,
        address: config.address ?? null,
        postalCode: config.postalCode ?? null,
        terminalCode: config.terminalCode ?? null,
        deliveryAreas: config.deliveryAreas ?? [],
        hours: branch.branchHours
    };
}
export async function getBranchHours(branchId) {
    return prisma.branchHours.findMany({
        where: { branchId },
        orderBy: { dayOfWeek: "asc" }
    });
}
export async function updateBranchHours(branchId, hours) {
    for (const entry of hours) {
        await prisma.branchHours.upsert({
            where: {
                branchId_dayOfWeek: { branchId, dayOfWeek: entry.dayOfWeek }
            },
            update: {
                openTime: entry.openTime,
                closeTime: entry.closeTime
            },
            create: {
                id: randomUUID(),
                branchId,
                dayOfWeek: entry.dayOfWeek,
                openTime: entry.openTime,
                closeTime: entry.closeTime
            }
        });
    }
    return getBranchHours(branchId);
}
export async function getBranchConfig(branchId) {
    const config = await prisma.branchConfig.findUnique({ where: { branchId } });
    return (config?.configJson ?? {});
}
export async function updateDeliveryAreas(branchId, deliveryAreas) {
    return updateDeliverySettings(branchId, { deliveryAreas });
}
export async function updateDeliverySettings(branchId, settings) {
    const existing = await prisma.branchConfig.findUnique({ where: { branchId } });
    const current = (existing?.configJson ?? {});
    const sortedZones = settings.deliveryRadiusZones
        ? [...settings.deliveryRadiusZones].sort((a, b) => a.maxDistanceKm - b.maxDistanceKm)
        : null;
    const configJson = {
        ...current,
        ...(settings.deliveryMode != null ? { deliveryMode: settings.deliveryMode } : {}),
        ...(settings.freeDeliveryAtMinimum != null
            ? { freeDeliveryAtMinimum: settings.freeDeliveryAtMinimum }
            : {}),
        ...(settings.deliveryAreas != null ? { deliveryAreas: settings.deliveryAreas } : {}),
        ...(sortedZones != null ? { deliveryRadiusZones: sortedZones } : {})
    };
    await prisma.branchConfig.upsert({
        where: { branchId },
        update: { configJson, version: { increment: 1 } },
        create: {
            id: randomUUID(),
            branchId,
            configJson
        }
    });
    return configJson;
}
export async function getBranchMenuForManager(branchId) {
    const categories = await prisma.branchCategory.findMany({
        where: { branchId },
        orderBy: { id: "asc" },
        include: {
            items: {
                orderBy: { id: "asc" },
                include: {
                    menuItem: {
                        select: {
                            id: true,
                            name: true,
                            basePrice: true,
                            kitchen: true
                        }
                    }
                }
            }
        }
    });
    return categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        items: cat.items.map((entry) => ({
            branchMenuItemId: entry.id,
            menuItemId: entry.menuItem.id,
            name: entry.menuItem.name,
            price: entry.price ?? entry.menuItem.basePrice ?? 0,
            kitchen: entry.menuItem.kitchen ?? "B",
            isAvailable: entry.isAvailable
        }))
    }));
}
export async function updateVariantGroupIncludedChoice(branchId, groupId, includedChoice) {
    const group = await prisma.variantGroup.findUnique({
        where: { id: groupId },
        include: {
            item: {
                include: {
                    branchItems: { where: { branchId }, take: 1 }
                }
            }
        }
    });
    if (!group || !group.item.branchItems.length) {
        throw new Error("Variant group not found for this branch");
    }
    return prisma.variantGroup.update({
        where: { id: groupId },
        data: { includedChoice }
    });
}
export async function updateBranchMenuItem(branchId, branchMenuItemId, data) {
    const item = await prisma.branchMenuItem.findFirst({
        where: { id: branchMenuItemId, branchId }
    });
    if (!item)
        throw new Error("Menu item not found");
    return prisma.branchMenuItem.update({
        where: { id: branchMenuItemId },
        data: {
            price: data.price ?? item.price,
            isAvailable: data.isAvailable ?? item.isAvailable
        },
        include: { menuItem: true }
    });
}
export async function getBranchOrders(branchId, limit = 50) {
    return prisma.order.findMany({
        where: { branchId },
        orderBy: { createdAt: "desc" },
        take: limit,
        include: {
            items: { include: { item: true } }
        }
    });
}
export async function getBranchDashboard(branchId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [pending, todayOrders, totalRevenue] = await Promise.all([
        prisma.order.count({
            where: { branchId, status: { in: ["pending", "accepted", "preparing"] } }
        }),
        prisma.order.count({
            where: { branchId, createdAt: { gte: today } }
        }),
        prisma.order.aggregate({
            where: { branchId, createdAt: { gte: today }, status: { not: "cancelled" } },
            _sum: { orderTotal: true }
        })
    ]);
    return {
        pendingOrders: pending,
        todayOrders,
        todayRevenue: totalRevenue._sum.orderTotal ?? 0
    };
}
