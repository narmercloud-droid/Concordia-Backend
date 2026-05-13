import { Router } from "express";
import { MenuController } from "../controllers/menu.controller.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { adminRole } from "../middleware/adminRole.js";
const router = Router();
// Customer menu browsing
router.get("/", MenuController.listMenu);
// Manager + superadmin
router.post("/category", adminAuth, adminRole("manager"), MenuController.createCategory);
router.put("/category/:id", adminAuth, adminRole("manager"), MenuController.updateCategory);
router.delete("/category/:id", adminAuth, adminRole("manager"), MenuController.deleteCategory);
router.post("/item", adminAuth, adminRole("manager"), MenuController.createItem);
router.put("/item/:id", adminAuth, adminRole("manager"), MenuController.updateItem);
router.delete("/item/:id", adminAuth, adminRole("manager"), MenuController.deleteItem);
router.post("/variant", adminAuth, adminRole("manager"), MenuController.createVariant);
router.put("/variant/:id", adminAuth, adminRole("manager"), MenuController.updateVariant);
router.delete("/variant/:id", adminAuth, adminRole("manager"), MenuController.deleteVariant);
router.post("/addon-group", adminAuth, adminRole("manager"), MenuController.createAddOnGroup);
router.put("/addon-group/:id", adminAuth, adminRole("manager"), MenuController.updateAddOnGroup);
router.delete("/addon-group/:id", adminAuth, adminRole("manager"), MenuController.deleteAddOnGroup);
router.post("/addon", adminAuth, adminRole("manager"), MenuController.createAddOn);
router.put("/addon/:id", adminAuth, adminRole("manager"), MenuController.updateAddOn);
router.delete("/addon/:id", adminAuth, adminRole("manager"), MenuController.deleteAddOn);
// Terminal sold-out controls
router.put("/item/:id/availability", MenuController.setItemAvailability);
router.put("/variant/:id/availability", MenuController.setVariantAvailability);
router.put("/addon/:id/availability", MenuController.setAddOnAvailability);
export default router;
