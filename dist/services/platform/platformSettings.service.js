import { randomUUID } from "crypto";
import { prisma } from "../../prisma/client.js";
import { invalidateBranchListCache } from "../customer/branchMenu.service.js";
import { invalidateGoogleReviewsCache } from "../customer/googleReviews.service.js";
import { getBranchPaymentPublic } from "../stripe/branchStripe.service.js";
import { isStripeConfigured } from "../stripe/stripeClient.js";
export const DEFAULT_PLATFORM_CONFIG = {
    websiteOrderDiscountPct: 10,
    freeDrinkCheckoutEnabled: false,
    showFreeDrinkCheckout: false,
    showLoyaltyCheckout: false,
    winbackPromoCode: process.env.WINBACK_PROMO_CODE || "WELCOME10",
    birthdayPromoCode: process.env.BIRTHDAY_PROMO_CODE || "BIRTHDAY"
};
let cachedPlatformConfig = null;
function mergePlatformConfig(raw) {
    const pct = Number(raw?.websiteOrderDiscountPct ?? DEFAULT_PLATFORM_CONFIG.websiteOrderDiscountPct);
    return {
        websiteOrderDiscountPct: Number.isFinite(pct) ? Math.min(100, Math.max(0, pct)) : 10,
        freeDrinkCheckoutEnabled: raw?.freeDrinkCheckoutEnabled === true,
        showFreeDrinkCheckout: raw?.showFreeDrinkCheckout === true,
        showLoyaltyCheckout: raw?.showLoyaltyCheckout === true,
        winbackPromoCode: String(raw?.winbackPromoCode ?? DEFAULT_PLATFORM_CONFIG.winbackPromoCode).trim(),
        birthdayPromoCode: String(raw?.birthdayPromoCode ?? DEFAULT_PLATFORM_CONFIG.birthdayPromoCode).trim()
    };
}
export function getPlatformConfig() {
    return cachedPlatformConfig ?? mergePlatformConfig(null);
}
export async function refreshPlatformConfigCache() {
    const row = await prisma.platformConfig.findUnique({ where: { id: "default" } });
    if (!row) {
        const defaults = mergePlatformConfig(null);
        await prisma.platformConfig.create({
            data: { id: "default", configJson: defaults }
        });
        cachedPlatformConfig = defaults;
        return cachedPlatformConfig;
    }
    cachedPlatformConfig = mergePlatformConfig((row.configJson ?? {}));
    return cachedPlatformConfig;
}
export async function getPlatformConfigRecord() {
    await refreshPlatformConfigCache();
    return getPlatformConfig();
}
export async function updatePlatformConfig(input) {
    const current = await getPlatformConfigRecord();
    const next = mergePlatformConfig({ ...current, ...input });
    await prisma.platformConfig.upsert({
        where: { id: "default" },
        update: { configJson: next },
        create: { id: "default", configJson: next }
    });
    cachedPlatformConfig = next;
    invalidateBranchListCache();
    return next;
}
export async function getGlobalNotificationSettings() {
    const row = await prisma.globalSettings.findFirst();
    if (row)
        return row;
    return prisma.globalSettings.create({
        data: {
            id: randomUUID(),
            enableSms: false,
            enablePush: false,
            enableEmail: false,
            smsProvider: "none",
            pushProvider: "none",
            emailProvider: "none",
            notifyOrderPlaced: true,
            notifyOrderAccepted: true,
            notifyOutForDelivery: true,
            notifyDelivered: true
        }
    });
}
export async function updateGlobalNotificationSettings(input) {
    const current = await getGlobalNotificationSettings();
    const allowed = [
        "enableSms",
        "enablePush",
        "enableEmail",
        "smsProvider",
        "pushProvider",
        "emailProvider",
        "notifyOrderPlaced",
        "notifyOrderAccepted",
        "notifyOutForDelivery",
        "notifyDelivered"
    ];
    const data = {};
    for (const key of allowed) {
        if (input[key] !== undefined)
            data[key] = input[key];
    }
    return prisma.globalSettings.update({
        where: { id: current.id },
        data
    });
}
export async function getLoyaltySettingsRecord() {
    const row = await prisma.loyaltySettings.findFirst();
    if (row)
        return row;
    return prisma.loyaltySettings.create({
        data: {
            id: randomUUID(),
            pointsPerCurrency: 1,
            silverThreshold: 1000,
            goldThreshold: 2500,
            platinumThreshold: 5000,
            allowPromoStacking: true,
            pointsExpireMonths: null
        }
    });
}
export async function updateLoyaltySettings(input) {
    const current = await getLoyaltySettingsRecord();
    const data = {};
    const allowed = [
        "pointsPerCurrency",
        "silverThreshold",
        "goldThreshold",
        "platinumThreshold",
        "allowPromoStacking",
        "pointsExpireMonths"
    ];
    for (const key of allowed) {
        if (input[key] !== undefined)
            data[key] = input[key];
    }
    return prisma.loyaltySettings.update({
        where: { id: current.id },
        data
    });
}
export async function getBranchSettingsDetail(branchId) {
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
    const promotions = (config.promotions ?? {});
    let printing = await prisma.branchSettings.findUnique({ where: { branchId } });
    if (!printing) {
        printing = await prisma.branchSettings.create({
            data: {
                branchId,
                printingMode: "direct",
                autoPrint: true,
                printCopies: 1,
                routingMode: "kitchen"
            }
        });
    }
    const payment = await getBranchPaymentPublic(branchId);
    return {
        id: branch.id,
        name: branch.name,
        printerType: branch.printerType,
        printerUrl: branch.printerUrl,
        avgPrepTimeBaseline: branch.avgPrepTimeBaseline,
        status: config.status ?? "live",
        ordersPaused: config.ordersPaused === true,
        city: config.city ?? "",
        address: config.address ?? "",
        postalCode: config.postalCode ?? "",
        lat: config.lat != null ? Number(config.lat) : null,
        lng: config.lng != null ? Number(config.lng) : null,
        slug: config.slug ?? "",
        terminalCode: config.terminalCode ?? "",
        supportsPickup: config.supportsPickup !== false,
        supportsDelivery: config.supportsDelivery !== false,
        websiteUrl: config.websiteUrl ?? "",
        lieferandoUrl: config.lieferandoUrl ?? "",
        googlePlaceId: config.googlePlaceId ?? "",
        lieferandoRestaurantId: config.lieferandoRestaurantId ?? "",
        deliveryMode: config.deliveryMode ?? "postcodes",
        freeDeliveryAtMinimum: config.freeDeliveryAtMinimum !== false,
        deliveryAreas: config.deliveryAreas ?? [],
        deliveryRadiusZones: config.deliveryRadiusZones ?? [],
        promotions: {
            freeDrinkMinOrder: Number(promotions.freeDrinkMinOrder ?? 35),
            freeDrinkMessage: String(promotions.freeDrinkMessage ?? ""),
            websiteDiscountEnabled: promotions.websiteDiscountEnabled !== false,
            freeDrinkEnabled: promotions.freeDrinkEnabled !== false
        },
        printing: {
            printingMode: printing.printingMode,
            autoPrint: printing.autoPrint,
            printCopies: printing.printCopies,
            routingMode: printing.routingMode
        },
        payment: {
            stripeConfigured: isStripeConfigured(),
            stripeAccountId: payment.stripeAccountId,
            stripeReady: payment.stripeReady,
            cardEnabled: payment.cardEnabled,
            applePayEnabled: payment.applePayEnabled,
            googlePayEnabled: payment.googlePayEnabled
        },
        hours: branch.branchHours
    };
}
export async function updateBranchSettingsDetail(branchId, input) {
    const branch = await prisma.branch.findUnique({
        where: { id: branchId },
        include: { BranchConfig: true }
    });
    if (!branch)
        throw new Error("Branch not found");
    const branchData = {};
    if (input.name != null)
        branchData.name = input.name;
    if (input.printerType != null)
        branchData.printerType = input.printerType;
    if (input.printerUrl !== undefined)
        branchData.printerUrl = input.printerUrl;
    if (input.avgPrepTimeBaseline != null)
        branchData.avgPrepTimeBaseline = input.avgPrepTimeBaseline;
    if (Object.keys(branchData).length) {
        await prisma.branch.update({ where: { id: branchId }, data: branchData });
    }
    const existing = (branch.BranchConfig?.configJson ?? {});
    const promotions = (existing.promotions ?? {});
    const configJson = {
        ...existing,
        ...(input.status != null ? { status: input.status } : {}),
        ...(input.ordersPaused != null ? { ordersPaused: input.ordersPaused } : {}),
        ...(input.city != null ? { city: input.city } : {}),
        ...(input.address != null ? { address: input.address } : {}),
        ...(input.postalCode != null ? { postalCode: input.postalCode } : {}),
        ...(input.lat != null ? { lat: input.lat } : {}),
        ...(input.lng != null ? { lng: input.lng } : {}),
        ...(input.slug != null ? { slug: input.slug } : {}),
        ...(input.terminalCode != null ? { terminalCode: input.terminalCode } : {}),
        ...(input.supportsPickup != null ? { supportsPickup: input.supportsPickup } : {}),
        ...(input.supportsDelivery != null ? { supportsDelivery: input.supportsDelivery } : {}),
        ...(input.websiteUrl != null ? { websiteUrl: input.websiteUrl } : {}),
        ...(input.lieferandoUrl != null ? { lieferandoUrl: input.lieferandoUrl } : {}),
        ...(input.googlePlaceId != null ? { googlePlaceId: input.googlePlaceId } : {}),
        ...(input.lieferandoRestaurantId != null
            ? { lieferandoRestaurantId: input.lieferandoRestaurantId }
            : {})
    };
    if (input.promotions) {
        configJson.promotions = {
            ...promotions,
            ...(input.promotions.freeDrinkMinOrder != null
                ? { freeDrinkMinOrder: input.promotions.freeDrinkMinOrder }
                : {}),
            ...(input.promotions.freeDrinkMessage != null
                ? { freeDrinkMessage: input.promotions.freeDrinkMessage }
                : {}),
            ...(input.promotions.websiteDiscountEnabled != null
                ? { websiteDiscountEnabled: input.promotions.websiteDiscountEnabled }
                : {}),
            ...(input.promotions.freeDrinkEnabled != null
                ? { freeDrinkEnabled: input.promotions.freeDrinkEnabled }
                : {})
        };
    }
    await prisma.branchConfig.upsert({
        where: { branchId },
        update: { configJson, version: { increment: 1 } },
        create: { id: `config-${branchId}`, branchId, configJson }
    });
    if (input.printing) {
        await prisma.branchSettings.upsert({
            where: { branchId },
            update: {
                ...(input.printing.printingMode != null
                    ? { printingMode: input.printing.printingMode }
                    : {}),
                ...(input.printing.autoPrint != null ? { autoPrint: input.printing.autoPrint } : {}),
                ...(input.printing.printCopies != null
                    ? { printCopies: input.printing.printCopies }
                    : {}),
                ...(input.printing.routingMode != null
                    ? { routingMode: input.printing.routingMode }
                    : {})
            },
            create: {
                branchId,
                printingMode: input.printing.printingMode ?? "direct",
                autoPrint: input.printing.autoPrint ?? true,
                printCopies: input.printing.printCopies ?? 1,
                routingMode: input.printing.routingMode ?? "kitchen"
            }
        });
    }
    invalidateBranchListCache();
    invalidateGoogleReviewsCache(branchId);
    return getBranchSettingsDetail(branchId);
}
export async function getAggregatedPlatformSettings() {
    const [platform, notifications, loyalty, permissions] = await Promise.all([
        getPlatformConfigRecord(),
        getGlobalNotificationSettings(),
        getLoyaltySettingsRecord(),
        prisma.managerPermissionPolicy.findUnique({ where: { id: "default" } })
    ]);
    return {
        platform,
        notifications,
        loyalty,
        permissions: (permissions?.permissions ?? {})
    };
}
