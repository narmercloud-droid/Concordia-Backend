import type { Request } from "express";
import { courierService } from "../services/couriers.service.ts";
import { wrap, fail } from "../contracts/api.js";

export const CouriersController = {
  claim: wrap(async (req: Request) => {
    const { orderId, courierToken } = req.body;

    const order = await courierService.validateCourierToken(orderId, courierToken);
    if (!order) throw fail('FORBIDDEN', 'Invalid or expired token');

    const updated = await courierService.claimOrder(orderId);
    return updated;
  }),

  updateStatus: wrap(async (req: Request) => {
    const { orderId, courierToken, status } = req.body;

    const order = await courierService.validateCourierToken(orderId, courierToken);
    if (!order) throw fail('FORBIDDEN', 'Invalid or expired token');

    const updated = await courierService.updateStatus(orderId, status);
    return updated;
  })
};






