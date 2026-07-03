import { randomUUID } from "crypto";
import { prisma } from "../prisma/client.ts";
import pool from "../db.ts";
import * as bcrypt from "bcrypt";
import { signToken } from "../utils/jwt.ts";
import {
  claimCampaignCoupon,
  activateCustomerCoupon,
  grantWelcomeCoupons
} from "./customer/customerCoupon.service.ts";
import { upsertRegisteredBranchCustomer } from "./customer/branchCustomer.service.ts";

const SALT_ROUNDS = 10;

function toPublicCustomer(customer: {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  phoneNumber?: string | null;
  loyaltyPoints?: number;
  loyaltyTier?: string;
  lifetimePoints?: number;
  marketingConsent?: boolean;
  marketingEmail?: boolean;
  marketingSMS?: boolean;
  marketingWhatsApp?: boolean;
}) {
  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone ?? customer.phoneNumber ?? null,
    loyaltyPoints: customer.loyaltyPoints ?? 0,
    loyaltyTier: customer.loyaltyTier ?? "bronze",
    lifetimePoints: customer.lifetimePoints ?? 0,
    marketingConsent: customer.marketingConsent ?? false,
    marketingEmail: customer.marketingEmail ?? false,
    marketingSMS: customer.marketingSMS ?? false,
    marketingWhatsApp: customer.marketingWhatsApp ?? false
  };
}

export class CustomerService {
  async register(data: {
    name: string;
    email: string;
    phone?: string;
    password?: string;
    branchId?: string;
    campaignId?: string;
  }): Promise<any> {
    const email = data.email.trim().toLowerCase();
    const existing = await prisma.customer.findUnique({ where: { email } });
    if (existing) return null;

    const password = data.password?.trim();
    const passwordHash = password ? await bcrypt.hash(password, SALT_ROUNDS) : null;

    const customer = await prisma.customer.create({
      data: {
        id: randomUUID(),
        name: data.name.trim(),
        email,
        passwordHash,
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

    const tokens = await this.generateTokens(customer);

    const branchId = data.branchId?.trim() || null;
    const campaignId = data.campaignId?.trim() || null;
    if (campaignId) {
      try {
        const claimed = await claimCampaignCoupon(customer.id, campaignId, branchId);
        if (!claimed.alreadyClaimed) {
          await activateCustomerCoupon(customer.id, claimed.id);
        }
      } catch {
        // campaign may be unavailable — registration still succeeds
      }
    } else if (branchId) {
      await grantWelcomeCoupons(customer.id, branchId);
    }

    const phone = data.phone?.trim();
    if (branchId && phone) {
      await upsertRegisteredBranchCustomer({
        branchId,
        phone,
        name: customer.name,
        email: customer.email
      }).catch(() => {
        // branch customer sync is best-effort during registration
      });
    }

    return { ...tokens, user: toPublicCustomer(customer) };
  }

  async validatePassword(password: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(password, hashed);
  }

  async generateTokens(customer: { id: string; email: string }): Promise<any> {
    const accessToken = signToken({
      id: customer.id,
      role: "customer",
      branchId: ""
    });

    return { accessToken };
  }

  async login(email: string, password: string): Promise<any> {
    const normalizedEmail = email.trim().toLowerCase();
    const customer = await prisma.customer.findUnique({ where: { email: normalizedEmail } });
    if (!customer) return null;

    if (customer.passwordHash) {
      if (!password) return null;
      const valid = await this.validatePassword(password, customer.passwordHash);
      if (!valid) return null;
    }

    const tokens = await this.generateTokens(customer);
    return { ...tokens, user: toPublicCustomer(customer) };
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
      data: { phoneNumber, phone: phoneNumber }
    });
  }

  async getProfile(id: string): Promise<any> {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: { addresses: true }
    });

    if (!customer) return null;

    const preferencesResult = await pool.query(
      `SELECT preference_type, item FROM preferences WHERE user_id = $1`,
      [id]
    );

    const { passwordHash: _passwordHash, loginToken: _loginToken, ...safe } = customer;

    return {
      ...safe,
      preferences: preferencesResult.rows || []
    };
  }

  async exportPersonalData(customerId: string) {
    const profile = await this.getProfile(customerId);
    if (!profile) return null;

    const orders = await prisma.order.findMany({
      where: { customerId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        branchId: true,
        status: true,
        orderTotal: true,
        paymentMethod: true,
        fulfillmentType: true,
        createdAt: true,
        deliveryAddress: true
      },
      take: 500
    });

    return {
      exportedAt: new Date().toISOString(),
      profile: {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        phone: profile.phone ?? profile.phoneNumber,
        marketingConsent: profile.marketingConsent,
        marketingEmail: profile.marketingEmail,
        marketingSMS: profile.marketingSMS,
        marketingWhatsApp: profile.marketingWhatsApp,
        marketingConsentAt: profile.marketingConsentAt,
        loyaltyPoints: profile.loyaltyPoints,
        loyaltyTier: profile.loyaltyTier,
        addresses: profile.addresses,
        preferences: profile.preferences
      },
      orders
    };
  }

  async deleteAccount(customerId: string) {
    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) return false;

    const tombstoneEmail = `deleted+${customerId}@invalid.concordiapizza.de`;

    await prisma.$transaction([
      prisma.customerSession.deleteMany({ where: { customerId } }),
      prisma.address.deleteMany({ where: { customerId } }),
      prisma.webPushSubscription.deleteMany({ where: { customerId } }),
      prisma.customer.update({
        where: { id: customerId },
        data: {
          name: "Gelöschter Nutzer",
          email: tombstoneEmail,
          phone: null,
          phoneNumber: null,
          passwordHash: null,
          loginToken: null,
          loginTokenExpires: null,
          marketingConsent: false,
          marketingEmail: false,
          marketingSMS: false,
          marketingWhatsApp: false,
          marketingConsentAt: null,
          loyaltyPoints: 0
        }
      })
    ]);

    return true;
  }
}

export const customerService = new CustomerService();
