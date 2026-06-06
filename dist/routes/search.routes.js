import express from "express";
const { Router } = express;
import { SearchController } from "../controllers/search.controller.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { adminRole } from "../middleware/adminRole.js";
const router = Router();
// Public search
router.get("/menu", SearchController.menu);
router.get("/branches", SearchController.branches);
router.get("/categories", SearchController.categories);
// Manager analytics
router.get("/analytics/top", adminAuth, adminRole("manager"), SearchController.topSearches);
export default router;
