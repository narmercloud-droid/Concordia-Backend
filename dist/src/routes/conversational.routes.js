import { Router } from "express";
import { ConversationalController } from "../controllers/conversational.controller.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { adminRole } from "../middleware/adminRole.js";
const router = Router();
router.post("/talk", adminAuth, adminRole("manager"), ConversationalController.talk);
router.get("/history", adminAuth, adminRole("manager"), ConversationalController.history);
export default router;
