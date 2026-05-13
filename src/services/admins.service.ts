import { prisma } from "../prisma/client.js";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { TokenPair } from "../types/common.js";

const ACCESS_TOKEN_EXPIRES = "15m";
const REFRESH_TOKEN_EXPIRES = "30d";

export class AdminService {
  async createAdmin(data: any): Promise<any> {
    const hashed = await bcrypt.hash(data.password, 10);
    return prisma.admin.create({
      data: { ...data, password: hashed }
    });
  }

  async validatePassword(password: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(password, hashed);
  }

  async generateTokens(admin: { id: string; role: string }): Promise<TokenPair> {
    const accessToken = jwt.sign(
      { id: admin.id, role: admin.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: ACCESS_TOKEN_EXPIRES }
    );

    const refreshToken = jwt.sign(
      { id: admin.id },
      process.env.JWT_REFRESH_SECRET || "refresh_secret",
      { expiresIn: REFRESH_TOKEN_EXPIRES }
    );

    return { accessToken, refreshToken };
  }

  async getAdminByEmail(email: string): Promise<any> {
    return prisma.admin.findUnique({ where: { email } });
  }

  async getAdminById(id: string): Promise<any> {
    return prisma.admin.findUnique({ where: { id } });
  }

  async listAdmins(): Promise<any[]> {
    return prisma.admin.findMany();
  }

  async updateAdmin(id: string, data: any): Promise<any> {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return prisma.admin.update({ where: { id }, data });
  }

  async deleteAdmin(id: string): Promise<any> {
    return prisma.admin.delete({ where: { id } });
  }
}

export const adminService = new AdminService();


