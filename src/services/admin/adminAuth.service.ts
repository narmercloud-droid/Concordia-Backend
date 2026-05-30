import { prisma } from "../../prisma/client.js";
import { randomUUID } from "crypto";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

const ACCESS_TOKEN_EXPIRES = "15m";
const REFRESH_TOKEN_EXPIRES = "30d";

export class AdminAuthService {
  async register(data: { name: string; email: string; password: string; role?: string; branchId?: string }): Promise<any> {
    const { password, ...adminData } = data;
    const hashedPassword = await bcrypt.hash(password, 10);
    return prisma.admin.create({
      data: {
        id: randomUUID(),
        ...adminData,
        branchId: data.branchId ?? "",
        password: hashedPassword,
        role: data.role || "staff",
        updatedAt: new Date()
      }
    });
  }

  async validatePassword(password: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(password, hashed);
  }

  async generateTokens(admin: { id: string; email: string; role: string; branchId?: string }): Promise<any> {
    const accessTokenPayload: any = {
      id: admin.id,
      email: admin.email,
      role: admin.role,
      type: "admin"
    };

    if (admin.branchId) {
      accessTokenPayload.branchId = admin.branchId;
    }

    const accessToken = jwt.sign(
      accessTokenPayload,
      process.env.JWT_SECRET || "secret",
      { expiresIn: ACCESS_TOKEN_EXPIRES }
    );

    const refreshToken = jwt.sign(
      { id: admin.id, role: admin.role, type: "admin" },
      process.env.JWT_REFRESH_SECRET || "refresh_secret",
      { expiresIn: REFRESH_TOKEN_EXPIRES }
    );

    return { accessToken, refreshToken };
  }

  async login(email: string, password: string): Promise<any> {
    const admin = await prisma.admin.findUnique({ where: { email } });
    console.log("ADMIN USER FROM DB:", admin);
    if (!admin || !admin.password) return false;

    const isValid = await this.validatePassword(password, admin.password);
    if (!isValid) return false;

    return this.generateTokens(admin);
  }

  async refresh(refreshToken: string): Promise<any> {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || "refresh_secret") as any;
      if (decoded.type !== "admin") return false;

      const admin = await prisma.admin.findUnique({ where: { id: decoded.id } });
      if (!admin) return false;

      return this.generateTokens(admin);
    } catch (error) {
      return false;
    }
  }

  async getProfile(id: string): Promise<any> {
    return prisma.admin.findUnique({
      where: { id }
    });
  }
}




