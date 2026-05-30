import { Router } from "express";
import { AddressController } from "../controllers/address.controller.js";
import { customerAuth } from "../middleware/customerAuth.js";

const router = Router();

router.post("/", customerAuth, AddressController.add);
router.put("/:id", customerAuth, AddressController.update);
router.delete("/:id", customerAuth, AddressController.delete);
router.get("/", customerAuth, AddressController.list);

export default router;






