import { z } from "zod";
export const deliveryFeeAddressSchema = z.record(z.string(), z.unknown());
export const deliveryFeeCalculateBodySchema = z
    .object({
    branchId: z.string().min(1),
    addressId: z.string().min(1),
    orderTotal: z.number().optional()
})
    .passthrough();
export const deliveryFeeZoneBodySchema = z.record(z.string(), z.unknown());
