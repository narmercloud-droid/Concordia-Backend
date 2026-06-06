import express from "express";
const { Router } = express;
import { adminAuth } from "../../middleware/adminAuth.ts";
import { listUnapprovedPrinters, approvePrinterController } from "../../controllers/admin/adminPrinterSecurity.controller.ts";

const router = Router();

router.get("/security/pending", adminAuth, listUnapprovedPrinters);
router.post("/security/approve/:id", adminAuth, approvePrinterController);

export default router;

