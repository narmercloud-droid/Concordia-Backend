interface DriverState {
  driverId: string;
  available: boolean;
  location: { lat: number; lng: number } | null;
  currentOrderId: string | null;
}

const drivers = new Map<string, DriverState>();

export function registerDriver(driverId: string) {
  const driver: DriverState = {
    driverId,
    available: false,
    location: null,
    currentOrderId: null
  };

  drivers.set(driverId, driver);
  return driver;
}

export function unregisterDriver(driverId: string) {
  drivers.delete(driverId);
}

export function updateDriverLocation(driverId: string, coords: { lat: number; lng: number }) {
  const driver = drivers.get(driverId);
  if (!driver) return false;

  driver.location = coords;
  return driver;
}

export function updateDriverAvailability(driverId: string, available: boolean) {
  const driver = drivers.get(driverId);
  if (!driver) return false;

  driver.available = available;
  return driver;
}

export function assignDriverToOrder(driverId: string, orderId: string) {
  const driver = drivers.get(driverId);
  if (!driver) return false;

  driver.currentOrderId = orderId;
  return driver;
}

export function getAvailableDrivers() {
  return Array.from(drivers.values()).filter((d) => d.available);
}

export function getDriver(driverId: string) {
  return drivers.get(driverId);
}
