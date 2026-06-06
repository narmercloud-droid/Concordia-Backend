import express from 'express';
import { customerAuthMiddleware } from '../../middleware/customerAuth.js';
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress
} from './customerAddresses.controller.js';

const router = express.Router();

router.get('/', customerAuthMiddleware, getAddresses);
router.post('/', customerAuthMiddleware, createAddress);
router.patch('/:addressId', customerAuthMiddleware, updateAddress);
router.delete('/:addressId', customerAuthMiddleware, deleteAddress);

export default router;
