import express from 'express';
import { adminAuthMiddleware } from '../../middleware/adminAuth.js';
import {
  getGlobalSettings,
  updateGlobalSettings
} from './adminSettings.controller.js';

const router = express.Router();

router.get('/', adminAuthMiddleware, getGlobalSettings);
router.patch('/', adminAuthMiddleware, updateGlobalSettings);

export default router;
