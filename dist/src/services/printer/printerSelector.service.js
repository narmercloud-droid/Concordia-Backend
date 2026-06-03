import { kitchenPrinters } from "../../config/printers.js";
const rrIndex = {};
export function selectPrinter(kitchen) {
    const printers = kitchenPrinters[kitchen];
    if (!printers || printers.length === 0)
        return null;
    const online = printers.filter(p => p.status.online);
    // If at least one printer is online â†’ round robin
    if (online.length > 0) {
        if (!rrIndex[kitchen])
            rrIndex[kitchen] = 0;
        const printer = online[rrIndex[kitchen] % online.length];
        rrIndex[kitchen]++;
        return printer;
    }
    // If all printers offline â†’ fallback to first printer
    return printers[0];
}
