import { dynamicPricingService } from "../services/dynamicPricing.service.js";
import { success, fail } from "./controllerHelper.js";
import { itemIdBodySchema } from "../validation/intelligence.schema.js";
const validationMessage = (issues) => issues.map((i) => i.message).join(", ") || "Invalid input";
export const DynamicPricingController = {
    optimizeItem: async (req, res, next) => {
        try {
            const parsed = itemIdBodySchema.safeParse(req.body);
            if (!parsed.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
            }
            const { itemId } = parsed.data;
            const result = await dynamicPricingService.applyPrice(itemId, "Manual optimize");
            return success(res, result, "Item optimized");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    },
    optimizeBranch: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const result = await dynamicPricingService.optimizeBranch(branchId);
            return success(res, result, "Branch optimized");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    }
};
