import express from 'express';
import { adminAuthMiddleware } from '../../middleware/adminAuth.js';
import {
  createBranch,
  updateBranch,
  deleteBranch
} from './adminBranches.controller.js';

const router = express.Router();

router.post('/', adminAuthMiddleware, createBranch);
router.patch('/:branchId', adminAuthMiddleware, updateBranch);
router.delete('/:branchId', adminAuthMiddleware, deleteBranch);

export default router;
