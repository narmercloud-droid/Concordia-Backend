import { Router } from "express";
import { CartController } from "../../controllers/cart/cart.controller";

const router = Router();

// Load or create cart
router.get("/load", CartController.loadCart);

// Get full cart
router.get("/:cartId", CartController.getCart);

// Add item
router.post("/:cartId/item", CartController.addItem);

// Add variant/topping/extra
router.post("/item/:cartItemId/variant", CartController.addVariant);
router.post("/item/:cartItemId/topping", CartController.addTopping);
router.post("/item/:cartItemId/extra", CartController.addExtra);

// Update quantity
router.put("/item/:cartItemId/quantity", CartController.updateQuantity);

// Remove item
router.delete("/item/:cartItemId", CartController.removeItem);

export default router;
