import express from 'express';
import { adminAuthMiddleware } from '../../middleware/adminAuth.js';
import { getPlatformAnalytics } from './adminAnalytics.controller.js';

const router = express.Router();

router.get('/', adminAuthMiddleware, getPlatformAnalytics);

export default router;
