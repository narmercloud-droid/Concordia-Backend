import { prisma } from "../../prisma/client.ts";

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
  claimed?: boolean;
  customerCouponId?: string | null;
  claimCode?: string | null;
  status?: string | null;
};

function campaignScope(branchId: string | null): "branch" | "platform" {
  return branchId ? "branch" : "platform";
}

function isWithinDates(validFrom: Date | null, validUntil: Date | null) {
  const now = Date.now();
  if (validFrom && validFrom.getTime() > now) return false;
  if (validUntil && validUntil.getTime() < now) return false;
  return true;
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

  return visible.map((row) => {
    const claim = claimedByCampaign.get(row.id);
    return {
      ...mapCampaign(row),
      claimed: Boolean(claim),
      customerCouponId: claim?.id ?? null,
      claimCode: claim?.claimCode ?? null,
      status: claim?.status ?? null
    };
  });
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
