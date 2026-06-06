import express from 'express';
import { driverAccessOrder } from './driverAccess.controller.js';

const router = express.Router();

router.get('/order', driverAccessOrder);

export default router;
