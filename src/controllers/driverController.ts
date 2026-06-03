import type { Request } from "express";
import {
  getAvailableDrivers,
  getDriver
} from "../services/driverService.ts";
import { wrap, fail } from "../contracts/api.js";

export const getAvailableDriversController = wrap(async (_req: Request) => {
  const drivers = await getAvailableDrivers();
  return drivers;
});

export const getDriverController = wrap(async (req: Request) => {
  const driver = await getDriver(req.params.driverId);
  if (!driver) throw fail('NOT_FOUND', 'Driver not found');
  return driver;
});





