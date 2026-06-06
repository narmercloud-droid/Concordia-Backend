import express from 'express';
import { getCustomerOrderStatus } from './customerTracking.controller.js';

const router = express.Router();

router.get('/status/:orderId', getCustomerOrderStatus);

export default router;
