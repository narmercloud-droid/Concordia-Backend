import { conversationalService } from "../services/conversational.service.js";
import { success } from "./controllerHelper.js";
export const ConversationalController = {
    talk: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const { message } = req.body;
            const response = await conversationalService.respond(branchId, message);
            return success(res, { message, response });
        }
        catch (err) {
            next(err);
        }
    },
    history: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const logs = await conversationalService.history(branchId);
            return success(res, logs);
        }
        catch (err) {
            next(err);
        }
    }
};
