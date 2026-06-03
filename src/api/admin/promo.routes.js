import express from 'express';
import { createPromo, updatePromo, listPromos, deletePromo } from './promo.controller.js';

const router = express.Router();

router.get('/', listPromos);
router.post('/', createPromo);
router.put('/:promoId', updatePromo);
router.delete('/:promoId', deletePromo);

export default router;
