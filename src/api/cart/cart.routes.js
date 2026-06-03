import express from 'express';
import { addCartItem, getCart, removeCartItem } from './cart.controller.js';

const router = express.Router();

router.post('/add', addCartItem);
router.get('/:orderId', getCart);
router.delete('/:cartItemId', removeCartItem);

export default router;
