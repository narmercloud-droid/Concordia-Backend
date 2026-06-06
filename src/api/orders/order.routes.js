import express from 'express';
import { createOrder } from './order.controller.js';
import { validate } from '../../middleware/validate.js';
import { createOrderSchema } from '../../validation/order.validation.js';

const router = express.Router();
router.post('/', validate(createOrderSchema), createOrder);

export default router;
