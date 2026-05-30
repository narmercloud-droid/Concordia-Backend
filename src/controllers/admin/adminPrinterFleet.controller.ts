import { getFleet, updatePrinterPolicy, updatePrinterFirmware } from "../../services/printer/printerFleet.service.js";
import { remoteRestart, remoteReset, remoteTestPrint } from "../../services/printer/printerRemoteCommands.service.js";
import { success } from "../controllerHelper.js";

export const listFleet = async (req, res) => {
  const fleet = await getFleet("branch-001");
  return success(res, fleet);
};

export const setPolicy = async (req, res) => {
  const { printerId } = req.params;
  const { policy } = req.body;
  const updated = await updatePrinterPolicy("branch-001", printerId, policy);
  return success(res, updated);
};

export const setFirmware = async (req, res) => {
  const { printerId } = req.params;
  const { version } = req.body;
  const updated = await updatePrinterFirmware("branch-001", printerId, version);
  return success(res, updated);
};

export const sendCommand = async (req, res) => {
  const { printerId, command } = req.params;

  const printer = { id: printerId };

  if (command === "restart") await remoteRestart(printer);
  if (command === "reset") await remoteReset(printer);
  if (command === "test") await remoteTestPrint(printer);

  return success(res, { ok: true });
};

