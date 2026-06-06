import type { Request } from "express";
import { fraudService } from "../services/fraud.service.ts";
import { wrap } from "../contracts/api.js";

export const FraudController = {
  scoreOrder: wrap(async (req: Request) => {
    const { orderId } = req.body;
    const result = await fraudService.scoreOrder(orderId);
    return result;
  }),

  getRisk: wrap(async (req: Request) => {
    const { orderId } = req.params;
    const result = await fraudService.getRisk(orderId);
    return result;
  }),

  flags: wrap(async () => {
    const flags = await fraudService.getFlags();
    return flags;
  }),

  events: wrap(async (req: Request) => {
    const { orderId } = req.params;
    const events = await fraudService.getOrderEvents(orderId);
    return events;
  })
};






