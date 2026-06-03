import express from "express";
const { Router } = express;
import { adminAuth } from "../../middleware/adminAuth.js";
import { updateKitchenAssignment } from "../../controllers/admin/adminKitchenAssignment.controller.js";
const router = Router();
router.put("/item/:itemId/kitchen", adminAuth, updateKitchenAssignment);
export default router;
