import express from "express";
const { Router } = express;
import { adminAuth } from "../../middleware/adminAuth.ts";
import { reprintKitchenTickets } from "../../controllers/admin/adminPrinter.controller.ts";

const router = Router();

router.post("/reprint/:orderId", adminAuth, reprintKitchenTickets);

export default router;

