import express from "express";
const { Router } = express;
import { adminAuth } from "../../middleware/adminAuth.ts";
import { assignCourier } from "../../controllers/admin/adminCourier.controller.ts";
import { getCourierLocation, getOrderTimeline } from "../../controllers/admin/adminCourierInsight.controller.ts";

const router = Router();

router.post("/assign", adminAuth, assignCourier);
router.get("/location/:orderId", adminAuth, getCourierLocation);
router.get("/timeline/:orderId", adminAuth, getOrderTimeline);

export default router;

