import { prisma } from "../../prisma/client.ts";
import {
  getWebsiteOrderDiscountPct
} from "../../config/websitePromo.ts";

/** Matches checkout free-drink threshold shown on offers/menu. */
export const PLATFORM_FREE_DRINK_MIN_ORDER = 35;

export type CouponCampaignDto = {
  id: string;
  branchId: string | null;
  scope: "branch" | "platform";
  title: string;
  description: string | null;
  discountType: string;
  discountValue: number;
  minOrder: number;
  validFrom: string | null;
  validUntil: string | null;
  newCustomersOnly: boolean;
  isActive: boolean;
  sortOrder: number;
  alwaysActive?: boolean;
  comingSoon?: boolean;
  claimed?: boolean;
  customerCouponId?: string | null;
  claimCode?: string | null;
  status?: string | null;
};

export function isPlatformPerkCampaignId(id: string) {
  return id.startsWith("platform:");
}

/** Always-on branch perks shown as pre-activated coupons (Lidl-style, no codes). */
export function buildAlwaysActivePlatformPerks(branchId: string): CouponCampaignDto[] {
  const pct = getWebsiteOrderDiscountPct();
  const perks: CouponCampaignDto[] = [
    {
      id: `platform:online-discount:${branchId}`,
      branchId,
      scope: "branch",
      title: `${pct} % Online-Rabatt`,
      description: "Automatisch an der Kasse — bei jeder Online-Bestellung über Website oder App.",
      discountType: "platform_online",
      discountValue: pct,
      minOrder: 0,
      validFrom: null,
      validUntil: null,
      newCustomersOnly: false,
      isActive: true,
      sortOrder: 0,
      alwaysActive: true,
      claimed: true,
      customerCouponId: null,
      claimCode: null,
      status: "activated"
    },
    {
      id: `platform:free-drink:${branchId}`,
      branchId,
      scope: "branch",
      title: "Gratisgetränk",
      description: "Ab 35 € Bestellwert wählen Sie an der Kasse ein kostenloses Getränk.",
      discountType: "platform_free_drink",
      discountValue: 0,
      minOrder: PLATFORM_FREE_DRINK_MIN_ORDER,
      validFrom: null,
      validUntil: null,
      newCustomersOnly: false,
      isActive: true,
      sortOrder: 1,
      alwaysActive: true,
      claimed: true,
      customerCouponId: null,
      claimCode: null,
      status: "activated"
    }
  ];

  return perks;
}

function campaignScope(branchId: string | null): "branch" | "platform" {
  return branchId ? "branch" : "platform";
}

function isWithinDates(validFrom: Date | null, validUntil: Date | null) {
  const now = Date.now();
  if (validFrom && validFrom.getTime() > now) return false;
  if (validUntil && validUntil.getTime() < now) return false;
  return true;
}

export function isCampaignComingSoon(validFrom: Date | null) {
  return Boolean(validFrom && validFrom.getTime() > Date.now());
}

export function calcCampaignDiscount(
  discountType: string,
  discountValue: number,
  orderTotal: number
): number {
  const type = discountType.toLowerCase();
  if (type === "percent" || type === "percentage") {
    return Math.round(orderTotal * discountValue) / 100;
  }
  if (type === "fixed" || type === "amount" || type === "euro") {
    return Math.min(orderTotal, discountValue);
  }
  if (type === "free_delivery") {
    return 0;
  }
  if (type === "combo") {
    // discountValue = bundle price (e.g. €10 menu); savings bring cart down toward that price.
    const savings = Math.max(0, orderTotal - discountValue);
    return Math.min(savings, orderTotal);
  }
  return 0;
}

function mapCampaign(row: {
  id: string;
  branchId: string | null;
  title: string;
  description: string | null;
  discountType: string;
  discountValue: number;
  minOrder: number;
  validFrom: Date | null;
  validUntil: Date | null;
  newCustomersOnly: boolean;
  isActive: boolean;
  sortOrder: number;
}): CouponCampaignDto {
  return {
    id: row.id,
    branchId: row.branchId,
    scope: campaignScope(row.branchId),
    title: row.title,
    description: row.description,
    discountType: row.discountType,
    discountValue: row.discountValue,
    minOrder: row.minOrder,
    validFrom: row.validFrom?.toISOString() ?? null,
    validUntil: row.validUntil?.toISOString() ?? null,
    newCustomersOnly: row.newCustomersOnly,
    isActive: row.isActive,
    sortOrder: row.sortOrder
  };
}

export async function listActiveCampaignsForBranch(
  branchId: string,
  customerId?: string | null
): Promise<CouponCampaignDto[]> {
  const platformPerks = buildAlwaysActivePlatformPerks(branchId);

  const rows = await prisma.couponCampaign.findMany({
    where: {
      isActive: true,
      branchId
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }]
  });

  const visible = rows.filter(
    (row) =>
      isWithinDates(row.validFrom, row.validUntil) &&
      (row.maxRedemptions == null || row.redemptionCount < row.maxRedemptions)
  );

  const now = Date.now();
  const upcoming = rows.filter(
    (row) =>
      row.validFrom &&
      row.validFrom.getTime() > now &&
      (!row.validUntil || row.validUntil.getTime() >= now) &&
      (row.maxRedemptions == null || row.redemptionCount < row.maxRedemptions)
  );

  let claimedByCampaign = new Map<
    string,
    { id: string; status: string; claimCode: string }
  >();
  if (customerId) {
    const claimed = await prisma.customerCoupon.findMany({
      where: { customerId, campaignId: { in: visible.map((c) => c.id) } },
      select: { id: true, campaignId: true, status: true, claimCode: true }
    });
    claimedByCampaign = new Map(
      claimed.map((c) => [c.campaignId, { id: c.id, status: c.status, claimCode: c.claimCode }])
    );
  }

  const branchCampaigns = visible.map((row) => {
    const claim = claimedByCampaign.get(row.id);
    return {
      ...mapCampaign(row),
      claimed: Boolean(claim),
      customerCouponId: claim?.id ?? null,
      claimCode: claim?.claimCode ?? null,
      status: claim?.status ?? null
    };
  });

  const comingSoonCampaigns = upcoming.map((row) => ({
    ...mapCampaign(row),
    comingSoon: true,
    claimed: false,
    customerCouponId: null,
    claimCode: null,
    status: null
  }));

  return [...platformPerks, ...branchCampaigns, ...comingSoonCampaigns];
}

export async function listManagerCampaigns(branchId: string) {
  const rows = await prisma.couponCampaign.findMany({
    where: { branchId },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }]
  });
  return rows.map(mapCampaign);
}

export async function createCampaign(
  branchId: string,
  input: {
    title: string;
    description?: string;
    discountType: string;
    discountValue: number;
    minOrder?: number;
    validFrom?: string | null;
    validUntil?: string | null;
    maxRedemptions?: number | null;
    newCustomersOnly?: boolean;
    sortOrder?: number;
  }
) {
  const row = await prisma.couponCampaign.create({
    data: {
      branchId,
      title: input.title.trim(),
      description: input.description?.trim() || null,
      discountType: input.discountType,
      discountValue: input.discountValue,
      minOrder: input.minOrder ?? 0,
      validFrom: input.validFrom ? new Date(input.validFrom) : null,
      validUntil: input.validUntil ? new Date(input.validUntil) : null,
      maxRedemptions: input.maxRedemptions ?? null,
      newCustomersOnly: input.newCustomersOnly ?? false,
      sortOrder: input.sortOrder ?? 0,
      isActive: true
    }
  });
  return mapCampaign(row);
}

export async function updateCampaign(
  campaignId: string,
  branchId: string,
  input: Partial<{
    title: string;
    description: string;
    discountType: string;
    discountValue: number;
    minOrder: number;
    validFrom: string | null;
    validUntil: string | null;
    maxRedemptions: number | null;
    newCustomersOnly: boolean;
    sortOrder: number;
    isActive: boolean;
  }>
) {
  const existing = await prisma.couponCampaign.findUnique({ where: { id: campaignId } });
  if (!existing) throw new Error("Coupon not found");
  if (existing.branchId !== branchId) {
    throw new Error("Coupon belongs to another branch");
  }

  const row = await prisma.couponCampaign.update({
    where: { id: campaignId },
    data: {
      ...(input.title != null ? { title: input.title.trim() } : {}),
      ...(input.description != null ? { description: input.description.trim() || null } : {}),
      ...(input.discountType != null ? { discountType: input.discountType } : {}),
      ...(input.discountValue != null ? { discountValue: input.discountValue } : {}),
      ...(input.minOrder != null ? { minOrder: input.minOrder } : {}),
      ...(input.validFrom !== undefined
        ? { validFrom: input.validFrom ? new Date(input.validFrom) : null }
        : {}),
      ...(input.validUntil !== undefined
        ? { validUntil: input.validUntil ? new Date(input.validUntil) : null }
        : {}),
      ...(input.maxRedemptions !== undefined ? { maxRedemptions: input.maxRedemptions } : {}),
      ...(input.newCustomersOnly != null ? { newCustomersOnly: input.newCustomersOnly } : {}),
      ...(input.sortOrder != null ? { sortOrder: input.sortOrder } : {}),
      ...(input.isActive != null ? { isActive: input.isActive } : {})
    }
  });
  return mapCampaign(row);
}
