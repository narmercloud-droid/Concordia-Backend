import { Router } from "express";
import { KnowledgeGraphController } from "../controllers/knowledgeGraph.controller.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { adminRole } from "../middleware/adminRole.js";
const router = Router();
router.post("/analyze", adminAuth, adminRole("manager"), KnowledgeGraphController.analyze);
router.get("/insights", adminAuth, adminRole("manager"), KnowledgeGraphController.insights);
export default router;
