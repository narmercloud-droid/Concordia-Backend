import express from 'express';
import { updateDriverLocation } from './driverLocation.controller.js';

const router = express.Router();

router.post('/update-location', updateDriverLocation);

export default router;
