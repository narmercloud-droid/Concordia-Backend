import { Router } from "express";
import { FavoritesController } from "../controllers/favorites.controller.js";
import { customerAuth } from "../middleware/customerAuth.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { adminRole } from "../middleware/adminRole.js";
const router = Router();
// Customer
router.post("/add", customerAuth, FavoritesController.add);
router.post("/remove", customerAuth, FavoritesController.remove);
router.get("/list", customerAuth, FavoritesController.list);
// Manager analytics
router.get("/analytics/most-favorited", adminAuth, adminRole("manager"), FavoritesController.mostFavorited);
export default router;
