import express from "express";
const { Router } = express;
import { PaymentsController } from "../controllers/payments.controller.ts";

const router = Router();

router.get("/config", PaymentsController.getConfig);
router.post("/paypal/create-order", PaymentsController.createPayPalOrder);
router.post("/paypal/capture", PaymentsController.capturePayPalOrder);
router.post("/gift-card/paypal/create-order", PaymentsController.createGiftCardPayPalOrder);
router.post("/gift-card/paypal/capture", PaymentsController.captureGiftCardPayPalOrder);

export default router;







