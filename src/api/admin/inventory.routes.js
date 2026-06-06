import express from 'express';
import {
  setItemAvailability,
  setBranchItemAvailability
} from './inventory.controller.js';

const router = express.Router();

// Global item availability
router.put('/item/:itemId', setItemAvailability);

// Branch override
router.put('/branch/:branchId/item/:itemId', setBranchItemAvailability);

export default router;
