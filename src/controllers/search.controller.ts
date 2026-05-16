import { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../globalTypes.js";
import { searchService } from "../services/search.service.js";
import { success, fail } from "./controllerHelper.js";
import { searchQuerySchema } from "../validation/search.schema.js";

const validationMessage = (issues: { message: string }[]) =>
  issues.map((i) => i.message).join(", ") || "Invalid input";

export const SearchController = {
  menu: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const parsed = searchQuerySchema.safeParse(req.query);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const { q } = parsed.data;
      const customerId = req.user?.id;

      await searchService.recordSearch(q);

      const results = await searchService.searchMenu(q, customerId);
      return success(res, results, "Menu search results");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  branches: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const parsed = searchQuerySchema.safeParse(req.query);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const { q } = parsed.data;
      await searchService.recordSearch(q);
      const results = await searchService.searchBranches(q);
      return success(res, results, "Branch search results");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  categories: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const parsed = searchQuerySchema.safeParse(req.query);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const { q } = parsed.data;
      await searchService.recordSearch(q);
      const results = await searchService.searchCategories(q);
      return success(res, results, "Category search results");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  topSearches: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const results = await searchService.topSearches();
      return success(res, results, "Top searches");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  }
};
