import { Router } from "express";
import { RecommendationController } from "../controllers/recommendation.controller.js";
import { customerAuth } from "../middleware/customerAuth.js";

const router = Router();

router.get("/", customerAuth, RecommendationController.recommend);

export default router;

