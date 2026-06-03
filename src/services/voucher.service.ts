import { prisma } from "../prisma/client.ts";
import { WalletService } from "./wallet.service.ts";

export class VoucherService {
  static async validate(code: string) {
    const voucher = await prisma.voucher.findUnique({
      where: { code }
    });

    if (!voucher) throw new Error("Voucher not found");
    if (voucher.isUsed) throw new Error("Voucher already used");
    if (voucher.expiresAt && voucher.expiresAt < new Date()) {
      throw new Error("Voucher expired");
    }

    return voucher;
  }

  static async redeem(code: string, customerId: string) {
    const voucher = await this.validate(code);

    await prisma.voucher.update({
      where: { code },
      data: {
        isUsed: true,
        usedBy: customerId,
        usedAt: new Date()
      }
    });

    await WalletService.addFunds(
      customerId,
      Number(voucher.amount),
      "VOUCHER",
      voucher.id
    );

    return { success: true, amount: voucher.amount };
  }
}

