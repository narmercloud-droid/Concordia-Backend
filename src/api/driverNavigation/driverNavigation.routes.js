import express from 'express';
import { driverAuthMiddleware } from '../../middleware/driverAuth.js';
import { getOrderNavigation } from './driverNavigation.controller.js';

const router = express.Router();

router.get('/order/:orderId', driverAuthMiddleware, getOrderNavigation);

export default router;
