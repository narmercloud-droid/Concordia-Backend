import { testKitchenPrinter } from "../../services/printer/printerTest.service.js";
import { success, fail } from "../controllerHelper.js";

export const runPrinterTest = async (req, res) => {
  try {
    const { kitchen } = req.params;

    const result = await testKitchenPrinter(kitchen);

    return success(res, {
      success: true,
      kitchen,
      message: "Test print sent"
    });
  } catch (err) {
    console.error(err);
    return fail(res, (err as Error).message || "Server error", 500);
  }
};

