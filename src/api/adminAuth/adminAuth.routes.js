import express from 'express';
import { adminLogin, adminMe } from './adminAuth.controller.js';
import { adminAuthMiddleware } from '../../middleware/adminAuth.js';

const router = express.Router();

router.post('/login', adminLogin);
router.get('/me', adminAuthMiddleware, adminMe);

export default router;
