import { z } from "zod";

const searchQueryString = z.preprocess((v: unknown) => {
  if (Array.isArray(v)) return typeof v[0] === "string" ? v[0] : undefined;
  return typeof v === "string" ? v : undefined;
}, z.string().min(1, "Search query is required"));

export const searchQuerySchema = z.object({
  q: searchQueryString
});
