import express from "express";
const { Router } = express;
import { ForecastingController } from "../controllers/forecasting.controller.ts";
import { adminAuth } from "../middleware/adminAuth.ts";
import { adminRole } from "../middleware/adminRole.ts";

const router = Router();

router.get(
  "/full",
  adminAuth,
  adminRole("manager"),
  ForecastingController.fullForecast
);

export default router;







