import express from "express";
const { Router } = express;
import { RelationController } from "../../controllers/admin/relation.controller.ts";
import { verifyAdmin } from "../../middleware/auth.ts";

const router = Router();

router.get("/:itemId", verifyAdmin, RelationController.getItemRelations);

export default router;





