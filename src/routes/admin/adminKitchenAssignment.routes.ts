import express from "express";
const { Router } = express;
import { adminAuth } from "../../middleware/adminAuth.ts";
import { updateKitchenAssignment } from "../../controllers/admin/adminKitchenAssignment.controller.ts";

const router = Router();

router.put("/item/:itemId/kitchen", adminAuth, updateKitchenAssignment);

export default router;

