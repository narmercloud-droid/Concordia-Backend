import { getAvailableDrivers, getDriver } from "../services/driverService.js";
export function getAvailableDriversController(req, res, next) {
    const drivers = getAvailableDrivers();
    res.json(drivers);
}
export function getDriverController(req, res, next) {
    const driver = getDriver(req.params.driverId);
    if (!driver)
        return res.status(404).json({ message: "Driver not found" });
    res.json(driver);
}
