import express from 'express';
import { triggerAutoDispatch } from './autoDispatch.controller.js';

const router = express.Router();

router.post('/:orderId', triggerAutoDispatch);

export default router;
