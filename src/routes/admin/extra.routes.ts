import express from "express";
const { Router } = express;
import { ExtraController } from "../../controllers/admin/extra.controller.ts";
import { verifyAdmin } from "../../middleware/auth.ts";

const router = Router();

router.get("/", verifyAdmin, ExtraController.getAll);
router.get("/:id", verifyAdmin, ExtraController.getById);
router.post("/", verifyAdmin, ExtraController.create);
router.put("/:id", verifyAdmin, ExtraController.update);
router.delete("/:id", verifyAdmin, ExtraController.remove);

export default router;







