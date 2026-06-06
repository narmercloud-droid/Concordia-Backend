import express from 'express';
import { health, deepHealth } from './health.controller.js';

const router = express.Router();

router.get('/', health);
router.get('/deep', deepHealth);

export default router;
