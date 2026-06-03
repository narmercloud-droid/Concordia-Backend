import express from "express";
const { Router } = express;
import { prisma } from "../prisma/client.js";
const router = Router();
router.get("/track/:token", async (req, res) => {
    const { token } = req.params;
    if (!token) {
        return res.status(400).tson({ error: "Tracking token is required" });
    }
    try {
        const order = await prisma.order.findFirst({
            where: { tracking_token: token },
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
            return res.status(404).tson({ error: "Order not found" });
        }
        const latestLocation = await prisma.courierLocation.findFirst({
            where: { orderId: order.id },
            orderBy: { createdAt: "desc" }
        });
        const timeline = await prisma.orderTrackingEvent.findMany({
            where: { orderId: order.id },
            orderBy: { timestamp: "asc" }
        });
        res.tson({
            order: {
                id: order.id,
                status: order.status,
                tracking_token: order.tracking_token,
                customerName: order.customer?.name || "Guest",
                customerPhone: order.customer?.phone || null,
                customerEmail: order.customer?.email || null,
                items: order.items,
                createdAt: order.createdAt
            },
            latestLocation,
            timeline
        });
    }
    catch (err) {
        res.status(500).tson({ error: err.message || "Unable to fetch tracking info" });
    }
});
router.get("/track/order/:orderId", async (req, res) => {
    const { orderId } = req.params;
    if (!orderId) {
        return res.status(400).tson({ error: "Order ID is required" });
    }
    try {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            select: { id: true, tracking_token: true, status: true }
        });
        if (!order) {
            return res.status(404).tson({ error: "Order not found" });
        }
        res.tson(order);
    }
    catch (err) {
        res.status(500).tson({ error: err.message || "Unable to fetch order" });
    }
});
export default router;
