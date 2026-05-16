import { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../globalTypes.js";
import { courierTrackingService } from "../services/courierTracking.service.js";
import { success, fail } from "./controllerHelper.js";
import { courierLocationUpdateSchema, courierTrackingEventSchema } from "../validation/courier.schema.js";
import { orderIdParamSchema } from "../validation/common.schema.js";

const validationMessage = (issues: { message: string }[]) =>
  issues.map((i) => i.message).join(", ") || "Invalid input";

export const CourierTrackingController = {
  updateLocation: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const parsed = courierLocationUpdateSchema.safeParse(req.body);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const courierId = req.user.id;
      const result = await courierTrackingService.updateLocation(courierId, parsed.data);
      return success(res, result, "Location updated");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  customerTracking: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const parsed = orderIdParamSchema.safeParse(req.params);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const result = await courierTrackingService.getCustomerTracking(parsed.data.orderId);
      return success(res, result, "Tracking fetched");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  addEvent: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const parsed = courierTrackingEventSchema.safeParse(req.body);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const { orderId, status } = parsed.data;
      const event = await courierTrackingService.addTrackingEvent(orderId, status);
      return success(res, event, "Event added");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  managerLiveMap: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user!.branchId;
      const couriers = await courierTrackingService.getActiveCouriers(branchId);
      return success(res, couriers, "Live map data fetched");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  }
};
