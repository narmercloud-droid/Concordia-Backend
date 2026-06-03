import express from 'express';
import { getAssignedOrders } from './driverOrders.controller.js';

const router = express.Router();

router.get('/assigned/:driverId', getAssignedOrders);

export default router;
