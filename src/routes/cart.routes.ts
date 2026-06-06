import express from "express";
const { Router } = express;
import { CartController } from "../controllers/cart.controller.ts";
import { customerAuth } from "../middleware/customerAuth.ts";

const router = Router();

router.post("/checkout", customerAuth, CartController.checkout);

export default router;








