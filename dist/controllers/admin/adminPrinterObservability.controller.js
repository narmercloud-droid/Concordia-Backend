import { prisma } from "../../prisma/client.js";
import { wrap } from "../../contracts/api.js";
export const getTraces = wrap(async () => {
    const traces = await prisma.printerTrace.findMany({
        orderBy: { createdAt: "desc" },
        take: 200
    });
    return traces;
});
export const getHealth = wrap(async () => {
    const health = await prisma.printerHealth.findMany({
        orderBy: { score: "asc" }
    });
    return health;
});
export const getAnomalies = wrap(async () => {
    const anomalies = await prisma.printerAnomaly.findMany({
        orderBy: { createdAt: "desc" },
        take: 100
    });
    return anomalies;
});
