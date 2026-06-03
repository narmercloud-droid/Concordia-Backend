import express from 'express';
import { updateBranch } from './branch.controller.js';

const router = express.Router();

router.patch('/:branchId', updateBranch);

export default router;
