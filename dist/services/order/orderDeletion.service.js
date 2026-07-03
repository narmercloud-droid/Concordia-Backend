import { prisma } from "../../prisma/client.js";
import { recalculateBranchCustomerStats } from "../customer/branchCustomer.service.js";
function orderSubtotal(items) {
    return items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
}
async function reverseRedemptions(tx, order) {
    const coupons = await tx.customerCoupon.findMany({
        where: { orderId: order.id },
        select: { id: true, campaignId: true }
    });
    for (const coupon of coupons) {
        await tx.customerCoupon.update({
            where: { id: coupon.id },
            data: {
                status: "activated",
                redeemedAt: null,
                orderId: null
            }
        });
        const campaign = await tx.couponCampaign.findUnique({
            where: { id: coupon.campaignId },
            select: { redemptionCount: true }
        });
        if (campaign && campaign.redemptionCount > 0) {
            await tx.couponCampaign.update({
                where: { id: coupon.campaignId },
                data: { redemptionCount: { decrement: 1 } }
            });
        }
    }
    if (order.promoCodeId) {
        const promo = await tx.promoCode.findUnique({
            where: { id: order.promoCodeId },
            select: { usedCount: true }
        });
        if (promo && promo.usedCount > 0) {
            await tx.promoCode.update({
                where: { id: order.promoCodeId },
                data: { usedCount: { decrement: 1 } }
            });
        }
    }
    if (order.giftCardId && order.giftCardAmount) {
        const amount = Number(order.giftCardAmount);
        if (amount > 0) {
            const card = await tx.branchGiftCard.findUnique({
                where: { id: order.giftCardId }
            });
            if (card) {
                const nextBalance = Math.round((Number(card.balance) + amount) * 100) / 100;
                await tx.branchGiftCard.update({
                    where: { id: order.giftCardId },
                    data: {
                        balance: nextBalance,
                        isActive: true
                    }
                });
            }
        }
    }
}
async function reverseLoyalty(tx, order) {
    if (!order.customerId)
        return;
    const loyaltyEvent = await tx.orderTrackingEvent.findFirst({
        where: { orderId: order.id, status: "loyalty:awarded" }
    });
    if (!loyaltyEvent)
        return;
    const items = await tx.orderItem.findMany({
        where: { orderId: order.id },
        select: { price: true, quantity: true }
    });
    const points = Math.floor(orderSubtotal(items) / 10);
    if (points <= 0)
        return;
    const customer = await tx.customer.findUnique({
        where: { id: order.customerId },
        select: { loyaltyPoints: true, lifetimePoints: true }
    });
    if (!customer)
        return;
    await tx.customer.update({
        where: { id: order.customerId },
        data: {
            loyaltyPoints: Math.max(0, customer.loyaltyPoints - points),
            lifetimePoints: Math.max(0, customer.lifetimePoints - points)
        }
    });
}
async function deleteOrderRows(tx, orderId) {
    const orderItemIds = (await tx.orderItem.findMany({
        where: { orderId },
        select: { id: true }
    })).map((row) => row.id);
    if (orderItemIds.length) {
        await tx.itemRating.deleteMany({ where: { orderItemId: { in: orderItemIds } } });
        await tx.orderItemExtra.deleteMany({ where: { orderItemId: { in: orderItemIds } } });
        await tx.orderItemVariant.deleteMany({ where: { orderItemId: { in: orderItemIds } } });
        await tx.orderItem.deleteMany({ where: { orderId } });
    }
    await tx.cartItem.deleteMany({ where: { orderId } });
    await tx.courierLocation.deleteMany({ where: { orderId } });
    await tx.driverRating.deleteMany({ where: { orderId } });
    await tx.orderIssue.deleteMany({ where: { orderId } });
    await tx.orderRiskEvent.deleteMany({ where: { orderId } });
    await tx.orderTrackingEvent.deleteMany({ where: { orderId } });
    await tx.terminalEvent.deleteMany({ where: { orderId } });
    await tx.review.deleteMany({ where: { orderId } });
    await tx.riskScore.deleteMany({ where: { orderId } });
    await tx.driverAccessToken.deleteMany({ where: { orderId } });
    await tx.order.delete({ where: { id: orderId } });
}
export async function deleteOrderCompletely(orderId, options) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
        return { deleted: false, orderId };
    }
    if (options?.branchId && order.branchId !== options.branchId) {
        throw new Error("Order does not belong to this branch");
    }
    const phone = order.customerPhone?.trim() || null;
    const branchId = order.branchId;
    await prisma.$transaction(async (tx) => {
        await reverseRedemptions(tx, order);
        await reverseLoyalty(tx, order);
        await tx.driver.updateMany({
            where: { currentOrderId: orderId },
            data: { currentOrderId: null }
        });
        await deleteOrderRows(tx, orderId);
    });
    if (phone) {
        await recalculateBranchCustomerStats(branchId, phone);
    }
    return { deleted: true, orderId, branchId, customerPhone: phone };
}
