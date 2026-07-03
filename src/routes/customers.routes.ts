import express from "express";
const { Router } = express;
import { CustomersController } from "../controllers/customers.controller.ts";
import { CustomerCouponsController } from "../controllers/customerCoupons.controller.ts";
import { customerAuth } from "../middleware/customerAuth.ts";

const router = Router();

// Auth
router.post("/register", CustomersController.register);
router.post("/login", CustomersController.login);
router.post("/refresh", CustomersController.refresh);

// Profile
router.get("/me", customerAuth, CustomersController.profile);
router.get("/profile", customerAuth, CustomersController.profile);
router.get("/orders", customerAuth, CustomersController.myOrders);
router.put("/phone", customerAuth, CustomersController.updatePhone);
router.get("/me/export", customerAuth, CustomersController.exportData);
router.delete("/me", customerAuth, CustomersController.deleteAccount);

// Addresses
router.post("/addresses", customerAuth, CustomersController.addAddress);
router.get("/addresses", customerAuth, CustomersController.listAddresses);
router.get("/addresses/:id", customerAuth, CustomersController.getAddress);
router.put("/addresses/:id", customerAuth, CustomersController.updateAddress);
router.delete("/addresses/:id", customerAuth, CustomersController.deleteAddress);

// Clickable coupons (wallet)
router.get("/coupons", customerAuth, CustomerCouponsController.listMine);
router.get("/coupons/available", customerAuth, CustomerCouponsController.listAvailable);
router.post("/coupons/claim/:campaignId", customerAuth, CustomerCouponsController.claim);
router.post("/coupons/:id/activate", customerAuth, CustomerCouponsController.activate);
router.post("/coupons/validate", customerAuth, CustomerCouponsController.validateForCheckout);

export default router;








