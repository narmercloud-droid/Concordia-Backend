import { Router } from "express";
import { VariantController } from "../../controllers/admin/variant.controller";
import { verifyAdmin } from "../../middleware/auth";

const router = Router();

router.get("/", verifyAdmin, VariantController.getAll);
router.get("/:id", verifyAdmin, VariantController.getById);
router.post("/", verifyAdmin, VariantController.create);
router.put("/:id", verifyAdmin, VariantController.update);
router.delete("/:id", verifyAdmin, VariantController.remove);

export default router;
