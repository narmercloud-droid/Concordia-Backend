import { Router } from "express";
import { HealthController } from "../controllers/health.controller.js";

const router = Router();

// Liveness probe - basic check if service is running
router.get("/live", HealthController.liveness);

// Readiness probe - check if service is ready to serve traffic
router.get("/ready", HealthController.readiness);

// Comprehensive health check (legacy endpoint)
router.get("/", HealthController.comprehensive);

export default router;
