import { randomBytes, randomUUID } from "crypto";
import { prisma } from "../../prisma/client.js";
import { calcCampaignDiscount, listActiveCampaignsForBranch } from "./couponCampaign.service.js";
function makeClaimCode() {
    return `CC-${randomBytes(4).toString("hex").toUpperCase()}`;
}
export async function listCustomerCoupons(customerId, branchId) {
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
export async function claimCampaignCoupon(customerId, campaignId, branchId) {
    if (!branchId) {
        throw new Error("branchId is required");
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
export async function activateCustomerCoupon(customerId, customerCouponId) {
    const row = await prisma.customerCoupon.findFirst({
        where: { id: customerCouponId, customerId },
        include: { campaign: true }
    });
    if (!row)
        throw new Error("Coupon not found");
    if (row.status === "redeemed")
        throw new Error("Coupon already used");
    if (row.status === "expired")
        throw new Error("Coupon expired");
    if (!row.campaign.branchId) {
        throw new Error("Coupon is not valid for this branch");
    }
    const campaignBranchId = row.campaign.branchId;
    await prisma.customerCoupon.updateMany({
        where: {
            customerId,
            status: "activated",
            id: { not: customerCouponId },
            campaign: { branchId: campaignBranchId }
        },
        data: { status: "available", activatedAt: null }
    });
    const updated = await prisma.customerCoupon.update({
        where: { id: customerCouponId },
        data: { status: "activated", activatedAt: new Date() }
    });
    return {
        id: updated.id,
        claimCode: updated.claimCode,
        status: updated.status,
        campaign: {
            title: row.campaign.title,
            discountType: row.campaign.discountType,
            discountValue: row.campaign.discountValue,
            minOrder: row.campaign.minOrder
        }
    };
}
export async function getActivatedCoupon(customerId, branchId) {
    return prisma.customerCoupon.findFirst({
        where: {
            customerId,
            status: "activated",
            ...(branchId ? { campaign: { branchId } } : {})
        },
        include: { campaign: true }
    });
}
export async function validateCustomerCouponForOrder(customerId, customerCouponId, branchId, orderTotal) {
    const row = await prisma.customerCoupon.findFirst({
        where: { id: customerCouponId, customerId },
        include: { campaign: true }
    });
    if (!row)
        throw new Error("Coupon not found");
    if (row.status !== "activated" && row.status !== "available") {
        throw new Error("Coupon cannot be used");
    }
    const campaign = row.campaign;
    if (!campaign.isActive)
        throw new Error("Coupon is no longer active");
    if (!campaign.branchId || campaign.branchId !== branchId) {
        throw new Error("Coupon is not valid for this branch");
    }
    const now = Date.now();
    if (campaign.validUntil && campaign.validUntil.getTime() < now) {
        throw new Error("Coupon has expired");
    }
    if (orderTotal < campaign.minOrder) {
        throw new Error(`Mindestbestellwert ${campaign.minOrder.toFixed(2).replace(".", ",")} € für diesen Gutschein`);
    }
    const discountAmount = calcCampaignDiscount(campaign.discountType, campaign.discountValue, orderTotal);
    if (campaign.discountType.toLowerCase() !== "free_delivery" && discountAmount <= 0) {
        throw new Error("Coupon brings no discount");
    }
    return {
        kind: "customer_coupon",
        customerCouponId: row.id,
        code: row.claimCode,
        discountAmount,
        freeDelivery: campaign.discountType.toLowerCase() === "free_delivery",
        title: campaign.title
    };
}
export async function redeemCustomerCoupon(customerCouponId, orderId) {
    const row = await prisma.customerCoupon.findUnique({
        where: { id: customerCouponId },
        include: { campaign: true }
    });
    if (!row)
        return;
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
export async function grantWelcomeCoupons(customerId, branchId) {
    if (!branchId)
        return [];
    const campaigns = await listActiveCampaignsForBranch(branchId);
    const granted = [];
    for (const campaign of campaigns) {
        if (campaign.newCustomersOnly) {
            try {
                const result = await claimCampaignCoupon(customerId, campaign.id, branchId);
                granted.push(result);
            }
            catch {
                // skip unavailable
            }
        }
    }
    return granted;
}
