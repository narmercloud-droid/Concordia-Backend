import express from 'express';
import {
  createVariantGroup, updateVariantGroup, deleteVariantGroup,
  createVariant, updateVariant, deleteVariant,
  createAddOnGroup, updateAddOnGroup, deleteAddOnGroup,
  createAddOn, updateAddOn, deleteAddOn
} from './variantAddon.controller.js';

const router = express.Router();

// Variant Groups
router.post('/variant-group', createVariantGroup);
router.put('/variant-group/:groupId', updateVariantGroup);
router.delete('/variant-group/:groupId', deleteVariantGroup);

// Variants
router.post('/variant', createVariant);
router.put('/variant/:variantId', updateVariant);
router.delete('/variant/:variantId', deleteVariant);

// Add‑On Groups
router.post('/addon-group', createAddOnGroup);
router.put('/addon-group/:groupId', updateAddOnGroup);
router.delete('/addon-group/:groupId', deleteAddOnGroup);

// Add‑Ons
router.post('/addon', createAddOn);
router.put('/addon/:addonId', updateAddOn);
router.delete('/addon/:addonId', deleteAddOn);

export default router;
