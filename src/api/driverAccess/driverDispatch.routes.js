import express from 'express';
import { driverAccept, driverDecline } from './driverDispatch.controller.js';

const router = express.Router();

router.post('/accept', driverAccept);
router.post('/decline', driverDecline);

export default router;
