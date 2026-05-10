"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailableDriversController = getAvailableDriversController;
exports.getDriverController = getDriverController;
const driverService_1 = require("../services/driverService");
function getAvailableDriversController(req, res) {
    const drivers = (0, driverService_1.getAvailableDrivers)();
    res.json(drivers);
}
function getDriverController(req, res) {
    const driver = (0, driverService_1.getDriver)(req.params.driverId);
    if (!driver)
        return res.status(404).json({ message: "Driver not found" });
    res.json(driver);
}
