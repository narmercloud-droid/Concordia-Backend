import express from 'express';
import {
  overview,
  dailyOrders,
  branchPerformance,
  driverPerformance
} from './analytics.controller.js';

const router = express.Router();

router.get('/overview', overview);
router.get('/daily-orders', dailyOrders);
router.get('/branches', branchPerformance);
router.get('/drivers', driverPerformance);

export default router;
