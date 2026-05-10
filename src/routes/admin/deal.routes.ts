import { Router } from "express";
import { DealController } from "../../controllers/admin/deal.controller";
import { verifyAdmin } from "../../middleware/auth";

const router = Router();

router.get("/", verifyAdmin, DealController.getAll);
router.get("/:id", verifyAdmin, DealController.getById);
router.post("/", verifyAdmin, DealController.create);
router.put("/:id", verifyAdmin, DealController.update);
router.delete("/:id", verifyAdmin, DealController.remove);

// Deal items
router.post("/:dealId/item", verifyAdmin, DealController.addItem);
router.delete("/:dealId/item/:itemId", verifyAdmin, DealController.removeItem);

export default router;
