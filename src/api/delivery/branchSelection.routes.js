import express from 'express';
import { selectBranch } from './branchSelection.controller.js';

const router = express.Router();
router.post('/select-branch', selectBranch);
export default router;
