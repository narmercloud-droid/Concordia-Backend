import { orchestrationService } from "../services/orchestration.service.js";
export const OrchestrationController = {
    runAll: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const result = await orchestrationService.runAll(branchId);
            res.json(result);
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
            res.json(result);
        }
        catch (err) {
            next(err);
        }
    },
    logs: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const logs = await orchestrationService.logs(branchId);
            res.json(logs);
        }
        catch (err) {
            next(err);
        }
    },
};
