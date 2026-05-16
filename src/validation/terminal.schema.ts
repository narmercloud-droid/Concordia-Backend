import { z } from "zod";

export const terminalActivateSchema = z.object({
  branchId: z.string().min(1)
});

export const terminalRegisterSchema = z.object({
  activation_token: z.string().min(1),
  terminal_name: z.string().min(1)
});

export const terminalLoginSchema = z.object({
  terminal_token: z.string().min(1)
});

export const terminalOrderIdParamSchema = z.object({
  order_id: z.string().min(1)
});
