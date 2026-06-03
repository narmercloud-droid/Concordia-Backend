import express from 'express';
import { getAvailableSlots, scheduleOrder } from './customerScheduling.controller.js';

const router = express.Router();

router.get('/slots/:branchId', getAvailableSlots);
router.post('/schedule', scheduleOrder);

export default router;
