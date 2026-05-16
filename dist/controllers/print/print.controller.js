import { PrintService } from "../../services/print/print.service.js";
import { success, fail } from "../controllerHelper.js";
import { idParamSchema } from "../../validation/common.schema.js";
const validationMessage = (issues) => issues.map((i) => i.message).join(", ") || "Invalid input";
export class PrintController {
    static async printOrder(req, res, next) {
        try {
            const parsed = idParamSchema.safeParse(req.params);
            if (!parsed.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
            }
            await PrintService.printOrder(parsed.data.id);
            return success(res, { success: true, message: "Printed successfully" }, "Printed");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    }
}
