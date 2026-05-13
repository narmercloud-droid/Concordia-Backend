import { Router } from "express";
import { LtvChurnController } from "../controllers/ltvChurn.controller.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { adminRole } from "../middleware/adminRole.js";
const router = Router();
router.get("/segment/:customerId", adminAuth, adminRole("manager"), LtvChurnController.segment);
router.get("/branch", adminAuth, adminRole("manager"), LtvChurnController.branchSegments);
export default router;
