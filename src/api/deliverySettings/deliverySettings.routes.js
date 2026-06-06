import express from 'express';
import {
  getDeliverySettings,
  updateDeliverySettings
} from './deliverySettings.controller.js';

const router = express.Router();

router.get('/:branchId', getDeliverySettings);
router.patch('/:branchId', updateDeliverySettings);

export default router;
