"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../db"));
const router = (0, express_1.Router)();
router.post("/", async (req, res) => {
    try {
        const { customer_name, customer_phone, customer_address, items, total_price } = req.body;
        if (!customer_name || !customer_phone || !customer_address || !items || !total_price) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const result = await db_1.default.query(`INSERT INTO orders (
        customer_name,
        customer_phone,
        customer_address,
        items,
        total_price
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`, [
            customer_name,
            customer_phone,
            customer_address,
            JSON.stringify(items),
            total_price
        ]);
        res.json({
            success: true,
            order: result.rows[0]
        });
    }
    catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ error: "Failed to create order" });
    }
});
exports.default = router;
