import { menuOptimizationService } from "../services/menuOptimization.service.js";
import { wrap } from "../contracts/api.js";
export const MenuOptimizationController = {
    optimize: wrap(async (req) => {
        const branchId = req.user.branchId;
        const result = await menuOptimizationService.optimize(branchId);
        return result;
    }),
};
