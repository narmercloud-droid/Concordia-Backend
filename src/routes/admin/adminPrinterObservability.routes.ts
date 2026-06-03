import express from "express";
const { Router } = express;
import { adminAuth } from "../../middleware/adminAuth.ts";
import { getTraces, getHealth, getAnomalies } from "../../controllers/admin/adminPrinterObservability.controller.ts";

const router = Router();

router.get("/observability/traces", adminAuth, getTraces);
router.get("/observability/health", adminAuth, getHealth);
router.get("/observability/anomalies", adminAuth, getAnomalies);

export default router;

