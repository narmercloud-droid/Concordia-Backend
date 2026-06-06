import express from 'express';
import { setAvailability, getAvailability } from './driverAvailability.controller.js';

const router = express.Router();

router.get('/:driverId', getAvailability);
router.post('/:driverId', setAvailability);

export default router;
