import express from "express";
const { Router } = express;
import { adminAuth } from "../../middleware/adminAuth.ts";
import { getPrinterAnalyticsController } from "../../controllers/admin/adminPrinterAnalytics.controller.ts";

const router = Router();

router.get("/analytics", adminAuth, getPrinterAnalyticsController);

export default router;

