import { prisma } from "../../prisma/client.js";
import { wrap } from "../../contracts/api.js";
export const getBranchSettings = wrap(async (req) => {
    const { branchId } = req.params;
    const settings = await prisma.branchSettings.findUnique({
        where: { branchId: Number(branchId) }
    });
    return settings;
});
export const updateBranchSettings = wrap(async (req) => {
    const { branchId } = req.params;
    const data = req.body;
    const updated = await prisma.branchSettings.update({
        where: { branchId: Number(branchId) },
        data
    });
    return updated;
});
