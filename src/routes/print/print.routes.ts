import { Router } from "express";
import { PrintController } from "../../controllers/print/print.controller";

const router = Router();

router.post("/order/:id", PrintController.printOrder);

export default router;
