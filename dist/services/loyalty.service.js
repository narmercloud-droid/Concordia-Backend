import { randomUUID } from "crypto";
import { prisma } from "../prisma/client.js";
function orderSubtotal(items) {
    return (items || []).reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
}
export async function awardLoyaltyForCompletedOrder(orderId) {
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            items: true,
            trackingEvents: { select: { status: true } }
        }
    });
    if (!order?.customerId)
        return 0;
    const alreadyAwarded = order.trackingEvents.some((e) => e.status === "loyalty:awarded");
    if (alreadyAwarded)
        return 0;
    const isPickupComplete = order.fulfillmentType === "pickup" && order.status === "picked_up";
    const isDeliveryComplete = order.status === "delivered";
    if (!isPickupComplete && !isDeliveryComplete)
        return 0;
    const points = Math.floor(orderSubtotal(order.items) / 10);
    if (points <= 0)
        return 0;
    await prisma.$transaction(async (tx) => {
        await tx.customer.update({
            where: { id: order.customerId },
            data: {
                loyaltyPoints: { increment: points },
                lifetimePoints: { increment: points }
            }
        });
        await tx.orderTrackingEvent.create({
            data: {
                id: randomUUID(),
                status: "loyalty:awarded",
                timestamp: new Date(),
                order: { connect: { id: orderId } }
            }
        });
    });
    return points;
}
export const loyaltyService = {
    applyPoints: async (..._args) => null,
    redeemReward: async (..._args) => null,
    applyPromoCode: async (..._args) => null,
    applyReferral: async (..._args) => null
};
