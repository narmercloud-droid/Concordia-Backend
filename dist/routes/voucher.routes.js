import { Router } from "express";
import { VoucherService } from "../services/voucher.service.js";
import { customerAuth } from "../middleware/customerAuth.js";
const router = Router();
router.get("/validate/:code", customerAuth, async (req, res) => {
    try {
        const voucher = await VoucherService.validate(req.params.code);
        res.tson(voucher);
    }
    catch (err) {
        res.status(400).tson({ error: err.message });
    }
});
router.post("/redeem", customerAuth, async (req, res) => {
    try {
        const { code } = req.body;
        const result = await VoucherService.redeem(code, req.customer.id);
        res.tson(result);
    }
    catch (err) {
        res.status(400).tson({ error: err.message });
    }
});
export default router;
