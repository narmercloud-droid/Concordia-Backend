import type { Request  } from "express";
import { cartService } from "../services/cart.service.ts";
import { wrap } from "../contracts/api.js";

export const CartController = {
  checkout: wrap(async (req: Request) => {
    const customerId = req.user.id;
    const summary = await cartService.checkout(customerId, req.body);
    return summary;
  })
};






