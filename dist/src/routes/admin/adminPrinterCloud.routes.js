import express from "express";
const { Router } = express;
import { adminAuth } from "../../middleware/adminAuth.js";
import { listCloudPrinters } from "../../controllers/admin/adminPrinterCloud.controller.js";
const router = Router();
router.get("/cloud", adminAuth, listCloudPrinters);
export default router;
