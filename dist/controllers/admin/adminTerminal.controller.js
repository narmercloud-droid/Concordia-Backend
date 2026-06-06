import { prisma } from "../../prisma/client.js";
import { wrap } from "../../contracts/api.js";
export const listTerminals = wrap(async () => {
    const terminals = await prisma.terminalStatus.findMany();
    return terminals;
});
export const listTerminalErrors = wrap(async () => {
    const errors = await prisma.terminalError.findMany({
        orderBy: { createdAt: "desc" },
        take: 200
    });
    return errors;
});
