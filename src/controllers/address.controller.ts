import type { Request, Response, NextFunction  } from "express";
import { addressService } from "../services/address.service.js";
import { success } from "./controllerHelper.js";

export const AddressController = {
  add: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customerId = req.user.id;
      const address = await addressService.addAddress(customerId, req.body);
      return success(res, address);
    } catch (err: unknown) {
      next(err);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customerId = req.user.id;
      const { id } = req.params;
      await addressService.updateAddress(customerId, id, req.body);
      return success(res, { success: true });
    } catch (err: unknown) {
      next(err);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customerId = req.user.id;
      const { id } = req.params;
      await addressService.deleteAddress(customerId, id);
      return success(res, { success: true });
    } catch (err: unknown) {
      next(err);
    }
  },

  list: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customerId = req.user.id;
      const list = await addressService.listAddresses(customerId);
      return success(res, list);
    } catch (err: unknown) {
      next(err);
    }
  }
};






