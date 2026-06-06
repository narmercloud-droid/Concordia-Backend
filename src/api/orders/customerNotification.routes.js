import express from 'express';
import { registerCustomerNotification } from './customerNotification.controller.js';

const router = express.Router();

router.post('/register', registerCustomerNotification);

export default router;
