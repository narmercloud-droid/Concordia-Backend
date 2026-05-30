import type { Request, Response, NextFunction  } from "express";
import { deliveryFeeService } from "../services/deliveryFee.service.js";
import { prisma } from "../prisma/client.js";
import { success, fail } from "./controllerHelper.js";

export const DeliveryFeeController = {
  calculate: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { branchId, addressId, orderTotal } = req.body;

      const address = await prisma.address.findUnique({
        where: { id: addressId }
      });

      if (!address) return fail(res, "Invalid address", 400);

      const result = await deliveryFeeService.calculate(branchId, {
        ...address,
        orderTotal
      });

      return success(res, result);
    } catch (err: unknown) {
      next(err);
    }
  },

  setZone: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { branchId } = req.params;

      const zone = await prisma.deliveryZone.upsert({
        where: { branchId },
        update: req.body,
        create: { branchId, ...req.body }
      });

      return success(res, zone);
    } catch (err: unknown) {
      next(err);
    }
  },

  getZone: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { branchId } = req.params;
      const zone = await prisma.deliveryZone.findUnique({ where: { branchId } });
      return success(res, zone);
    } catch (err: unknown) {
      next(err);
    }
  }
};







