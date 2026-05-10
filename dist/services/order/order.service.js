"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const client_1 = require("../../prisma/client");
const pricing_service_1 = require("../cart/pricing.service");
const order_socket_1 = require("../../socket/order.socket");
const uuid_1 = require("uuid");
class OrderService {
    // -----------------------------------------------------
    // CREATE ORDER FROM CART
    // -----------------------------------------------------
    static async createOrder(cartId, branch_id) {
        const cart = await client_1.prisma.cart.findUnique({
            where: { cart_id: cartId },
            include: {
                items: {
                    include: {
                        variant: true,
                        toppings: true,
                        extras: true
                    }
                }
            }
        });
        if (!cart || cart.items.length === 0) {
            throw new Error("Cart is empty or does not exist");
        }
        const totals = await pricing_service_1.PricingService.calculateCart(cart);
        const orderId = `order_${(0, uuid_1.v4)()}`;
        const order = await client_1.prisma.order.create({
            data: {
                order_id: orderId,
                cart_id: cartId,
                branch_id: branch_id,
                subtotal: totals.subtotal,
                total: totals.total,
                status: "pending",
                terminal_id: null,
            }
        });
        // Save each cart item into order items
        for (const cartItem of cart.items) {
            const itemTotal = await pricing_service_1.PricingService.calculateCartItem(cartItem);
            const orderItem = await client_1.prisma.orderItem.create({
                data: {
                    order_id: orderId,
                    item_id: cartItem.item_id,
                    quantity: cartItem.quantity,
                    base_price: itemTotal / cartItem.quantity,
                    total_price: itemTotal
                }
            });
            // Variant
            if (cartItem.variant) {
                await client_1.prisma.orderItemVariant.create({
                    data: {
                        order_item_id: orderItem.id,
                        variant_id: cartItem.variant.variant_id,
                        price: 0
                    }
                });
            }
            // Toppings
            for (const topping of cartItem.toppings) {
                await client_1.prisma.orderItemTopping.create({
                    data: {
                        order_item_id: orderItem.id,
                        topping_id: topping.topping_id,
                        price: 0
                    }
                });
            }
            // Extras
            for (const extra of cartItem.extras) {
                await client_1.prisma.orderItemExtra.create({
                    data: {
                        order_item_id: orderItem.id,
                        extra_id: extra.extra_id,
                        price: 0
                    }
                });
            }
        }
        // Clear cart after order creation
        await client_1.prisma.cartItem.deleteMany({
            where: { cart_id: cartId }
        });
        this.emitOrderStatus(order);
        return order;
    }
    // -----------------------------------------------------
    static emitOrderStatus(order) {
        if (order.status === "pending") {
            order_socket_1.OrderSocket.orderCreated(order);
            return;
        }
        if (order.status === "assigned") {
            order_socket_1.OrderSocket.orderAssigned(order);
            return;
        }
        if (order.status === "accepted") {
            order_socket_1.OrderSocket.orderAccepted(order);
            return;
        }
        if (order.status === "rejected") {
            order_socket_1.OrderSocket.orderRejected(order, order.terminal_id ?? undefined);
            return;
        }
        order_socket_1.OrderSocket.orderUpdated(order);
    }
    // -----------------------------------------------------
    // UPDATE ORDER STATUS (with printing + ETA)
    // -----------------------------------------------------
    static async updateStatus(orderId, status, estimated_time) {
        const order = await client_1.prisma.order.update({
            where: { order_id: orderId },
            data: {
                status,
                estimated_time: estimated_time ?? undefined
            },
            include: {
                items: {
                    include: {
                        item: true,
                        variant: true,
                        toppings: { include: { topping: true } },
                        extras: { include: { extra: true } }
                    }
                }
            }
        });
        // Trigger printing when order is accepted/preparing
        if (status === "preparing") {
            const { PrintService } = await Promise.resolve().then(() => __importStar(require("../print/print.service")));
            await PrintService.printOrder(order.order_id);
        }
        order_socket_1.OrderSocket.orderUpdated(order);
        return order;
    }
    // -----------------------------------------------------
    // COURIER PICKUP (QR CODE SCAN)
    // -----------------------------------------------------
    static async courierPickup(orderId) {
        const order = await client_1.prisma.order.update({
            where: { order_id: orderId },
            data: { status: "picked_up" }
        });
        order_socket_1.OrderSocket.orderUpdated(order);
        return order;
    }
    // -----------------------------------------------------
    // GET ACTIVE ORDERS (Kitchen Dashboard)
    // -----------------------------------------------------
    static async getActiveOrders() {
        return client_1.prisma.order.findMany({
            where: {
                status: {
                    in: ["pending", "accepted", "preparing", "ready"]
                }
            },
            orderBy: { createdAt: "asc" },
            include: {
                items: {
                    include: {
                        item: true,
                        variant: true,
                        toppings: { include: { topping: true } },
                        extras: { include: { extra: true } }
                    }
                }
            }
        });
    }
    // -----------------------------------------------------
    // GET ORDER BY ID
    // -----------------------------------------------------
    static async getOrderById(orderId) {
        return client_1.prisma.order.findUnique({
            where: { order_id: orderId },
            include: {
                items: {
                    include: {
                        item: true,
                        variant: true,
                        toppings: { include: { topping: true } },
                        extras: { include: { extra: true } }
                    }
                }
            }
        });
    }
    // -----------------------------------------------------
    // ASSIGN ORDER TO TERMINAL
    // -----------------------------------------------------
    static async assignOrderToTerminal(order_id, terminal_id) {
        const order = await client_1.prisma.order.update({
            where: { order_id },
            data: { terminal_id },
            include: {
                items: {
                    include: {
                        item: true,
                        variant: true,
                        toppings: { include: { topping: true } },
                        extras: { include: { extra: true } }
                    }
                }
            }
        });
        return order;
    }
}
exports.OrderService = OrderService;
