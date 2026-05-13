import { Router } from "express";
import { OrchestrationController } from "../controllers/orchestration.controller.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { adminRole } from "../middleware/adminRole.js";
const router = Router();
router.post("/run", adminAuth, adminRole("manager"), OrchestrationController.runAll);
router.post("/trigger", adminAuth, adminRole("manager"), OrchestrationController.trigger);
router.get("/logs", adminAuth, adminRole("manager"), OrchestrationController.logs);
export default router;
