import express from "express";
import { prisma } from "../prisma/client.js";
import { success, fail } from "../controllers/controllerHelper.js";
import { trackingTokenParamSchema } from "../validation/public.schema.js";
const router = express.Router();
// Public tracking endpoint
router.get("/order/:tracking_token", async (req, res) => {
    try {
        const parsedParams = trackingTokenParamSchema.safeParse(req.params);
        if (!parsedParams.success) {
            return fail(res, "INVALID_INPUT", parsedParams.error.message, 400);
        }
        const { tracking_token } = parsedParams.data;
        const order = await prisma.order.findFirst({
            where: { tracking_token },
            include: {
                items: {
                    include: {
                        item: true
                    }
                },
                customer: true
            }
        });
        if (!order) {
            return fail(res, "NOT_FOUND", "Order not found", 404);
        }
        const timeline = [];
        if (order.status === "accepted" || order.status === "preparing") {
            timeline.push({ status: "accepted", timestamp: order.updatedAt });
        }
        if (order.status === "ready" || order.status === "completed") {
            timeline.push({ status: "ready", timestamp: order.updatedAt });
        }
        if (order.status === "completed") {
            timeline.push({ status: "completed", timestamp: order.updatedAt });
        }
        const response = {
            order_id: order.id,
            status: order.status,
            customer_name: order.customer?.name || "Guest",
            customer_phone: order.customer?.phone || null,
            customer_email: order.customer?.email || null,
            items: order.items,
            timeline
        };
        return success(res, response, "Order tracking data");
    }
    catch (err) {
        return fail(res, "UNKNOWN_ERROR", err.message, 500);
    }
});
export default router;
