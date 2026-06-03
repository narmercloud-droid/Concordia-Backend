import express from "express";
const { Router } = express;
import { adminAuth } from "../../middleware/adminAuth.js";
import { getTraces, getHealth, getAnomalies } from "../../controllers/admin/adminPrinterObservability.controller.js";
const router = Router();
router.get("/observability/traces", adminAuth, getTraces);
router.get("/observability/health", adminAuth, getHealth);
router.get("/observability/anomalies", adminAuth, getAnomalies);
export default router;
