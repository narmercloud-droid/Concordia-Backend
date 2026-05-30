import { Router } from "express";
import { adminAuth } from "../../middleware/adminAuth.js";
import { assignCourier } from "../../controllers/admin/adminCourier.controller.js";
import { getCourierLocation, getOrderTimeline } from "../../controllers/admin/adminCourierInsight.controller.js";
const router = Router();
router.post("/assign", adminAuth, assignCourier);
router.get("/location/:orderId", adminAuth, getCourierLocation);
router.get("/timeline/:orderId", adminAuth, getOrderTimeline);
export default router;
