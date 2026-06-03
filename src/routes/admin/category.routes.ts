import express from "express";
const { Router } = express;
import { CategoryController } from "../../controllers/admin/category.controller.ts";
import { verifyAdmin } from "../../middleware/auth.ts";

const router = Router();

router.get("/", verifyAdmin, CategoryController.getAll);
router.get("/:id", verifyAdmin, CategoryController.getById);
router.post("/", verifyAdmin, CategoryController.create);
router.put("/:id", verifyAdmin, CategoryController.update);
router.delete("/:id", verifyAdmin, CategoryController.remove);

export default router;







