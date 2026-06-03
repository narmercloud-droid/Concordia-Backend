import express from 'express';
import { createCategory, updateCategory, deleteCategory, createItem, updateItem, deleteItem, uploadCategoryImage, uploadItemImage } from './menu.controller.js';
import { uploadImage } from '../../middleware/uploadImage.js';

const router = express.Router();

router.post('/category', createCategory);
router.put('/category/:categoryId', updateCategory);
router.delete('/category/:categoryId', deleteCategory);

router.post('/item', createItem);
router.put('/item/:itemId', updateItem);
router.delete('/item/:itemId', deleteItem);

router.post('/category/:categoryId/image', uploadImage.single('image'), uploadCategoryImage);
router.post('/item/:itemId/image', uploadImage.single('image'), uploadItemImage);

export default router;
