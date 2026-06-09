import { randomUUID } from "crypto";
import { prisma } from "../prisma/client.js";
import pool from "../db.js";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { env } from "../config/env.js";
const ACCESS_TOKEN_EXPIRES = "15m";
const REFRESH_TOKEN_EXPIRES = "30d";
export class CustomerService {
    async register(data) {
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
    async validatePassword(password, hashed) {
        return bcrypt.compare(password, hashed);
    }
    async generateTokens(customer) {
        const accessToken = jwt.sign({ id: customer.id, email: customer.email, type: "customer" }, env.JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES });
        const refreshToken = jwt.sign({ id: customer.id, type: "customer" }, env.JWT_REFRESH_SECRET || env.JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES });
        return { accessToken, refreshToken };
    }
    async login(email, _password) {
        const customer = await prisma.customer.findUnique({ where: { email } });
        if (!customer)
            return null;
        return this.generateTokens(customer);
    }
    async refresh(_refreshToken) {
        return null;
    }
    async addAddress(customerId, data) {
        return prisma.address.create({
            data: { ...data, customerId }
        });
    }
    async updateAddress(customerId, addressId, data) {
        return prisma.address.updateMany({
            where: { id: addressId, customerId },
            data
        });
    }
    async listAddresses(customerId) {
        return prisma.address.findMany({ where: { customerId } });
    }
    async getAddress(customerId, addressId) {
        return prisma.address.findFirst({ where: { id: addressId, customerId } });
    }
    async deleteAddress(_customerId, id) {
        return prisma.address.delete({
            where: { id }
        });
    }
    async updatePhone(customerId, phoneNumber) {
        return prisma.customer.update({
            where: { id: customerId },
            data: { phoneNumber }
        });
    }
    async getProfile(id) {
        const customer = await prisma.customer.findUnique({
            where: { id },
            include: { addresses: true }
        });
        const preferencesResult = await pool.query(`SELECT preference_type, item FROM preferences WHERE user_id = $1`, [id]);
        return {
            ...customer,
            preferences: preferencesResult.rows || []
        };
    }
}
export const customerService = new CustomerService();
