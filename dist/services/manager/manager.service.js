import { randomUUID } from "crypto";
import { prisma } from "../../prisma/client.js";
import { getBerlinTodayRange } from "../../utils/berlinTime.js";
import { IN_PROGRESS_ORDER_STATUSES } from "../order/orderStatus.constants.js";
import { isCountableRevenueOrder } from "../admin/revenueReport.service.js";
import { resolveOrderPaymentMethod } from "../../utils/orderPaymentMethod.js";
import { checkoutIssuePrismaFilter, getOrderCheckoutTagLabel, resolveOrderCheckoutTag } from "../../utils/orderPayment.js";
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
export async function updateBranchVisibility(branchId, status) {
    if (!["live", "coming_soon"].includes(status)) {
        throw new Error("status must be live or coming_soon");
    }
    const branch = await prisma.branch.findUnique({
        where: { id: branchId },
        include: { BranchConfig: true }
    });
    if (!branch)
        throw new Error("Branch not found");
    const existing = (branch.BranchConfig?.configJson ?? {});
    const configJson = { ...existing, status };
    if (branch.BranchConfig) {
        await prisma.branchConfig.update({
            where: { branchId },
            data: { configJson }
        });
    }
    else {
        await prisma.branchConfig.create({
            data: {
                id: `config-${branchId}`,
                branchId,
                configJson
            }
        });
    }
    const { invalidateBranchListCache } = await import("../customer/branchMenu.service.js");
    invalidateBranchListCache();
    return getManagerBranch(branchId);
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
    const { invalidateBranchListCache } = await import("../customer/branchMenu.service.js");
    invalidateBranchListCache();
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
        ...(settings.deliveryMode === "radius"
            ? { deliveryAreas: [] }
            : settings.deliveryAreas != null
                ? { deliveryAreas: settings.deliveryAreas }
                : {}),
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
    const { invalidateBranchListCache } = await import("../customer/branchMenu.service.js");
    invalidateBranchListCache();
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
    const { invalidateBranchMenuCache } = await import("../customer/branchMenu.service.js");
    invalidateBranchMenuCache(branchId);
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
    const { invalidateBranchMenuCache } = await import("../customer/branchMenu.service.js");
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
export async function getBranchOrders(branchId, options = {}) {
    const limit = Math.min(Math.max(Number(options.limit ?? 50) || 50, 1), 100);
    const offset = Math.max(Number(options.offset ?? 0) || 0, 0);
    const where = buildBranchOrderWhere(branchId, options);
    const [orders, total] = await Promise.all([
        prisma.order.findMany({
            where,
            orderBy: { createdAt: "desc" },
            take: limit,
            skip: offset,
            include: MANAGER_ORDER_LIST_INCLUDE
        }),
        prisma.order.count({ where })
    ]);
    return { orders, total, limit, offset };
}
export async function getBranchOrderById(branchId, orderId) {
    return prisma.order.findFirst({
        where: { id: orderId, branchId },
        include: MANAGER_ORDER_DETAIL_INCLUDE
    });
}
const MANAGER_ORDER_LIST_INCLUDE = {
    items: {
        select: {
            id: true,
            quantity: true,
            price: true,
            notes: true,
            item: { select: { name: true } },
            variants: { select: { name: true, price: true } },
            extras: { select: { name: true, price: true } }
        }
    },
    trackingEvents: {
        select: { status: true, timestamp: true },
        orderBy: { timestamp: "asc" }
    }
};
const MANAGER_ORDER_DETAIL_INCLUDE = {
    items: {
        include: {
            item: true,
            variants: true,
            extras: true
        }
    },
    trackingEvents: { orderBy: { timestamp: "asc" } }
};
const PAYMENT_METHOD_FILTER_VALUES = {
    cash: ["COD", "cod", "cash"],
    card: ["CARD", "card"],
    paypal: ["PAYPAL", "paypal"],
    klarna: ["KLARNA", "klarna"],
    sepa: ["SEPA", "sepa"],
    stripe: ["stripe", "STRIPE"]
};
function paymentMethodFilterValues(filter) {
    const key = filter.trim().toLowerCase();
    if (!key || key === "all")
        return null;
    return PAYMENT_METHOD_FILTER_VALUES[key] ?? [filter.trim().toUpperCase(), filter.trim().toLowerCase()];
}
function buildBranchOrderWhere(branchId, filters = {}) {
    const and = [{ branchId }];
    const q = filters.search?.trim();
    if (q) {
        and.push({
            OR: [
                { id: { contains: q, mode: "insensitive" } },
                { tracking_token: { contains: q, mode: "insensitive" } },
                { customerName: { contains: q, mode: "insensitive" } },
                { customerPhone: { contains: q, mode: "insensitive" } },
                { customerEmail: { contains: q, mode: "insensitive" } },
                { deliveryAddress: { contains: q, mode: "insensitive" } },
                { postalCode: { contains: q, mode: "insensitive" } }
            ]
        });
    }
    if (filters.customerType === "guest") {
        and.push({ OR: [{ isGuest: true }, { customerId: null }] });
    }
    else if (filters.customerType === "registered") {
        and.push({ isGuest: false, customerId: { not: null } });
    }
    const paymentValues = paymentMethodFilterValues(filters.paymentMethod ?? "");
    const filterKey = (filters.paymentMethod ?? "").trim().toLowerCase();
    if (filterKey === "paypal") {
        and.push({
            OR: [
                { paypalOrderId: { not: null } },
                { paypalCaptureId: { not: null } },
                { paymentMethod: { equals: "PAYPAL", mode: "insensitive" } }
            ]
        });
    }
    else if (filterKey === "card") {
        and.push({
            paypalOrderId: null,
            paypalCaptureId: null,
            OR: [
                { paymentMethod: { equals: "CARD", mode: "insensitive" } },
                { paymentMethod: { equals: "STRIPE", mode: "insensitive" } },
                { paymentIntentId: { not: null } }
            ]
        });
    }
    else if (paymentValues?.length) {
        and.push({
            OR: paymentValues.map((value) => ({
                paymentMethod: { equals: value, mode: "insensitive" }
            }))
        });
    }
    const checkoutFilter = checkoutIssuePrismaFilter(filters.checkoutIssue);
    if (checkoutFilter) {
        and.push(checkoutFilter);
    }
    return and.length === 1 ? and[0] : { AND: and };
}
export function formatManagerOrder(o) {
    const checkoutTag = resolveOrderCheckoutTag(o);
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
        paymentMethod: resolveOrderPaymentMethod(o),
        paymentStatus: o.paymentStatus,
        checkoutTag,
        checkoutTagLabel: checkoutTag ? getOrderCheckoutTagLabel(checkoutTag) : null,
        paypalOrderId: o.paypalOrderId ?? null,
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
export async function getBranchPromotions(branchId) {
    const config = await getBranchConfig(branchId);
    const promotions = (config.promotions ?? {});
    const platform = (await import("../platform/platformSettings.service.js")).getPlatformConfig();
    return {
        freeDrinkMinOrder: Number(promotions.freeDrinkMinOrder ?? 35),
        freeDrinkMessage: String(promotions.freeDrinkMessage ?? ""),
        websiteDiscountEnabled: promotions.websiteDiscountEnabled !== false,
        freeDrinkEnabled: promotions.freeDrinkEnabled !== false,
        platform: {
            websiteOrderDiscountPct: platform.websiteOrderDiscountPct,
            freeDrinkCheckoutEnabled: platform.freeDrinkCheckoutEnabled,
            showFreeDrinkCheckout: platform.showFreeDrinkCheckout
        }
    };
}
export async function updateBranchPromotions(branchId, input) {
    const existing = await prisma.branchConfig.findUnique({ where: { branchId } });
    const current = (existing?.configJson ?? {});
    const promotions = (current.promotions ?? {});
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
                : {}),
            ...(input.freeDrinkEnabled != null
                ? { freeDrinkEnabled: input.freeDrinkEnabled }
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
    const { invalidateBranchListCache } = await import("../customer/branchMenu.service.js");
    invalidateBranchListCache();
    return getBranchPromotions(branchId);
}
export async function getBranchDashboard(branchId) {
    const { start, end } = getBerlinTodayRange();
    const [activeOrders, todayOrders, todayOrderRows] = await Promise.all([
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
        prisma.order.findMany({
            where: {
                branchId,
                createdAt: { gte: start, lt: end },
                status: { notIn: ["cancelled", "rejected"] }
            },
            select: {
                orderTotal: true,
                paymentMethod: true,
                paymentStatus: true,
                paidAt: true,
                status: true
            }
        })
    ]);
    const todayRevenue = todayOrderRows
        .filter((order) => isCountableRevenueOrder(order))
        .reduce((sum, order) => sum + Number(order.orderTotal ?? 0), 0);
    return {
        pendingOrders: activeOrders,
        todayOrders,
        todayRevenue
    };
}
