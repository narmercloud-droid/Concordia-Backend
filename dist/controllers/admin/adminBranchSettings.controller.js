import { prisma } from "../../prisma/client.js";
import { success } from "../controllerHelper.js";
export const getBranchSettings = async (req, res) => {
    const { branchId } = req.params;
    const settings = await prisma.branchSettings.findUnique({
        where: { branchId: Number(branchId) }
    });
    return success(res, settings);
};
export const updateBranchSettings = async (req, res) => {
    const { branchId } = req.params;
    const data = req.body;
    const updated = await prisma.branchSettings.update({
        where: { branchId: Number(branchId) },
        data
    });
    return success(res, updated);
};
