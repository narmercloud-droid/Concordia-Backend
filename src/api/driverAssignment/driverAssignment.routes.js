import express from 'express';
import { assignDriver } from './driverAssignment.controller.js';

const router = express.Router();
router.post('/:orderId/assign', assignDriver);

export default router;
