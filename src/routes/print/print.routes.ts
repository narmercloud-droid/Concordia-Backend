import express from "express";
const { Router } = express;
import { PrintController } from "../../controllers/print/print.controller.ts";

const router = Router();

router.post("/order/:id", PrintController.printOrder);

export default router;







