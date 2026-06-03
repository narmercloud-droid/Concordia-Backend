import express from 'express';
import { updateOrderStatus } from './orderStatus.controller.js';

const router = express.Router();
router.patch('/:orderId/status', updateOrderStatus);

export default router;
