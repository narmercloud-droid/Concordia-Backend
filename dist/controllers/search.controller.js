import { searchService } from "../services/search.service.js";
import { success, fail } from "./controllerHelper.js";
import { searchQuerySchema } from "../validation/search.schema.js";
const validationMessage = (issues) => issues.map((i) => i.message).join(", ") || "Invalid input";
export const SearchController = {
    menu: async (req, res, next) => {
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
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    },
    branches: async (req, res, next) => {
        try {
            const parsed = searchQuerySchema.safeParse(req.query);
            if (!parsed.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
            }
            const { q } = parsed.data;
            await searchService.recordSearch(q);
            const results = await searchService.searchBranches(q);
            return success(res, results, "Branch search results");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    },
    categories: async (req, res, next) => {
        try {
            const parsed = searchQuerySchema.safeParse(req.query);
            if (!parsed.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
            }
            const { q } = parsed.data;
            await searchService.recordSearch(q);
            const results = await searchService.searchCategories(q);
            return success(res, results, "Category search results");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    },
    topSearches: async (req, res, next) => {
        try {
            const results = await searchService.topSearches();
            return success(res, results, "Top searches");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    }
};
