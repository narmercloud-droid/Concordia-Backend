import { prisma } from "../../prisma/client.js";
import { signToken, verifyToken } from "../../utils/jwt";
import crypto from "crypto";
export class TerminalService {
    // -----------------------------------------------------
    // ACTIVATE TERMINAL
    // -----------------------------------------------------
    static async activateTerminal(branch_code) {
        const branch = await prisma.branch.findUnique({
            where: { branch_code },
        });
        if (!branch) {
            throw new Error("Branch not found");
        }
        return signToken({
            branch_id: branch.id,
            branch_code: branch.branch_code,
            type: "terminal_activation",
        });
    }
    // -----------------------------------------------------
    // REGISTER TERMINAL
    // -----------------------------------------------------
    static async registerTerminal(activation_token, terminal_name) {
        const payload = verifyToken(activation_token);
        if (payload.type !== "terminal_activation") {
            throw new Error("Invalid activation token");
        }
        const branch = await prisma.branch.findUnique({
            where: { id: payload.branch_id },
        });
        if (!branch) {
            throw new Error("Branch not found");
        }
        const existingTerminal = await prisma.terminal.findUnique({
            where: { activation_token },
        });
        if (existingTerminal) {
            throw new Error("Terminal has already been registered");
        }
        // Generate secure random token
        const terminal_token = crypto.randomBytes(32).toString("hex");
        const terminal = await prisma.branchTerminal.create({
            data: {
                name: terminal_name,
                terminal_token,
                branch_id: branch.id,
            },
        });
        // Still create the Terminal record for activation tracking
        await prisma.terminal.create({
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
        const terminal = await prisma.branchTerminal.findUnique({
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
        return prisma.order.findMany({
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
        await prisma.branchTerminal.update({
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
        const order = await prisma.order.findUnique({ where: { order_id } });
        if (!order) {
            throw new Error("Order not found");
        }
        const updatedOrder = await prisma.order.update({
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
    static async assignOrder(order_id, terminal_id) {
        const terminal = await prisma.branchTerminal.findUnique({
            where: { id: terminal_id },
        });
        if (!terminal) {
            throw new Error("Terminal not found");
        }
        const order = await prisma.order.findUnique({
            where: { order_id },
        });
        if (!order) {
            throw new Error("Order not found");
        }
        if (order.terminal_id !== null) {
            throw new Error("Order is already assigned to a terminal");
        }
        const updatedOrder = await prisma.order.update({
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
        // Emit socket event
        const { getIO } = await import("../../lib/socket");
        const payload = {
            order_id: updatedOrder.order_id,
            terminal_id: updatedOrder.terminal_id,
            status: updatedOrder.status,
            branch_id: updatedOrder.branch_id
        };
        getIO().to(`terminal_${terminal_id}`).emit("order_assigned", payload);
        getIO().to(`branch_${updatedOrder.branch_id}`).emit("order_assigned", payload);
        // Emit order status to branch
        const { OrderService } = await import("../order/order.service");
        OrderService.emitOrderStatus(updatedOrder);
        return updatedOrder;
    }
    // -----------------------------------------------------
    // ASSIGN ORDER TO TERMINAL (LEGACY)
    // -----------------------------------------------------
    static async assignOrderToTerminal(order_id, terminal_id) {
        const terminal = await prisma.branchTerminal.findUnique({
            where: { id: terminal_id },
        });
        if (!terminal) {
            throw new Error("Terminal not found");
        }
        const order = await prisma.order.findUnique({
            where: { order_id },
        });
        if (!order) {
            throw new Error("Order not found");
        }
        const updatedOrder = await prisma.order.update({
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
        const order = await prisma.order.findUnique({
            where: { order_id },
        });
        if (!order) {
            throw new Error("Order not found");
        }
        if (order.terminal_id !== terminal_id) {
            throw new Error("Terminal not assigned to this order");
        }
        const updatedOrder = await prisma.order.update({
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
        // Emit socket event
        const { getIO } = await import("../../lib/socket");
        const payload = {
            order_id: updatedOrder.order_id,
            terminal_id: updatedOrder.terminal_id,
            status: updatedOrder.status,
            branch_id: updatedOrder.branch_id
        };
        getIO().to(`terminal_${terminal_id}`).emit("order_accepted", payload);
        getIO().to(`branch_${updatedOrder.branch_id}`).emit("order_accepted", payload);
        // Emit order status to branch
        const { OrderService } = await import("../order/order.service");
        OrderService.emitOrderStatus(updatedOrder);
        return updatedOrder;
    }
    // -----------------------------------------------------
    // REJECT ORDER
    // -----------------------------------------------------
    static async rejectOrder(order_id, terminal_id) {
        const order = await prisma.order.findUnique({
            where: { order_id },
        });
        if (!order) {
            throw new Error("Order not found");
        }
        if (order.terminal_id !== terminal_id) {
            throw new Error("Terminal not assigned to this order");
        }
        const updatedOrder = await prisma.order.update({
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
        // Emit socket event
        const { getIO } = await import("../../lib/socket");
        const payload = {
            order_id: updatedOrder.order_id,
            terminal_id: updatedOrder.terminal_id,
            status: updatedOrder.status,
            branch_id: updatedOrder.branch_id
        };
        getIO().to(`terminal_${terminal_id}`).emit("order_rejected", payload);
        getIO().to(`branch_${updatedOrder.branch_id}`).emit("order_rejected", payload);
        // Emit order status to branch
        const { OrderService } = await import("../order/order.service");
        OrderService.emitOrderStatus(updatedOrder);
        return updatedOrder;
    }
}
