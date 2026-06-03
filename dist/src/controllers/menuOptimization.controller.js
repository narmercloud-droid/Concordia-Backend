import { menuOptimizationService } from "../services/menuOptimization.service.js";
import { success } from "./controllerHelper.js";
export const MenuOptimizationController = {
    optimize: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const result = await menuOptimizationService.optimize(branchId);
            return success(res, result);
        }
        catch (err) {
            next(err);
        }
    },
};
