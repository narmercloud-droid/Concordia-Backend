import express from 'express';
import { driverUpdateStatus } from './driverRealtime.controller.js';

const router = express.Router();

router.post('/update-status', driverUpdateStatus);

export default router;
