import { conversationalService } from "../services/conversational.service.js";
export const ConversationalController = {
    talk: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const { message } = req.body;
            const response = await conversationalService.respond(branchId, message);
            res.json({ message, response });
        }
        catch (err) {
            next(err);
        }
    },
    history: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const logs = await conversationalService.history(branchId);
            res.json(logs);
        }
        catch (err) {
            next(err);
        }
    }
};
