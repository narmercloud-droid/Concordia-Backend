import { prisma } from "../../prisma/client.js";
import { wrap, fail } from "../../contracts/api.js";
export const getCourierLocation = wrap(async (req) => {
    try {
        const { orderId } = req.params;
        const loc = await prisma.courierLocation.findFirst({
            where: { orderId },
            orderBy: { createdAt: "desc" }
        });
        return loc || {};
    }
    catch (err) {
        console.error(err);
        throw fail('INTERNAL_ERROR', 'Server error');
    }
});
export const getOrderTimeline = wrap(async (req) => {
    try {
        const { orderId } = req.params;
        const events = await prisma.orderTrackingEvent.findMany({
            where: { orderId },
            orderBy: { timestamp: "asc" }
        });
        return events;
    }
    catch (err) {
        console.error(err);
        throw fail('INTERNAL_ERROR', 'Server error');
    }
});
