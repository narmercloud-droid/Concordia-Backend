import express from 'express';
import { customerAuthMiddleware } from '../../middleware/customerAuth.js';
import {
  getCustomerOrders,
  getCustomerOrder
} from './customerOrders.controller.js';

const router = express.Router();

router.get('/', customerAuthMiddleware, getCustomerOrders);
router.get('/:orderId', customerAuthMiddleware, getCustomerOrder);

export default router;
