import { ltvChurnService } from "../services/ltvChurn.service.js";
import { success } from "./controllerHelper.js";
export const LtvChurnController = {
    segment: async (req, res, next) => {
        try {
            const customerId = req.params.customerId;
            const result = await ltvChurnService.segment(customerId);
            return success(res, result);
        }
        catch (err) {
            next(err);
        }
    },
    branchSegments: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const result = await ltvChurnService.branchSegments(branchId);
            return success(res, result);
        }
        catch (err) {
            next(err);
        }
    },
};
