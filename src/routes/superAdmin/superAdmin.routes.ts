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
  updateBranchStatus,
  updateBranchSettings,
  getBranchSettings,
  getPlatformSettings,
  updatePlatformSettings,
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
router.put("/branches/:branchId/status", updateBranchStatus);
router.get("/branches/:branchId/settings", getBranchSettings);
router.put("/branches/:branchId/settings", updateBranchSettings);
router.get("/platform-settings", getPlatformSettings);
router.put("/platform-settings", updatePlatformSettings);

export default router;
