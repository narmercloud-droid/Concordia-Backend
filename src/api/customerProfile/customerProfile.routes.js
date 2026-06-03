import express from 'express';
import { customerAuthMiddleware } from '../../middleware/customerAuth.js';
import {
  getCustomerProfile,
  updateCustomerProfile
} from './customerProfile.controller.js';

const router = express.Router();

router.get('/', customerAuthMiddleware, getCustomerProfile);
router.patch('/', customerAuthMiddleware, updateCustomerProfile);

export default router;
