import express from 'express';
import { rateDriver } from './rating.controller.js';

const router = express.Router();

router.post('/rate', rateDriver);

export default router;
