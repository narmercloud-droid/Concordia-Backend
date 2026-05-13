import { menuOptimizationService } from "../services/menuOptimization.service.js";
export const MenuOptimizationController = {
    optimize: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const result = await menuOptimizationService.optimize(branchId);
            res.json(result);
        }
        catch (err) {
            next(err);
        }
    },
};
