import { Router } from "express";
import { prisma } from "../prisma/client.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { success, fail } from "../controllers/controllerHelper.js";
import { adminLoginSchema } from "../validation/auth.schema.js";
const router = Router();
router.post("/login", async (req, res) => {
    try {
        const parsed = adminLoginSchema.safeParse(req.body);
        if (!parsed.success) {
            return fail(res, "INVALID_INPUT", parsed.error.message, 400);
        }
        const { email, password } = parsed.data;
        const admin = await prisma.admin.findUnique({
            where: { email }
        });
        if (!admin) {
            return fail(res, "INVALID_CREDENTIALS", "Invalid credentials", 401);
        }
        const match = await bcrypt.compare(password, admin.password);
        if (!match) {
            return fail(res, "INVALID_CREDENTIALS", "Invalid credentials", 401);
        }
        const payload = {
            id: admin.id,
            role: admin.role,
            branchId: admin.branchId
        };
        if (!payload.role) {
            return fail(res, "TOKEN_PAYLOAD_ERROR", "Admin role is required in token payload", 500);
        }
        if (!payload.branchId) {
            return fail(res, "TOKEN_PAYLOAD_ERROR", "Admin branchId is required in token payload", 500);
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "7d"
        });
        return success(res, { token, user: payload }, "Login successful");
    }
    catch (err) {
        return fail(res, "UNKNOWN_ERROR", err.message, 500);
    }
});
export default router;
