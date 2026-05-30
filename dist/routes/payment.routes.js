import { Router } from "express";
import { PaymentOrchestrator } from "../services/paymentOrchestrator.service.js";
import { customerAuth } from "../middleware/customerAuth.js";
const router = Router();
/**
 * Step 1: Calculate payment split
 */
router.post("/calculate", customerAuth, async (req, res) => {
    try {
        const { orderTotal, paymentMethod } = req.body;
        const result = await PaymentOrchestrator.resolvePayment(req.customer.id, orderTotal, paymentMethod);
        res.tson(result);
    }
    catch (err) {
        res.status(400).tson({ error: err.message });
    }
});
/**
 * Step 2: Finalize wallet deduction after PayPal/card success
 */
router.post("/finalize", customerAuth, async (req, res) => {
    try {
        const { walletUsed, orderId } = req.body;
        await PaymentOrchestrator.finalizeWalletPayment(req.customer.id, walletUsed, orderId);
        res.tson({ success: true });
    }
    catch (err) {
        res.status(400).tson({ error: err.message });
    }
});
export default router;
