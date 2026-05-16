import { prisma } from "../prisma/client.js";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
const ACCESS_TOKEN_EXPIRES = "15m";
const REFRESH_TOKEN_EXPIRES = "30d";
export class CustomerService {
    async register(data) {
        const { password, ...customerData } = data;
        return prisma.customer.create({
            data: customerData
        });
    }
    async validatePassword(password, hashed) {
        return bcrypt.compare(password, hashed);
    }
    async generateTokens(customer) {
        const accessToken = jwt.sign({ id: customer.id, email: customer.email, type: "customer" }, process.env.JWT_SECRET || "secret", { expiresIn: ACCESS_TOKEN_EXPIRES });
        const refreshToken = jwt.sign({ id: customer.id, type: "customer" }, process.env.JWT_REFRESH_SECRET || "refresh_secret", { expiresIn: REFRESH_TOKEN_EXPIRES });
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
    async listAddresses(customerId) {
        return prisma.address.findMany({ where: { customerId } });
    }
    async deleteAddress(id) {
        return prisma.address.delete({
            where: { id }
        });
    }
    async getProfile(id) {
        return prisma.customer.findUnique({
            where: { id },
            include: { addresses: true }
        });
    }
}
export const customerService = new CustomerService();
