import express from 'express';
import { fetchSettings, saveSettings } from './loyaltySettings.controller.js';

const router = express.Router();

router.get('/', fetchSettings);
router.put('/', saveSettings);

export default router;
