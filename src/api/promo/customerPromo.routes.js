import express from 'express';
import { applyPromoCode } from './customerPromo.controller.js';

const router = express.Router();

router.post('/apply', applyPromoCode);

export default router;
