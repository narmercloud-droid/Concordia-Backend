import { Router } from "express";
import { CartController } from "../controllers/cart.controller.js";
import { customerAuth } from "../middleware/customerAuth.js";
const router = Router();
router.post("/checkout", customerAuth, CartController.checkout);
export default router;
