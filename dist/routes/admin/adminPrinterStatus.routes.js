import { Router } from "express";
import { adminAuth } from "../../middleware/adminAuth.js";
import { getPrinterStatus } from "../../controllers/admin/adminPrinterStatus.controller.js";
const router = Router();
router.get("/status", adminAuth, getPrinterStatus);
export default router;
