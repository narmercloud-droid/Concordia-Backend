import { Router } from "express";
import { adminAuth } from "../../middleware/adminAuth.js";
import { getPrinterQueue } from "../../controllers/admin/adminPrinterQueue.controller.js";
const router = Router();
router.get("/queue", adminAuth, getPrinterQueue);
export default router;
