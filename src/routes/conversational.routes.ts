import express from "express";
const { Router } = express;
import { ConversationalController } from "../controllers/conversational.controller.ts";
import { adminAuth } from "../middleware/adminAuth.ts";
import { adminRole } from "../middleware/adminRole.ts";

const router = Router();

router.post(
  "/talk",
  adminAuth,
  adminRole("manager"),
  ConversationalController.talk
);

router.get(
  "/history",
  adminAuth,
  adminRole("manager"),
  ConversationalController.history
);

export default router;







