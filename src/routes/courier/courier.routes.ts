import { Router } from "express";
import { getCourierOrderView } from "../../controllers/courier/courierView.controller.js";
import { updateCourierLocation } from "../../controllers/courier/courierLocation.controller.js";

const router = Router();

router.get("/order", getCourierOrderView);
router.post("/location/update", updateCourierLocation);

export default router;

