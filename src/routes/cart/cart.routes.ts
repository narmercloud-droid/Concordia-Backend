import express from "express";
const { Router } = express;
import { CartController } from "../../controllers/cart/cart.controller.ts";

const router = Router();

router.get("/load", CartController.loadCart);
router.get("/:cartId", CartController.getCart);
router.post("/:cartId/item", CartController.addItem);
router.put("/item/:cartItemId/quantity", CartController.updateQuantity);
router.delete("/item/:cartItemId", CartController.removeItem);

export default router;






