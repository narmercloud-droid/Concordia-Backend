import express from "express";
const { Router } = express;
import { getCourierOrderView } from "../../controllers/courier/courierView.controller.ts";
import { updateCourierLocation } from "../../controllers/courier/courierLocation.controller.ts";

const router = Router();

router.get("/order", getCourierOrderView);
router.post("/location/update", updateCourierLocation);

export default router;

