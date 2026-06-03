import express from 'express';
import { getBranchLoad, recalcLoad } from './kitchenLoad.controller.js';

const router = express.Router();

router.get('/:branchId', getBranchLoad);
router.post('/:branchId/recalculate', recalcLoad);

export default router;
