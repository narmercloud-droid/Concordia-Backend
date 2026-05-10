"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrintController = void 0;
const print_service_1 = require("../../services/print/print.service");
class PrintController {
    static async printOrder(req, res) {
        try {
            const { id } = req.params;
            await print_service_1.PrintService.printOrder(id);
            res.json({ success: true, message: "Printed successfully" });
        }
        catch (err) {
            console.error("Print error:", err);
            res.status(500).json({ error: "Print failed" });
        }
    }
}
exports.PrintController = PrintController;
