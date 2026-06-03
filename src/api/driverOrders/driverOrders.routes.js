import express from 'express';
import { driverAuthMiddleware } from '../../middleware/driverAuth.js';
import {
  getActiveOrders,
  driverUpdateOrderStatus
} from './driverOrders.controller.js';

const router = express.Router();

router.get('/active', driverAuthMiddleware, getActiveOrders);
router.patch('/:orderId/status', driverAuthMiddleware, driverUpdateOrderStatus);

export default router;
