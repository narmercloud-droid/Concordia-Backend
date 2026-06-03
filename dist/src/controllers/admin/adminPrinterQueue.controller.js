import { prisma } from "../../prisma/client.js";
import { success } from "../controllerHelper.js";
export const getPrinterQueue = async (req, res) => {
    const jobs = await prisma.printerQueue.findMany({
        orderBy: { createdAt: "desc" }
    });
    return success(res, jobs);
};
