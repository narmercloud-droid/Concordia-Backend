import type { AuthenticatedRequest } from "../globalTypes.ts";
import { menuOptimizationService } from "../services/menuOptimization.service.ts";
import { wrap } from "../contracts/api.js";

export const MenuOptimizationController = {
  optimize: wrap(async (req: AuthenticatedRequest) => {
    const branchId = req.user!.branchId;
    const result = await menuOptimizationService.optimize(branchId);
    return result;
  }),
};







