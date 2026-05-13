import { Router } from "express";
import { adminAuth } from "../middleware/adminAuth.js";
import { adminRole } from "../middleware/adminRole.js";
import { MenuController } from "../controllers/menu.controller.js";

const router = Router();

// Managers + superadmin can create/delete/update menu items
router.post("/", adminAuth, adminRole("manager"), MenuController.createItem);
router.put("/:id", adminAuth, adminRole("manager"), MenuController.updateItem);
router.delete("/:id", adminAuth, adminRole("manager"), MenuController.deleteItem);

export default router;

