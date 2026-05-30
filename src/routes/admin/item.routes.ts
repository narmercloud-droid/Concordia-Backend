import { Router } from "express";
import { ItemController } from "../../controllers/admin/item.controller.js";
import { verifyAdmin } from "../../middleware/auth.js";

const router = Router();

router.get("/", verifyAdmin, ItemController.getAll);
router.get("/:id", verifyAdmin, ItemController.getById);
router.post("/", verifyAdmin, ItemController.create);
router.put("/:id", verifyAdmin, ItemController.update);
router.delete("/:id", verifyAdmin, ItemController.remove);

export default router;







