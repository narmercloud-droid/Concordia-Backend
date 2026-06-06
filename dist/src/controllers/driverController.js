import { getAvailableDrivers, getDriver } from "../services/driverService.js";
import { success, fail } from "./controllerHelper.js";
export function getAvailableDriversController(req, res, next) {
    const drivers = getAvailableDrivers();
    return success(res, drivers);
}
export function getDriverController(req, res, next) {
    const driver = getDriver(req.params.driverId);
    if (!driver)
        return fail(res, "Driver not found", 404);
    return success(res, driver);
}
