var _a;
import { PrintService } from "../../services/print/print.service.js";
import { wrap } from "../../contracts/api.js";
export class PrintController {
}
_a = PrintController;
PrintController.printOrder = wrap(async (req) => {
    const { id } = req.params;
    await PrintService.printOrder(id);
    return { success: true, message: "Printed successfully" };
});
