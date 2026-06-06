import { prisma } from "../../prisma/client.js";
import { broadcastToCustomer } from "../../services/realtime/realtime.service.js";
import { wrap, fail } from "../../contracts/api.js";
export const getCustomerTracking = wrap(async (req) => {
    try {
        const { token } = req.params;
        const order = await prisma.order.findFirst({
            where: { tracking_token: token },
            include: {
                customer: { include: { addresses: true } },
                branch: true,
                items: { include: { item: true } },
                trackingEvents: { orderBy: { timestamp: "asc" } },
                courierLocations: { orderBy: { createdAt: "desc" }, take: 1 }
            }
        });
        if (!order)
            throw fail('NOT_FOUND', 'Invalid tracking token');
        const response = {
            orderId: order.id,
            status: order.status,
            courierStatus: order.courierStatus,
            timeline: order.trackingEvents,
            courierLocation: order.courierLocations[0] || null,
            items: order.items.map(i => ({
                name: i.item.name,
                quantity: i.quantity,
                notes: i.notes
            })),
            branch: {
                name: order.branch.name,
                address: order.branch.address || null,
                lat: order.branch.lat ?? null,
                lng: order.branch.lng ?? null
            },
            customerAddress: order.customer.addresses?.[0] || null
        };
        broadcastToCustomer(token, "tracking_update", response);
        return response;
    }
    catch (err) {
        console.error(err);
        throw fail('INTERNAL_ERROR', 'Server error');
    }
});
