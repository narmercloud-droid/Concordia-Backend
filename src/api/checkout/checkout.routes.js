import express from 'express';
import { validateCheckout } from './checkout.controller.js';

const router = express.Router();
router.post('/validate', validateCheckout);

export default router;
