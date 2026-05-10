"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerEvents = registerEvents;
const driverEvents_1 = require("./driverEvents");
const terminalEvents_1 = require("./terminalEvents");
function registerEvents(io) {
    io.on("connection", (socket) => {
        (0, driverEvents_1.registerDriverEvents)(io, socket);
        (0, terminalEvents_1.registerTerminalEvents)(io, socket);
    });
}
