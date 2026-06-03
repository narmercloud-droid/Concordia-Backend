import express from "express";
const { Router } = express;
import { adminAuth } from "../../middleware/adminAuth.ts";
import { listCloudPrinters } from "../../controllers/admin/adminPrinterCloud.controller.ts";

const router = Router();

router.get("/cloud", adminAuth, listCloudPrinters);

export default router;

