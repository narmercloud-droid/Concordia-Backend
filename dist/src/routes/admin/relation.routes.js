import { Router } from "express";
import { RelationController } from "../../controllers/admin/relation.controller.js";
import { verifyAdmin } from "../../middleware/auth.js";
const router = Router();
// Get all relations for an item
router.get("/:itemId", verifyAdmin, RelationController.getItemRelations);
// Add relations
router.post("/:itemId/variant", verifyAdmin, RelationController.addVariant);
router.post("/:itemId/topping", verifyAdmin, RelationController.addTopping);
router.post("/:itemId/extra", verifyAdmin, RelationController.addExtra);
// Remove relations
router.delete("/:itemId/variant/:variantId", verifyAdmin, RelationController.removeVariant);
router.delete("/:itemId/topping/:toppingId", verifyAdmin, RelationController.removeTopping);
router.delete("/:itemId/extra/:extraId", verifyAdmin, RelationController.removeExtra);
export default router;
