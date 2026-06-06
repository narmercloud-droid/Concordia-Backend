import express from 'express';
import { requestOtp, verifyCustomerOtp } from './customerAuth.controller.js';

const router = express.Router();

router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyCustomerOtp);

export default router;
