import { Request, Response, NextFunction } from "express";
import {
  getAvailableDrivers,
  getDriver
} from "../services/driverService.js";

export function getAvailableDriversController(req: Request, res: Response, next: NextFunction) {
  const drivers = getAvailableDrivers();
  res.json(drivers);
}

export function getDriverController(req: Request, res: Response, next: NextFunction) {
  const driver = getDriver(req.params.driverId);
  if (!driver) return res.status(404).json({ message: "Driver not found" });

  res.json(driver);
}
