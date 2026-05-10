"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitOrderCreated = emitOrderCreated;
exports.emitOrderAssigned = emitOrderAssigned;
exports.emitOrderStatus = emitOrderStatus;
exports.emitOrderDelivered = emitOrderDelivered;
exports.emitOrderCancelled = emitOrderCancelled;
const eventTypes_1 = require("./eventTypes");
function emitOrderCreated(io, order) {
    io.emit(eventTypes_1.ORDER_EVENTS.CREATED, order);
}
function emitOrderAssigned(io, orderId, driverId) {
    io.emit("order:assigned", { orderId, driverId });
}
function emitOrderStatus(io, orderId, status) {
    io.emit(eventTypes_1.ORDER_EVENTS.STATUS_UPDATE, { orderId, status });
}
function emitOrderDelivered(io, orderId) {
    io.emit(eventTypes_1.ORDER_EVENTS.DELIVERED, { orderId });
}
function emitOrderCancelled(io, orderId) {
    io.emit(eventTypes_1.ORDER_EVENTS.CANCELLED, { orderId });
}
