import { Router } from "express";
import { RelationController } from "../../controllers/admin/relation.controller.js";
import { verifyAdmin } from "../../middleware/auth.js";

const router = Router();

router.get("/:itemId", verifyAdmin, RelationController.getItemRelations);

export default router;





