import { dynamicPricingService } from "../services/dynamicPricing.service.js";
import { success } from "./controllerHelper.js";
export const DynamicPricingController = {
    optimizeItem: async (req, res, next) => {
        try {
            const { itemId } = req.body;
            const result = await dynamicPricingService.applyPrice(itemId, "Manual optimize");
            return success(res, result);
        }
        catch (err) {
            next(err);
        }
    },
    optimizeBranch: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const result = await dynamicPricingService.optimizeBranch(branchId);
            return success(res, result);
        }
        catch (err) {
            next(err);
        }
    },
};
