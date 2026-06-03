import express from 'express';
import { fetchCustomerMenu } from './customerMenu.controller.js';

const router = express.Router();

router.get('/:branchId', fetchCustomerMenu);

export default router;
