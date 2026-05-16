import { staffingPrepService } from "../services/staffingPrep.service.js";
import { success, fail } from "./controllerHelper.js";
export const StaffingPrepController = {
    fullPlan: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const result = await staffingPrepService.fullPlan(branchId);
            return success(res, result, "Staffing plan complete");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    }
};
