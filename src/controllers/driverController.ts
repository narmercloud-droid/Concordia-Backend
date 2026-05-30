import type { Request, Response, NextFunction  } from "express";
import {
  getAvailableDrivers,
  getDriver
} from "../services/driverService.js";
import { success, fail } from "./controllerHelper.js";

export function getAvailableDriversController(req: Request, res: Response, next: NextFunction) {
  const drivers = getAvailableDrivers();
  return success(res, drivers);
}

export function getDriverController(req: Request, res: Response, next: NextFunction) {
  const driver = getDriver(req.params.driverId);
  if (!driver) return fail(res, "Driver not found", 404);

  return success(res, driver);
}





