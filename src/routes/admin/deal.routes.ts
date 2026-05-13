import { Router } from "express";
import { DealController } from "../../controllers/admin/deal.controller.js";
import { verifyAdmin } from "../../middleware/auth.js";

const router = Router();

router.get("/", verifyAdmin, DealController.getAll);
router.get("/:id", verifyAdmin, DealController.getById);
router.post("/", verifyAdmin, DealController.create);
router.put("/:id", verifyAdmin, DealController.update);
router.delete("/:id", verifyAdmin, DealController.remove);

export default router;
