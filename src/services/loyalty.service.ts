export const loyaltyService = {
  applyPoints: (...args: any[]) => ({ success: true, points: 0 }),
  redeemReward: (...args: any[]) => ({ success: true, reward: { discount: 0, amountOff: 0 } }),
  applyPromoCode: (...args: any[]) => ({ success: true, discount: 0, amountOff: 0 }),
  applyReferral: (...args: any[]) => ({ success: true, bonus: 0 })
};
