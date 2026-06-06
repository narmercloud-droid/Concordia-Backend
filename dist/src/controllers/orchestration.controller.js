import { orchestrationService } from "../services/orchestration.service.js";
import { success } from "./controllerHelper.js";
export const OrchestrationController = {
    runAll: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const result = await orchestrationService.runAll(branchId);
            return success(res, result);
        }
        catch (err) {
            next(err);
        }
    },
    trigger: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const { event } = req.body;
            const result = await orchestrationService.eventTrigger(branchId, event);
            return success(res, result);
        }
        catch (err) {
            next(err);
        }
    },
    logs: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const logs = await orchestrationService.logs(branchId);
            return success(res, logs);
        }
        catch (err) {
            next(err);
        }
    },
};
