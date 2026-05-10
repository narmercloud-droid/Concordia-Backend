"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDriver = registerDriver;
exports.unregisterDriver = unregisterDriver;
exports.updateDriverLocation = updateDriverLocation;
exports.updateDriverAvailability = updateDriverAvailability;
exports.assignDriverToOrder = assignDriverToOrder;
exports.getAvailableDrivers = getAvailableDrivers;
exports.getDriver = getDriver;
const drivers = new Map();
function registerDriver(driverId) {
    const driver = {
        driverId,
        available: false,
        location: null,
        currentOrderId: null
    };
    drivers.set(driverId, driver);
    return driver;
}
function unregisterDriver(driverId) {
    drivers.delete(driverId);
}
function updateDriverLocation(driverId, coords) {
    const driver = drivers.get(driverId);
    if (!driver)
        return null;
    driver.location = coords;
    return driver;
}
function updateDriverAvailability(driverId, available) {
    const driver = drivers.get(driverId);
    if (!driver)
        return null;
    driver.available = available;
    return driver;
}
function assignDriverToOrder(driverId, orderId) {
    const driver = drivers.get(driverId);
    if (!driver)
        return null;
    driver.currentOrderId = orderId;
    return driver;
}
function getAvailableDrivers() {
    return Array.from(drivers.values()).filter((d) => d.available);
}
function getDriver(driverId) {
    return drivers.get(driverId);
}
