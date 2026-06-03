import express from "express";
const { Router } = express;
import registry from "../metrics/metrics.js";
const router = Router();
router.get("/", async (_req, res) => {
    try {
        res.set("Content-Type", registry.contentType || "text/plain");
        const metrics = await registry.metrics();
        res.send(metrics);
    }
    catch (err) {
        res.status(500).send("Error collecting metrics");
    }
});
export default router;
