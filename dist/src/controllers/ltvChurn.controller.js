import { ltvChurnService } from "../services/ltvChurn.service.js";
export const LtvChurnController = {
    segment: async (req, res, next) => {
        try {
            const customerId = req.params.customerId;
            const result = await ltvChurnService.segment(customerId);
            res.json(result);
        }
        catch (err) {
            next(err);
        }
    },
    branchSegments: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const result = await ltvChurnService.branchSegments(branchId);
            res.json(result);
        }
        catch (err) {
            next(err);
        }
    },
};
