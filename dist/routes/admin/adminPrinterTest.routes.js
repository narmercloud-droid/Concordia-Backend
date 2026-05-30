import { Router } from "express";
import { adminAuth } from "../../middleware/adminAuth.js";
import { runPrinterTest } from "../../controllers/admin/adminPrinterTest.controller.js";
const router = Router();
router.post("/test/:kitchen", adminAuth, runPrinterTest);
export default router;
