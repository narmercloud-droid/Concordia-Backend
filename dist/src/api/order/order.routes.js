import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { cartService } from "../../lib/cartService.js";
import { priceEngine } from "../../lib/priceEngine.js";
const router = Router();
const prisma = new PrismaClient();
router.post("/", async (req, res) => {
    try {
        const body = req.body;
        if (!body.cart || !Array.isArray(body.cart.items)) {
            return res.status(400).json({ error: "Invalid cart format" });
        }
        await cartService.validateCart(body.cart, prisma);
        const total = cartService.calculateTotals(body.cart, priceEngine);
        const order = await prisma.order.create({
            data: {
                externalAmount: total,
                branch: {
                    connect: { id: body.branchId }
                },
                customer: {
                    create: {
                        name: body.customerName,
                        email: body.customerEmail,
                        phone: body.customerPhone,
                        addresses: {
                            create: {
                                label: "Delivery",
                                street: body.customerAddress.street,
                                city: body.customerAddress.city,
                                postalCode: body.customerAddress.postalCode,
                                isDefault: true
                            }
                        }
                    }
                },
                items: {
                    create: body.cart.items.map((item) => ({
                        itemId: item.itemId,
                        quantity: item.quantity,
                        price: item.basePrice,
                        variantId: item.variantId || null,
                        extras: {
                            create: item.extras?.map((extra) => ({
                                name: extra.name,
                                price: extra.price
                            })) || []
                        },
                        variants: {
                            create: item.variant
                                ? [{ name: item.variant.name, price: item.variant.price }]
                                : []
                        }
                    }))
                }
            }
        });
        return res.json({ success: true, orderId: order.id });
    }
    catch (err) {
        console.error("Order creation error:", err);
        return res.status(500).json({ error: "Failed to create order" });
    }
});
export default router;
