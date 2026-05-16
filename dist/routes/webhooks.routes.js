import express, { Router } from "express";
import { fail } from "../controllers/controllerHelper.js";
const router = Router();
// Placeholder webhook routes. Install Stripe if webhook processing is required.
router.post("/stripe", express.raw({ type: "application/json" }), async (_req, res) => {
    try {
        return fail(res, "NOT_CONFIGURED", "Stripe webhook handling is not configured.", 501);
    }
    catch (err) {
        return fail(res, "UNKNOWN_ERROR", err.message, 500);
    }
});
router.post("/paypal", (_req, res) => {
    try {
        return fail(res, "NOT_CONFIGURED", "PayPal webhook handling is not configured.", 501);
    }
    catch (err) {
        return fail(res, "UNKNOWN_ERROR", err.message, 500);
    }
});
export default router;
