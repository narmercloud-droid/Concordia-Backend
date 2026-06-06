import express from "express";
const { Router } = express;
import { adminAuth } from "../../middleware/adminAuth.ts";
import { managerAccess } from "../../middleware/managerAccess.ts";
import {
  getBranch,
  getHours,
  updateHours,
  getConfig,
  updateDeliveryAreas,
  updateDeliverySettings,
  getMenu,
  updateMenuItem,
  getOrders,
  getDashboard
} from "../../controllers/manager/manager.controller.ts";

const router = Router();

router.use(adminAuth, managerAccess);

router.get("/branch", getBranch);
router.get("/dashboard", getDashboard);
router.get("/hours", getHours);
router.put("/hours", updateHours);
router.get("/config", getConfig);
router.patch("/config/delivery-areas", updateDeliveryAreas);
router.patch("/config/delivery-settings", updateDeliverySettings);
router.get("/menu", getMenu);
router.patch("/menu/items/:id", updateMenuItem);
router.get("/orders", getOrders);

export default router;
