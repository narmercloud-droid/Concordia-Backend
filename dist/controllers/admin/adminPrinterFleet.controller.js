import { getFleet, updatePrinterPolicy, updatePrinterFirmware } from "../../services/printer/printerFleet.service.js";
import { remoteRestart, remoteReset, remoteTestPrint } from "../../services/printer/printerRemoteCommands.service.js";
import { wrap } from "../../contracts/api.js";
export const listFleet = wrap(async (_req) => {
    const fleet = await getFleet("concordia-kempen");
    return fleet;
});
export const setPolicy = wrap(async (req) => {
    const { printerId } = req.params;
    const { policy } = req.body;
    const updated = await updatePrinterPolicy("branch-001", printerId, policy);
    return updated;
});
export const setFirmware = wrap(async (req) => {
    const { printerId } = req.params;
    const { version } = req.body;
    const updated = await updatePrinterFirmware("concordia-kempen", printerId, version);
    return updated;
});
export const sendCommand = wrap(async (req) => {
    const { printerId, command } = req.params;
    const printer = { id: printerId };
    if (command === "restart")
        await remoteRestart(printer);
    if (command === "reset")
        await remoteReset(printer);
    if (command === "test")
        await remoteTestPrint(printer);
    return { ok: true };
});
