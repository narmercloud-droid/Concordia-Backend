import { randomUUID } from "crypto";
import { prisma } from "../../prisma/client.js";
import { success, fail } from "../controllerHelper.js";

export const createVoucher = async (req, res) => {
  try {
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

    return success(res, voucher);
  } catch (err) {
    return fail(res, err.message, 400);
  }
};

export const invalidateVoucher = async (req, res) => {
  try {
    const { code } = req.body;

    const voucher = await prisma.voucher.update({
      where: { code },
      data: { isUsed: true }
    });

    return success(res, voucher);
  } catch (err) {
    return fail(res, err.message, 400);
  }
};

export const listVouchers = async (req, res) => {
  try {
    const vouchers = await prisma.voucher.findMany();
    return success(res, vouchers);
  } catch (err) {
    return fail(res, err.message, 400);
  }
};

