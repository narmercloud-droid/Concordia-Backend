import type { AuthenticatedRequest } from "../globalTypes.ts";
import { staffingPrepService } from "../services/staffingPrep.service.ts";
import { wrap } from "../contracts/api.js";

export const StaffingPrepController = {
  fullPlan: wrap(async (req: AuthenticatedRequest) => {
    const branchId = req.user!.branchId;
    const result = await staffingPrepService.fullPlan(branchId);
    return result;
  }),
};







