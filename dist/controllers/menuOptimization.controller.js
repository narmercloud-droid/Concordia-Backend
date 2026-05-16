import { menuOptimizationService } from "../services/menuOptimization.service.js";
import { success, fail } from "./controllerHelper.js";
export const MenuOptimizationController = {
    optimize: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const result = await menuOptimizationService.optimize(branchId);
            return success(res, result, "Menu optimized");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    }
};
