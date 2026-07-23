import { randomUUID } from "crypto";
import express from "express";
const { Router } = express;
import { prisma } from "../prisma/client.ts";
import { OrderLifecycleService } from "../services/order/orderLifecycle.service.ts";
import { courierAuth } from "../middleware/courierAuth.ts";
import { adminAuth } from "../middleware/adminAuth.ts";

const router = Router();

async function resolveCourierId(courierReference: string) {
  const courier = await prisma.courier.findFirst({
    where: {
      OR: [{ id: courierReference }, { email: courierReference }]
    }
  });
  return courier?.id ?? null;
}

router.post("/location", courierAuth, async (req, res) => {
  const { courierId, orderId, latitude, longitude, accuracy } = req.body;

  if (!courierId || !orderId || latitude == null || longitude == null) {
    return res.status(400).json({ error: "courierId, orderId, latitude and longitude are required" });
  }

  try {
    const resolvedCourierId = await resolveCourierId(courierId);
    if (!resolvedCourierId) {
      return res.status(404).json({ error: "Courier not found" });
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
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.status !== "out_for_delivery") {
      await OrderLifecycleService.updateStatus(orderId, "out_for_delivery");
    }

    return res.json({ success: true, courierLocation });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to save courier location" });
  }
});

router.post("/status", courierAuth, async (req, res) => {
  const { orderId, status } = req.body;

  if (!orderId || !status) {
    return res.status(400).json({ error: "orderId and status are required" });
  }

  try {
    const updated = await OrderLifecycleService.updateStatus(orderId, status);
    return res.json({ success: true, order: updated });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to create order tracking event" });
  }
});

router.get("/orders/:courierId", adminAuth, async (req, res) => {
  const { courierId } = req.params;

  try {
    const resolvedCourierId = await resolveCourierId(courierId);
    if (!resolvedCourierId) {
      return res.status(404).json({ error: "Courier not found" });
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

    return res.json({ orders: activeOrders });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to fetch courier orders" });
  }
});

export default router;
