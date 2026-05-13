import { Router } from "express";
import { adminAuth } from "../middleware/adminAuth.js";
import { adminRole } from "../middleware/adminRole.js";
import { CategoryController } from "../controllers/admin/category.controller.js";
const router = Router();
// Managers + superadmin can create/delete/update categories
router.post("/", adminAuth, adminRole("manager"), CategoryController.create);
router.put("/:id", adminAuth, adminRole("manager"), CategoryController.update);
router.delete("/:id", adminAuth, adminRole("manager"), CategoryController.delete);
export default router;
