import { randomUUID } from "crypto";
import { prisma } from "../prisma/client.js";
export class WalletService {
    static async getWallet(customerId) {
        let wallet = await prisma.wallet.findUnique({
            where: { customerId }
        });
        if (!wallet) {
            wallet = await prisma.wallet.create({
                data: {
                    id: randomUUID(),
                    customerId,
                    balance: 0
                }
            });
        }
        return wallet;
    }
    static async addFunds(customerId, amount, type, reference) {
        const wallet = await this.getWallet(customerId);
        const updated = await prisma.wallet.update({
            where: { id: wallet.id },
            data: {
                balance: wallet.balance.toNumber() + amount,
                transactions: {
                    create: {
                        id: randomUUID(),
                        type,
                        amount,
                        reference: reference ?? null
                    }
                }
            }
        });
        return updated;
    }
    static async deductFunds(customerId, amount, reference) {
        const wallet = await this.getWallet(customerId);
        if (wallet.balance.toNumber() < amount) {
            throw new Error("Insufficient wallet balance");
        }
        const updated = await prisma.wallet.update({
            where: { id: wallet.id },
            data: {
                balance: wallet.balance.toNumber() - amount,
                transactions: {
                    create: {
                        id: randomUUID(),
                        type: "DEBIT",
                        amount,
                        reference: reference ?? null
                    }
                }
            }
        });
        return updated;
    }
    static async getTransactions(customerId) {
        const wallet = await this.getWallet(customerId);
        return prisma.walletTransaction.findMany({
            where: { walletId: wallet.id },
            orderBy: { createdAt: "desc" }
        });
    }
}
