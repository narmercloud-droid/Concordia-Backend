import { PrintService } from "../../services/print/print.service.js";
export class PrintController {
    static async printOrder(req, res, next) {
        try {
            const { id } = req.params;
            await PrintService.printOrder(id);
            res.json({ success: true, message: "Printed successfully" });
        }
        catch (err) {
            next(err);
        }
    }
}
