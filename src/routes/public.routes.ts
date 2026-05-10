import express from "express";
import { prisma } from "../prisma/client";

const router = express.Router();

// Public tracking endpoint
router.get("/order/:tracking_token", async (req, res) => {
  const { tracking_token } = req.params;
  
  try {
    const order = await prisma.order.findUnique({
      where: { tracking_token },
      include: {
        items: {
          include: {
            variant: true,
            toppings: true,
            extras: true,
          },
        },
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
      order_id: order.order_id,
      status: order.status,
      customer_name: order.customer_name,
      customer_phone: order.customer_phone,
      customer_email: order.customer_email,
      items: order.items,
      timeline,
    };

    res.json(response);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;