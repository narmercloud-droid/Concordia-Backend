var _a;
import { CartService } from "../../services/cart/cart.service.js";
import { PricingService } from "../../services/cart/pricing.service.js";
import { wrap, fail } from "../../contracts/api.js";
export class CartController {
}
_a = CartController;
CartController.loadCart = wrap(async (req) => {
    const { cartId } = req.query;
    const cart = await CartService.getOrCreateCart(cartId);
    return cart;
});
CartController.getCart = wrap(async (req) => {
    const { cartId } = req.params;
    const cart = await CartService.getCart(cartId);
    if (!cart)
        throw fail('NOT_FOUND', 'Cart not found');
    const totals = await PricingService.calculateCart(cart);
    return { cart, totals };
});
CartController.addItem = wrap(async (req) => {
    const { cartId } = req.params;
    const { itemId, quantity } = req.body;
    const item = await CartService.addItem(cartId, itemId, quantity);
    return item;
});
CartController.updateQuantity = wrap(async (req) => {
    const cartItemId = req.params.cartItemId;
    const { quantity } = req.body;
    const result = await CartService.updateQuantity(cartItemId, quantity);
    return result;
});
CartController.removeItem = wrap(async (req) => {
    const cartItemId = req.params.cartItemId;
    await CartService.removeItem(cartItemId);
    return { success: true };
});
