import { z } from "zod";
export const loyaltyRedeemSchema = z.object({
    rewardId: z.string().min(1)
});
export const loyaltyPromoSchema = z.object({
    code: z.string().min(1)
});
export const loyaltyReferralSchema = z.object({
    code: z.string().min(1)
});
export const loyaltyRewardCreateSchema = z.record(z.string(), z.unknown());
export const loyaltyPromoCreateSchema = z.record(z.string(), z.unknown());
