import express from 'express';
import { claimOrder } from './driverClaim.controller.js';
import { updateDriverStatus } from './driverStatus.controller.js';

const router = express.Router();

router.post('/claim', claimOrder);
router.post('/status', updateDriverStatus);

export default router;
