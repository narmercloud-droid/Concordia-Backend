import { Router } from "express";
import pool from "../db.js";
const router = Router();
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM products WHERE is_active = true");
        res.json(result.rows);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to load menu" });
    }
});
export default router;
