export async function remoteRestart(printer) {
    console.log("REMOTE COMMAND: Restart printer", printer.id);
}
export async function remoteReset(printer) {
    console.log("REMOTE COMMAND: Reset printer", printer.id);
}
export async function remoteTestPrint(printer) {
    console.log("REMOTE COMMAND: Test print on", printer.id);
}
