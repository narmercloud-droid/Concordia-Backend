"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const relation_controller_1 = require("../../controllers/admin/relation.controller");
const auth_1 = require("../../middleware/auth");
const router = (0, express_1.Router)();
// Get all relations for an item
router.get("/:itemId", auth_1.verifyAdmin, relation_controller_1.RelationController.getItemRelations);
// Add relations
router.post("/:itemId/variant", auth_1.verifyAdmin, relation_controller_1.RelationController.addVariant);
router.post("/:itemId/topping", auth_1.verifyAdmin, relation_controller_1.RelationController.addTopping);
router.post("/:itemId/extra", auth_1.verifyAdmin, relation_controller_1.RelationController.addExtra);
// Remove relations
router.delete("/:itemId/variant/:variantId", auth_1.verifyAdmin, relation_controller_1.RelationController.removeVariant);
router.delete("/:itemId/topping/:toppingId", auth_1.verifyAdmin, relation_controller_1.RelationController.removeTopping);
router.delete("/:itemId/extra/:extraId", auth_1.verifyAdmin, relation_controller_1.RelationController.removeExtra);
exports.default = router;
