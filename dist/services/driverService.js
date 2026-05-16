const drivers = new Map();
export function registerDriver(driverId) {
    const driver = {
        driverId,
        available: false,
        location: null,
        currentOrderId: null
    };
    drivers.set(driverId, driver);
    return driver;
}
export function unregisterDriver(driverId) {
    drivers.delete(driverId);
}
export function updateDriverLocation(driverId, coords) {
    const driver = drivers.get(driverId);
    if (!driver)
        return null;
    driver.location = coords;
    return driver;
}
export function updateDriverAvailability(driverId, available) {
    const driver = drivers.get(driverId);
    if (!driver)
        return null;
    driver.available = available;
    return driver;
}
export function assignDriverToOrder(driverId, orderId) {
    const driver = drivers.get(driverId);
    if (!driver)
        return null;
    driver.currentOrderId = orderId;
    return driver;
}
export function getAvailableDrivers() {
    return Array.from(drivers.values()).filter((d) => d.available);
}
export function getDriver(driverId) {
    return drivers.get(driverId);
}
