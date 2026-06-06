import express from 'express';
import { getOrderETA } from './eta.controller.js';

const router = express.Router();

router.get('/:orderId', getOrderETA);

export default router;
