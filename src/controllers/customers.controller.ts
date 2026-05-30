import type { Request, Response, NextFunction  } from "express";
import { customerService } from "../services/customers.service.js";
import { success, fail } from "./controllerHelper.js";

export const CustomersController = {
  register: async (req: Request, res: Response, next: NextFunction) => {
    const customer = await customerService.register(req.body);
    return success(res, customer);
  },

  login: async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const tokens = await customerService.login(email, password);
    if (!tokens) return fail(res, "Invalid credentials", 401);
    return success(res, tokens);
  },

  refresh: async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body;
    const tokens = await customerService.refresh(refreshToken);
    if (!tokens) return fail(res, "Invalid token", 403);
    return success(res, tokens);
  },

  profile: async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id;
    if (!customerId) return fail(res, "Unauthorized", 401);
    const profile = await customerService.getProfile(customerId);
    return success(res, profile);
  },

  addAddress: async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id;
    if (!customerId) return fail(res, "Unauthorized", 401);
    const address = await customerService.addAddress(customerId, req.body);
    return success(res, address);
  },

  updateAddress: async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id;
    const addressId = req.params.id;
    if (!customerId) return fail(res, "Unauthorized", 401);
    await customerService.updateAddress(customerId, addressId, req.body);
    return success(res, { success: true });
  },

  listAddresses: async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id;
    if (!customerId) return fail(res, "Unauthorized", 401);
    const addresses = await customerService.listAddresses(customerId);
    return success(res, addresses);
  },

  getAddress: async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id;
    const addressId = req.params.id;
    if (!customerId) return fail(res, "Unauthorized", 401);
    const address = await customerService.getAddress(customerId, addressId);
    if (!address) return fail(res, "Address not found", 404);
    return success(res, address);
  },

  deleteAddress: async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id;
    const addressId = req.params.id;
    if (!customerId) return fail(res, "Unauthorized", 401);
    await customerService.deleteAddress(customerId, addressId);
    return success(res, { success: true });
  },

  updatePhone: async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id;
    const { phoneNumber } = req.body;
    if (!customerId) return fail(res, "Unauthorized", 401);
    if (!phoneNumber) return fail(res, "phoneNumber is required", 400);
    const customer = await customerService.updatePhone(customerId, String(phoneNumber));
    return success(res, customer);
  }
};






