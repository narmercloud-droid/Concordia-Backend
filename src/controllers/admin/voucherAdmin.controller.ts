import { randomUUID } from "crypto";
import { prisma } from "../../prisma/client.ts";
import { wrap } from "../../contracts/api.js";

export const createVoucher = wrap(async (req) => {
  const { code, amount, expiresAt } = req.body;

  const voucher = await prisma.voucher.create({
    data: {
      id: randomUUID(),
      code,
      amount,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      isUsed: false
    }
  });

  return voucher;
});

export const invalidateVoucher = wrap(async (req) => {
  const { code } = req.body;

  const voucher = await prisma.voucher.update({
    where: { code },
    data: { isUsed: true }
  });

  return voucher;
});

export const listVouchers = wrap(async () => {
  const vouchers = await prisma.voucher.findMany();
  return vouchers;
});

