export const loyaltyService = {
    applyPoints: (...args) => ({ success: true, points: 0 }),
    redeemReward: (...args) => ({ success: true, reward: { discount: 0, amountOff: 0 } }),
    applyPromoCode: (...args) => ({ success: true, discount: 0, amountOff: 0 }),
    applyReferral: (...args) => ({ success: true, bonus: 0 })
};
