import { Router } from "express";
import { OptimizationLoopController } from "../controllers/optimizationLoop.controller.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { adminRole } from "../middleware/adminRole.js";
const router = Router();
router.post("/run", adminAuth, adminRole("manager"), OptimizationLoopController.run);
router.get("/logs", adminAuth, adminRole("manager"), OptimizationLoopController.logs);
export default router;
