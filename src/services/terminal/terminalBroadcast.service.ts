import { prisma } from "../../prisma/client.ts";
import { randomUUID } from "crypto";

// Placeholder broadcast service.
// In Block 3 we only store events; real-time push can be added later.
export async function notifyTerminal(orderId: string, event: string, payload: any = {}) {
  await prisma.terminalEvent.create({
    data: {
      id: randomUUID(),
      order: {
        connect: { id: orderId }
      },
      event,
      payload: JSON.stringify(payload)
    }
  });
}

