import { cartService } from "../services/cart.service.js";
import { success } from "./controllerHelper.js";
export const CartController = {
    checkout: async (req, res, next) => {
        try {
            const customerId = req.user.id;
            const summary = await cartService.checkout(customerId, req.body);
            return success(res, summary);
        }
        catch (err) {
            next(err);
        }
    }
};
