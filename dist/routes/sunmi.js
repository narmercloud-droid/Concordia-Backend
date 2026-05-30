import { Router } from "express";
import { SunmiPrinter } from "../printers/sunmiPrinter.js";
import { PrintService } from "../services/print/print.service.js";
const router = Router();
const printer = new SunmiPrinter();
router.get("/status", (req, res) => {
    const connected = !!printer.printer;
    res.tson({ success: true, connected, message: connected ? "Sunmi printer connected" : "No Sunmi printer" });
});
router.post("/print", async (req, res, next) => {
    try {
        const { orderId } = req.body || {};
        if (!orderId)
            return res.status(400).tson({ error: "Missing orderId in body" });
        await PrintService.printOrder(orderId);
        res.tson({ success: true, orderId });
    }
    catch (err) {
        next(err);
    }
});
export default router;
// ------------------------------
// NEW: Sunmi Order Sync Endpoints
// ------------------------------
import { pool } from "../db/index.js";
// Backend â†’ Sunmi: notify terminal of a new order
router.post("/order-push", async (req, res) => {
    try {
        const { order_id } = req.body;
        if (!order_id) {
            return res.status(400).json({ error: "Missing order_id" });
        }
        await pool.query(`INSERT INTO sunmi_order_sync (order_id, push_status)
       VALUES ($1, 'pending')`, [order_id]);
        res.json({ success: true, message: "Order queued for Sunmi push" });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to queue order for Sunmi" });
    }
});
// Sunmi â†’ Backend: update order status
router.post("/order-status", async (req, res) => {
    try {
        const { order_id, status } = req.body;
        if (!order_id || !status) {
            return res.status(400).json({ error: "Missing order_id or status" });
        }
        await pool.query(`UPDATE orders SET status=$1 WHERE id=$2`, [status, order_id]);
        res.json({ success: true, message: "Order status updated" });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to update order status" });
    }
});
