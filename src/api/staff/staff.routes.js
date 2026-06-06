import express from 'express';
import { createStaff, updateStaff } from './staff.controller.js';

const router = express.Router();

router.post('/', createStaff);
router.patch('/:staffId', updateStaff);

export default router;
