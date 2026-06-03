import { Router } from 'express';
import * as categoriesCtrl from './categories.controller.js';
import * as itemsCtrl from './items.controller.js';
import * as overridesCtrl from './overrides.controller.js';
import * as extrasCtrl from './extras.controller.js';
import * as notesCtrl from './notes.controller.js';

const router = Router({ mergeParams: true });

// Categories
router.post('/categories', categoriesCtrl.createCategory);
router.put('/categories/:categoryId', categoriesCtrl.updateCategory);
router.delete('/categories/:categoryId', categoriesCtrl.deleteCategory);

// Items (global + branch override on create)
router.post('/items', itemsCtrl.createMenuItem);
router.put('/items/:itemId', itemsCtrl.updateMenuItem);
router.delete('/items/:itemId', itemsCtrl.deleteMenuItem);

// Overrides (branch-specific operations)
router.put('/items/:itemId/price', overridesCtrl.updatePrice);
router.put('/items/:itemId/availability', overridesCtrl.updateAvailability);
router.put('/items/:itemId/description', overridesCtrl.updateDescription);
router.put('/items/:itemId/image', overridesCtrl.updateImage);

// Extras
router.post('/items/:itemId/extras', extrasCtrl.addExtra);
router.put('/items/:itemId/extras/:extraId', extrasCtrl.updateExtra);
router.delete('/items/:itemId/extras/:extraId', extrasCtrl.deleteExtra);

// Notes
router.post('/items/:itemId/notes', notesCtrl.addNote);
router.delete('/items/:itemId/notes/:noteId', notesCtrl.deleteNote);

export default router;
