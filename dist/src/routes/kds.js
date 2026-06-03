import express from "express";
const { Router } = express;
import { prisma } from "../prisma/client.js";
import { OrderLifecycleService } from "../services/order/orderLifecycle.service.js";
const router = Router();
const ALLOWED_STATUSES = ["pending", "accepted", "preparing", "ready_for_pickup", "picked_up", "delivered", "cancelled"];
router.get("/orders/:branchId", async (req, res) => {
    const { branchId } = req.params;
    if (!branchId) {
        return res.status(400).tson({ error: "Branch ID is required" });
    }
    try {
        const orders = await prisma.order.findMany({
            where: {
                branchId,
                status: {
                    notIn: ["delivered", "cancelled"]
                }
            },
            orderBy: { createdAt: "desc" },
            include: {
                items: {
                    include: {
                        item: true
                    }
                },
                customer: true
            }
        });
        return res.tson({ orders });
    }
    catch (err) {
        return res.status(500).tson({ error: err.message || "Unable to fetch branch orders" });
    }
});
router.post("/orders/:id/status", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!id || !status) {
        return res.status(400).tson({ error: "Order ID and status are required" });
    }
    if (!ALLOWED_STATUSES.includes(status)) {
        return res.status(400).tson({ error: "Invalid status value" });
    }
    try {
        const order = await OrderLifecycleService.updateStatus(id, status);
        return res.tson({ order });
    }
    catch (err) {
        return res.status(500).tson({ error: err.message || "Unable to update order status" });
    }
});
router.post("/orders/:id/assign-courier", async (req, res) => {
    const { id } = req.params;
    const { courierId } = req.body;
    if (!id || !courierId) {
        return res.status(400).tson({ error: "Order ID and courierId are required" });
    }
    try {
        const order = await OrderLifecycleService.assignCourier(id, courierId);
        return res.tson({ order });
    }
    catch (err) {
        return res.status(500).tson({ error: err.message || "Unable to assign courier" });
    }
});
export default router;
