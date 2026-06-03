import { conversationalService } from "../services/conversational.service.js";
import { wrap } from "./../contracts/api.js";
export const ConversationalController = {
    talk: wrap(async (req) => {
        const branchId = req.user.branchId;
        const { message } = req.body;
        const response = await conversationalService.respond(branchId, message);
        return { message, response };
    }),
    history: wrap(async (req) => {
        const branchId = req.user.branchId;
        const logs = await conversationalService.history(branchId);
        return logs;
    })
};
