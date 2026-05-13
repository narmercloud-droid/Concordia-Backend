import express from "express";
import { prisma } from "../prisma/client.js";
const router = express.Router();
// Public tracking endpoint
router.get("/order/:tracking_token", async (req, res) => {
    const { tracking_token } = req.params;
    try {
        const order = await prisma.order.findUnique({
            where: { tracking_token },
            include: {
                items: true,
                customer: true
            },
        });
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }
        // Build timeline based on order status
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
            timeline,
        };
        res.json(response);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
export default router;
