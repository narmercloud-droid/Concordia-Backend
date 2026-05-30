import { Router } from "express";
import { ExtraController } from "../../controllers/admin/extra.controller.js";
import { verifyAdmin } from "../../middleware/auth.js";

const router = Router();

router.get("/", verifyAdmin, ExtraController.getAll);
router.get("/:id", verifyAdmin, ExtraController.getById);
router.post("/", verifyAdmin, ExtraController.create);
router.put("/:id", verifyAdmin, ExtraController.update);
router.delete("/:id", verifyAdmin, ExtraController.remove);

export default router;







