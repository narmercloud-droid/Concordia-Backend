import { Router } from "express";
import { adminAuth } from "../../middleware/adminAuth.js";
import { getPrinterAnalyticsController } from "../../controllers/admin/adminPrinterAnalytics.controller.js";
const router = Router();
router.get("/analytics", adminAuth, getPrinterAnalyticsController);
export default router;
