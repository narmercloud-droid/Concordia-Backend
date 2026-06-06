import express from "express";
const { Router } = express;
import { adminAuth } from "../../middleware/adminAuth.ts";
import { createVoucher, invalidateVoucher, listVouchers } from "../../controllers/admin/voucherAdmin.controller.ts";
import { adminRefundOrder } from "../../controllers/admin/refundAdmin.controller.ts";

const router = Router();

router.post("/voucher/create", adminAuth, createVoucher);
router.post("/voucher/invalidate", adminAuth, invalidateVoucher);
router.get("/voucher/list", adminAuth, listVouchers);

router.post("/refund", adminAuth, adminRefundOrder);

export default router;

