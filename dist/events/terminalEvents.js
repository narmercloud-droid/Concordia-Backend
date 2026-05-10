"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerTerminalEvents = registerTerminalEvents;
exports.emitOrderAssigned = emitOrderAssigned;
exports.emitOrderAccepted = emitOrderAccepted;
exports.emitOrderRejected = emitOrderRejected;
const client_1 = require("../prisma/client");
const terminal_service_1 = require("../services/terminal/terminal.service");
function registerTerminalEvents(io, socket) {
    socket.on("terminal_connected", async () => {
        const terminalToken = socket.handshake.auth?.terminal_token;
        if (!terminalToken) {
            console.log("Terminal socket connection failed: no terminal_token");
            socket.disconnect();
            return;
        }
        try {
            const terminal = await terminal_service_1.TerminalService.loginTerminal(terminalToken);
            socket.data.terminal_id = terminal.id;
            socket.data.branch_id = terminal.branch_id;
            socket.join(`terminal_${terminal.id}`);
            socket.join(`branch_${terminal.branch_id}`);
            console.log(`Terminal socket connection: ${terminal.name} (ID: ${terminal.id})`);
        }
        catch (err) {
            console.log(`Terminal socket connection failed: ${err.message}`);
            socket.disconnect();
        }
    });
    socket.on("disconnect", async () => {
        try {
            if (socket.data.terminal_id) {
                await client_1.prisma.branchTerminal.update({
                    where: { id: socket.data.terminal_id },
                    data: {
                        is_online: false,
                        last_seen: new Date(),
                    },
                });
                console.log(`Terminal ${socket.data.terminal_id} marked offline on disconnect`);
            }
        }
        catch (err) {
            console.error(`Error updating terminal offline status: ${err.message}`);
        }
    });
}
function emitOrderAssigned(order) {
    if (order.terminal_id) {
        io.to(`terminal_${order.terminal_id}`).emit("order_assigned", order);
    }
    io.to(`branch_${order.branch_id}`).emit("order_assigned", order);
}
function emitOrderAccepted(order) {
    if (order.terminal_id) {
        io.to(`terminal_${order.terminal_id}`).emit("order_accepted", order);
    }
    io.to(`branch_${order.branch_id}`).emit("order_accepted", order);
}
function emitOrderRejected(order, terminal_id) {
    if (terminal_id) {
        io.to(`terminal_${terminal_id}`).emit("order_rejected", order);
    }
    io.to(`branch_${order.branch_id}`).emit("order_rejected", order);
}
