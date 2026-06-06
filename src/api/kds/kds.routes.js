import express from 'express';
import { updateKitchenStatus, getKitchenQueue } from './kds.controller.js';

const router = express.Router();

router.get('/queue/:branchId', getKitchenQueue);
router.post('/update-status', updateKitchenStatus);

export default router;
