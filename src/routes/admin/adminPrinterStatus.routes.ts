import express from "express";
const { Router } = express;
import { adminAuth } from "../../middleware/adminAuth.ts";
import { getPrinterStatus } from "../../controllers/admin/adminPrinterStatus.controller.ts";

const router = Router();

router.get("/status", adminAuth, getPrinterStatus);

export default router;

