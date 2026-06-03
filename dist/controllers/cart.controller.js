import { cartService } from "../services/cart.service.js";
import { wrap } from "../contracts/api.js";
export const CartController = {
    checkout: wrap(async (req) => {
        const customerId = req.user.id;
        const summary = await cartService.checkout(customerId, req.body);
        return summary;
    })
};
