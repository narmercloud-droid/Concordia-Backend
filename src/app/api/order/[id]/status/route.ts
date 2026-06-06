import { PrismaClient } from "@prisma/client";

export async function PUT(req: Request, { params }) {
  const prisma = new PrismaClient();
  const { status } = await req.json();

  const order = await prisma.order.update({
    where: { id: params.id },
    data: { status }
  });

  return Response.json({ success: true, order });
}
