import type { Request } from "express";
import { addressService } from "../services/address.service.ts";
import { wrap } from "../contracts/api.js";

export const AddressController = {
  add: wrap(async (req: Request) => {
    const customerId = req.user.id;
    const address = await addressService.addAddress(customerId, req.body);
    return address;
  }),

  update: wrap(async (req: Request) => {
    const customerId = req.user.id;
    const { id } = req.params;
    await addressService.updateAddress(customerId, id, req.body);
    return { success: true };
  }),

  delete: wrap(async (req: Request) => {
    const customerId = req.user.id;
    const { id } = req.params;
    await addressService.deleteAddress(customerId, id);
    return { success: true };
  }),

  list: wrap(async (req: Request) => {
    const customerId = req.user.id;
    const list = await addressService.listAddresses(customerId);
    return list;
  })
};






