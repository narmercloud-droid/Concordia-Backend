import { Request, Response, NextFunction } from "express";
import { ordersService } from "../services/orders.service.js";
import { success, fail } from "./controllerHelper.js";
import {
  legacyCreateOrderSchema,
  courierOrderActionSchema,
  orderStatusBodySchema
} from "../validation/orders.schema.js";
import { branchIdParamSchema, idParamSchema } from "../validation/common.schema.js";

const validationMessage = (issues: { message: string }[]) =>
  issues.map((i) => i.message).join(", ") || "Invalid input";

export const OrdersController = {
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = legacyCreateOrderSchema.safeParse(req.body);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const order = await ordersService.createOrder(parsed.data);
      return success(res, order, "Order created successfully", 201);
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  listBranchOrders: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = branchIdParamSchema.safeParse(req.params);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const orders = await ordersService.listBranchOrders(parsed.data.branchId);
      return success(res, orders, "Branch orders fetched successfully");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  updateStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedParams = idParamSchema.safeParse(req.params);
      if (!parsedParams.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsedParams.error.issues), 400);
      }
      const parsed = orderStatusBodySchema.safeParse(req.body);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const order = await ordersService.updateStatus(parsedParams.data.id, parsed.data.status);
      return success(res, order, "Order status updated successfully");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  courierClaim: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = courierOrderActionSchema.safeParse(req.body);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const { orderId, courierToken } = parsed.data;
      const order = await ordersService.validateCourierToken(orderId, courierToken);
      if (!order) return fail(res, "FORBIDDEN", "Invalid or expired token", 403);

      const updated = await ordersService.updateStatus(orderId, "picked_up");
      return success(res, updated, "Order claimed successfully");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  courierPickedUp: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = courierOrderActionSchema.safeParse(req.body);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const { orderId, courierToken } = parsed.data;
      const order = await ordersService.validateCourierToken(orderId, courierToken);
      if (!order) return fail(res, "FORBIDDEN", "Invalid or expired token", 403);

      const updated = await ordersService.courierPickedUp(orderId);
      return success(res, updated, "Order picked up successfully");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  courierDelivered: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = courierOrderActionSchema.safeParse(req.body);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const { orderId, courierToken } = parsed.data;
      const order = await ordersService.validateCourierToken(orderId, courierToken);
      if (!order) return fail(res, "FORBIDDEN", "Invalid or expired token", 403);

      const updated = await ordersService.courierDelivered(orderId);
      return success(res, updated, "Order delivered successfully");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  }
};
