import { Router } from "express";
import { MenuController } from "../controllers/menu.controller";

const router = Router();

router.get("/menu", MenuController.getMenu);

export default router;
