"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDriverEvents = registerDriverEvents;
const eventTypes_1 = require("./eventTypes");
const logger_1 = __importDefault(require("../utils/logger"));
const drivers = new Map();
function registerDriverEvents(io, socket) {
    const driverId = socket.id; // Guest driver = socket ID
    logger_1.default.info(`Driver connected: ${driverId}`);
    drivers.set(driverId, {
        driverId,
        available: false,
        location: null
    });
    socket.on(eventTypes_1.DRIVER_EVENTS.LOCATION_UPDATE, (coords) => {
        const driver = drivers.get(driverId);
        if (!driver)
            return;
        driver.location = coords;
        io.emit("driver:location:broadcast", {
            driverId,
            location: coords
        });
    });
    socket.on(eventTypes_1.DRIVER_EVENTS.AVAILABILITY_UPDATE, (available) => {
        const driver = drivers.get(driverId);
        if (!driver)
            return;
        driver.available = available;
        io.emit("driver:availability:broadcast", {
            driverId,
            available
        });
    });
    socket.on(eventTypes_1.DRIVER_EVENTS.JOIN_ORDER, (orderId) => {
        socket.join(`order_${orderId}`);
        logger_1.default.info(`Driver ${driverId} joined order room ${orderId}`);
    });
    socket.on(eventTypes_1.DRIVER_EVENTS.LEAVE_ORDER, (orderId) => {
        socket.leave(`order_${orderId}`);
        logger_1.default.info(`Driver ${driverId} left order room ${orderId}`);
    });
    socket.on("disconnect", () => {
        drivers.delete(driverId);
        logger_1.default.info(`Driver disconnected: ${driverId}`);
    });
}
