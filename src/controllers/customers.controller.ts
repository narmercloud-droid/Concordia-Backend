import { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../globalTypes.js";
import { customerService } from "../services/customers.service.js";
import { success, fail } from "./controllerHelper.js";
import {
  customerRegisterSchema,
  customerLoginSchema,
  customerRefreshSchema
} from "../validation/customers.schema.js";
import { addressBodySchema } from "../validation/address.schema.js";
import { idParamSchema } from "../validation/common.schema.js";

const validationMessage = (issues: { message: string }[]) =>
  issues.map((i) => i.message).join(", ") || "Invalid input";

export const CustomersController = {
  register: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const parsed = customerRegisterSchema.safeParse(req.body);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const customer = await customerService.register(parsed.data);
      return success(res, customer, "Customer registered successfully");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  login: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const parsed = customerLoginSchema.safeParse(req.body);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const { email, password } = parsed.data;
      const tokens = await customerService.login(email, password);
      if (!tokens) return fail(res, "INVALID_CREDENTIALS", "Invalid credentials", 401);
      return success(res, tokens, "Login successful");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  refresh: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const parsed = customerRefreshSchema.safeParse(req.body);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const { refreshToken } = parsed.data;
      const tokens = await customerService.refresh(refreshToken);
      if (!tokens) return fail(res, "INVALID_TOKEN", "Invalid token", 403);
      return success(res, tokens, "Token refreshed successfully");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  addAddress: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const customerId = req.user?.id;
      if (!customerId) return fail(res, "UNAUTHORIZED", "Unauthorized", 401);
      const parsed = addressBodySchema.safeParse(req.body);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const address = await customerService.addAddress(customerId, parsed.data);
      return success(res, address, "Address added successfully");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  listAddresses: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const customerId = req.user?.id;
      if (!customerId) return fail(res, "UNAUTHORIZED", "Unauthorized", 401);
      const addresses = await customerService.listAddresses(customerId);
      return success(res, addresses, "Addresses fetched successfully");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  deleteAddress: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const customerId = req.user?.id;
      if (!customerId) return fail(res, "UNAUTHORIZED", "Unauthorized", 401);
      const parsed = idParamSchema.safeParse(req.params);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const address = await customerService.deleteAddress(parsed.data.id);
      return success(res, address, "Address deleted successfully");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  profile: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const customerId = req.user?.id;
      if (!customerId) return fail(res, "UNAUTHORIZED", "Unauthorized", 401);
      const profile = await customerService.getProfile(customerId);
      if (!profile) return fail(res, "NOT_FOUND", "Profile not found", 404);
      return success(res, profile, "Profile fetched successfully");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  orders: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const customerId = req.user?.id;
      if (!customerId) return fail(res, "UNAUTHORIZED", "Unauthorized", 401);
      const orders = await customerService.getOrders(customerId);
      return success(res, orders, "Orders fetched successfully");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  }
};
