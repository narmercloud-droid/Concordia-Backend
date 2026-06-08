import type { Request } from "express";
import { wrap } from "../../contracts/api.js";
import { reviewService } from "../../services/review.service.ts";

function branchId(req: Request) {
  return (req as any).managerBranchId as string;
}

function parseDate(value: unknown, endOfDay = false) {
  if (!value) return undefined;
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return undefined;
  if (endOfDay) {
    date.setHours(23, 59, 59, 999);
  } else {
    date.setHours(0, 0, 0, 0);
  }
  return date;
}

export const getBranchReviews = wrap(async (req: Request) => {
  const id = branchId(req);
  const fromDate = parseDate(req.query.from);
  const toDate = parseDate(req.query.to, true);
  const lowRatingsOnly = req.query.lowRatingsOnly === "true";

  const [reviews, summary] = await Promise.all([
    reviewService.listBranchReviews(id, { fromDate, toDate, lowRatingsOnly }),
    reviewService.branchRating(id)
  ]);

  return { reviews, summary };
});
