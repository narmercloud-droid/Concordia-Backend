import { prisma } from "../../prisma/client.js";
import { generateCourierToken } from "../../services/courier/courierToken.service.js";
import { OrderLifecycleService } from "../../services/order/orderLifecycle.service.js";
import { success, fail } from "../controllerHelper.js";
export const assignCourier = async (req, res) => {
    try {
        const { orderId, courierId } = req.body;
        const order = await prisma.order.findUnique({ where: { id: orderId } });
        if (!order)
            return fail(res, "Order not found", 404);
        const token = await generateCourierToken(orderId);
        await OrderLifecycleService.updateStatus(orderId, "courier_assigned", undefined, {
            courierId,
            courierStatus: "assigned"
        });
        return success(res, {
            success: true,
            courierToken: token,
            qrUrl: `${process.env.PUBLIC_URL}/courier/order?token=${token}`
        });
    }
    catch (err) {
        console.error(err);
        return fail(res, "Server error", 500);
    }
};
