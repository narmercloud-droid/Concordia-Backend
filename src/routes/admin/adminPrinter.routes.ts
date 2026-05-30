import { Router } from "express";
import { adminAuth } from "../../middleware/adminAuth.js";
import { reprintKitchenTickets } from "../../controllers/admin/adminPrinter.controller.js";

const router = Router();

router.post("/reprint/:orderId", adminAuth, reprintKitchenTickets);

export default router;

