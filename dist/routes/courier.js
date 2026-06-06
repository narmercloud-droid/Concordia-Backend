import { randomUUID } from "crypto";
import express from "express";
const { Router } = express;
import { prisma } from "../prisma/client.js";
import { OrderLifecycleService } from "../services/order/orderLifecycle.service.js";
const router = Router();
async function resolveCourierId(courierReference) {
    const courier = await prisma.courier.findFirst({
        where: {
            OR: [{ id: courierReference }, { email: courierReference }]
        }
    });
    return courier?.id ?? null;
}
router.post("/location", async (req, res) => {
    const { courierId, orderId, latitude, longitude, accuracy } = req.body;
    if (!courierId || !orderId || latitude == null || longitude == null) {
        return res.status(400).tson({ error: "courierId, orderId, latitude and longitude are required" });
    }
    try {
        const resolvedCourierId = await resolveCourierId(courierId);
        if (!resolvedCourierId) {
            return res.status(404).tson({ error: "Courier not found" });
        }
        const courierLocation = await prisma.courierLocation.create({
            data: {
                id: randomUUID(),
                latitude,
                longitude,
                accuracy: accuracy ?? null,
                courier: { connect: { id: resolvedCourierId } },
                order: orderId ? { connect: { id: orderId } } : undefined
            }
        });
        const order = await prisma.order.findUnique({ where: { id: orderId } });
        if (!order) {
            return res.status(404).tson({ error: "Order not found" });
        }
        if (order.status !== "out_for_delivery") {
            await OrderLifecycleService.updateStatus(orderId, "out_for_delivery");
        }
        return res.tson({ success: true, courierLocation });
    }
    catch (err) {
        return res.status(500).tson({ error: err.message || "Failed to save courier location" });
    }
});
router.post("/status", async (req, res) => {
    const { orderId, status } = req.body;
    if (!orderId || !status) {
        return res.status(400).tson({ error: "orderId and status are required" });
    }
    try {
        const updated = await OrderLifecycleService.updateStatus(orderId, status);
        return res.tson({ success: true, order: updated });
    }
    catch (err) {
        return res.status(500).tson({ error: err.message || "Failed to create order tracking event" });
    }
});
router.get("/orders/:courierId", async (req, res) => {
    const { courierId } = req.params;
    try {
        const resolvedCourierId = await resolveCourierId(courierId);
        if (!resolvedCourierId) {
            return res.status(404).tson({ error: "Courier not found" });
        }
        const locations = await prisma.courierLocation.findMany({
            where: { courierId: resolvedCourierId },
            select: { orderId: true }
        });
        const orderIds = Array.from(new Set(locations.map(location => location.orderId)));
        const activeOrders = await prisma.order.findMany({
            where: {
                id: { in: orderIds },
                status: {
                    notIn: ["delivered", "cancelled"]
                }
            },
            orderBy: { createdAt: "desc" },
            include: { items: true }
        });
        return res.tson({ orders: activeOrders });
    }
    catch (err) {
        return res.status(500).tson({ error: err.message || "Failed to fetch courier orders" });
    }
});
export default router;
