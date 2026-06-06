import express from "express";
const { Router } = express;
import { ItemController } from "../../controllers/admin/item.controller.ts";
import { verifyAdmin } from "../../middleware/auth.ts";

const router = Router();

router.get("/", verifyAdmin, ItemController.getAll);
router.get("/:id", verifyAdmin, ItemController.getById);
router.post("/", verifyAdmin, ItemController.create);
router.put("/:id", verifyAdmin, ItemController.update);
router.delete("/:id", verifyAdmin, ItemController.remove);

export default router;







