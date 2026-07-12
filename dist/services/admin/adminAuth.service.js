import { prisma } from "../../prisma/client.js";
import { randomUUID } from "crypto";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import logger from "../../logger.js";
import { env } from "../../config/env.js";
const ACCESS_TOKEN_EXPIRES = "15m";
const REFRESH_TOKEN_EXPIRES = "30d";
export class AdminAuthService {
    async register(data) {
        const { password, ...adminData } = data;
        const hashedPassword = await bcrypt.hash(password, 10);
        return prisma.admin.create({
            data: {
                id: randomUUID(),
                ...adminData,
                branchId: data.branchId ?? "",
                password: hashedPassword,
                role: data.role || "staff"
            }
        });
    }
    async validatePassword(password, hashed) {
        return bcrypt.compare(password, hashed);
    }
    async generateTokens(admin) {
        const accessTokenPayload = {
            id: admin.id,
            email: admin.email,
            role: admin.role,
            type: "admin"
        };
        if (admin.branchId) {
            accessTokenPayload.branchId = admin.branchId;
        }
        const accessToken = jwt.sign(accessTokenPayload, env.JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES });
        const refreshToken = jwt.sign({ id: admin.id, role: admin.role, type: "admin" }, env.JWT_REFRESH_SECRET || env.JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES });
        return { accessToken, refreshToken };
    }
    async login(email, password) {
        const admin = await prisma.admin.findUnique({ where: { email } });
        logger.debug({ adminId: admin?.id }, "ADMIN USER FROM DB fetched");
        if (!admin || !admin.password)
            return false;
        const isValid = await this.validatePassword(password, admin.password);
        if (!isValid)
            return false;
        return this.generateTokens(admin);
    }
    async refresh(refreshToken) {
        try {
            const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET || env.JWT_SECRET);
            if (decoded.type !== "admin")
                return false;
            const admin = await prisma.admin.findUnique({ where: { id: decoded.id } });
            if (!admin)
                return false;
            return this.generateTokens(admin);
        }
        catch (_error) {
            void _error;
            return false;
        }
    }
    async getProfile(id) {
        return prisma.admin.findUnique({
            where: { id }
        });
    }
}
