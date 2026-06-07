import express from "express";
const { Router } = express;
import { adminAuth } from "../../middleware/adminAuth.ts";
import { requireSuperAdmin } from "../../middleware/requireSuperAdmin.ts";
import {
  createStaffMember,
  getPermissions,
  getStaffList,
  listAllBranches,
  removeStaffMember,
  updatePermissions,
  updateStaffMember
} from "../../controllers/superAdmin/superAdmin.controller.ts";

const router = Router();

router.use(adminAuth, requireSuperAdmin);

router.get("/permissions", getPermissions);
router.put("/permissions", updatePermissions);
router.get("/staff", getStaffList);
router.post("/staff", createStaffMember);
router.put("/staff/:id", updateStaffMember);
router.delete("/staff/:id", removeStaffMember);
router.get("/branches", listAllBranches);

export default router;
