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
// Terminal sold-out controls
router.put("/item/:id/availability", MenuController.setItemAvailability);
router.put("/variant/:id/availability", MenuController.setVariantAvailability);
export default router;
