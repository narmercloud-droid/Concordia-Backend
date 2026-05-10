"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cart_controller_1 = require("../../controllers/cart/cart.controller");
const router = (0, express_1.Router)();
// Load or create cart
router.get("/load", cart_controller_1.CartController.loadCart);
// Get full cart
router.get("/:cartId", cart_controller_1.CartController.getCart);
// Add item
router.post("/:cartId/item", cart_controller_1.CartController.addItem);
// Add variant/topping/extra
router.post("/item/:cartItemId/variant", cart_controller_1.CartController.addVariant);
router.post("/item/:cartItemId/topping", cart_controller_1.CartController.addTopping);
router.post("/item/:cartItemId/extra", cart_controller_1.CartController.addExtra);
// Update quantity
router.put("/item/:cartItemId/quantity", cart_controller_1.CartController.updateQuantity);
// Remove item
router.delete("/item/:cartItemId", cart_controller_1.CartController.removeItem);
exports.default = router;
