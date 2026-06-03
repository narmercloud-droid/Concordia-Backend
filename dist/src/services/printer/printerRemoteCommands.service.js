import logger from "../../logger.js";
export async function remoteRestart(printer) {
    logger.info({ printerId: printer.id }, "REMOTE COMMAND: Restart printer");
}
export async function remoteReset(printer) {
    logger.info({ printerId: printer.id }, "REMOTE COMMAND: Reset printer");
}
export async function remoteTestPrint(printer) {
    logger.info({ printerId: printer.id }, "REMOTE COMMAND: Test print");
}
