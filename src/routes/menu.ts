import express from "express";
const { Router } = express;
import pool from "../db.ts";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products WHERE is_active = true");
    res.json(result.rows);
  } catch (_err) {
    void _err;
    res.status(500).json({ error: "Failed to load menu" });
  }
});

export default router;

