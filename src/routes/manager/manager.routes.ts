import express from "express";
const { Router } = express;
import { adminAuth } from "../../middleware/adminAuth.ts";
import { managerAccess } from "../../middleware/managerAccess.ts";
import { requireManagerPermission } from "../../middleware/requireManagerPermission.ts";
import {
  getBranch,
  getHours,
  updateHours,
  getConfig,
  updateDeliveryAreas,
  updateDeliverySettings,
  getMenu,
  updateMenuItem,
  updateVariantGroup,
  getOrders,
  getDashboard,
  getPromotions,
  updatePromotions
} from "../../controllers/manager/manager.controller.ts";
import { getSession } from "../../controllers/manager/managerSession.controller.ts";
import {
  getMenuItemDetail,
  createCategory,
  updateCategory,
  deleteCategory,
  createMenuItem,
  updateMenuItemFull,
  deleteMenuItem,
  createVariantGroupHandler,
  updateVariantGroupFull,
  deleteVariantGroupHandler,
  createVariantHandler,
  updateVariantHandler,
  deleteVariantHandler,
  createAddOnGroupHandler,
  updateAddOnGroupHandler,
  deleteAddOnGroupHandler,
  createAddOnHandler,
  updateAddOnHandler,
  deleteAddOnHandler
} from "../../controllers/manager/managerMenu.controller.ts";
import {
  exportCustomers,
  getCustomerOrders,
  getCustomers,
  runBranchAutomation
} from "../../controllers/manager/branchCustomers.controller.ts";

const router = Router();

router.use(adminAuth, managerAccess);

router.get("/session", getSession);
router.get("/branch", getBranch);
router.get("/dashboard", requireManagerPermission("dashboard"), getDashboard);
router.get("/hours", requireManagerPermission("hours_view"), getHours);
router.put("/hours", requireManagerPermission("hours_edit"), updateHours);
router.get("/config", requireManagerPermission("delivery_view"), getConfig);
router.patch(
  "/config/delivery-areas",
  requireManagerPermission("delivery_edit"),
  updateDeliveryAreas
);
router.patch(
  "/config/delivery-settings",
  requireManagerPermission("delivery_edit"),
  updateDeliverySettings
);
router.get("/menu", requireManagerPermission("menu_view"), getMenu);
router.get("/menu/items/:menuItemId/detail", requireManagerPermission("menu_view"), getMenuItemDetail);
router.post("/menu/categories", createCategory);
router.patch("/menu/categories/:id", updateCategory);
router.delete("/menu/categories/:id", deleteCategory);
router.post("/menu/items", createMenuItem);
router.patch("/menu/items/:id", updateMenuItem);
router.patch("/menu/items/:id/full", updateMenuItemFull);
router.delete("/menu/branch-items/:branchMenuItemId", deleteMenuItem);
router.patch(
  "/menu/variant-groups/:groupId",
  requireManagerPermission("menu_edit_prices"),
  updateVariantGroup
);
router.patch("/menu/variant-groups/:groupId/full", updateVariantGroupFull);
router.delete("/menu/variant-groups/:groupId", deleteVariantGroupHandler);
router.post("/menu/items/:menuItemId/variant-groups", createVariantGroupHandler);
router.post("/menu/variant-groups/:groupId/variants", createVariantHandler);
router.patch("/menu/variants/:variantId", updateVariantHandler);
router.delete("/menu/variants/:variantId", deleteVariantHandler);
router.post("/menu/items/:menuItemId/addon-groups", createAddOnGroupHandler);
router.patch("/menu/addon-groups/:groupId", updateAddOnGroupHandler);
router.delete("/menu/addon-groups/:groupId", deleteAddOnGroupHandler);
router.post("/menu/addon-groups/:groupId/addons", createAddOnHandler);
router.patch("/menu/addons/:addOnId", updateAddOnHandler);
router.delete("/menu/addons/:addOnId", deleteAddOnHandler);
router.get("/orders", requireManagerPermission("orders"), getOrders);
router.get("/promotions", requireManagerPermission("offers_view"), getPromotions);
router.patch("/promotions", requireManagerPermission("offers_edit"), updatePromotions);
router.get("/customers", requireManagerPermission("customers_view"), getCustomers);
router.get(
  "/customers/export",
  requireManagerPermission("customers_export"),
  exportCustomers
);
router.get(
  "/customers/:phone/orders",
  requireManagerPermission("customers_view"),
  getCustomerOrders
);
router.post(
  "/customers/automation/run",
  requireManagerPermission("customers_automation"),
  runBranchAutomation
);

export default router;
