import express from "express";
const { Router } = express;
import pool from "../db.ts";
import { prisma } from "../prisma/client.ts";
import { customerAuth } from "../middleware/customerAuth.ts";

const router = Router();

router.post("/create", async (req, res) => {
  try {
    const { items, order_type, address } = req.body;

    const order = await pool.query(
      `INSERT INTO orders (order_type, address, status)
       VALUES ($1, $2, 'pending')
       RETURNING id`,
      [order_type, address]
    );

    const orderId = order.rows[0].id;

    for (const item of items) {
      await pool.query(
        `INSERT INTO order_items (order_id, product_id, option_id, quantity, unit_price)
         VALUES ($1, $2, $3, $4, $5)`,
        [orderId, item.product_id, item.option_id, item.quantity, item.unit_price]
      );
    }

    res.json({ order_id: orderId });
  } catch (_err) {
    void _err;
    res.status(500).json({ error: "Failed to create order" });
  }
});

router.get("/customer/:id", customerAuth, async (req, res) => {
  try {
    const customerId = req.params.id;
    const orders = await prisma.order.findMany({
      where: { customerId },
      orderBy: { createdAt: "desc" },
      include: { items: true }
    });
    res.json({ orders });
  } catch (_error) {
    void _error;
    res.status(500).json({ error: "Unable to fetch order history" });
  }
});

export default router;

