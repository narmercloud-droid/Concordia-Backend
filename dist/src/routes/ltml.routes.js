import { Router } from "express";
import { LTMLController } from "../controllers/ltml.controller.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { adminRole } from "../middleware/adminRole.js";
const router = Router();
router.post("/save", adminAuth, adminRole("manager"), LTMLController.save);
router.post("/trends", adminAuth, adminRole("manager"), LTMLController.trends);
router.get("/summary", adminAuth, adminRole("manager"), LTMLController.summary);
export default router;
