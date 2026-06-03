import express from 'express';
import { driverRegister, driverLogin } from './driverAuth.controller.js';

const router = express.Router();

router.post('/register', driverRegister);
router.post('/login', driverLogin);

export default router;
