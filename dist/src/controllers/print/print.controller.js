import { PrintService } from "../../services/print/print.service.js";
import { success } from "../controllerHelper.js";
export class PrintController {
    static async printOrder(req, res, next) {
        try {
            const { id } = req.params;
            await PrintService.printOrder(id);
            return success(res, { success: true, message: "Printed successfully" });
        }
        catch (err) {
            next(err);
        }
    }
}
