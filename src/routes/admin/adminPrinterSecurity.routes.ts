import { Router } from "express";
import { adminAuth } from "../../middleware/adminAuth.js";
import { listUnapprovedPrinters, approvePrinterController } from "../../controllers/admin/adminPrinterSecurity.controller.js";

const router = Router();

router.get("/security/pending", adminAuth, listUnapprovedPrinters);
router.post("/security/approve/:id", adminAuth, approvePrinterController);

export default router;

