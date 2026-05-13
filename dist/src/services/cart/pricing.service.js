import { prisma } from "../../prisma/client.js";
export class PricingService {
    // Calculate price for a single cart item
    static async calculateCartItem(cartItem) {
        let total = 0;
        // 1. Base item price
        const item = await prisma.item.findUnique({
            where: { item_id: cartItem.item_id }
        });
        if (!item)
            throw new Error("Item not found");
        total += item.manual_number; // You can replace this with your real price field
        // 2. Variant price
        if (cartItem.variant) {
            const variant = await prisma.variant.findUnique({
                where: { variant_id: cartItem.variant.variant_id }
            });
            if (variant) {
                total += variant.sort_order; // Replace with real price field
            }
        }
        // 3. Toppings
        for (const topping of cartItem.toppings) {
            const t = await prisma.topping.findUnique({
                where: { topping_id: topping.topping_id }
            });
            if (t) {
                total += t.sort_order; // Replace with real price field
            }
        }
        // 4. Extras
        for (const extra of cartItem.extras) {
            const e = await prisma.extra.findUnique({
                where: { extra_id: extra.extra_id }
            });
            if (e) {
                total += e.sort_order; // Replace with real price field
            }
        }
        // 5. Multiply by quantity
        total *= cartItem.quantity;
        return total;
    }
    // Calculate full cart totals
    static async calculateCart(cart) {
        let subtotal = 0;
        for (const cartItem of cart.items) {
            const itemTotal = await PricingService.calculateCartItem(cartItem);
            subtotal += itemTotal;
        }
        // Deals will be added later
        const total = subtotal;
        return {
            subtotal,
            total
        };
    }
}
