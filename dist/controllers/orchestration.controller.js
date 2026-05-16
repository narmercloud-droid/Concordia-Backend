import { orchestrationService } from "../services/orchestration.service.js";
import { success, fail } from "./controllerHelper.js";
import { orchestrationEventBodySchema } from "../validation/intelligence.schema.js";
const validationMessage = (issues) => issues.map((i) => i.message).join(", ") || "Invalid input";
export const OrchestrationController = {
    runAll: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const result = await orchestrationService.runAll(branchId);
            return success(res, result, "Orchestration complete");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    },
    trigger: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const parsed = orchestrationEventBodySchema.safeParse(req.body);
            if (!parsed.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
            }
            const { event } = parsed.data;
            const result = await orchestrationService.eventTrigger(branchId, event);
            return success(res, result, "Event triggered");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    },
    logs: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const logs = await orchestrationService.logs(branchId);
            return success(res, logs, "Orchestration logs");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    }
};
