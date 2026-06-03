import express from 'express';
import { getBranchDashboard } from './managerDashboard.controller.js';

const router = express.Router();

router.get('/dashboard/:branchId', getBranchDashboard);

export default router;
