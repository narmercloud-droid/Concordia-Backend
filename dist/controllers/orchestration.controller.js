import { orchestrationService } from "../services/orchestration.service.js";
import { wrap } from "../contracts/api.js";
export const OrchestrationController = {
    runAll: wrap(async (req) => {
        const branchId = req.user.branchId;
        const result = await orchestrationService.runAll(branchId);
        return result;
    }),
    trigger: wrap(async (req) => {
        const branchId = req.user.branchId;
        const { event } = req.body;
        const result = await orchestrationService.eventTrigger(branchId, event);
        return result;
    }),
    logs: wrap(async (req) => {
        const branchId = req.user.branchId;
        const logs = await orchestrationService.logs(branchId);
        return logs;
    }),
};
