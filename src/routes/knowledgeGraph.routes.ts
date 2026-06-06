import express from "express";
const { Router } = express;
import { KnowledgeGraphController } from "../controllers/knowledgeGraph.controller.ts";
import { adminAuth } from "../middleware/adminAuth.ts";
import { adminRole } from "../middleware/adminRole.ts";

const router = Router();

router.post(
  "/analyze",
  adminAuth,
  adminRole("manager"),
  KnowledgeGraphController.analyze
);

router.get(
  "/insights",
  adminAuth,
  adminRole("manager"),
  KnowledgeGraphController.insights
);

export default router;







