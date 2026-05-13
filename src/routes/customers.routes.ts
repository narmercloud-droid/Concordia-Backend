import { Router } from "express";
import { CustomersController } from "../controllers/customers.controller.js";
import { customerAuth } from "../middleware/customerAuth.js";

const router = Router();

// Auth
router.post("/register", CustomersController.register);
router.post("/login", CustomersController.login);
router.post("/refresh", CustomersController.refresh);

// Profile
router.get("/profile", customerAuth, CustomersController.profile);

// Addresses
router.post("/addresses", customerAuth, CustomersController.addAddress);
router.get("/addresses", customerAuth, CustomersController.listAddresses);
router.delete("/addresses/:id", customerAuth, CustomersController.deleteAddress);

export default router;


