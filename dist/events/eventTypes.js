"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ORDER_EVENTS = exports.DRIVER_EVENTS = void 0;
exports.DRIVER_EVENTS = {
    CONNECT: "driver:connect",
    DISCONNECT: "driver:disconnect",
    LOCATION_UPDATE: "driver:location:update",
    AVAILABILITY_UPDATE: "driver:availability:update",
    JOIN_ORDER: "driver:order:join",
    LEAVE_ORDER: "driver:order:leave"
};
exports.ORDER_EVENTS = {
    CREATED: "order:created",
    ASSIGNED: "order:assigned",
    STATUS_UPDATE: "order:status:update",
    CANCELLED: "order:cancelled",
    DELIVERED: "order:delivered"
};
