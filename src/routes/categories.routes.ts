import express from "express";
const { Router } = express;
import { adminAuth } from "../middleware/adminAuth.ts";
import { adminRole } from "../middleware/adminRole.ts";
import { CategoryController } from "../controllers/admin/category.controller.ts";

const router = Router();

// Managers + superadmin can create/delete/update categories
router.post("/", adminAuth, adminRole("manager"), CategoryController.create);
router.put("/:id", adminAuth, adminRole("manager"), CategoryController.update);
router.delete("/:id", adminAuth, adminRole("manager"), CategoryController.remove);

export default router;







