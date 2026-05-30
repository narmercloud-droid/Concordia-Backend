import { Router } from "express";
import { getCustomerTracking } from "../../controllers/customer/customerTracking.controller.js";

const router = Router();

router.get("/track/:token", getCustomerTracking);

export default router;

