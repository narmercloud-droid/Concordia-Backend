import { ltvChurnService } from "../services/ltvChurn.service.js";
import { wrap } from "../contracts/api.js";
export const LtvChurnController = {
    segment: wrap(async (req) => {
        const customerId = req.params.customerId;
        const result = await ltvChurnService.segment(customerId);
        return result;
    }),
    branchSegments: wrap(async (req) => {
        const branchId = req.user.branchId;
        const result = await ltvChurnService.branchSegments(branchId);
        return result;
    }),
};
