import express from "express";
const { Router } = express;
import { adminAuth } from "../../middleware/adminAuth.ts";
import { runPrinterTest } from "../../controllers/admin/adminPrinterTest.controller.ts";

const router = Router();

router.post("/test/:kitchen", adminAuth, runPrinterTest);

export default router;

