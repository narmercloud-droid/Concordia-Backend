import express from "express";
const { Router } = express;
import { adminAuth } from "../middleware/adminAuth.ts";
import { adminRole } from "../middleware/adminRole.ts";
import { MenuController } from "../controllers/menu.controller.ts";

const router = Router();

// Managers + superadmin can create/delete/update menu items
router.post("/", adminAuth, adminRole("manager"), MenuController.createItem);
router.put("/:id", adminAuth, adminRole("manager"), MenuController.updateItem);
router.delete("/:id", adminAuth, adminRole("manager"), MenuController.deleteItem);

export default router;







