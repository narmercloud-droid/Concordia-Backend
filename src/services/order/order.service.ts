import { prisma } from "../../prisma/client";
import { PricingService } from "../cart/pricing.service";
import { OrderSocket } from "../../socket/order.socket";
import { v4 as uuid } from "uuid";

export class OrderService {
  // -----------------------------------------------------
  // CREATE ORDER FROM CART
  // -----------------------------------------------------
  static async createOrder(cartId: string, branch_id: number) {
    const cart = await prisma.cart.findUnique({
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

    const totals = await PricingService.calculateCart(cart);
    const orderId = `order_${uuid()}`;

    const order = await prisma.order.create({
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
      const itemTotal = await PricingService.calculateCartItem(cartItem);

      const orderItem = await prisma.orderItem.create({
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
        await prisma.orderItemVariant.create({
          data: {
            order_item_id: orderItem.id,
            variant_id: cartItem.variant.variant_id,
            price: 0
          }
        });
      }

      // Toppings
      for (const topping of cartItem.toppings) {
        await prisma.orderItemTopping.create({
          data: {
            order_item_id: orderItem.id,
            topping_id: topping.topping_id,
            price: 0
          }
        });
      }

      // Extras
      for (const extra of cartItem.extras) {
        await prisma.orderItemExtra.create({
          data: {
            order_item_id: orderItem.id,
            extra_id: extra.extra_id,
            price: 0
          }
        });
      }
    }

    // Clear cart after order creation
    await prisma.cartItem.deleteMany({
      where: { cart_id: cartId }
    });

    this.emitOrderStatus(order);
    return order;
  }

  // -----------------------------------------------------
  static emitOrderStatus(order: any) {
    const { getIO } = require("../../lib/socket");
    const payload = {
      order_id: order.order_id,
      terminal_id: order.terminal_id,
      status: order.status,
      branch_id: order.branch_id
    };
    getIO().to(`branch_${order.branch_id}`).emit("order_status", payload);
  }

  // -----------------------------------------------------
  // UPDATE ORDER STATUS (with printing + ETA)
  // -----------------------------------------------------
  static async updateStatus(orderId: string, status: string, estimated_time?: number) {
    const order = await prisma.order.update({
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
      const { PrintService } = await import("../print/print.service");
      await PrintService.printOrder(order.order_id);
    }

    OrderSocket.orderUpdated(order);
    return order;
  }

  // -----------------------------------------------------
  // COURIER PICKUP (QR CODE SCAN)
  // -----------------------------------------------------
  static async courierPickup(orderId: string) {
    const order = await prisma.order.update({
      where: { order_id: orderId },
      data: { status: "picked_up" }
    });

    OrderSocket.orderUpdated(order);
    return order;
  }

  // -----------------------------------------------------
  // GET ACTIVE ORDERS (Kitchen Dashboard)
  // -----------------------------------------------------
  static async getActiveOrders() {
    return prisma.order.findMany({
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
  static async getOrderById(orderId: string) {
    return prisma.order.findUnique({
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
  static async assignOrderToTerminal(order_id: string, terminal_id: number) {
    const order = await prisma.order.update({
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
