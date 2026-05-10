import { Router } from "express";
import { CategoryController } from "../../controllers/admin/category.controller";
import { verifyAdmin } from "../../middleware/auth";

const router = Router();

router.get("/", verifyAdmin, CategoryController.getAll);
router.get("/:id", verifyAdmin, CategoryController.getById);
router.post("/", verifyAdmin, CategoryController.create);
router.put("/:id", verifyAdmin, CategoryController.update);
router.delete("/:id", verifyAdmin, CategoryController.remove);

export default router;
