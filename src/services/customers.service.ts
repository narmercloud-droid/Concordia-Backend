import { prisma } from "../prisma/client.js";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

const ACCESS_TOKEN_EXPIRES = "15m";
const REFRESH_TOKEN_EXPIRES = "30d";

export class CustomerService {
  async register(data: { name: string; email: string; phone?: string; password?: string }): Promise<any> {
    const { password, ...customerData } = data;
    return prisma.customer.create({
      data: {
        ...customerData
      }
    });
  }

  async validatePassword(password: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(password, hashed);
  }

  async generateTokens(customer: { id: string; email: string }): Promise<any> {
    const accessToken = jwt.sign(
      { id: customer.id, email: customer.email, type: "customer" },
      process.env.JWT_SECRET || "secret",
      { expiresIn: ACCESS_TOKEN_EXPIRES }
    );

    const refreshToken = jwt.sign(
      { id: customer.id, type: "customer" },
      process.env.JWT_REFRESH_SECRET || "refresh_secret",
      { expiresIn: REFRESH_TOKEN_EXPIRES }
    );

    return { accessToken, refreshToken };
  }

  async login(email: string, _password?: string): Promise<any> {
    const customer = await prisma.customer.findUnique({ where: { email } });
    if (!customer) return false;

    return this.generateTokens(customer);
  }

  async refresh(refreshToken: string): Promise<any> {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || "refresh_secret") as any;
      if (decoded.type !== "customer") return false;

      const customer = await prisma.customer.findUnique({ where: { id: decoded.id } });
      if (!customer) return false;

      return this.generateTokens(customer);
    } catch (error) {
      return false;
    }
  }

  async addAddress(customerId: string, data: any): Promise<any> {
    return prisma.address.create({
      data: { ...data, customerId }
    });
  }

  async listAddresses(customerId: string): Promise<any[]> {
    return prisma.address.findMany({ where: { customerId } });
  }

  async deleteAddress(id: string): Promise<any> {
    return prisma.address.delete({
      where: { id }
    });
  }

  async getProfile(id: string): Promise<any> {
    return prisma.customer.findUnique({
      where: { id },
      include: { addresses: true }
    });
  }

  async getOrders(customerId: string): Promise<any[]> {
    return prisma.order.findMany({
      where: { customerId },
      include: {
        items: {
          include: {
            item: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  }
}

export const customerService = new CustomerService();

