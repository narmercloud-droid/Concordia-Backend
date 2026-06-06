import express from "express";
const { Router } = express;
import registry from "../metrics/metrics.ts";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    res.set("Content-Type", registry.contentType || "text/plain");
    const metrics = await registry.metrics();
    res.send(metrics);
  } catch (_err) {
    void _err;
    res.status(500).send("Error collecting metrics");
  }
});

export default router;
