import { randomUUID } from "crypto";
import { prisma } from "../../prisma/client.ts";
import { invalidateBranchListCache } from "../customer/branchMenu.service.ts";
import { invalidateGoogleReviewsCache } from "../customer/googleReviews.service.ts";
import { getBranchPaymentPublic } from "../stripe/branchStripe.service.ts";
import { isStripeConfigured } from "../stripe/stripeClient.ts";

export const DEFAULT_PLATFORM_CONFIG = {
  websiteOrderDiscountPct: 10,
  freeDrinkCheckoutEnabled: false,
  showFreeDrinkCheckout: false,
  showLoyaltyCheckout: false,
  winbackPromoCode: process.env.WINBACK_PROMO_CODE || "WELCOME10",
  birthdayPromoCode: process.env.BIRTHDAY_PROMO_CODE || "BIRTHDAY"
} as const;

export type PlatformConfigData = {
  websiteOrderDiscountPct: number;
  freeDrinkCheckoutEnabled: boolean;
  showFreeDrinkCheckout: boolean;
  showLoyaltyCheckout: boolean;
  winbackPromoCode: string;
  birthdayPromoCode: string;
};

let cachedPlatformConfig: PlatformConfigData | null = null;

function mergePlatformConfig(raw: Record<string, unknown> | null | undefined): PlatformConfigData {
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

export function getPlatformConfig(): PlatformConfigData {
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
  cachedPlatformConfig = mergePlatformConfig((row.configJson ?? {}) as Record<string, unknown>);
  return cachedPlatformConfig;
}

export async function getPlatformConfigRecord() {
  await refreshPlatformConfigCache();
  return getPlatformConfig();
}

export async function updatePlatformConfig(
  input: Partial<PlatformConfigData>
) {
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
  if (row) return row;

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

export async function updateGlobalNotificationSettings(input: Record<string, unknown>) {
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
  ] as const;

  const data: Record<string, unknown> = {};
  for (const key of allowed) {
    if (input[key] !== undefined) data[key] = input[key];
  }

  return prisma.globalSettings.update({
    where: { id: current.id },
    data
  });
}

export async function getLoyaltySettingsRecord() {
  const row = await prisma.loyaltySettings.findFirst();
  if (row) return row;

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

export async function updateLoyaltySettings(input: Record<string, unknown>) {
  const current = await getLoyaltySettingsRecord();
  const data: Record<string, unknown> = {};
  const allowed = [
    "pointsPerCurrency",
    "silverThreshold",
    "goldThreshold",
    "platinumThreshold",
    "allowPromoStacking",
    "pointsExpireMonths"
  ] as const;

  for (const key of allowed) {
    if (input[key] !== undefined) data[key] = input[key];
  }

  return prisma.loyaltySettings.update({
    where: { id: current.id },
    data
  });
}

export type BranchSettingsPayload = {
  name?: string;
  printerType?: string;
  printerUrl?: string | null;
  avgPrepTimeBaseline?: number;
  status?: "live" | "coming_soon";
  ordersPaused?: boolean;
  city?: string;
  address?: string;
  postalCode?: string;
  lat?: number;
  lng?: number;
  slug?: string;
  terminalCode?: string;
  supportsPickup?: boolean;
  supportsDelivery?: boolean;
  websiteUrl?: string;
  lieferandoUrl?: string;
  googlePlaceId?: string;
  lieferandoRestaurantId?: string;
  promotions?: {
    freeDrinkMinOrder?: number;
    freeDrinkMessage?: string;
    websiteDiscountEnabled?: boolean;
    freeDrinkEnabled?: boolean;
  };
  printing?: {
    printingMode?: string;
    autoPrint?: boolean;
    printCopies?: number;
    routingMode?: string;
  };
};

export async function getBranchSettingsDetail(branchId: string) {
  const branch = await prisma.branch.findUnique({
    where: { id: branchId },
    include: {
      BranchConfig: true,
      branchHours: { orderBy: { dayOfWeek: "asc" } }
    }
  });

  if (!branch) throw new Error("Branch not found");

  const config = (branch.BranchConfig?.configJson ?? {}) as Record<string, unknown>;
  const promotions = (config.promotions ?? {}) as Record<string, unknown>;

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

  let payment: Awaited<ReturnType<typeof getBranchPaymentPublic>> | null = null;
  try {
    payment = await getBranchPaymentPublic(branchId);
  } catch {
    // Stripe/network issues must not block loading branch profile settings.
  }

  return {
    id: branch.id,
    name: branch.name,
    printerType: branch.printerType,
    printerUrl: branch.printerUrl,
    avgPrepTimeBaseline: branch.avgPrepTimeBaseline,
    status: (config.status as string) ?? "live",
    ordersPaused: config.ordersPaused === true,
    city: (config.city as string) ?? "",
    address: (config.address as string) ?? "",
    postalCode: (config.postalCode as string) ?? "",
    lat: config.lat != null ? Number(config.lat) : null,
    lng: config.lng != null ? Number(config.lng) : null,
    slug: (config.slug as string) ?? "",
    terminalCode: (config.terminalCode as string) ?? "",
    supportsPickup: config.supportsPickup !== false,
    supportsDelivery: config.supportsDelivery !== false,
    websiteUrl: (config.websiteUrl as string) ?? "",
    lieferandoUrl: (config.lieferandoUrl as string) ?? "",
    googlePlaceId: (config.googlePlaceId as string) ?? "",
    lieferandoRestaurantId: (config.lieferandoRestaurantId as string) ?? "",
    deliveryMode: (config.deliveryMode as string) ?? "postcodes",
    freeDeliveryAtMinimum: config.freeDeliveryAtMinimum !== false,
    deliveryAreas: (config.deliveryAreas as unknown[]) ?? [],
    deliveryRadiusZones: (config.deliveryRadiusZones as unknown[]) ?? [],
    promotions: {
      freeDrinkMinOrder: Number(promotions.freeDrinkMinOrder ?? 0),
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
      stripeAccountId: payment?.stripeAccountId ?? null,
      stripeReady: payment?.stripeReady ?? false,
      cardEnabled: payment?.cardEnabled ?? false,
      applePayEnabled: payment?.applePayEnabled ?? false,
      googlePayEnabled: payment?.googlePayEnabled ?? false
    },
    hours: branch.branchHours
  };
}

export async function updateBranchSettingsDetail(
  branchId: string,
  input: BranchSettingsPayload
) {
  const branch = await prisma.branch.findUnique({
    where: { id: branchId },
    include: { BranchConfig: true }
  });

  if (!branch) throw new Error("Branch not found");

  const branchData: Record<string, unknown> = {};
  if (input.name != null) branchData.name = input.name;
  if (input.printerType != null) branchData.printerType = input.printerType;
  if (input.printerUrl !== undefined) branchData.printerUrl = input.printerUrl;
  if (input.avgPrepTimeBaseline != null) branchData.avgPrepTimeBaseline = input.avgPrepTimeBaseline;

  if (Object.keys(branchData).length) {
    await prisma.branch.update({ where: { id: branchId }, data: branchData });
  }

  const existing = (branch.BranchConfig?.configJson ?? {}) as Record<string, unknown>;
  const promotions = (existing.promotions ?? {}) as Record<string, unknown>;

  const configJson: Record<string, unknown> = {
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
    permissions: (permissions?.permissions ?? {}) as Record<string, boolean>
  };
}
