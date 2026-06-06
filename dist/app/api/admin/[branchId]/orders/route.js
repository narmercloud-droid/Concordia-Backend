import { PrismaClient } from "@prisma/client";
export async function GET(req, { params }) {
    const prisma = new PrismaClient();
    const orders = await prisma.order.findMany({
        where: { branchId: params.branchId },
        orderBy: { createdAt: "desc" },
        include: {
            items: {
                include: {
                    variants: true,
                    extras: true
                }
            }
        }
    });
    return Response.json({ success: true, orders });
}
