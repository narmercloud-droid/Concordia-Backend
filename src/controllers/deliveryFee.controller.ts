import { Request, Response, NextFunction } from "express";
import { deliveryFeeService } from "../services/deliveryFee.service.js";
import { prisma } from "../prisma/client.js";

export const DeliveryFeeController = {
  calculate: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { branchId, addressId, orderTotal } = req.body;

      const address = await prisma.address.findUnique({
        where: { id: addressId }
      });

      if (!address) return res.status(400).json({ error: "Invalid address" });

      const result = await deliveryFeeService.calculate(branchId, {
        ...address,
        orderTotal
      });

      res.json(result);
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

      res.json(zone);
    } catch (err: unknown) {
      next(err);
    }
  },

  getZone: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { branchId } = req.params;
      const zone = await prisma.deliveryZone.findUnique({ where: { branchId } });
      res.json(zone);
    } catch (err: unknown) {
      next(err);
    }
  }
};


