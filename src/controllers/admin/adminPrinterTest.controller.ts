import { testKitchenPrinter } from "../../services/printer/printerTest.service.ts";
import { wrap, fail } from "../../contracts/api.js";

export const runPrinterTest = wrap(async (req) => {
  try {
    const { kitchen } = req.params;

    await testKitchenPrinter(kitchen);

    return {
      success: true,
      kitchen,
      message: "Test print sent"
    };
  } catch (err) {
    console.error(err);
    throw fail('INTERNAL_ERROR', (err as Error).message || "Server error");
  }
});

