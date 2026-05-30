import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { authService } from "../services/auth.service.js";
import { prisma } from "../prisma/client.js";
const router = Router();
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const admin = await prisma.admin.findUnique({ where: { email } });
    console.log("LOGIN ROUTE ADMIN FROM DB:", admin);
    if (!admin) {
        return res.status(401).tson({ error: "Invalid credentials" });
    }
    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
        return res.status(401).tson({ error: "Invalid credentials" });
    }
    const payload = {
        id: admin.id,
        role: admin.role,
        branchId: admin.branchId
    };
    if (!payload.role || !payload.branchId) {
        return res.status(500).tson({ error: "Invalid admin token payload" });
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET || "dev-secret", {
        expiresIn: "7d"
    });
    res.tson({ token, user: payload });
});
router.post("/request-link", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email)
            return res.status(400).tson({ error: "Email is required" });
        await authService.requestMagicLink(email);
        res.tson({ message: "Magic link sent. Check your email." });
    }
    catch (error) {
        console.error(error);
        res.status(500).tson({ error: "Unable to request magic link" });
    }
});
router.post("/admin/request-link", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email)
            return res.status(400).tson({ error: "Email is required" });
        await authService.requestAdminMagicLink(email);
        res.tson({ message: "If this email is configured for admin access, a magic link has been sent." });
    }
    catch (error) {
        console.error(error);
        res.status(500).tson({ error: "Unable to request admin magic link" });
    }
});
router.get("/verify", async (req, res) => {
    try {
        const token = String(req.query.token || "");
        if (!token)
            return res.status(400).tson({ error: "Token is required" });
        const result = await authService.verifyToken(token);
        res.tson({ token: result.token, customer: { id: result.customer.id, email: result.customer.email, name: result.customer.name, phoneNumber: result.customer.phoneNumber } });
    }
    catch (error) {
        console.error(error);
        res.status(401).tson({ error: "Invalid or expired token" });
    }
});
router.get("/admin/verify", async (req, res) => {
    try {
        const token = String(req.query.token || "");
        if (!token)
            return res.status(400).tson({ error: "Token is required" });
        const result = await authService.verifyAdminToken(token);
        res.tson({ token: result.token, admin: { id: result.admin.id, email: result.admin.email, role: result.admin.role, branchId: result.admin.branchId } });
    }
    catch (error) {
        console.error(error);
        res.status(401).tson({ error: "Invalid or expired admin token" });
    }
});
router.post("/logout", async (_req, res) => {
    res.clearCookie("session", { path: "/", httpOnly: true, sameSite: "lax" });
    res.status(204).send();
});
export default router;
