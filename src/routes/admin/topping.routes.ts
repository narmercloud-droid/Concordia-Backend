import { Router } from "express";
import { ToppingController } from "../../controllers/admin/topping.controller";
import { verifyAdmin } from "../../middleware/auth";

const router = Router();

router.get("/", verifyAdmin, ToppingController.getAll);
router.get("/:id", verifyAdmin, ToppingController.getById);
router.post("/", verifyAdmin, ToppingController.create);
router.put("/:id", verifyAdmin, ToppingController.update);
router.delete("/:id", verifyAdmin, ToppingController.remove);

export default router;
