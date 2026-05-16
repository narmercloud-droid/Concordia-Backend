import { prisma } from "../prisma/client.js";
import { deliveryFeeService } from "./deliveryFee.service.js";
import { loyaltyService } from "./loyalty.service.js";
export class CartService {
    // MAIN CHECKOUT ENGINE
    async checkout(customerId, data) {
        const { branchId, addressId, items, promoCode, rewardId, scheduledFor } = data;
        // 1. Validate branch
        const branch = await prisma.branch.findUnique({ where: { id: branchId } });
        if (!branch)
            throw new Error("Invalid branch");
        // 2. Validate address
        const address = await prisma.address.findUnique({ where: { id: addressId } });
        if (!address)
            throw new Error("Invalid address");
        // 3. Validate branch schedule
        const schedule = await prisma.branchSchedule.findMany({ where: { branchId } });
        const now = scheduledFor ? new Date(scheduledFor) : new Date();
        const day = now.getDay() === 0 ? 6 : now.getDay() - 1;
        const todaysSchedule = schedule.find(s => s.day === day);
        if (!todaysSchedule)
            throw new Error("Branch closed today");
        const time = now.toTimeString().slice(0, 5);
        if (time < todaysSchedule.openTime || time > todaysSchedule.closeTime) {
            throw new Error("Branch is closed at this time");
        }
        // 4. Validate items + calculate subtotal
        let subtotal = 0;
        const validatedItems = [];
        for (const cartItem of items) {
            const item = await prisma.menuItem.findFirst({
                where: { id: cartItem.itemId }
            });
            if (!item || item.autoDisable) {
                throw new Error("Item unavailable");
            }
            const totalItemPrice = item.price * cartItem.quantity;
            subtotal += totalItemPrice;
            validatedItems.push({
                ...cartItem,
                basePrice: item.price,
                finalPrice: totalItemPrice
            });
        }
        // 5. Apply promo code
        let promoDiscount = 0;
        let appliedPromo = null;
        if (promoCode) {
            const promo = await loyaltyService.applyPromoCode(promoCode);
            if (promo) {
                appliedPromo = promo;
                if (promo.discount)
                    promoDiscount = subtotal * promo.discount;
                if (promo.amountOff)
                    promoDiscount = promo.amountOff;
            }
        }
        // 6. Apply reward
        let rewardDiscount = 0;
        let appliedReward = null;
        if (rewardId) {
            const reward = await loyaltyService.redeemReward(customerId, rewardId);
            appliedReward = reward;
            if (reward.discount)
                rewardDiscount = subtotal * reward.discount;
            if (reward.amountOff)
                rewardDiscount = reward.amountOff;
        }
        // 7. Delivery fee
        const feeResult = await deliveryFeeService.calculate(branchId, {
            ...address,
            orderTotal: subtotal
        });
        if (!feeResult.allowed) {
            throw new Error(feeResult.reason || "Address out of delivery zone");
        }
        const deliveryFee = feeResult.fee;
        // 8. Taxes (simple 7% VAT for food)
        const tax = subtotal * 0.07;
        // 9. Final total
        const total = subtotal - promoDiscount - rewardDiscount + deliveryFee + tax;
        // 10. Fee locking for scheduled orders
        const lockedFee = scheduledFor ? deliveryFee : null;
        return {
            branchId,
            addressId,
            items: validatedItems,
            subtotal,
            promoDiscount,
            rewardDiscount,
            deliveryFee,
            lockedFee,
            tax,
            total,
            appliedPromo,
            appliedReward
        };
    }
}
export const cartService = new CartService();
