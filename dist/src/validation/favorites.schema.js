import { z } from "zod";
export const favoritesBodySchema = z.object({
    itemId: z.string().min(1)
});
