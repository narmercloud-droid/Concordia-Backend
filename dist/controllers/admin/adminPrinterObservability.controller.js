import { prisma } from "../../prisma/client.js";
import { success } from "../controllerHelper.js";
export const getTraces = async (req, res) => {
    const traces = await prisma.printerTrace.findMany({
        orderBy: { createdAt: "desc" },
        take: 200
    });
    return success(res, traces);
};
export const getHealth = async (req, res) => {
    const health = await prisma.printerHealth.findMany({
        orderBy: { score: "asc" }
    });
    return success(res, health);
};
export const getAnomalies = async (req, res) => {
    const anomalies = await prisma.printerAnomaly.findMany({
        orderBy: { createdAt: "desc" },
        take: 100
    });
    return success(res, anomalies);
};
