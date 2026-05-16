import { Request, Response, NextFunction } from "express";
import { addressService } from "../services/address.service.js";

export const AddressController = {
  add: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customerId = req.user.id;
      const address = await addressService.addAddress(customerId, req.body);
      res.json(address);
    } catch (err: unknown) {
      next(err);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customerId = req.user.id;
      const { id } = req.params;
      await addressService.updateAddress(customerId, id, req.body);
      res.json({ success: true });
    } catch (err: unknown) {
      next(err);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customerId = req.user.id;
      const { id } = req.params;
      await addressService.deleteAddress(customerId, id);
      res.json({ success: true });
    } catch (err: unknown) {
      next(err);
    }
  },

  list: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customerId = req.user.id;
      const list = await addressService.listAddresses(customerId);
      res.json(list);
    } catch (err: unknown) {
      next(err);
    }
  }
};

