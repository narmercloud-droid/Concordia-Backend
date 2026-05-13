import { Router } from "express";
import { ForecastingController } from "../controllers/forecasting.controller.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { adminRole } from "../middleware/adminRole.js";
const router = Router();
router.get("/full", adminAuth, adminRole("manager"), ForecastingController.fullForecast);
export default router;
