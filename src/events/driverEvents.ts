import { Server, Socket } from "socket.io";
import { DRIVER_EVENTS } from "./eventTypes";
import logger from "../utils/logger";

interface DriverState {
  driverId: string;
  available: boolean;
  location: { lat: number; lng: number } | null;
}

const drivers = new Map<string, DriverState>();

export function registerDriverEvents(io: Server, socket: Socket) {
  const driverId = socket.id; // Guest driver = socket ID
  logger.info(`Driver connected: ${driverId}`);

  drivers.set(driverId, {
    driverId,
    available: false,
    location: null
  });

  socket.on(DRIVER_EVENTS.LOCATION_UPDATE, (coords) => {
    const driver = drivers.get(driverId);
    if (!driver) return;

    driver.location = coords;

    io.emit("driver:location:broadcast", {
      driverId,
      location: coords
    });
  });

  socket.on(DRIVER_EVENTS.AVAILABILITY_UPDATE, (available: boolean) => {
    const driver = drivers.get(driverId);
    if (!driver) return;

    driver.available = available;

    io.emit("driver:availability:broadcast", {
      driverId,
      available
    });
  });

  socket.on(DRIVER_EVENTS.JOIN_ORDER, (orderId: string) => {
    socket.join(`order_${orderId}`);
    logger.info(`Driver ${driverId} joined order room ${orderId}`);
  });

  socket.on(DRIVER_EVENTS.LEAVE_ORDER, (orderId: string) => {
    socket.leave(`order_${orderId}`);
    logger.info(`Driver ${driverId} left order room ${orderId}`);
  });

  socket.on("disconnect", () => {
    drivers.delete(driverId);
    logger.info(`Driver disconnected: ${driverId}`);
  });
}
