import type { Request } from "express";
import { courierTrackingService } from "../services/courierTracking.service.ts";
import { wrap } from "../contracts/api.js";

export const CourierTrackingController = {
  // Courier updates GPS
  updateLocation: wrap(async (req: Request) => {
    const courierId = (req as any).user.id;
    const data = req.body;
    const result = await courierTrackingService.updateLocation(courierId, data);
    return result;
  }),

  // Customer tracking screen
  customerTracking: wrap(async (req: Request) => {
    const { orderId } = req.params;
    const result = await courierTrackingService.getCustomerTracking(orderId);
    return result;
  }),

  // Add tracking event (courier or system)
  addEvent: wrap(async (req: Request) => {
    const { orderId, status } = req.body;
    const event = await courierTrackingService.addTrackingEvent(orderId, status);
    return event;
  }),

  // Manager live map
  managerLiveMap: wrap(async (req: Request) => {
    const branchId = (req as any).user.branchId;
    const couriers = await courierTrackingService.getActiveCouriers(branchId);
    return couriers;
  })
};






