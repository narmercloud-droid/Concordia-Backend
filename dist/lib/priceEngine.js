export const priceEngine = {
    calculateCartTotal: (cart) => {
        return cart.items.reduce((sum, item) => sum +
            item.basePrice * item.quantity +
            (item.variant?.price || 0) +
            (item.extras?.reduce((eSum, e) => eSum + e.price, 0) || 0), 0);
    },
    applyPricingRules: (total) => {
        return total;
    }
};
