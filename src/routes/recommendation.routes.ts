import express from "express";
const { Router } = express;
import { RecommendationController } from "../controllers/recommendation.controller.ts";
import { customerAuth } from "../middleware/customerAuth.ts";

const router = Router();

router.get("/", customerAuth, RecommendationController.recommend);

export default router;







