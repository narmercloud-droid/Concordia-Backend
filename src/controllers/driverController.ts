import { Request, Response, NextFunction } from "express";
import {
  getAvailableDrivers,
  getDriver
} from "../services/driverService.js";
import { success, fail } from "./controllerHelper.js";
import { driverIdParamSchema } from "../validation/common.schema.js";

const validationMessage = (issues: { message: string }[]) =>
  issues.map((i) => i.message).join(", ") || "Invalid input";

export function getAvailableDriversController(req: Request, res: Response, next: NextFunction) {
  try {
    const drivers = getAvailableDrivers();
    return success(res, drivers, "Drivers listed");
  } catch (err: unknown) {
    return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
  }
}

export function getDriverController(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = driverIdParamSchema.safeParse(req.params);
    if (!parsed.success) {
      return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
    }
    const driver = getDriver(parsed.data.driverId);
    if (!driver) return fail(res, "NOT_FOUND", "Driver not found", 404);

    return success(res, driver, "Driver fetched");
  } catch (err: unknown) {
    return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
  }
}
