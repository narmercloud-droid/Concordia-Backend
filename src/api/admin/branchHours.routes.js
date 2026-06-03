import express from 'express';
import { setBranchHours, getBranchHours } from './branchHours.controller.js';

const router = express.Router();

router.get('/:branchId', getBranchHours);
router.put('/:branchId', setBranchHours);

export default router;
