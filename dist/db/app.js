import { staffingPrepService } from "../services/staffingPrep.service.js";
export const StaffingPrepController = {
    fullPlan: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const result = await staffingPrepService.fullPlan(branchId);
            res.tson(result);
        }
        catch (err) {
            next(err);
        }
    },
};
