import escpos from "escpos";
import escposNetwork from "escpos-network";
import { kitchenPrinters } from "../../config/printers.js";
escpos.Network = escposNetwork;
export async function testKitchenPrinter(kitchen) {
    const cfg = kitchenPrinters[kitchen];
    if (!cfg)
        throw new Error("Printer not configured");
    return new Promise((resolve, reject) => {
        const device = new escpos.Network(cfg.host, cfg.port);
        const printer = new escpos.Printer(device);
        device.open(() => {
            printer
                .align("CT")
                .style("B")
                .size(2, 2)
                .text("TEST PRINT")
                .size(1, 1)
                .text("------------------------")
                .text(`Kitchen ${kitchen}`)
                .text(`Time: ${new Date().toLocaleTimeString()}`)
                .text("------------------------")
                .text("If you can read this,")
                .text("your printer is working.")
                .cut()
                .close();
            resolve(true);
        });
        device.on("error", (err) => reject(err));
    });
}
