import { prisma } from "../../prisma/client.js";
import { success, fail } from "../controllerHelper.js";

export const updateKitchenAssignment = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { kitchen } = req.body;

    if (!["A", "B"].includes(kitchen)) {
      return fail(res, "Invalid kitchen", 400);
    }

    const updated = await prisma.menuItem.update({
      where: { id: itemId },
      data: { kitchen }
    });

    return success(res, updated);
  } catch (err) {
    console.error(err);
    return fail(res, "Server error", 500);
  }
};

