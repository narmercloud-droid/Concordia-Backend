import { z } from "zod";
export const customerRegisterSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    password: z.string().optional()
});
export const customerLoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1)
});
export const customerRefreshSchema = z.object({
    refreshToken: z.string().min(1)
});
