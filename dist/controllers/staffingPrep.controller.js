import { staffingPrepService } from "../services/staffingPrep.service.js";
import { success } from "./controllerHelper.js";
export const StaffingPrepController = {
    fullPlan: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const result = await staffingPrepService.fullPlan(branchId);
            return success(res, result);
        }
        catch (err) {
            next(err);
        }
    },
};
