import express from "express";
const { Router } = express;
import { getCustomerTracking } from "../../controllers/customer/customerTracking.controller.ts";

const router = Router();

router.get("/track/:token", getCustomerTracking);

export default router;

