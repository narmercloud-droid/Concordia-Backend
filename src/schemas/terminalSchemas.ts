import { z } from "zod";

export const activateTerminalSchema = z.object({
  body: z.object({
    branch_code: z.string(),
  }),
});

export const registerTerminalSchema = z.object({
  body: z.object({
    activation_token: z.string(),
    terminal_name: z.string(),
  }),
});

export const loginTerminalSchema = z.object({
  body: z.object({
    terminal_token: z.string(),
  }),
});
