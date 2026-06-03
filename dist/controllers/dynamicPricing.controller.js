import { dynamicPricingService } from "../services/dynamicPricing.service.js";
import { wrap } from "../contracts/api.js";
export const DynamicPricingController = {
    optimizeItem: wrap(async (req) => {
        const { itemId } = req.body;
        const result = await dynamicPricingService.applyPrice(itemId, "Manual optimize");
        return result;
    }),
    optimizeBranch: wrap(async (req) => {
        const branchId = req.user.branchId;
        const result = await dynamicPricingService.optimizeBranch(branchId);
        return result;
    }),
};
