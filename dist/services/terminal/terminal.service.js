"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerminalService = void 0;
const client_1 = require("../../prisma/client");
const jwt_1 = require("../../utils/jwt");
const crypto_1 = __importDefault(require("crypto"));
class TerminalService {
    // -----------------------------------------------------
    // ACTIVATE TERMINAL
    // -----------------------------------------------------
    static async activateTerminal(branch_code) {
        const branch = await client_1.prisma.branch.findUnique({
            where: { branch_code },
        });
        if (!branch) {
            throw new Error("Branch not found");
        }
        return (0, jwt_1.signToken)({
            branch_id: branch.id,
            branch_code: branch.branch_code,
            type: "terminal_activation",
        });
    }
    // -----------------------------------------------------
    // REGISTER TERMINAL
    // -----------------------------------------------------
    static async registerTerminal(activation_token, terminal_name) {
        const payload = (0, jwt_1.verifyToken)(activation_token);
        if (payload.type !== "terminal_activation") {
            throw new Error("Invalid activation token");
        }
        const branch = await client_1.prisma.branch.findUnique({
            where: { id: payload.branch_id },
        });
        if (!branch) {
            throw new Error("Branch not found");
        }
        const existingTerminal = await client_1.prisma.terminal.findUnique({
            where: { activation_token },
        });
        if (existingTerminal) {
            throw new Error("Terminal has already been registered");
        }
        // Generate secure random token
        const terminal_token = crypto_1.default.randomBytes(32).toString("hex");
        const terminal = await client_1.prisma.branchTerminal.create({
            data: {
                name: terminal_name,
                terminal_token,
                branch_id: branch.id,
            },
        });
        // Still create the Terminal record for activation tracking
        await client_1.prisma.terminal.create({
            data: {
                name: terminal_name,
                activation_token,
                branch_id: branch.id,
            },
        });
        return { ...terminal, terminal_token };
    }
    // -----------------------------------------------------
    // LOGIN TERMINAL
    // -----------------------------------------------------
    static async loginTerminal(terminal_token) {
        const terminal = await client_1.prisma.branchTerminal.findUnique({
            where: { terminal_token },
        });
        if (!terminal) {
            throw new Error("Invalid terminal token");
        }
        return terminal;
    }
    // -----------------------------------------------------
    // GET BRANCH ORDERS
    // -----------------------------------------------------
    static async getBranchOrders(branch_id) {
        return client_1.prisma.order.findMany({
            where: { branch_id },
            orderBy: { createdAt: "asc" },
            include: {
                items: {
                    include: {
                        item: true,
                        variant: true,
                        toppings: {
                            include: { topping: true },
                        },
                        extras: {
                            include: { extra: true },
                        },
                    },
                },
            },
        });
    }
    // -----------------------------------------------------
    // UPDATE TERMINAL HEARTBEAT
    // -----------------------------------------------------
    static async updateHeartbeat(terminal_id) {
        await client_1.prisma.branchTerminal.update({
            where: { id: terminal_id },
            data: {
                last_seen: new Date(),
                is_online: true,
            },
        });
        console.log(`Terminal ${terminal_id} marked online via heartbeat`);
    }
    // -----------------------------------------------------
    // ACKNOWLEDGE ORDER
    // -----------------------------------------------------
    static async acknowledgeOrder(order_id, terminal_id) {
        const order = await client_1.prisma.order.findUnique({ where: { order_id } });
        if (!order) {
            throw new Error("Order not found");
        }
        const updatedOrder = await client_1.prisma.order.update({
            where: { order_id },
            data: {
                status: "acknowledged",
                terminal_id,
            },
            include: {
                items: {
                    include: {
                        item: true,
                        variant: true,
                        toppings: { include: { topping: true } },
                        extras: { include: { extra: true } },
                    },
                },
            },
        });
        return updatedOrder;
    }
    // -----------------------------------------------------
    // ASSIGN ORDER TO TERMINAL
    // -----------------------------------------------------
    static async assignOrderToTerminal(order_id, terminal_id) {
        const terminal = await client_1.prisma.branchTerminal.findUnique({
            where: { id: terminal_id },
        });
        if (!terminal) {
            throw new Error("Terminal not found");
        }
        const order = await client_1.prisma.order.findUnique({
            where: { order_id },
        });
        if (!order) {
            throw new Error("Order not found");
        }
        const updatedOrder = await client_1.prisma.order.update({
            where: { order_id },
            data: {
                terminal_id,
                status: "assigned",
            },
            include: {
                items: {
                    include: {
                        item: true,
                        variant: true,
                        toppings: { include: { topping: true } },
                        extras: { include: { extra: true } },
                    },
                },
            },
        });
        return updatedOrder;
    }
    // -----------------------------------------------------
    // ACCEPT ORDER
    // -----------------------------------------------------
    static async acceptOrder(order_id, terminal_id) {
        const order = await client_1.prisma.order.findUnique({
            where: { order_id },
        });
        if (!order) {
            throw new Error("Order not found");
        }
        if (order.terminal_id !== terminal_id) {
            throw new Error("Terminal not assigned to this order");
        }
        const updatedOrder = await client_1.prisma.order.update({
            where: { order_id },
            data: { status: "accepted" },
            include: {
                items: {
                    include: {
                        item: true,
                        variant: true,
                        toppings: { include: { topping: true } },
                        extras: { include: { extra: true } },
                    },
                },
            },
        });
        return updatedOrder;
    }
    // -----------------------------------------------------
    // REJECT ORDER
    // -----------------------------------------------------
    static async rejectOrder(order_id, terminal_id) {
        const order = await client_1.prisma.order.findUnique({
            where: { order_id },
        });
        if (!order) {
            throw new Error("Order not found");
        }
        if (order.terminal_id !== terminal_id) {
            throw new Error("Terminal not assigned to this order");
        }
        const updatedOrder = await client_1.prisma.order.update({
            where: { order_id },
            data: {
                status: "rejected",
                terminal_id: null,
            },
            include: {
                items: {
                    include: {
                        item: true,
                        variant: true,
                        toppings: { include: { topping: true } },
                        extras: { include: { extra: true } },
                    },
                },
            },
        });
        return updatedOrder;
    }
}
exports.TerminalService = TerminalService;
