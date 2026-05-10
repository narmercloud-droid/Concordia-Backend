"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const deal_controller_1 = require("../../controllers/admin/deal.controller");
const auth_1 = require("../../middleware/auth");
const router = (0, express_1.Router)();
router.get("/", auth_1.verifyAdmin, deal_controller_1.DealController.getAll);
router.get("/:id", auth_1.verifyAdmin, deal_controller_1.DealController.getById);
router.post("/", auth_1.verifyAdmin, deal_controller_1.DealController.create);
router.put("/:id", auth_1.verifyAdmin, deal_controller_1.DealController.update);
router.delete("/:id", auth_1.verifyAdmin, deal_controller_1.DealController.remove);
// Deal items
router.post("/:dealId/item", auth_1.verifyAdmin, deal_controller_1.DealController.addItem);
router.delete("/:dealId/item/:itemId", auth_1.verifyAdmin, deal_controller_1.DealController.removeItem);
exports.default = router;
