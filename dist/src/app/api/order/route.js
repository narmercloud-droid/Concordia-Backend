import { PrismaClient } from "@prisma/client";
import { cartService } from "@/src/lib/cartService";
import { priceEngine } from "@/src/lib/priceEngine";
export async function POST(req) {
    const prisma = new PrismaClient();
    const body = await req.json();
    await cartService.validateCart(body.cart, prisma);
    const total = cartService.calculateTotals(body.cart, priceEngine);
    const order = await prisma.order.create({
        data: {
            branchId: body.branchId,
            totalPrice: total,
            customerName: body.customerName,
            customerPhone: body.customerPhone,
            customerAddress: body.customerAddress,
            items: {
                create: body.cart.items.map(item => ({
                    itemId: item.itemId,
                    name: item.name,
                    basePrice: item.basePrice,
                    quantity: item.quantity,
                    variants: {
                        create: item.variant
                            ? [{ name: item.variant.name, price: item.variant.price }]
                            : []
                    },
                    extras: {
                        create: item.extras?.map(extra => ({
                            name: extra.name,
                            price: extra.price
                        })) || []
                    }
                }))
            }
        }
    });
    return Response.json({ success: true, orderId: order.id });
}
