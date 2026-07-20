import { randomBytes, randomUUID } from "crypto";
import { prisma } from "../../prisma/client.ts";
import {
  calcCampaignDiscount,
  isPlatformPerkCampaignId,
  listActiveCampaignsForBranch
} from "./couponCampaign.service.ts";

function makeClaimCode() {
  return `CC-${randomBytes(4).toString("hex").toUpperCase()}`;
}

export async function listCustomerCoupons(customerId: string, branchId?: string | null) {
  const rows = await prisma.customerCoupon.findMany({
    where: {
      customerId,
      status: { not: "redeemed" },
      ...(branchId ? { campaign: { branchId } } : {})
    },
    include: { campaign: true },
    orderBy: { createdAt: "desc" }
  });

  return rows.map((row) => ({
    id: row.id,
    claimCode: row.claimCode,
    status: row.status,
    activatedAt: row.activatedAt?.toISOString() ?? null,
    campaign: {
      id: row.campaign.id,
      branchId: row.campaign.branchId,
      scope: row.campaign.branchId ? "branch" : "platform",
      title: row.campaign.title,
      description: row.campaign.description,
      discountType: row.campaign.discountType,
      discountValue: row.campaign.discountValue,
      minOrder: row.campaign.minOrder,
      validUntil: row.campaign.validUntil?.toISOString() ?? null
    }
  }));
}

export async function claimCampaignCoupon(
  customerId: string,
  campaignId: string,
  branchId?: string | null
) {
  if (!branchId) {
    throw new Error("branchId is required");
  }
  if (isPlatformPerkCampaignId(campaignId)) {
    throw new Error("This offer is always active and does not need to be saved");
  }

  const campaign = await prisma.couponCampaign.findUnique({ where: { id: campaignId } });
  if (!campaign || !campaign.isActive) {
    throw new Error("Coupon is not available");
  }
  if (!campaign.branchId) {
    throw new Error("Coupon is not available for this branch");
  }
  if (campaign.branchId !== branchId) {
    throw new Error("This coupon is for a different branch");
  }

  const now = Date.now();
  if (campaign.validFrom && campaign.validFrom.getTime() > now) {
    throw new Error("Coupon is not active yet");
  }
  if (campaign.validUntil && campaign.validUntil.getTime() < now) {
    throw new Error("Coupon has expired");
  }
  if (campaign.maxRedemptions != null && campaign.redemptionCount >= campaign.maxRedemptions) {
    throw new Error("Coupon has reached its redemption limit");
  }

  if (campaign.newCustomersOnly) {
    const priorOrders = await prisma.order.count({
      where: { customerId, branchId: campaign.branchId }
    });
    if (priorOrders > 0) {
      throw new Error("This coupon is for new customers only");
    }
  }

  const existing = await prisma.customerCoupon.findUnique({
    where: { customerId_campaignId: { customerId, campaignId } }
  });
  if (existing) {
    return {
      id: existing.id,
      claimCode: existing.claimCode,
      status: existing.status,
      alreadyClaimed: true
    };
  }

  const row = await prisma.customerCoupon.create({
    data: {
      id: randomUUID(),
      customerId,
      campaignId,
      claimCode: makeClaimCode(),
      status: "available"
    }
  });

  return {
    id: row.id,
    claimCode: row.claimCode,
    status: row.status,
    alreadyClaimed: false
  };
}

/** Combined coupon benefit cap: max(€8, 25% of cart). */
export function couponStackCap(orderTotal: number) {
  return Math.max(8, Math.round(orderTotal * 0.25 * 100) / 100);
}

function campaignSummary(row: {
  claimCode: string;
  campaign: {
    title: string;
    discountType: string;
    discountValue: number;
    minOrder: number;
  };
}) {
  return {
    claimCode: row.claimCode,
    campaign: {
      title: row.campaign.title,
      discountType: row.campaign.discountType,
      discountValue: row.campaign.discountValue,
      minOrder: row.campaign.minOrder
    }
  };
}

/** Activate without deactivating others — customers may stack several branch coupons. */
export async function activateCustomerCoupon(customerId: string, customerCouponId: string) {
  const row = await prisma.customerCoupon.findFirst({
    where: { id: customerCouponId, customerId },
    include: { campaign: true }
  });
  if (!row) throw new Error("Coupon not found");
  if (row.status === "redeemed") throw new Error("Coupon already used");
  if (row.status === "expired") throw new Error("Coupon expired");
  if (!row.campaign.branchId) {
    throw new Error("Coupon is not valid for this branch");
  }

  if (row.status === "activated") {
    return {
      id: row.id,
      status: row.status,
      ...campaignSummary(row)
    };
  }

  const updated = await prisma.customerCoupon.update({
    where: { id: customerCouponId },
    data: { status: "activated", activatedAt: new Date() }
  });

  return {
    id: updated.id,
    claimCode: row.claimCode,
    status: updated.status,
    campaign: {
      title: row.campaign.title,
      discountType: row.campaign.discountType,
      discountValue: row.campaign.discountValue,
      minOrder: row.campaign.minOrder
    }
  };
}

export async function deactivateCustomerCoupon(customerId: string, customerCouponId: string) {
  const row = await prisma.customerCoupon.findFirst({
    where: { id: customerCouponId, customerId },
    include: { campaign: true }
  });
  if (!row) throw new Error("Coupon not found");
  if (row.status === "redeemed") throw new Error("Coupon already used");
  if (row.status !== "activated") {
    return {
      id: row.id,
      claimCode: row.claimCode,
      status: row.status,
      campaign: {
        title: row.campaign.title,
        discountType: row.campaign.discountType,
        discountValue: row.campaign.discountValue,
        minOrder: row.campaign.minOrder
      }
    };
  }

  const updated = await prisma.customerCoupon.update({
    where: { id: customerCouponId },
    data: { status: "available", activatedAt: null }
  });

  return {
    id: updated.id,
    claimCode: row.claimCode,
    status: updated.status,
    campaign: {
      title: row.campaign.title,
      discountType: row.campaign.discountType,
      discountValue: row.campaign.discountValue,
      minOrder: row.campaign.minOrder
    }
  };
}

export async function getActivatedCoupon(customerId: string, branchId?: string | null) {
  return prisma.customerCoupon.findFirst({
    where: {
      customerId,
      status: "activated",
      ...(branchId ? { campaign: { branchId } } : {})
    },
    include: { campaign: true }
  });
}

export async function getActivatedCoupons(customerId: string, branchId?: string | null) {
  return prisma.customerCoupon.findMany({
    where: {
      customerId,
      status: "activated",
      ...(branchId ? { campaign: { branchId } } : {})
    },
    include: { campaign: true },
    orderBy: { activatedAt: "asc" }
  });
}

export async function validateCustomerCouponForOrder(
  customerId: string,
  customerCouponId: string,
  branchId: string,
  orderTotal: number
) {
  const stacked = await validateCustomerCouponsForOrder(
    customerId,
    [customerCouponId],
    branchId,
    orderTotal
  );
  const first = stacked.coupons[0];
  if (!first) throw new Error("Coupon not found");
  return {
    kind: "customer_coupon" as const,
    customerCouponId: first.customerCouponId,
    code: first.code,
    discountAmount: stacked.discountAmount,
    freeDelivery: stacked.freeDelivery,
    title: first.title,
    customerCouponIds: stacked.customerCouponIds,
    coupons: stacked.coupons,
    capped: stacked.capped,
    uncappedDiscountAmount: stacked.uncappedDiscountAmount
  };
}

export async function validateCustomerCouponsForOrder(
  customerId: string,
  customerCouponIds: string[],
  branchId: string,
  orderTotal: number
) {
  const ids = [...new Set(customerCouponIds.map((id) => String(id ?? "").trim()).filter(Boolean))];
  if (ids.length === 0) throw new Error("No coupons selected");
  if (ids.some((id) => isPlatformPerkCampaignId(id))) {
    throw new Error("Platform perks apply automatically and cannot be redeemed as coupons");
  }

  const rows = await prisma.customerCoupon.findMany({
    where: { id: { in: ids }, customerId },
    include: { campaign: true }
  });
  if (rows.length !== ids.length) throw new Error("Coupon not found");

  const coupons: Array<{
    customerCouponId: string;
    code: string;
    title: string;
    discountType: string;
    rawDiscountAmount: number;
    freeDelivery: boolean;
  }> = [];

  let uncappedMoney = 0;
  let freeDelivery = false;

  for (const row of rows) {
    if (row.status !== "activated" && row.status !== "available") {
      throw new Error(`Coupon cannot be used: ${row.campaign.title}`);
    }

    const campaign = row.campaign;
    if (!campaign.isActive) throw new Error(`Coupon is no longer active: ${campaign.title}`);
    if (!campaign.branchId || campaign.branchId !== branchId) {
      throw new Error(`Coupon is not valid for this branch: ${campaign.title}`);
    }
    const now = Date.now();
    if (campaign.validUntil && campaign.validUntil.getTime() < now) {
      throw new Error(`Coupon has expired: ${campaign.title}`);
    }
    if (orderTotal < campaign.minOrder) {
      throw new Error(
        `Mindestbestellwert ${campaign.minOrder.toFixed(2).replace(".", ",")} € für „${campaign.title}“`
      );
    }

    const type = campaign.discountType.toLowerCase();
    const isFreeDelivery = type === "free_delivery";
    const rawDiscountAmount = calcCampaignDiscount(
      campaign.discountType,
      campaign.discountValue,
      orderTotal
    );
    if (!isFreeDelivery && rawDiscountAmount <= 0) {
      throw new Error(`Coupon brings no discount: ${campaign.title}`);
    }

    if (isFreeDelivery) freeDelivery = true;
    else uncappedMoney += rawDiscountAmount;

    coupons.push({
      customerCouponId: row.id,
      code: row.claimCode,
      title: campaign.title,
      discountType: campaign.discountType,
      rawDiscountAmount,
      freeDelivery: isFreeDelivery
    });
  }

  const cap = couponStackCap(orderTotal);
  const discountAmount = Math.min(uncappedMoney, orderTotal, cap);
  const capped = uncappedMoney > discountAmount + 0.001;

  return {
    kind: "customer_coupon_stack" as const,
    customerCouponIds: coupons.map((c) => c.customerCouponId),
    code: coupons.map((c) => c.code).join("+"),
    title: coupons.map((c) => c.title).join(" · "),
    discountAmount: Math.round(discountAmount * 100) / 100,
    uncappedDiscountAmount: Math.round(uncappedMoney * 100) / 100,
    freeDelivery,
    capped,
    cap,
    coupons
  };
}

export async function redeemCustomerCoupon(customerCouponId: string, orderId: string) {
  const row = await prisma.customerCoupon.findUnique({
    where: { id: customerCouponId },
    include: { campaign: true }
  });
  if (!row) return;

  await prisma.$transaction([
    prisma.customerCoupon.update({
      where: { id: customerCouponId },
      data: {
        status: "redeemed",
        redeemedAt: new Date(),
        orderId
      }
    }),
    prisma.couponCampaign.update({
      where: { id: row.campaignId },
      data: { redemptionCount: { increment: 1 } }
    })
  ]);
}

export async function grantWelcomeCoupons(customerId: string, branchId?: string | null) {
  if (!branchId) return [];
  const campaigns = await listActiveCampaignsForBranch(branchId);
  const granted = [];
  for (const campaign of campaigns) {
    if (isPlatformPerkCampaignId(campaign.id)) continue;
    if (campaign.newCustomersOnly) {
      try {
        const result = await claimCampaignCoupon(customerId, campaign.id, branchId);
        granted.push(result);
      } catch {
        // skip unavailable
      }
    }
  }
  return granted;
}
