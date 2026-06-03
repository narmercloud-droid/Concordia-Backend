import { staffingPrepService } from "../services/staffingPrep.service.js";
import { wrap } from "../contracts/api.js";
export const StaffingPrepController = {
    fullPlan: wrap(async (req) => {
        const branchId = req.user.branchId;
        const result = await staffingPrepService.fullPlan(branchId);
        return result;
    }),
};
