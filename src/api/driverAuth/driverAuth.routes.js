import express from 'express';
import { driverLogin, driverMe } from './driverAuth.controller.js';
import { driverAuthMiddleware } from '../../middleware/driverAuth.js';

const router = express.Router();

router.post('/login', driverLogin);
router.get('/me', driverAuthMiddleware, driverMe);

export default router;
