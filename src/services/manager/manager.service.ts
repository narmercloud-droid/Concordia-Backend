import { randomUUID } from "crypto";
import { prisma } from "../../prisma/client.ts";

export async function getManagerBranch(branchId: string) {
  const branch = await prisma.branch.findUnique({
    where: { id: branchId },
    include: {
      BranchConfig: true,
      branchHours: { orderBy: { dayOfWeek: "asc" } }
    }
  });

  if (!branch) throw new Error("Branch not found");

  const config = (branch.BranchConfig?.configJson ?? {}) as Record<string, unknown>;

  return {
    id: branch.id,
    name: branch.name,
    status: config.status ?? "live",
    city: config.city ?? null,
    address: config.address ?? null,
    postalCode: config.postalCode ?? null,
    terminalCode: config.terminalCode ?? null,
    deliveryAreas: (config.deliveryAreas as unknown[]) ?? [],
    hours: branch.branchHours
  };
}

export async function getBranchHours(branchId: string) {
  return prisma.branchHours.findMany({
    where: { branchId },
    orderBy: { dayOfWeek: "asc" }
  });
}

export async function updateBranchVisibility(
  branchId: string,
  status: "live" | "coming_soon"
) {
  if (!["live", "coming_soon"].includes(status)) {
    throw new Error("status must be live or coming_soon");
  }

  const branch = await prisma.branch.findUnique({
    where: { id: branchId },
    include: { BranchConfig: true }
  });

  if (!branch) throw new Error("Branch not found");

  const existing = (branch.BranchConfig?.configJson ?? {}) as Record<string, unknown>;
  const configJson = { ...existing, status };

  if (branch.BranchConfig) {
    await prisma.branchConfig.update({
      where: { branchId },
      data: { configJson }
    });
  } else {
    await prisma.branchConfig.create({
      data: {
        id: `config-${branchId}`,
        branchId,
        configJson
      }
    });
  }

  const { invalidateBranchListCache } = await import("../customer/branchMenu.service.ts");
  invalidateBranchListCache();

  return getManagerBranch(branchId);
}

export async function updateBranchHours(
  branchId: string,
  hours: Array<{ dayOfWeek: number; openTime: string; closeTime: string }>
) {
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

  const { invalidateBranchListCache } = await import("../customer/branchMenu.service.ts");
  invalidateBranchListCache();

  return getBranchHours(branchId);
}

export async function getBranchConfig(branchId: string) {
  const config = await prisma.branchConfig.findUnique({ where: { branchId } });
  return (config?.configJson ?? {}) as Record<string, unknown>;
}

export async function updateDeliveryAreas(
  branchId: string,
  deliveryAreas: Array<{
    postalCode: string;
    minimumOrder: number;
    deliveryFee: number;
    name?: string;
  }>
) {
  return updateDeliverySettings(branchId, { deliveryAreas });
}

export async function updateDeliverySettings(
  branchId: string,
  settings: {
    deliveryMode?: "postcodes" | "radius" | "both";
    freeDeliveryAtMinimum?: boolean;
    deliveryAreas?: Array<{
      postalCode: string;
      minimumOrder: number;
      deliveryFee: number;
      name?: string;
    }>;
    deliveryRadiusZones?: Array<{
      maxDistanceKm: number;
      minimumOrder: number;
      deliveryFee: number;
      label?: string;
    }>;
  }
) {
  const existing = await prisma.branchConfig.findUnique({ where: { branchId } });
  const current = (existing?.configJson ?? {}) as Record<string, unknown>;

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

export async function getBranchMenuForManager(branchId: string) {
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
              kitchen: true,
              imageUrl: true
            }
          }
        }
      }
    }
  });

  return categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    description: cat.description,
    sortOrder: cat.sortOrder ?? 0,
    items: cat.items.map((entry) => ({
      branchMenuItemId: entry.id,
      menuItemId: entry.menuItem.id,
      name: entry.menuItem.name,
      description: entry.description ?? entry.menuItem.description,
      price: entry.price ?? entry.menuItem.basePrice ?? 0,
      kitchen: entry.menuItem.kitchen ?? "B",
      sortOrder: entry.menuItem.sortOrder ?? 0,
      isAvailable: entry.isAvailable,
      imageUrl: entry.imageUrl ?? entry.menuItem.imageUrl ?? null
    }))
  }));
}

export async function updateVariantGroupIncludedChoice(
  branchId: string,
  groupId: string,
  includedChoice: boolean
) {
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

export async function updateBranchMenuItem(
  branchId: string,
  branchMenuItemId: number,
  data: { price?: number; isAvailable?: boolean }
) {
  const item = await prisma.branchMenuItem.findFirst({
    where: { id: branchMenuItemId, branchId }
  });

  if (!item) throw new Error("Menu item not found");

  const { invalidateBranchMenuCache } = await import("../customer/branchMenu.service.ts");
  invalidateBranchMenuCache(branchId);

  return prisma.branchMenuItem.update({
    where: { id: branchMenuItemId },
    data: {
      price: data.price ?? item.price,
      isAvailable: data.isAvailable ?? item.isAvailable
    },
    include: { menuItem: true }
  });
}

export async function getBranchOrders(branchId: string, limit = 50) {
  return prisma.order.findMany({
    where: { branchId },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      items: { include: { item: true } }
    }
  });
}

export async function getBranchPromotions(branchId: string) {
  const config = await getBranchConfig(branchId);
  const promotions = (config.promotions ?? {}) as Record<string, unknown>;
  return {
    freeDrinkMinOrder: Number(promotions.freeDrinkMinOrder ?? 35),
    freeDrinkMessage: String(promotions.freeDrinkMessage ?? ""),
    websiteDiscountEnabled: promotions.websiteDiscountEnabled !== false
  };
}

export async function updateBranchPromotions(
  branchId: string,
  input: {
    freeDrinkMinOrder?: number;
    freeDrinkMessage?: string;
    websiteDiscountEnabled?: boolean;
  }
) {
  const existing = await prisma.branchConfig.findUnique({ where: { branchId } });
  const current = (existing?.configJson ?? {}) as Record<string, unknown>;
  const promotions = (current.promotions ?? {}) as Record<string, unknown>;

  const configJson = {
    ...current,
    promotions: {
      ...promotions,
      ...(input.freeDrinkMinOrder != null
        ? { freeDrinkMinOrder: input.freeDrinkMinOrder }
        : {}),
      ...(input.freeDrinkMessage != null
        ? { freeDrinkMessage: input.freeDrinkMessage }
        : {}),
      ...(input.websiteDiscountEnabled != null
        ? { websiteDiscountEnabled: input.websiteDiscountEnabled }
        : {})
    }
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

  return getBranchPromotions(branchId);
}

export async function getBranchDashboard(branchId: string) {
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
