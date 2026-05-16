import { cartService } from "../services/cart.service.js";
export const CartController = {
    checkout: async (req, res, next) => {
        try {
            const customerId = req.user.id;
            const summary = await cartService.checkout(customerId, req.body);
            res.json(summary);
        }
        catch (err) {
            next(err);
        }
    }
};
