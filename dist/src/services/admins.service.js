import { prisma } from "../prisma/client.js";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
const ACCESS_TOKEN_EXPIRES = "15m";
const REFRESH_TOKEN_EXPIRES = "30d";
export class AdminService {
    async createAdmin(data) {
        const hashed = await bcrypt.hash(data.password, 10);
        return prisma.admin.create({
            data: { ...data, password: hashed }
        });
    }
    async validatePassword(password, hashed) {
        return bcrypt.compare(password, hashed);
    }
    async generateTokens(admin) {
        const accessToken = jwt.sign({ id: admin.id, role: admin.role }, process.env.JWT_SECRET || "secret", { expiresIn: ACCESS_TOKEN_EXPIRES });
        const refreshToken = jwt.sign({ id: admin.id }, process.env.JWT_REFRESH_SECRET || "refresh_secret", { expiresIn: REFRESH_TOKEN_EXPIRES });
        return { accessToken, refreshToken };
    }
    async getAdminByEmail(email) {
        return prisma.admin.findUnique({ where: { email } });
    }
    async getAdminById(id) {
        return prisma.admin.findUnique({ where: { id } });
    }
    async listAdmins() {
        return prisma.admin.findMany();
    }
    async updateAdmin(id, data) {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }
        return prisma.admin.update({ where: { id }, data });
    }
    async deleteAdmin(id) {
        return prisma.admin.delete({ where: { id } });
    }
}
export const adminService = new AdminService();
