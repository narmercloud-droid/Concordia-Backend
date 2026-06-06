import express from 'express';
import { saveSubscription } from './push.controller.js';

const router = express.Router();

router.post('/subscribe', saveSubscription);

export default router;
