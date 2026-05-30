import { prisma } from "../prisma/client.js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { sendMagicLink } from "../utils/email.js";
const DEFAULT_JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const MAGIC_LINK_TTL_MS = 15 * 60 * 1000;
export class AuthService {
    async requestMagicLink(email) {
        const normalizedEmail = String(email).trim().toLowerCase();
        const customer = await prisma.customer.upsert({
            where: { email: normalizedEmail },
            update: {},
            create: {
                id: uuidv4(),
                email: normalizedEmail,
                name: normalizedEmail.split("@")[0] || normalizedEmail,
            }
        });
        const loginToken = uuidv4();
        const expiresAt = new Date(Date.now() + MAGIC_LINK_TTL_MS);
        await prisma.customer.update({
            where: { id: customer.id },
            data: {
                loginToken,
                loginTokenExpires: expiresAt
            }
        });
        await sendMagicLink(normalizedEmail, loginToken);
        return { customer, loginToken, expiresAt };
    }
    async verifyToken(token) {
        const customer = await prisma.customer.findFirst({
            where: {
                loginToken: token,
                loginTokenExpires: {
                    gt: new Date()
                }
            }
        });
        if (!customer) {
            throw new Error("Invalid or expired login token");
        }
        await prisma.customer.update({
            where: { id: customer.id },
            data: {
                loginToken: null,
                loginTokenExpires: null
            }
        });
        const sessionToken = this.createSession(customer.id);
        return { token: sessionToken, customer };
    }
    async requestAdminMagicLink(email) {
        const normalizedEmail = String(email).trim().toLowerCase();
        const admin = await prisma.admin.findUnique({ where: { email: normalizedEmail } });
        if (!admin) {
            return { admin: null };
        }
        const magicToken = jwt.sign({
            email: normalizedEmail,
            role: admin.role,
            branchId: admin.branchId,
            purpose: "admin_magic_link"
        }, DEFAULT_JWT_SECRET, { expiresIn: "15m" });
        await sendMagicLink(normalizedEmail, magicToken, "/admin/auth/callback");
        return { admin };
    }
    async verifyAdminToken(token) {
        const decoded = jwt.verify(token, DEFAULT_JWT_SECRET);
        if (!decoded || decoded.purpose !== "admin_magic_link" || typeof decoded.email !== "string") {
            throw new Error("Invalid admin token");
        }
        const admin = await prisma.admin.findUnique({ where: { email: decoded.email.toLowerCase() } });
        if (!admin) {
            throw new Error("Admin not found");
        }
        if (admin.role !== decoded.role || admin.branchId !== decoded.branchId) {
            throw new Error("Invalid admin token payload");
        }
        const sessionToken = jwt.sign({ id: admin.id, role: admin.role, branchId: admin.branchId }, DEFAULT_JWT_SECRET, { expiresIn: "7d" });
        return { token: sessionToken, admin };
    }
    createSession(customerId) {
        return jwt.sign({ id: customerId, role: "customer", branchId: "customer" }, DEFAULT_JWT_SECRET, { expiresIn: "7d" });
    }
    clearSession() {
        return;
    }
}
export const authService = new AuthService();
