import { randomUUID } from "crypto";
import { prisma } from "../../prisma/client.ts";
import { getBerlinTodayRange } from "../../utils/berlinTime.ts";
import { IN_PROGRESS_ORDER_STATUSES } from "../order/orderStatus.constants.ts";

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
      freeDeliveryMinimum?: number;
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

  const { invalidateBranchListCache } = await import("../customer/branchMenu.service.ts");
  invalidateBranchListCache();

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

  const { invalidateBranchMenuCache } = await import("../customer/branchMenu.service.ts");
  invalidateBranchMenuCache(branchId);

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

export async function getBranchOrders(
  branchId: string,
  options: {
    search?: string;
    customerType?: "guest" | "registered";
    paymentMethod?: string;
    limit?: number;
    offset?: number;
  } = {}
) {
  const limit = Math.min(Math.max(Number(options.limit ?? 50) || 50, 1), 100);
  const offset = Math.max(Number(options.offset ?? 0) || 0, 0);
  const where = buildBranchOrderWhere(branchId, options);

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
      include: MANAGER_ORDER_INCLUDE
    }),
    prisma.order.count({ where })
  ]);

  return { orders, total, limit, offset };
}

export async function getBranchOrderById(branchId: string, orderId: string) {
  return prisma.order.findFirst({
    where: { id: orderId, branchId },
    include: MANAGER_ORDER_INCLUDE
  });
}

const MANAGER_ORDER_INCLUDE = {
  items: {
    include: {
      item: true,
      variants: true,
      extras: true
    }
  },
  trackingEvents: { orderBy: { timestamp: "asc" as const } }
};

const PAYMENT_METHOD_FILTER_VALUES: Record<string, string[]> = {
  cash: ["COD", "cod", "cash"],
  card: ["CARD", "card"],
  paypal: ["PAYPAL", "paypal"],
  klarna: ["KLARNA", "klarna"],
  sepa: ["SEPA", "sepa"],
  stripe: ["stripe", "STRIPE"]
};

function paymentMethodFilterValues(filter: string) {
  const key = filter.trim().toLowerCase();
  if (!key || key === "all") return null;
  return PAYMENT_METHOD_FILTER_VALUES[key] ?? [filter.trim().toUpperCase(), filter.trim().toLowerCase()];
}

function buildBranchOrderWhere(
  branchId: string,
  filters: {
    search?: string;
    customerType?: "guest" | "registered";
    paymentMethod?: string;
  } = {}
) {
  const and: Array<Record<string, unknown>> = [{ branchId }];

  const q = filters.search?.trim();
  if (q) {
    and.push({
      OR: [
        { id: { contains: q, mode: "insensitive" as const } },
        { tracking_token: { contains: q, mode: "insensitive" as const } },
        { customerName: { contains: q, mode: "insensitive" as const } },
        { customerPhone: { contains: q, mode: "insensitive" as const } },
        { customerEmail: { contains: q, mode: "insensitive" as const } },
        { deliveryAddress: { contains: q, mode: "insensitive" as const } },
        { postalCode: { contains: q, mode: "insensitive" as const } }
      ]
    });
  }

  if (filters.customerType === "guest") {
    and.push({ OR: [{ isGuest: true }, { customerId: null }] });
  } else if (filters.customerType === "registered") {
    and.push({ isGuest: false, customerId: { not: null } });
  }

  const paymentValues = paymentMethodFilterValues(filters.paymentMethod ?? "");
  if (paymentValues?.length) {
    and.push({
      OR: paymentValues.map((value) => ({
        paymentMethod: { equals: value, mode: "insensitive" as const }
      }))
    });
  }

  return and.length === 1 ? and[0] : { AND: and };
}

export function formatManagerOrder(o: {
  id: string;
  tracking_token?: string | null;
  status: string;
  courierStatus?: string | null;
  kitchenStatus?: string | null;
  fulfillmentType?: string | null;
  customerName?: string | null;
  customerPhone?: string | null;
  customerEmail?: string | null;
  deliveryAddress?: string | null;
  postalCode?: string | null;
  orderTotal?: number | null;
  deliveryFee?: number | null;
  discount?: number | null;
  giftCardAmount?: number | null;
  paymentMethod?: string | null;
  paymentStatus?: string | null;
  notes?: string | null;
  scheduledFor?: Date | null;
  createdAt: Date;
  confirmedAt?: Date | null;
  preparingAt?: Date | null;
  readyAt?: Date | null;
  pickedUpAt?: Date | null;
  deliveredAt?: Date | null;
  estimatedPrepTime?: number | null;
  estimatedTotalTime?: number | null;
  isGuest?: boolean | null;
  items?: Array<{
    id: string;
    quantity: number;
    price: number;
    notes?: string | null;
    item?: { name?: string | null } | null;
    variants?: Array<{ name: string; price: unknown }>;
    extras?: Array<{ name: string; price: unknown }>;
  }>;
  trackingEvents?: Array<{ status: string; timestamp: Date }>;
}) {
  return {
    id: o.id,
    trackingToken: o.tracking_token ?? null,
    status: o.status,
    courierStatus: o.courierStatus,
    kitchenStatus: o.kitchenStatus,
    fulfillmentType: o.fulfillmentType,
    customerName: o.customerName,
    customerPhone: o.customerPhone,
    customerEmail: o.customerEmail,
    deliveryAddress: o.deliveryAddress,
    postalCode: o.postalCode,
    orderTotal: o.orderTotal,
    deliveryFee: o.deliveryFee,
    discount: o.discount,
    giftCardAmount: o.giftCardAmount,
    paymentMethod: o.paymentMethod,
    paymentStatus: o.paymentStatus,
    notes: o.notes,
    scheduledFor: o.scheduledFor,
    createdAt: o.createdAt,
    confirmedAt: o.confirmedAt,
    preparingAt: o.preparingAt,
    readyAt: o.readyAt,
    pickedUpAt: o.pickedUpAt,
    deliveredAt: o.deliveredAt,
    estimatedPrepTime: o.estimatedPrepTime,
    estimatedTotalTime: o.estimatedTotalTime,
    isGuest: o.isGuest,
    items: (o.items ?? []).map((i) => ({
      id: i.id,
      name: i.item?.name ?? "Item",
      quantity: i.quantity,
      price: i.price,
      notes: i.notes,
      variants: (i.variants ?? []).map((v) => ({
        name: v.name,
        price: Number(v.price)
      })),
      extras: (i.extras ?? []).map((e) => ({
        name: e.name,
        price: Number(e.price)
      }))
    })),
    timeline: (o.trackingEvents ?? []).map((e) => ({
      status: e.status,
      timestamp: e.timestamp
    }))
  };
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

  const { invalidateBranchListCache } = await import("../customer/branchMenu.service.ts");
  invalidateBranchListCache();

  return getBranchPromotions(branchId);
}

export async function getBranchDashboard(branchId: string) {
  const { start, end } = getBerlinTodayRange();

  const [activeOrders, todayOrders, totalRevenue] = await Promise.all([
    prisma.order.count({
      where: {
        branchId,
        createdAt: { gte: start, lt: end },
        status: { in: IN_PROGRESS_ORDER_STATUSES },
        paymentStatus: { notIn: ["awaiting_payment", "AWAITING_EXTERNAL_PAYMENT"] }
      }
    }),
    prisma.order.count({
      where: { branchId, createdAt: { gte: start, lt: end } }
    }),
    prisma.order.aggregate({
      where: {
        branchId,
        createdAt: { gte: start, lt: end },
        paymentStatus: "paid",
        status: { notIn: ["cancelled", "rejected"] }
      },
      _sum: { orderTotal: true }
    })
  ]);

  return {
    pendingOrders: activeOrders,
    todayOrders,
    todayRevenue: totalRevenue._sum.orderTotal ?? 0
  };
}
