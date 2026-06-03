import { DRIVER_EVENTS } from "./eventTypes.js";
import logger from "../utils/logger.js";
const drivers = new Map();
export function registerDriverEvents(io, socket) {
    const driverId = socket.id; // Guest driver = socket ID
    logger.info(`Driver connected: ${driverId}`);
    drivers.set(driverId, {
        driverId,
        available: false,
        location: null
    });
    socket.on(DRIVER_EVENTS.LOCATION_UPDATE, (coords) => {
        const driver = drivers.get(driverId);
        if (!driver)
            return;
        driver.location = coords;
        io.emit("driver:location:broadcast", {
            driverId,
            location: coords
        });
    });
    socket.on(DRIVER_EVENTS.AVAILABILITY_UPDATE, (available) => {
        const driver = drivers.get(driverId);
        if (!driver)
            return;
        driver.available = available;
        io.emit("driver:availability:broadcast", {
            driverId,
            available
        });
    });
    socket.on(DRIVER_EVENTS.JOIN_ORDER, (orderId) => {
        socket.join(`order_${orderId}`);
        logger.info(`Driver ${driverId} joined order room ${orderId}`);
    });
    socket.on(DRIVER_EVENTS.LEAVE_ORDER, (orderId) => {
        socket.leave(`order_${orderId}`);
        logger.info(`Driver ${driverId} left order room ${orderId}`);
    });
    socket.on("disconnect", () => {
        drivers.delete(driverId);
        logger.info(`Driver disconnected: ${driverId}`);
    });
}
