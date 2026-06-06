import express from "express";
const { Router } = express;
import { adminAuth } from "../../middleware/adminAuth.ts";
import { getPrinterQueue } from "../../controllers/admin/adminPrinterQueue.controller.ts";

const router = Router();

router.get("/queue", adminAuth, getPrinterQueue);

export default router;

