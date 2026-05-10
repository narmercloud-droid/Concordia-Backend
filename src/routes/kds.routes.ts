import { Router } from "express";
import { KDSController } from "../controllers/kds/kds.controller";
import { validateKDSToken } from "../middleware/kdsAuth";
import { validate } from "../middleware/validate";
import { loginKDSSchema } from "../schemas/kdsSchemas";

const router = Router();

router.post("/login", validate(loginKDSSchema), KDSController.login);
router.get("/orders", validateKDSToken, KDSController.getOrders);
router.patch("/orders/:order_id/preparing", validateKDSToken, KDSController.startPreparing);
router.patch("/orders/:order_id/ready", validateKDSToken, KDSController.markReady);
router.patch("/orders/:order_id/completed", validateKDSToken, KDSController.completeOrder);

export default router;