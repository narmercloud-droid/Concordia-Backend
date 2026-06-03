import express from 'express';
import {
  getMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} from './menu.controller.js';

const router = express.Router();

router.get('/', getMenu);
router.post('/', createMenuItem);
router.patch('/:itemId', updateMenuItem);
router.delete('/:itemId', deleteMenuItem);

export default router;
