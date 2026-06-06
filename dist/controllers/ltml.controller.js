import { ltmlService } from "../services/ltml.service.js";
import { wrap } from "../contracts/api.js";
export const LTMLController = {
    save: wrap(async (req) => {
        const branchId = req.user.branchId;
        const { module, key, value } = req.body;
        const result = await ltmlService.save(branchId, module, key, value);
        return result;
    }),
    trends: wrap(async (req) => {
        const branchId = req.user.branchId;
        const result = await ltmlService.generateTrends(branchId);
        return result;
    }),
    summary: wrap(async (req) => {
        const branchId = req.user.branchId;
        const result = await ltmlService.summary(branchId);
        return result;
    })
};
