import { Router } from "express";
import { AdminController } from "../controllers/admins.controller.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { adminRole } from "../middleware/adminRole.js";

const router = Router();

// Only superadmin can create admins
router.post("/", adminAuth, adminRole("superadmin"), AdminController.create);

// Login + refresh
router.post("/login", AdminController.login);
router.post("/refresh", AdminController.refresh);

// Only superadmin can list admins
router.get("/", adminAuth, adminRole("superadmin"), AdminController.list);

// Only superadmin can view admin details
router.get("/:id", adminAuth, adminRole("superadmin"), AdminController.getById);

// Only superadmin can update admins
router.put("/:id", adminAuth, adminRole("superadmin"), AdminController.update);

// Only superadmin can delete admins
router.delete("/:id", adminAuth, adminRole("superadmin"), AdminController.delete);

export default router;


