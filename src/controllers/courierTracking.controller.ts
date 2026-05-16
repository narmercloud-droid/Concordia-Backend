import { Request, Response, NextFunction } from "express";
import { courierTrackingService } from "../services/courierTracking.service.js";

export const CourierTrackingController = {
  // Courier updates GPS
  updateLocation: async (req: Request, res: Response, next: NextFunction) => {
    const courierId = req.user.id;
    const data = req.body;
    const result = await courierTrackingService.updateLocation(courierId, data);
    res.json(result);
  },

  // Customer tracking screen
  customerTracking: async (req: Request, res: Response, next: NextFunction) => {
    const { orderId } = req.params;
    const result = await courierTrackingService.getCustomerTracking(orderId);
    res.json(result);
  },

  // Add tracking event (courier or system)
  addEvent: async (req: Request, res: Response, next: NextFunction) => {
    const { orderId, status } = req.body;
    const event = await courierTrackingService.addTrackingEvent(orderId, status);
    res.json(event);
  },

  // Manager live map
  managerLiveMap: async (req: Request, res: Response, next: NextFunction) => {
    const branchId = req.user.branchId;
    const couriers = await courierTrackingService.getActiveCouriers(branchId);
    res.json(couriers);
  }
};

