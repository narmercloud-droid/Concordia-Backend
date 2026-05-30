import { Router } from "express";
import { ManagerDashboardController } from "../controllers/managerDashboard.controller.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { adminRole } from "../middleware/adminRole.js";

const router = Router();

// Manager-only routes
router.get("/menu", adminAuth, adminRole("manager"), ManagerDashboardController.menu);
router.post("/menu/availability", adminAuth, adminRole("manager"), ManagerDashboardController.setItemAvailability);

router.get("/orders", adminAuth, adminRole("manager"), ManagerDashboardController.orders);

router.get("/couriers", adminAuth, adminRole("manager"), ManagerDashboardController.couriers);

router.get("/terminals", adminAuth, adminRole("manager"), ManagerDashboardController.terminals);

router.get("/schedule", adminAuth, adminRole("manager"), ManagerDashboardController.getSchedule);
router.post("/schedule", adminAuth, adminRole("manager"), ManagerDashboardController.updateSchedule);

export default router;








