import { Router } from "express";
import { handleAdminLogin } from "./authController";

const router = Router();

router.post("/login", handleAdminLogin);

export default router;
