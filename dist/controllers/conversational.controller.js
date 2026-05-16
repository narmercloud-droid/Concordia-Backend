import { conversationalService } from "../services/conversational.service.js";
import { success, fail } from "./controllerHelper.js";
import { conversationalTalkBodySchema } from "../validation/conversational.schema.js";
const validationMessage = (issues) => issues.map((i) => i.message).join(", ") || "Invalid input";
export const ConversationalController = {
    talk: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const parsed = conversationalTalkBodySchema.safeParse(req.body);
            if (!parsed.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
            }
            const { message } = parsed.data;
            const response = await conversationalService.respond(branchId, message);
            return success(res, { message, response }, "Response generated");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    },
    history: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const logs = await conversationalService.history(branchId);
            return success(res, logs, "Conversation history");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    }
};
