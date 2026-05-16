import { cartService } from "../services/cart.service.js";
import { success, fail } from "./controllerHelper.js";
import { cartCheckoutBodySchema } from "../validation/cart.schema.js";
const validationMessage = (issues) => issues.map((i) => i.message).join(", ") || "Invalid input";
export const CartController = {
    checkout: async (req, res, next) => {
        try {
            const parsed = cartCheckoutBodySchema.safeParse(req.body);
            if (!parsed.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
            }
            const customerId = req.user.id;
            const summary = await cartService.checkout(customerId, parsed.data);
            return success(res, summary, "Checkout completed successfully");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    }
};
