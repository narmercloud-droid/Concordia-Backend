import express from 'express';
import { setBranchItemPrice, clearBranchItemPrice } from './branchPricing.controller.js';

const router = express.Router();

router.put('/:branchId/item/:itemId', setBranchItemPrice);
router.delete('/:branchId/item/:itemId', clearBranchItemPrice);

export default router;
