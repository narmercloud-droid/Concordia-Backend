import { prisma } from "../../prisma/client.js";
import { success, fail } from "../controllerHelper.js";
export const getCourierLocation = async (req, res) => {
    try {
        const { orderId } = req.params;
        const loc = await prisma.courierLocation.findFirst({
            where: { orderId },
            orderBy: { createdAt: "desc" }
        });
        return success(res, loc || {});
    }
    catch (err) {
        console.error(err);
        return fail(res, "Server error", 500);
    }
};
export const getOrderTimeline = async (req, res) => {
    try {
        const { orderId } = req.params;
        const events = await prisma.orderTrackingEvent.findMany({
            where: { orderId },
            orderBy: { timestamp: "asc" }
        });
        return success(res, events);
    }
    catch (err) {
        console.error(err);
        return fail(res, "Server error", 500);
    }
};
