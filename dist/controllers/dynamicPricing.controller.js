import { dynamicPricingService } from "../services/dynamicPricing.service.js";
export const DynamicPricingController = {
    optimizeItem: async (req, res, next) => {
        try {
            const { itemId } = req.body;
            const result = await dynamicPricingService.applyPrice(itemId, "Manual optimize");
            res.json(result);
        }
        catch (err) {
            next(err);
        }
    },
    optimizeBranch: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const result = await dynamicPricingService.optimizeBranch(branchId);
            res.json(result);
        }
        catch (err) {
            next(err);
        }
    },
};
