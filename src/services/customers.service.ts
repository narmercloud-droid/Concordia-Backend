import { randomUUID } from "crypto";
import { prisma } from "../prisma/client.ts";
import pool from "../db.ts";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { env } from "../config/env.ts";

const ACCESS_TOKEN_EXPIRES = "15m";
const REFRESH_TOKEN_EXPIRES = "30d";

export class CustomerService {
  async register(data: { name: string; email: string; phone?: string; password?: string }): Promise<any> {
    return prisma.customer.create({
      data: {
        id: randomUUID(),
        name: data.name,
        email: data.email,
        phone: data.phone ?? null,
        loginToken: null,
        loginTokenExpires: null,
        loyaltyPoints: 0,
        marketingConsent: false,
        marketingEmail: false,
        marketingSMS: false,
        marketingWhatsApp: false,
        phoneNumber: data.phone ?? null
      }
    });
  }

  async validatePassword(password: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(password, hashed);
  }

  async generateTokens(customer: { id: string; email: string }): Promise<any> {
    const accessToken = jwt.sign({ id: customer.id, email: customer.email, type: "customer" }, env.JWT_SECRET as string, { expiresIn: ACCESS_TOKEN_EXPIRES } as jwt.SignOptions);
    const refreshToken = jwt.sign({ id: customer.id, type: "customer" }, (env.JWT_REFRESH_SECRET as string) || (env.JWT_SECRET as string), { expiresIn: REFRESH_TOKEN_EXPIRES } as jwt.SignOptions);

    return { accessToken, refreshToken };
  }

  async login(email: string, _password: string): Promise<any> {
    const customer = await prisma.customer.findUnique({ where: { email } });
    if (!customer) return null;

    return this.generateTokens(customer);
  }

  async refresh(_refreshToken: string): Promise<any> {
    return null;
  }

  async addAddress(customerId: string, data: any): Promise<any> {
    return prisma.address.create({
      data: { ...data, customerId }
    });
  }

  async updateAddress(customerId: string, addressId: string, data: any): Promise<any> {
    return prisma.address.updateMany({
      where: { id: addressId, customerId },
      data
    });
  }

  async listAddresses(customerId: string): Promise<any[]> {
    return prisma.address.findMany({ where: { customerId } });
  }

  async getAddress(customerId: string, addressId: string): Promise<any | null> {
    return prisma.address.findFirst({ where: { id: addressId, customerId } });
  }

  async deleteAddress(_customerId: string, id: string): Promise<any> {
    return prisma.address.delete({
      where: { id }
    });
  }

  async updatePhone(customerId: string, phoneNumber: string): Promise<any> {
    return prisma.customer.update({
      where: { id: customerId },
      data: { phoneNumber }
    });
  }

  async getProfile(id: string): Promise<any> {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: { addresses: true }
    });

    const preferencesResult = await pool.query(
      `SELECT preference_type, item FROM preferences WHERE user_id = $1`,
      [id]
    );

    return {
      ...customer,
      preferences: preferencesResult.rows || []
    };
  }
}

export const customerService = new CustomerService();





