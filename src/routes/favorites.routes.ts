import express from "express";
const { Router } = express;
import { FavoritesController } from "../controllers/favorites.controller.ts";
import { customerAuth } from "../middleware/customerAuth.ts";
import { adminAuth } from "../middleware/adminAuth.ts";
import { adminRole } from "../middleware/adminRole.ts";

const router = Router();

// Customer
router.post("/add", customerAuth, FavoritesController.add);
router.post("/remove", customerAuth, FavoritesController.remove);
router.get("/list", customerAuth, FavoritesController.list);

// Manager analytics
router.get(
  "/analytics/most-favorited",
  adminAuth,
  adminRole("manager"),
  FavoritesController.mostFavorited
);

export default router;







