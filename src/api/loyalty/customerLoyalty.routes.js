import express from 'express';
import { getLoyaltyInfo, redeem } from './customerLoyalty.controller.js';

const router = express.Router();

router.get('/:userId', getLoyaltyInfo);
router.post('/redeem', redeem);

export default router;
