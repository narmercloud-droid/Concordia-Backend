export const dynamicPricingService = {
    calculatePrice: (...args) => ({ price: 0, adjustments: [] }),
    applyPrice: (...args) => ({ success: true }),
    optimizeBranch: (...args) => ({ optimizations: [] })
};
